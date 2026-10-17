import type { SeedFile } from "emdash/seed";
import { sql } from "kysely";

const POSTS_PER_CHUNK = 4;

export interface SluggedPost {
  slug?: string | null;
}

export interface ImportChunk {
  created: number;
  skipped: number;
  remaining: number;
  complete: boolean;
}

type SeedDb = Parameters<typeof import("emdash/seed").applySeed>[0];

/** Posts in seed order that are not already stored, capped at `limit`. */
export function selectMissingPosts<T extends SluggedPost>(
  posts: readonly T[],
  presentSlugs: ReadonlySet<string>,
  limit: number
): T[] {
  const missing: T[] = [];
  for (const post of posts) {
    if (typeof post.slug !== "string" || post.slug.length === 0) continue;
    if (presentSlugs.has(post.slug)) continue;
    missing.push(post);
    if (missing.length === limit) break;
  }
  return missing;
}

async function readSeed(): Promise<SeedFile> {
  const seedModule = await import("../../.emdash/seed.json");
  return seedModule.default as SeedFile;
}

/** Slugs already stored. Entry ids from the loader are not the slug. */
async function storedSlugs(db: SeedDb): Promise<Set<string>> {
  const result = await sql<{ slug: string | null }>`
    SELECT slug FROM ec_posts WHERE deleted_at IS NULL
  `.execute(db);
  const slugs = new Set<string>();
  for (const row of result.rows) {
    if (typeof row.slug === "string" && row.slug.length > 0)
      slugs.add(row.slug);
  }
  return slugs;
}

/**
 * Insert the next few ported posts. Existing slugs are left as they are,
 * so a setup run that stopped early can be finished without rewriting it.
 */
export async function importNextPostChunk(db: SeedDb): Promise<ImportChunk> {
  const [{ applySeed }, seed] = await Promise.all([
    import("emdash/seed"),
    readSeed(),
  ]);
  const posts = seed.content?.posts ?? [];
  const present = await storedSlugs(db);
  const missing = selectMissingPosts(posts, present, POSTS_PER_CHUNK);
  if (missing.length === 0) {
    return { created: 0, skipped: 0, remaining: 0, complete: true };
  }
  const partial: SeedFile = {
    ...seed,
    settings: undefined,
    content: { posts: missing },
  };
  const result = await applySeed(db, partial, {
    includeContent: true,
    onConflict: "skip",
    skipMediaDownload: true,
  });
  const remaining = Math.max(0, posts.length - present.size - missing.length);
  return {
    created: result.content.created,
    skipped: result.content.skipped,
    remaining,
    complete: remaining === 0,
  };
}

/** Import through the EmDash runtime. Public pages do not receive `locals.emdash.db`. */
export async function continueBlogImport(
  budgetMs: number
): Promise<ImportChunk> {
  const { withEmDashRuntime } = await import("emdash/middleware");
  return withEmDashRuntime((runtime) =>
    importPostsWithin(runtime.db, budgetMs)
  );
}

export async function importPostsWithin(
  db: SeedDb,
  budgetMs: number
): Promise<ImportChunk> {
  const started = Date.now();
  let created = 0;
  let skipped = 0;
  let remaining = 0;
  let complete = false;
  do {
    const step = await importNextPostChunk(db);
    created += step.created;
    skipped += step.skipped;
    remaining = step.remaining;
    complete = step.complete;
    if (complete || (step.created === 0 && step.skipped === 0)) break;
  } while (Date.now() - started < budgetMs);
  return { created, skipped, remaining, complete };
}

let kickStarted = false;

/** Ask the preview to keep importing after this response is sent. */
export function kickBlogPostImport(
  pageUrl: URL,
  netlifyContext?: { waitUntil?: (promise: Promise<unknown>) => void }
): void {
  if (kickStarted) return;
  const secret = process.env.EMDASH_SCHEDULE_SECRET;
  if (!secret) return;
  kickStarted = true;
  const task = fetch(new URL("/api/emdash-import-posts", pageUrl), {
    method: "POST",
    headers: { authorization: `Bearer ${secret}` },
  })
    .then((response) => {
      if (!response.ok) kickStarted = false;
    })
    .catch((error: unknown) => {
      kickStarted = false;
      console.error("[emdash-import] kick failed", error);
    });
  netlifyContext?.waitUntil?.(task);
}
