#!/usr/bin/env node
/**
 * Add the EmDash `dev_to_url` field and fill it for posts that used to live
 * in src/content/blog.
 *
 * Those markdown files stored `dev_to_slug`, not a full URL. Organization
 * articles are not under nickytonline, so the public URL comes from the DEV
 * article list, matched on that slug. Posts with no matching article are left
 * unset, and the Boost on DEV button stays hidden for them.
 *
 *   vp run backfill:dev-to-urls
 *   vp run backfill:dev-to-urls -- --dry-run
 */
import { execFileSync } from "node:child_process";
import { createClient } from "@libsql/client";
import { LibsqlDialect, type LibsqlDialectConfig } from "@libsql/kysely-libsql";
import { Kysely, sql } from "kysely";
import { SchemaError, SchemaRegistry } from "emdash";
import {
  DEV_TO_URL_FIELD,
  DEV_TO_URL_LABEL,
  devToSlugFromMarkdown,
  devToUrlAssignments,
  type DevArticleRef,
  type DevToUrlAssignment,
  type HistoricalDevToSlug,
} from "../src/emdash/dev-to-url.ts";

const DEV_TO_USERNAME = "nickytonline";
const POSTS_COLLECTION = "posts";

function blogSnapshotRevision(): string {
  const deletion = execFileSync(
    "git",
    [
      "log",
      "-1",
      "--diff-filter=D",
      "--format=%H",
      "--grep=remove static blog posts",
      "--",
      "src/content/blog",
    ],
    { encoding: "utf8" }
  ).trim();
  if (!deletion) {
    throw new Error(
      "Could not find the commit that removed src/content/blog. Pass the snapshot with --rev."
    );
  }
  return `${deletion}^`;
}

function git(args: string[]): string {
  return execFileSync("git", args, {
    encoding: "utf8",
    maxBuffer: 20 * 1024 * 1024,
  });
}

function historicalPosts(revision: string): HistoricalDevToSlug[] {
  const files = git([
    "ls-tree",
    "-r",
    "--name-only",
    revision,
    "src/content/blog",
  ])
    .split("\n")
    .map((file) => file.trim())
    .filter((file) => file.endsWith(".mdx"));

  const posts: HistoricalDevToSlug[] = [];
  const missing: string[] = [];
  for (const file of files) {
    const slug = file.slice("src/content/blog/".length, -".mdx".length);
    const source = git(["show", `${revision}:${file}`]);
    const devToSlug = devToSlugFromMarkdown(source);
    if (!devToSlug) {
      missing.push(slug);
      continue;
    }
    posts.push({ slug, devToSlug });
  }
  if (missing.length > 0) {
    console.warn(
      `Skipped ${missing.length} markdown files with no dev_to_slug: ${missing.join(", ")}`
    );
  }
  return posts;
}

async function fetchDevArticles(): Promise<DevArticleRef[]> {
  const articles: DevArticleRef[] = [];
  for (let page = 1; page <= 20; page++) {
    const url = `https://dev.to/api/articles?username=${DEV_TO_USERNAME}&per_page=1000&page=${page}`;
    const response = await fetch(url, {
      headers: {
        "User-Agent": "nickytonline-blog-sync",
        Accept: "application/json",
      },
    });
    if (!response.ok) {
      throw new Error(
        `DEV article list failed (${response.status}) on page ${page}`
      );
    }
    const data: unknown = await response.json();
    if (!Array.isArray(data) || data.length === 0) break;
    for (const article of data) {
      if (!article || typeof article !== "object") continue;
      const record = article as { slug?: unknown; url?: unknown };
      if (typeof record.slug === "string" && typeof record.url === "string") {
        articles.push({ slug: record.slug, url: record.url });
      }
    }
    if (data.length < 1000) break;
  }
  return articles;
}

function revisionArg(): string | undefined {
  const flag = process.argv.indexOf("--rev");
  if (flag === -1) return undefined;
  const value = process.argv[flag + 1];
  if (!value) throw new Error("--rev needs a commit");
  return value;
}

async function ensureDevToUrlField(db: Kysely<unknown>): Promise<void> {
  const registry = new SchemaRegistry(
    db as ConstructorParameters<typeof SchemaRegistry>[0]
  );
  const existing = await registry.getField(POSTS_COLLECTION, DEV_TO_URL_FIELD);
  if (!existing) {
    const slugField = await registry.getField(POSTS_COLLECTION, "dev_to_slug");
    try {
      await registry.createField(POSTS_COLLECTION, {
        slug: DEV_TO_URL_FIELD,
        label: DEV_TO_URL_LABEL,
        type: "url",
        sortOrder: slugField ? slugField.sortOrder + 1 : undefined,
      });
      console.log(`Added ${DEV_TO_URL_FIELD} to the posts schema`);
    } catch (error) {
      if (error instanceof SchemaError && error.code === "FIELD_EXISTS") {
        console.log(`${DEV_TO_URL_FIELD} already exists`);
      } else {
        throw error;
      }
    }
  } else if (existing.label !== DEV_TO_URL_LABEL) {
    await registry.updateField(POSTS_COLLECTION, DEV_TO_URL_FIELD, {
      label: DEV_TO_URL_LABEL,
    });
  }

  const collection = await registry.getCollectionWithFields(POSTS_COLLECTION);
  if (!collection) throw new Error("EmDash posts collection was not found");
  const current = collection.fields.map((field) => field.slug);
  const without = current.filter((slug) => slug !== DEV_TO_URL_FIELD);
  const afterSlug = without.indexOf("dev_to_slug");
  const ordered =
    afterSlug === -1
      ? [...without, DEV_TO_URL_FIELD]
      : [
          ...without.slice(0, afterSlug + 1),
          DEV_TO_URL_FIELD,
          ...without.slice(afterSlug + 1),
        ];
  const alreadyOrdered = ordered.every(
    (slug, index) => slug === current[index]
  );
  if (!alreadyOrdered) {
    await registry.reorderFields(POSTS_COLLECTION, ordered);
  }
}

