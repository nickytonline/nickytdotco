#!/usr/bin/env node
/**
 * Seed EmDash `guests` + `livestreams` drafts from Turso `stream_guests`.
 *
 * - READ-ONLY against stream_guests (never mutates that table).
 * - Creates EmDash collection schema (if missing) and draft content.
 * - Guest bios are left empty for later CMS backfill.
 * - Stores legacy_slug (= today's slugifyVideo) for a future redirect pass.
 *
 * Usage:
 *   varlock run -- node ./bin/seedEmDashStreams.ts              # dry-run (default)
 *   varlock run -- node ./bin/seedEmDashStreams.ts --apply      # create missing drafts (skip existing)
 *   varlock run -- node ./bin/seedEmDashStreams.ts --update-schema  # sync collection fields only
 */
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { createClient } from "@libsql/client/http";
import { LibsqlDialect } from "@libsql/kysely-libsql";
import { SchemaRegistry } from "emdash";
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

/** Streams credited only to Nick / placeholder → 0 guest refs. */
const ZERO_GUEST_NAME =
  /^(nick taylor|nicky\s*taylor|nickytonline|multiple guests)$/i;

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

function isZeroGuestStream(guestName: string): boolean {
  return ZERO_GUEST_NAME.test(guestName.trim());
}

function parseArgs(argv: string[]): { apply: boolean; updateSchema: boolean } {
  return {
    apply: argv.includes("--apply"),
    updateSchema: argv.includes("--update-schema"),
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
    const name = row.guest_name.trim();
    if (!name || isZeroGuestStream(name)) continue;

    const key = normalizeGuestKey(name);
    const existing = guests.get(key);
    // Most recent date wins for role/socials.
    if (existing && row.date <= existing.date) continue;

    const slug = guestSlug(name);
    guests.set(key, {
      seedId: `guest:${slug}`,
      slug,
      name,
      role: asOptionalString(row.guest_title),
      twitter: asOptionalString(row.twitter),
      twitch: asOptionalString(row.twitch),
      github: asOptionalString(row.github),
      youtube: asOptionalString(row.youtube),
      bluesky: asOptionalString(row.bluesky),
      website: asOptionalString(row.website),
      linkedin: asOptionalString(row.linkedin),
      date: row.date,
    });
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

    if (!isZeroGuestStream(guestName)) {
      const guest = guestsByKey.get(normalizeGuestKey(guestName));
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
        status: "draft" as const,
        data: guestData(guest),
      })),
      livestreams: livestreams.map((stream) => ({
        id: stream.seedId,
        slug: stream.slug,
        status: "draft" as const,
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

  console.log("=== EmDash streams seed dry-run ===");
  console.log(`Guests (deduped):     ${guests.length}`);
  console.log(`Livestreams:          ${livestreams.length}`);
  console.log(`  with guest refs:    ${withGuests.length}`);
  console.log(`  zero guests:        ${zeroGuest.length}`);
  console.log("");
  console.log("Sample guests:");
  for (const guest of guests.slice(0, 5)) {
    console.log(
      `  - ${guest.slug}  name=${guest.name}  role=${guest.role ?? "(none)"}  bio=empty`
    );
  }
  console.log("");
  console.log("Sample livestreams:");
  for (const stream of livestreams.slice(0, 5)) {
    console.log(
      `  - ${stream.slug}  guests=${stream.guestSeedIds.length}  legacy=${stream.legacySlug}  source=${stream.sourceId}`
    );
  }
  console.log("");
  console.log("Zero-guest livestream samples:");
  for (const stream of zeroGuest.slice(0, 5)) {
    console.log(`  - ${stream.slug}  guest_name=${stream.guestName}`);
  }
  console.log("");
  console.log("Re-run with --apply to write drafts to EmDash Turso.");
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
  const { apply, updateSchema: shouldUpdateSchema } = parseArgs(
    process.argv.slice(2)
  );

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
