#!/usr/bin/env node
/**
 * One-shot seed: fill empty EmDash guest `image` fields from social avatars.
 *
 * Source order: X/Twitter (unavatar) → Bluesky public profile → skip LinkedIn.
 * Bytes go to the Netlify Blobs `emdash-media` store only. After this seed,
 * use `seed:guest-avatars:sync` to copy Blobs → `.emdash/uploads` for local
 * `astro dev` (disk storage; no Blobs context required at runtime).
 *
 * Usage:
 *   varlock run -- node ./bin/seedGuestAvatars.ts           # dry-run
 *   varlock run -- node ./bin/seedGuestAvatars.ts --apply   # upload + wire image
 *   … --slugs danny-thompson,adewale-ace-abati             # limit to slugs
 *   … --limit 10                                           # cap work list
 *
 * Blobs auth (required for --apply):
 *   NETLIFY_SITE_ID + NETLIFY_AUTH_TOKEN
 *   or NETLIFY_BLOBS_CONTEXT (set automatically under `netlify serve` / Functions)
 */
import path from "node:path";

import { createClient } from "@libsql/client/http";
import { LibsqlDialect } from "@libsql/kysely-libsql";
import { getStore, type Store } from "@netlify/blobs";
import {
  ContentRepository,
  MediaRepository,
  computeContentHash,
  type MediaItem,
} from "emdash";
import { enrichImageMetadata } from "emdash/media";
import { Kysely, sql } from "kysely";

const MEDIA_BASE_URL = "/_emdash/api/media/file";
const BLOBS_STORE = "emdash-media";
const FETCH_GAP_MS = 400;
const DEFAULT_SITE_ID = "c2c08a6d-097d-49df-b32d-27fa3d7fc8f8";

type GuestRow = {
  id: string;
  slug: string;
  title: string;
  twitter: string | null;
  bluesky: string | null;
  image: unknown;
};

type AvatarSource = "x" | "bluesky";

type ResolvedAvatar = {
  source: AvatarSource;
  handle: string;
  url: string;
  bytes: Uint8Array;
  mimeType: string;
  ext: string;
};