async function applyAssignments(
  db: Kysely<unknown>,
  assignments: readonly DevToUrlAssignment[]
): Promise<void> {
  let updated = 0;
  let alreadySet = 0;
  let missing = 0;
  for (const assignment of assignments) {
    const column = await sql`
      UPDATE ec_posts
      SET dev_to_url = ${assignment.devToUrl}
      WHERE slug = ${assignment.slug}
        AND deleted_at IS NULL
        AND (dev_to_url IS NULL OR dev_to_url = '')
    `.execute(db);
    const columnChanges = Number(column.numAffectedRows ?? 0);
    if (columnChanges > 0) updated += columnChanges;

    const present = await sql<{ count: number | bigint }>`
      SELECT COUNT(*) AS count
      FROM ec_posts
      WHERE slug = ${assignment.slug}
        AND deleted_at IS NULL
    `.execute(db);
    const count = Number(present.rows[0]?.count ?? 0);
    if (count === 0) {
      missing += 1;
      console.warn(`No EmDash post for slug ${assignment.slug}`);
      continue;
    }
    if (columnChanges === 0) alreadySet += count;

    await sql`
      UPDATE revisions
      SET data = json_set(data, '$.dev_to_url', ${assignment.devToUrl})
      WHERE collection = ${POSTS_COLLECTION}
        AND entry_id IN (
          SELECT id FROM ec_posts
          WHERE slug = ${assignment.slug}
            AND deleted_at IS NULL
        )
        AND json_valid(data)
        AND (
          json_extract(data, '$.dev_to_url') IS NULL
          OR json_extract(data, '$.dev_to_url') = ''
        )
    `.execute(db);
  }
  console.log(
    `Updated ${updated} posts, left ${alreadySet} already set, ${missing} slugs were not in EmDash`
  );
}

async function main(): Promise<void> {
  const dryRun = process.argv.includes("--dry-run");
  const revision = revisionArg() ?? blogSnapshotRevision();
  console.log(`Reading blog markdown from ${revision}`);
  const posts = historicalPosts(revision);
  console.log(`Found ${posts.length} posts with a dev_to_slug`);
  const articles = await fetchDevArticles();
  console.log(`Fetched ${articles.length} DEV articles`);
  const { assignments, unmatched } = devToUrlAssignments(posts, articles);
  const organizationUrls = assignments.filter(
    (assignment) => !assignment.devToUrl.includes("/nickytonline/")
  ).length;
  console.log(
    `${assignments.length} posts have a DEV URL (${organizationUrls} under an organization), ${unmatched.length} do not`
  );
  if (unmatched.length > 0) {
    console.log(`Unmatched slugs: ${unmatched.join(", ")}`);
  }
  if (dryRun) {
    for (const assignment of assignments.slice(0, 5)) {
      console.log(`  ${assignment.slug} -> ${assignment.devToUrl}`);
    }
    if (assignments.length > 5) {
      console.log(`  … ${assignments.length - 5} more`);
    }
    return;
  }

  const { db, close } = openEmDashDatabase();
  try {
    await ensureDevToUrlField(db);
    await applyAssignments(db, assignments);
  } catch (error) {
    if (isTursoUnauthorized(error)) {
      throw new Error(
        "Turso rejected TURSO_AUTH_TOKEN for EMDASH_TURSO_DATABASE_URL (HTTP 401).",
        { cause: error }
      );
    }
    throw error;
  } finally {
    await db.destroy();
    close();
  }
}

/**
 * Open the EmDash Turso database with the site's libSQL client.
 *
 * `emdash/db/libsql` builds its dialect through `@libsql/kysely-libsql`,
 * and that package depends on `@libsql/client` 0.8. Node resolves that
 * nested client for a plain `node` script. Turso answers it with HTTP 401.
 * The Astro app uses the direct `@libsql/client` 0.18 dependency, so this
 * script creates that client and hands it to the dialect.
 */
function openEmDashDatabase(): { db: Kysely<unknown>; close: () => void } {
  const url = process.env.EMDASH_TURSO_DATABASE_URL?.trim();
  const authToken = process.env.TURSO_AUTH_TOKEN?.trim();
  if (!url || !authToken) {
    throw new Error(
      "EMDASH_TURSO_DATABASE_URL and TURSO_AUTH_TOKEN are required. Run via vp run backfill:dev-to-urls."
    );
  }
  const client = createClient({ url, authToken });
  // The dialect only calls execute(), transaction(), and close(), whose APIs
  // are compatible. Its older client type expects sync() to return void;
  // the current client returns replication details. The dialect never calls it.
  const dialectClient = client as Extract<
    LibsqlDialectConfig,
    { client: unknown }
  >["client"];
  return {
    db: new Kysely({
      dialect: new LibsqlDialect({ client: dialectClient }),
    }),
    close: () => {
      client.close();
    },
  };
}

function isTursoUnauthorized(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  const record = error as {
    code?: unknown;
    message?: unknown;
    cause?: unknown;
  };
  if (
    record.code === "SERVER_ERROR" &&
    String(record.message).includes("401")
  ) {
    return true;
  }
  return isTursoUnauthorized(record.cause);
}

await main();
