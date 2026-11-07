#!/usr/bin/env node
/**
 * Sync guest avatar objects from Netlify Blobs → `.emdash/uploads` for local
 * `astro dev`. Run after `seed:guest-avatars:apply` (or whenever Blobs has
 * avatars the local disk is missing).
 *
 * Usage:
 *   varlock run -- node ./bin/syncGuestAvatarsLocal.ts           # dry-run
 *   varlock run -- node ./bin/syncGuestAvatarsLocal.ts --apply   # write files
 *
 * Blobs auth: NETLIFY_SITE_ID + NETLIFY_AUTH_TOKEN, or NETLIFY_BLOBS_CONTEXT.
 */
import { mkdir, writeFile, access } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { getStore, type Store } from "@netlify/blobs";

const BLOBS_STORE = "emdash-media";
const DEFAULT_SITE_ID = "c2c08a6d-097d-49df-b32d-27fa3d7fc8f8";
const PREFIX = "guests/";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const LOCAL_DIR = path.join(ROOT, ".emdash/uploads");

function parseArgs(argv: string[]): { apply: boolean } {
  return { apply: argv.includes("--apply") };
}

function openBlobsStore(): Store {
  if (process.env.NETLIFY_BLOBS_CONTEXT) {
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
      "Missing Netlify Blobs auth. Set NETLIFY_AUTH_TOKEN and optionally NETLIFY_SITE_ID."
    );
  }
  return getStore({ name: BLOBS_STORE, siteID, token });
}

async function exists(filePath: string): Promise<boolean> {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function listGuestKeys(store: Store): Promise<string[]> {
  const keys: string[] = [];
  const listed = await store.list({ prefix: PREFIX });
  for (const blob of listed.blobs) {
    keys.push(blob.key);
  }
  // Paginate if the client returns a next cursor-like field in future.
  return keys.sort();
}

async function main(): Promise<void> {
  const { apply } = parseArgs(process.argv.slice(2));
  const store = openBlobsStore();
  const keys = await listGuestKeys(store);

  console.log(
    `${apply ? "APPLY" : "DRY-RUN"} sync Blobs → ${path.relative(ROOT, LOCAL_DIR)} (${keys.length} guest keys)`
  );

  let copied = 0;
  let skipped = 0;
  let failed = 0;

  for (const key of keys) {
    const dest = path.join(LOCAL_DIR, key);
    if (await exists(dest)) {
      skipped++;
      console.log(`  skip exists ${key}`);
      continue;
    }

    if (!apply) {
      console.log(`  would copy ${key}`);
      copied++;
      continue;
    }

    try {
      const entry = await store.getWithMetadata(key, { type: "arrayBuffer" });
      if (!entry?.data) {
        failed++;
        console.error(`  miss ${key}`);
        continue;
      }
      await mkdir(path.dirname(dest), { recursive: true });
      await writeFile(dest, Buffer.from(entry.data as ArrayBuffer));
      copied++;
      console.log(`  ok ${key}`);
    } catch (error) {
      failed++;
      console.error(`  fail ${key}:`, error);
    }
  }

  console.log(
    `\nDone. ${apply ? "copied" : "wouldCopy"}=${copied} skipped=${skipped} failed=${failed}`
  );
  if (failed > 0) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
