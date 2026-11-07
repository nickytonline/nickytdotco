#!/usr/bin/env node
/**
 * Seed EmDash `guests` + `livestreams` from Turso `stream_guests`.
 *
 * - READ-ONLY against stream_guests (never mutates that table).
 * - Creates EmDash collection schema (if missing) and published content.
 * - Guest bios are left empty for later CMS backfill.
 * - Stores legacy_slug (= today's slugifyVideo) for a future redirect pass.
 *
 * Usage:
 *   varlock run -- node ./bin/seedEmDashStreams.ts              # dry-run (default)
 *   varlock run -- node ./bin/seedEmDashStreams.ts --apply      # create missing entries (skip existing)
 *   varlock run -- node ./bin/seedEmDashStreams.ts --repair     # fix multi-guest splits + rewire refs
 *   varlock run -- node ./bin/seedEmDashStreams.ts --update-schema  # sync collection fields only
 *   varlock run -- node ./bin/seedEmDashStreams.ts --publish    # publish draft guests + livestreams
 */
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { createClient } from "@libsql/client/http";
import { LibsqlDialect } from "@libsql/kysely-libsql";
import { ContentRepository, RevisionRepository, SchemaRegistry } from "emdash";
import { applySeed, validateSeed, type SeedFile } from "emdash/seed";
import { Kysely } from "kysely";
import slugify from "slugify";

/** Fields removed from the seed that should be dropped on --update-schema. */
const REMOVED_FIELDS: Array<{ collection: string; field: string }> = [
  { collection: "livestreams", field: "on_schedule" },
];

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const SEED_SCHEMA_PATH = path.join(ROOT, "seed/guests-and-livestreams.json");

const SLUG_OPTS = { lower: true, strict: true } as const;

/** Solo Nick streams → 0 guest refs (he hosts; not a guest). */
const NICK_ONLY_GUEST_NAME = /^(nick taylor|nicky\s*taylor|nickytonline)$/i;

/** Panel placeholder — guests are parsed from the description Panel list. */
const MULTIPLE_GUESTS_NAME = /^multiple guests$/i;

/** Known spelling fixes when creating guest records (description stays unchanged). */
const GUEST_NAME_CORRECTIONS: Record<string, string> = {
  "schalk neetling": "Schalk Neethling",
};

/**
 * Composite / role-baked guest rows created by the first import. Soft-deleted
 * during --repair once real people are split out.
 */
const MALFORMED_GUEST_SLUGS = [
  "brian-douglas-chief-sauce-officer-and-john-mcbride",
  "phil-miller-and-theo-ephraim",
  "gregor-martynus-staff-software-engineer-at-github",
  "kaelig-deloumeau-prigent-engineer-netlify",
] as const;

/**
 * stream_guests ids whose guest links need rewiring after splits / panel parse.
 * Includes How People AI Vol. 1–3 (Vol. 4 has no panel in the description).
 */
const REPAIR_STREAM_SOURCE_IDS = new Set([
  "21",
  "37",
  "87",
  "114",
  "115",
  "192",
  "193",
  "199",
]);

type StreamGuestRow = {
  id: string | number;
  type: string;
  date: string;
  title: string;
  description: string;
  guest_name: string;
  guest_title: string | null;
  youtube_stream_link: string | null;
  linkedin_stream_link: string | null;
  twitter: string | null;
  twitch: string | null;
  github: string | null;
  youtube: string | null;
  bluesky: string | null;
  website: string | null;
  linkedin: string | null;
};

type ParsedGuest = {
  name: string;
  role?: string;
};

type GuestDraft = {
  seedId: string;
  slug: string;
  name: string;
  role?: string;
  twitter?: string;
  twitch?: string;
  github?: string;
  youtube?: string;
  bluesky?: string;
  website?: string;
  linkedin?: string;
  date: string;
};

type LivestreamDraft = {
  seedId: string;
  slug: string;
  legacySlug: string;
  sourceId: string;
  type: "nickyt.live" | "pomerium-live";
  date: string;
  title: string;
  description: string;
  youtubeStreamLink?: string;
  linkedinStreamLink?: string;
  guestSeedIds: string[];
  guestName: string;
};