function parseArgs(argv: string[]): {
  apply: boolean;
  limit?: number;
  slugs?: Set<string>;
} {
  const apply = argv.includes("--apply");
  const limitIdx = argv.indexOf("--limit");
  const limitRaw =
    limitIdx >= 0 && argv[limitIdx + 1]
      ? Number(argv[limitIdx + 1])
      : undefined;
  const limit =
    limitRaw !== undefined && Number.isFinite(limitRaw) && limitRaw > 0
      ? Math.floor(limitRaw)
      : undefined;
  const slugsIdx = argv.indexOf("--slugs");
  const slugsRaw = slugsIdx >= 0 ? argv[slugsIdx + 1] : undefined;
  const slugs = slugsRaw
    ? new Set(
        slugsRaw
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      )
    : undefined;
  return { apply, limit, slugs };
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

function createEmDashClient() {
  const url =
    process.env.EMDASH_TURSO_DATABASE_URL ?? process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;
  if (!url || !authToken) {
    throw new Error(
      "Missing EMDASH_TURSO_DATABASE_URL/TURSO_DATABASE_URL or TURSO_AUTH_TOKEN"
    );
  }
  return createClient({ url, authToken });
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function stripHandle(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return "";
  try {
    if (/^https?:\/\//i.test(trimmed)) {
      const url = new URL(trimmed);
      const host = url.hostname.replace(/^www\./, "");
      if (host === "x.com" || host === "twitter.com") {
        return url.pathname.replace(/^\//, "").split("/")[0] ?? "";
      }
      if (host === "bsky.app") {
        const parts = url.pathname.split("/").filter(Boolean);
        const profileIdx = parts.indexOf("profile");
        if (profileIdx >= 0 && parts[profileIdx + 1]) {
          return parts[profileIdx + 1];
        }
      }
    }
  } catch {
    // fall through to plain handle parsing
  }
  return trimmed.replace(/^@/, "").replace(/\/$/, "");
}

function hasGuestImage(image: unknown): boolean {
  if (image == null) return false;
  if (typeof image === "string") return image.trim().length > 0;
  if (typeof image !== "object") return false;
  const record = image as Record<string, unknown>;
  if (typeof record.id === "string" && record.id.trim()) return true;
  if (typeof record.src === "string" && record.src.trim()) return true;
  return false;
}

function extForMime(mimeType: string): string {
  switch (mimeType) {
    case "image/png":
      return ".png";
    case "image/webp":
      return ".webp";
    case "image/gif":
      return ".gif";
    case "image/jpeg":
    case "image/jpg":
      return ".jpg";
    default:
      return ".jpg";
  }
}

function mimeFromResponse(
  contentType: string | null,
  fallbackUrl: string
): string {
  const base = (contentType ?? "").split(";")[0]?.trim().toLowerCase();
  if (base?.startsWith("image/")) return base;
  const ext = path.extname(new URL(fallbackUrl).pathname).toLowerCase();
  if (ext === ".png") return "image/png";
  if (ext === ".webp") return "image/webp";
  if (ext === ".gif") return "image/gif";
  return "image/jpeg";
}

async function fetchBytes(
  url: string
): Promise<{ bytes: Uint8Array; mimeType: string } | null> {
  const response = await fetch(url, {
    headers: { Accept: "image/*,*/*" },
    redirect: "follow",
  });
  if (!response.ok) return null;
  const mimeType = mimeFromResponse(
    response.headers.get("content-type"),
    response.url || url
  );
  if (!mimeType.startsWith("image/")) return null;
  const buffer = new Uint8Array(await response.arrayBuffer());
  if (buffer.byteLength < 64) return null;
  return { bytes: buffer, mimeType };
}

async function resolveFromX(
  twitter: string | null
): Promise<ResolvedAvatar | null> {
  if (!twitter) return null;
  const handle = stripHandle(twitter);
  if (!handle) return null;
  const url = `https://unavatar.io/x/${encodeURIComponent(handle)}?fallback=false`;
  const fetched = await fetchBytes(url);
  if (!fetched) return null;
  return {
    source: "x",
    handle,
    url,
    bytes: fetched.bytes,
    mimeType: fetched.mimeType,
    ext: extForMime(fetched.mimeType),
  };
}

async function resolveFromBluesky(
  bluesky: string | null
): Promise<ResolvedAvatar | null> {
  if (!bluesky) return null;
  const handle = stripHandle(bluesky);
  if (!handle) return null;
  const profileUrl = `https://public.api.bsky.app/xrpc/app.bsky.actor.getProfile?actor=${encodeURIComponent(handle)}`;
  const profileRes = await fetch(profileUrl, {
    headers: { Accept: "application/json" },
  });
  if (!profileRes.ok) return null;
  const profile = (await profileRes.json()) as { avatar?: string };
  if (!profile.avatar) return null;
  const fetched = await fetchBytes(profile.avatar);
  if (!fetched) return null;
  return {
    source: "bluesky",
    handle,
    url: profile.avatar,
    bytes: fetched.bytes,
    mimeType: fetched.mimeType,
    ext: extForMime(fetched.mimeType),
  };
}

async function resolveAvatar(guest: GuestRow): Promise<{
  avatar?: ResolvedAvatar;
  skipReason?: string;
}> {
  if (hasGuestImage(guest.image)) {
    return { skipReason: "already has image" };
  }
  const fromX = await resolveFromX(guest.twitter);
  if (fromX) return { avatar: fromX };
  const fromBsky = await resolveFromBluesky(guest.bluesky);
  if (fromBsky) return { avatar: fromBsky };
  if (!guest.twitter && !guest.bluesky) {
    return { skipReason: "no twitter/bluesky (linkedin skipped)" };
  }
  return { skipReason: "avatar fetch failed" };
}

function openBlobsStore(): Store {
  // Netlify builds / Functions / `netlify serve` inject Blobs credentials.
  if (process.env.NETLIFY_BLOBS_CONTEXT || process.env.NETLIFY === "true") {
    return getStore(BLOBS_STORE);
  }
  const siteID =
    process.env.NETLIFY_SITE_ID?.trim() ||
    process.env.SITE_ID?.trim() ||
    DEFAULT_SITE_ID;
  const token =
    process.env.NETLIFY_AUTH_TOKEN?.trim() ||
    process.env.NETLIFY_BLOBS_TOKEN?.trim();
  if (!token) {
    throw new Error(
      "Missing Netlify Blobs auth. Set NETLIFY_AUTH_TOKEN (personal access token with Blobs access) and optionally NETLIFY_SITE_ID. Or run under netlify serve / a Netlify build so Blobs context is set."
    );
  }
  return getStore({ name: BLOBS_STORE, siteID, token });
}

async function loadGuests(): Promise<GuestRow[]> {
  const client = createEmDashClient();
  const result = await client.execute(
    `SELECT id, slug, title, twitter, bluesky, image
     FROM ec_guests
     WHERE deleted_at IS NULL
     ORDER BY slug ASC`
  );
  return result.rows.map((row) => {
    const r = row as Record<string, unknown>;
    let image: unknown = r.image ?? null;
    if (typeof image === "string") {
      try {
        image = JSON.parse(image);
      } catch {
        // keep string
      }
    }
    return {
      id: String(r.id),
      slug: String(r.slug),
      title: String(r.title ?? ""),
      twitter: r.twitter == null ? null : String(r.twitter),
      bluesky: r.bluesky == null ? null : String(r.bluesky),
      image,
    };
  });
}

async function findMediaIdByStorageKey(
  db: Kysely<unknown>,
  storageKey: string
): Promise<string | null> {
  const result = await sql<{ id: string }>`
    SELECT id FROM media WHERE storage_key = ${storageKey} LIMIT 1
  `.execute(db);
  const id = result.rows[0]?.id;
  return id ? String(id) : null;
}

async function ensureMediaRow(
  db: Kysely<unknown>,
  mediaRepo: MediaRepository,
  guest: GuestRow,
  avatar: ResolvedAvatar,
  storageKey: string
): Promise<MediaItem> {
  const existingId = await findMediaIdByStorageKey(db, storageKey);
  if (existingId) {
    const existing = await mediaRepo.findById(existingId);
    if (existing) return existing;
  }

  const contentHash = await computeContentHash(avatar.bytes);
  const byHash = await mediaRepo.findByContentHash(contentHash);
  if (byHash) return byHash;

  const enriched = await enrichImageMetadata(avatar.bytes, avatar.mimeType);
  return mediaRepo.create({
    filename: `${guest.slug}-avatar${avatar.ext}`,
    mimeType: avatar.mimeType,
    size: avatar.bytes.byteLength,
    width: enriched.width,
    height: enriched.height,
    alt: guest.title,
    storageKey,
    contentHash,
    blurhash: enriched.blurhash,
    dominantColor: enriched.dominantColor,
    status: "ready",
  });
}

function mediaValueFor(item: MediaItem) {
  return {
    provider: "local",
    id: item.id,
    src: `${MEDIA_BASE_URL}/${item.storageKey}`,
    filename: item.filename,
    mimeType: item.mimeType,
    width: item.width ?? undefined,
    height: item.height ?? undefined,
    alt: item.alt ?? undefined,
    blurhash: item.blurhash ?? undefined,
    dominantColor: item.dominantColor ?? undefined,
  };
}

async function main(): Promise<void> {
  const { apply, limit, slugs } = parseArgs(process.argv.slice(2));
  const guests = await loadGuests();
  const targets = guests.filter((guest) => {
    if (slugs && !slugs.has(guest.slug)) return false;
    return !hasGuestImage(guest.image);
  });
  const work = limit ? targets.slice(0, limit) : targets;

  console.log(
    `${apply ? "APPLY" : "DRY-RUN"} guest avatars: ${work.length}/${targets.length} missing image (${guests.length} total)`
  );

  let store: Store | undefined;
  if (apply) {
    store = openBlobsStore();
  }

  const db = apply ? createEmDashDb() : null;
  const mediaRepo = db ? new MediaRepository(db as never) : null;
  const contentRepo = db ? new ContentRepository(db as never) : null;

  let wouldFetch = 0;
  let uploaded = 0;
  let skipped = 0;
  let failed = 0;

  for (const guest of work) {
    try {
      const { avatar, skipReason } = await resolveAvatar(guest);
      if (!avatar) {
        skipped++;
        console.log(`  skip ${guest.slug}: ${skipReason}`);
        await sleep(FETCH_GAP_MS);
        continue;
      }

      const storageKey = `guests/${guest.slug}/avatar${avatar.ext}`;
      wouldFetch++;

      if (!apply) {
        console.log(
          `  would set ${guest.slug} ← ${avatar.source}:${avatar.handle} (${avatar.mimeType}, ${avatar.bytes.byteLength}b) → ${storageKey}`
        );
        await sleep(FETCH_GAP_MS);
        continue;
      }

      if (!store || !mediaRepo || !contentRepo || !db) {
        throw new Error("Apply mode missing storage/db handles");
      }

      await store.set(storageKey, avatar.bytes.buffer as ArrayBuffer, {
        metadata: {
          contentType: avatar.mimeType,
          size: avatar.bytes.byteLength,
          lastModified: new Date().toISOString(),
          guestSlug: guest.slug,
          source: avatar.source,
        },
      });

      const media = await ensureMediaRow(
        db,
        mediaRepo,
        guest,
        avatar,
        storageKey
      );
      await contentRepo.update("guests", guest.id, {
        data: { image: mediaValueFor(media) },
      });

      uploaded++;
      console.log(
        `  ok ${guest.slug} ← ${avatar.source}:${avatar.handle} → ${storageKey} (media ${media.id})`
      );
      await sleep(FETCH_GAP_MS);
    } catch (error) {
      failed++;
      console.error(`  fail ${guest.slug}:`, error);
      await sleep(FETCH_GAP_MS);
    }
  }

  if (db) await db.destroy();

  console.log(
    `\nDone. ${apply ? `uploaded=${uploaded}` : `wouldFetch=${wouldFetch}`} skipped=${skipped} failed=${failed}`
  );
  if (apply && uploaded > 0) {
    console.log(
      "Next: npm run seed:guest-avatars:sync  # Blobs → .emdash/uploads for local dev"
    );
  }
  if (failed > 0) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