function asOptionalString(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function normalizeGuestKey(name: string): string {
  return name.trim().toLowerCase().replace(/\s+/g, " ");
}

function guestSlug(name: string): string {
  return slugify(name.trim(), SLUG_OPTS);
}

function slugifyVideo(title: string, guestName: string): string {
  const primaryGuest = guestName.split(",")[0]?.trim() || guestName;
  return `${slugify(title, SLUG_OPTS)}-${slugify(primaryGuest, SLUG_OPTS)}`;
}

function isNickOnlyStream(guestName: string): boolean {
  return NICK_ONLY_GUEST_NAME.test(guestName.trim());
}

function correctGuestName(name: string): string {
  const key = normalizeGuestKey(name);
  return GUEST_NAME_CORRECTIONS[key] ?? name.trim();
}

/** "Francis Batac, Senior Software Engineer at GitHub" → person-shaped before comma. */
function looksLikePersonName(value: string): boolean {
  const beforeComma = value.split(",")[0]?.trim() ?? "";
  const parts = beforeComma.split(/\s+/).filter(Boolean);
  if (parts.length < 2) return false;
  return parts.every((part) => /^[\p{L}][\p{L}'’.-]*$/u.test(part));
}

function splitNameAndRole(value: string): ParsedGuest {
  const trimmed = value.trim();
  const comma = trimmed.indexOf(",");
  if (comma === -1) return { name: trimmed };
  return {
    name: trimmed.slice(0, comma).trim(),
    role: asOptionalString(trimmed.slice(comma + 1)),
  };
}

/**
 * Parse `Panel:` bullet names from a How People AI-style description.
 * Skips Nick; leaves the description text untouched in EmDash.
 */
function parsePanelGuestsFromDescription(description: string): ParsedGuest[] {
  const panelMatch = description.match(
    /Panel:\s*\n([\s\S]*?)(?:\n\s*\n|\nLinks:|$)/i
  );
  if (!panelMatch) return [];

  const guests: ParsedGuest[] = [];
  for (const line of panelMatch[1].split("\n")) {
    const bullet = line.match(/^\s*-\s+(.+)$/);
    if (!bullet) continue;

    let namePart = bullet[1].trim();
    // "- Name, [@handle](url)" or "- Name, @handle"
    namePart = namePart
      .replace(/,\s*\[[^\]]+\]\([^)]+\)\s*$/u, "")
      .replace(/,\s*@\S+\s*$/u, "")
      .trim();
    if (!namePart) continue;
    if (isNickOnlyStream(namePart)) continue;

    guests.push({ name: correctGuestName(namePart) });
  }
  return guests;
}

/**
 * Expand a stream_guests row into 0..n real people.
 *
 * Handles:
 * - "Multiple Guests" → Panel list in description (excludes Nick)
 * - "Phil Miller and Theo Ephraim" (+ shared guest_title role)
 * - "Brian Douglas, Chief Sauce Officer and John McBride"
 * - "Gregor…, Role" with guest_title "Francis…, Role" (second guest)
 * - plain single guest names
 */
function parseGuestsFromRow(row: StreamGuestRow): ParsedGuest[] {
  const guestName = row.guest_name.trim();
  const guestTitle = asOptionalString(row.guest_title);

  if (!guestName || isNickOnlyStream(guestName)) return [];

  if (MULTIPLE_GUESTS_NAME.test(guestName)) {
    return parsePanelGuestsFromDescription(row.description);
  }

  // "Name1 and Name2" (no role baked into the name string)
  if (/^[^,]+?\s+and\s+[^,]+$/i.test(guestName)) {
    const [left, right] = guestName.split(/\s+and\s+/i);
    return [
      { name: left.trim(), role: guestTitle },
      { name: right.trim(), role: guestTitle },
    ];
  }

  // "Name1, Role and Name2"
  const nameRoleAndName = guestName.match(
    /^([^,]+),\s*(.+?)\s+and\s+([^,]+)$/i
  );
  if (nameRoleAndName) {
    return [
      {
        name: nameRoleAndName[1].trim(),
        role: asOptionalString(nameRoleAndName[2]),
      },
      { name: nameRoleAndName[3].trim() },
    ];
  }

  // "Name, Role" + guest_title that is itself "OtherName, OtherRole"
  if (
    guestName.includes(",") &&
    guestTitle &&
    looksLikePersonName(guestTitle)
  ) {
    return [splitNameAndRole(guestName), splitNameAndRole(guestTitle)];
  }

  // "Name, Role" alone (role baked into guest_name)
  if (guestName.includes(",") && looksLikePersonName(guestName)) {
    const parsed = splitNameAndRole(guestName);
    return [{ name: parsed.name, role: parsed.role ?? guestTitle }];
  }

  return [{ name: guestName, role: guestTitle }];
}

function socialsFromRow(row: StreamGuestRow): Partial<GuestDraft> {
  return {
    twitter: asOptionalString(row.twitter),
    twitch: asOptionalString(row.twitch),
    github: asOptionalString(row.github),
    youtube: asOptionalString(row.youtube),
    bluesky: asOptionalString(row.bluesky),
    website: asOptionalString(row.website),
    linkedin: asOptionalString(row.linkedin),
  };
}

function mergeGuest(
  existing: GuestDraft | undefined,
  incoming: GuestDraft
): GuestDraft {
  if (!existing) return incoming;

  const newer = incoming.date >= existing.date ? incoming : existing;
  const older = newer === incoming ? existing : incoming;

  return {
    ...newer,
    role: newer.role ?? older.role,
    twitter: newer.twitter ?? older.twitter,
    twitch: newer.twitch ?? older.twitch,
    github: newer.github ?? older.github,
    youtube: newer.youtube ?? older.youtube,
    bluesky: newer.bluesky ?? older.bluesky,
    website: newer.website ?? older.website,
    linkedin: newer.linkedin ?? older.linkedin,
  };
}

function parseArgs(argv: string[]): {
  apply: boolean;
  repair: boolean;
  updateSchema: boolean;
  publish: boolean;
} {
  return {
    apply: argv.includes("--apply"),
    repair: argv.includes("--repair"),
    updateSchema: argv.includes("--update-schema"),
    publish: argv.includes("--publish"),
  };
}

function createEmDashDb() {
  const url =
    process.env.EMDASH_TURSO_DATABASE_URL ?? process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;
  if (!url || !authToken) {
    throw new Error(
      "Missing EMDASH_TURSO_DATABASE_URL/TURSO_DATABASE_URL or TURSO_AUTH_TOKEN"
    );
  }
  return new Kysely({
    dialect: new LibsqlDialect({ url, authToken }),
  });
}

function createStreamClient() {
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;
  if (!url || !authToken) {
    throw new Error("Missing TURSO_DATABASE_URL or TURSO_AUTH_TOKEN");
  }
  return createClient({ url, authToken });
}

async function loadStreamGuests(): Promise<StreamGuestRow[]> {
  const client = createStreamClient();
  const result = await client.execute(
    `SELECT id, type, date, title, description, guest_name, guest_title,
            youtube_stream_link, linkedin_stream_link,
            twitter, twitch, github, youtube, bluesky, website, linkedin
     FROM stream_guests
     ORDER BY date ASC`
  );

  return result.rows.map((row) => {
    const r = row as Record<string, unknown>;
    return {
      id: r.id as string | number,
      type: String(r.type ?? ""),
      date: String(r.date ?? ""),
      title: String(r.title ?? ""),
      description: String(r.description ?? ""),
      guest_name: String(r.guest_name ?? ""),
      guest_title: (r.guest_title as string | null) ?? null,
      youtube_stream_link: (r.youtube_stream_link as string | null) ?? null,
      linkedin_stream_link: (r.linkedin_stream_link as string | null) ?? null,
      twitter: (r.twitter as string | null) ?? null,
      twitch: (r.twitch as string | null) ?? null,
      github: (r.github as string | null) ?? null,
      youtube: (r.youtube as string | null) ?? null,
      bluesky: (r.bluesky as string | null) ?? null,
      website: (r.website as string | null) ?? null,
      linkedin: (r.linkedin as string | null) ?? null,
    } satisfies StreamGuestRow;
  });
}

function buildGuests(rows: StreamGuestRow[]): Map<string, GuestDraft> {
  const guests = new Map<string, GuestDraft>();

  for (const row of rows) {
    const parsed = parseGuestsFromRow(row);
    if (parsed.length === 0) continue;

    // Social links on the Turso row belong to the primary (first) guest only.
    const socials = socialsFromRow(row);

    for (const [index, person] of parsed.entries()) {
      const key = normalizeGuestKey(person.name);
      const slug = guestSlug(person.name);
      const incoming: GuestDraft = {
        seedId: `guest:${slug}`,
        slug,
        name: person.name,
        role: person.role,
        date: row.date,
        ...(index === 0 ? socials : {}),
      };
      guests.set(key, mergeGuest(guests.get(key), incoming));
    }
  }

  return guests;
}

function buildLivestreams(
  rows: StreamGuestRow[],
  guestsByKey: Map<string, GuestDraft>
): LivestreamDraft[] {
  const livestreams: LivestreamDraft[] = [];

  for (const row of rows) {
    if (row.type !== "nickyt.live" && row.type !== "pomerium-live") {
      console.warn(
        `Skipping stream_guests id=${row.id}: invalid type ${row.type}`
      );
      continue;
    }
    if (!row.title || !row.description || !row.date || !row.guest_name) {
      console.warn(
        `Skipping stream_guests id=${row.id}: missing required fields`
      );
      continue;
    }

    const guestName = row.guest_name.trim();
    const legacySlug = slugifyVideo(row.title, guestName);
    const sourceId = String(row.id);
    const guestSeedIds: string[] = [];

    for (const person of parseGuestsFromRow(row)) {
      const guest = guestsByKey.get(normalizeGuestKey(person.name));
      if (guest) guestSeedIds.push(guest.seedId);
    }

    livestreams.push({
      seedId: `livestream:${sourceId}`,
      slug: legacySlug,
      legacySlug,
      sourceId,
      type: row.type,
      date: row.date,
      title: row.title,
      description: row.description,
      youtubeStreamLink: asOptionalString(row.youtube_stream_link),
      linkedinStreamLink: asOptionalString(row.linkedin_stream_link),
      guestSeedIds,
      guestName,
    });
  }

  return livestreams;
}

function guestData(guest: GuestDraft): Record<string, unknown> {
  return {
    title: guest.name,
    ...(guest.role ? { role: guest.role } : {}),
    // Empty portable text — bios were never in Turso; backfill in CMS later.
    // Photo (`image`) is an EmDash media upload — omit on import; upload in admin.
    bio: [],
    ...(guest.twitter ? { twitter: guest.twitter } : {}),
    ...(guest.twitch ? { twitch: guest.twitch } : {}),
    ...(guest.github ? { github: guest.github } : {}),
    ...(guest.youtube ? { youtube: guest.youtube } : {}),
    ...(guest.bluesky ? { bluesky: guest.bluesky } : {}),
    ...(guest.website ? { website: guest.website } : {}),
    ...(guest.linkedin ? { linkedin: guest.linkedin } : {}),
  };
}

function livestreamData(stream: LivestreamDraft): Record<string, unknown> {
  return {
    title: stream.title,
    type: stream.type,
    date: stream.date,
    description: stream.description,
    ...(stream.youtubeStreamLink
      ? { youtube_stream_link: stream.youtubeStreamLink }
      : {}),
    ...(stream.linkedinStreamLink
      ? { linkedin_stream_link: stream.linkedinStreamLink }
      : {}),
    source_stream_guest_id: stream.sourceId,
    legacy_slug: stream.legacySlug,
    ...(stream.guestSeedIds.length > 0
      ? { guests: stream.guestSeedIds.map((id) => `$ref:${id}`) }
      : { guests: [] }),
  };
}

function buildContentSeed(
  schema: SeedFile,
  guests: GuestDraft[],
  livestreams: LivestreamDraft[]
): SeedFile {
  return {
    ...schema,
    content: {
      // Guests first so livestream $ref: values resolve.
      guests: guests.map((guest) => ({
        id: guest.seedId,
        slug: guest.slug,
        // Not linked from the public site yet; published so they're editable/visible in admin.
        status: "published" as const,
        data: guestData(guest),
      })),
      livestreams: livestreams.map((stream) => ({
        id: stream.seedId,
        slug: stream.slug,
        status: "published" as const,
        data: livestreamData(stream),
      })),
    },
  };
}

function printDryRun(
  guests: GuestDraft[],
  livestreams: LivestreamDraft[]
): void {
  const zeroGuest = livestreams.filter((s) => s.guestSeedIds.length === 0);
  const withGuests = livestreams.filter((s) => s.guestSeedIds.length > 0);
  const multiGuest = livestreams.filter((s) => s.guestSeedIds.length > 1);

  console.log("=== EmDash streams seed dry-run ===");
  console.log(`Guests (deduped):     ${guests.length}`);
  console.log(`Livestreams:          ${livestreams.length}`);
  console.log(`  with guest refs:    ${withGuests.length}`);
  console.log(`  multi-guest:        ${multiGuest.length}`);
  console.log(`  zero guests:        ${zeroGuest.length}`);
  console.log("");
  console.log("Multi-guest livestreams:");
  for (const stream of multiGuest) {
    console.log(
      `  - [${stream.sourceId}] ${stream.title} → ${stream.guestSeedIds.join(", ")}`
    );
  }
  console.log("");
  console.log("Zero-guest livestreams:");
  for (const stream of zeroGuest) {
    console.log(
      `  - [${stream.sourceId}] ${stream.title}  guest_name=${stream.guestName}`
    );
  }
  console.log("");
  console.log(
    "Re-run with --apply to write content, or --repair to fix splits."
  );
}

async function softDeleteMalformedGuests(db: Kysely<unknown>): Promise<void> {
  const contentRepo = new ContentRepository(db as never);
  for (const slug of MALFORMED_GUEST_SLUGS) {
    const existing = await contentRepo.findBySlug("guests", slug);
    if (!existing) {
      console.log(`  guest ${slug}: already absent`);
      continue;
    }
    await contentRepo.delete("guests", existing.id);
    console.log(`  trashed guest ${slug} (${existing.id})`);
  }
}

async function repairGuestSplits(
  db: Kysely<unknown>,
  schema: SeedFile,
  guests: GuestDraft[],
  livestreams: LivestreamDraft[]
): Promise<void> {
  console.log("Trashing malformed composite guest entries…");
  await softDeleteMalformedGuests(db);

  const guestsBySeedId = new Map(guests.map((g) => [g.seedId, g]));
  const repairStreams = livestreams.filter((s) =>
    REPAIR_STREAM_SOURCE_IDS.has(s.sourceId)
  );
  const neededGuestIds = new Set(repairStreams.flatMap((s) => s.guestSeedIds));
  const repairGuests = [...neededGuestIds]
    .map((id) => guestsBySeedId.get(id))
    .filter((g): g is GuestDraft => Boolean(g));

  console.log(
    `Re-applying ${repairGuests.length} guests + ${repairStreams.length} livestreams (onConflict=update)…`
  );

  const contentSeed = buildContentSeed(schema, repairGuests, repairStreams);
  const validation = validateSeed(contentSeed);
  if (!validation.valid) {
    console.error("Repair seed invalid:");
    for (const error of validation.errors) console.error(`  - ${error}`);
    process.exit(1);
  }

  const result = await applySeed(db, contentSeed, {
    includeContent: true,
    onConflict: "update",
    skipMediaDownload: true,
  });
  console.log(
    JSON.stringify(
      {
        content: result.content,
        relations: result.relations,
      },
      null,
      2
    )
  );

  console.log("\nRepaired livestream guest links:");
  for (const stream of repairStreams) {
    const names = stream.guestSeedIds
      .map((id) => guestsBySeedId.get(id)?.name ?? id)
      .join(" + ");
    console.log(`  - [${stream.sourceId}] ${stream.title} → ${names}`);
  }
}

async function publishDrafts(db: Kysely<unknown>): Promise<void> {
  const contentRepo = new ContentRepository(db as never);
  const revisionRepo = new RevisionRepository(db as never);
  const client = createStreamClient(); // same Turso host as EmDash today

  for (const collection of ["guests", "livestreams"] as const) {
    const result = await client.execute({
      sql: `SELECT id FROM ec_${collection} WHERE status = ? AND deleted_at IS NULL`,
      args: ["draft"],
    });
    const ids = result.rows.map((row) => String(row.id));
    console.log(`Publishing ${ids.length} draft ${collection}…`);

    let published = 0;
    for (const id of ids) {
      const existing = await contentRepo.findById(collection, id);
      if (!existing) {
        console.warn(`  skip missing ${collection}/${id}`);
        continue;
      }
      if (existing.status === "published") {
        published++;
        continue;
      }

      const draft = await revisionRepo.create({
        collection,
        entryId: id,
        data: existing.data,
      });
      try {
        await contentRepo.setDraftRevision(collection, id, draft.id);
        await contentRepo.publish(
          collection,
          id,
          undefined,
          false,
          undefined,
          true,
          true
        );
        published++;
        if (published % 25 === 0) {
          console.log(`  ${collection}: ${published}/${ids.length}`);
        }
      } catch (error) {
        try {
          await revisionRepo.deleteIfUnreferenced(collection, id, draft.id);
        } catch (cleanupError) {
          console.error(
            `  failed cleanup for ${collection}/${id}:`,
            cleanupError
          );
        }
        throw error;
      }
    }
    console.log(`Published ${published} ${collection}.`);
  }
}

async function updateSchema(
  db: Kysely<unknown>,
  schema: SeedFile
): Promise<void> {
  console.log("Updating EmDash collection schema (no content import)…");
  const result = await applySeed(db, schema, {
    includeContent: false,
    onConflict: "update",
    skipMediaDownload: true,
  });
  console.log(
    JSON.stringify(
      {
        collections: result.collections,
        fields: result.fields,
        relations: result.relations,
      },
      null,
      2
    )
  );

  const registry = new SchemaRegistry(db as never);
  for (const { collection, field } of REMOVED_FIELDS) {
    const existing = await registry.getField(collection, field);
    if (!existing) {
      console.log(`Field ${collection}.${field} already absent.`);
      continue;
    }
    console.log(`Removing field ${collection}.${field}…`);
    await registry.deleteField(collection, field);
    console.log(`Removed ${collection}.${field}.`);
  }
}

async function main(): Promise<void> {
  const {
    apply,
    repair,
    updateSchema: shouldUpdateSchema,
    publish,
  } = parseArgs(process.argv.slice(2));

  if (publish) {
    const db = createEmDashDb();
    try {
      await publishDrafts(db);
      console.log("Publish done. Hard-refresh EmDash admin.");
    } finally {
      await db.destroy();
    }
    return;
  }

  const schemaRaw = await readFile(SEED_SCHEMA_PATH, "utf-8");
  const schema = JSON.parse(schemaRaw) as SeedFile;
  const validation = validateSeed(schema);
  if (!validation.valid) {
    console.error("Schema seed invalid:");
    for (const error of validation.errors) console.error(`  - ${error}`);
    process.exit(1);
  }
  for (const warning of validation.warnings) {
    console.warn(`schema warning: ${warning}`);
  }

  if (shouldUpdateSchema) {
    const db = createEmDashDb();
    try {
      await updateSchema(db, schema);
      console.log("Schema update done. Hard-refresh EmDash admin.");
    } finally {
      await db.destroy();
    }
    return;
  }

  const rows = await loadStreamGuests();
  const guestsByKey = buildGuests(rows);
  const guests = [...guestsByKey.values()].sort((a, b) =>
    a.name.localeCompare(b.name)
  );
  const livestreams = buildLivestreams(rows, guestsByKey);

  if (repair) {
    const db = createEmDashDb();
    try {
      await repairGuestSplits(db, schema, guests, livestreams);
      console.log("Repair done. Hard-refresh EmDash admin.");
    } finally {
      await db.destroy();
    }
    return;
  }

  if (!apply) {
    printDryRun(guests, livestreams);
    return;
  }

  const contentSeed = buildContentSeed(schema, guests, livestreams);
  const contentValidation = validateSeed(contentSeed);
  if (!contentValidation.valid) {
    console.error("Content seed invalid:");
    for (const error of contentValidation.errors) console.error(`  - ${error}`);
    process.exit(1);
  }

  console.log(
    `Applying schema + ${guests.length} guest drafts + ${livestreams.length} livestream drafts…`
  );

  const db = createEmDashDb();
  try {
    const result = await applySeed(db, contentSeed, {
      includeContent: true,
      onConflict: "skip",
      skipMediaDownload: true,
    });
    console.log("Done.");
    console.log(
      JSON.stringify(
        {
          collections: result.collections,
          fields: result.fields,
          relations: result.relations,
          content: result.content,
        },
        null,
        2
      )
    );
  } finally {
    await db.destroy();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
