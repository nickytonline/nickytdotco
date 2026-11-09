#!/usr/bin/env node
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { load } from "js-yaml";
import { loadSearchBlogPosts } from "../src/lib/search/blogPosts.ts";
import { site } from "../src/data/site.ts";
import {
  SEARCH_EMBED_BATCH_DELAY_MS,
  SEARCH_EMBED_BATCH_SIZE,
  SEARCH_MAX_EMBED_CHARS,
} from "../src/lib/search/constants.ts";
import {
  excerptFromText,
  hashSearchContent,
  portableTextToSearchText,
  stripMdxImports,
  truncateForEmbedding,
} from "../src/lib/search/content.ts";
import { embedDocuments } from "../src/lib/search/embeddings.ts";
import {
  deleteMissingSearchDocuments,
  ensureSearchTable,
  loadContentHashes,
  updateSearchTexts,
  upsertSearchDocuments,
} from "../src/lib/search/turso.ts";
import type {
  SearchDocumentInput,
  SearchDocumentType,
} from "../src/lib/search/types.ts";
import { createClient } from "@libsql/client/http";
import { isObject, isString } from "../src/utils/type-guards.ts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const TALKS_DIR = path.join(ROOT, "src/content/talks");

const VIDEO_SQL = `SELECT
    livestreams.id,
    livestreams.slug,
    livestreams.title,
    livestreams.description,
    group_concat(guests.title, ', ') AS guest_names
  FROM ec_livestreams AS livestreams
  LEFT JOIN _emdash_content_references AS refs
    ON refs.parent_group = livestreams.translation_group
  LEFT JOIN ec_guests AS guests
    ON guests.translation_group = refs.child_group
    AND guests.status = 'published'
    AND guests.deleted_at IS NULL
  WHERE livestreams.status = 'published'
    AND livestreams.deleted_at IS NULL
    AND livestreams.slug IS NOT NULL
    AND livestreams.youtube_stream_link IS NOT NULL
    AND livestreams.youtube_stream_link != ''
    AND (
      livestreams.youtube_stream_link LIKE '%v=___________%'
      OR livestreams.youtube_stream_link LIKE '%youtu.be/___________%'
      OR livestreams.youtube_stream_link LIKE '%/live/___________%'
    )
  GROUP BY livestreams.id
  ORDER BY livestreams.date DESC`;

interface MarkdownFile {
  id: string;
  data: MarkdownFrontmatter;
  body: string;
}

interface MarkdownFrontmatter {
  title?: string;
  description?: string;
  excerpt?: string;
  venue?: string | { name?: string };
}

interface ParsedFrontmatter {
  data: MarkdownFrontmatter;
  body: string;
}

function parseFrontmatter(raw: string): ParsedFrontmatter {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);

  if (!match) {
    return { data: {}, body: raw };
  }

  const parsed = load(match[1]);

  if (!isObject(parsed) || Array.isArray(parsed)) {
    return { data: {}, body: match[2] };
  }

  const fields = new Map(Object.entries(parsed));
  const title = fields.get("title");
  const description = fields.get("description");
  const excerpt = fields.get("excerpt");
  const venue = fields.get("venue");

  const venueName = isObject(venue)
    ? Object.entries(venue).find(([key]) => key === "name")?.[1]
    : undefined;

  return {
    data: {
      title: isString(title) ? title : undefined,
      description: isString(description) ? description : undefined,
      excerpt: isString(excerpt) ? excerpt : undefined,
      venue: isString(venue)
        ? venue
        : isString(venueName)
          ? { name: venueName }
          : undefined,
    },
    body: match[2],
  };
}

async function readMarkdownDir(
  dir: string,
  extension: string
): Promise<MarkdownFile[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const files: MarkdownFile[] = [];

  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.endsWith(extension)) {
      continue;
    }

    const raw = await readFile(path.join(dir, entry.name), "utf8");
    const { data, body } = parseFrontmatter(raw);
    files.push({
      id: entry.name.slice(0, -extension.length),
      data,
      body,
    });
  }

  return files;
}

function siteUrl(pathname: string): string {
  return new URL(pathname, `${site.url}/`).toString();
}

function asString<Value>(value: Value): string | undefined {
  return isString(value) && value.trim() ? value : undefined;
}

function buildDocument(input: {
  id: string;
  url: string;
  title: string;
  excerpt: string;
  type: SearchDocumentType;
  body: string;
}): SearchDocumentInput {
  const textToEmbed = truncateForEmbedding(
    [input.title, input.excerpt, input.body].filter(Boolean).join("\n\n"),
    SEARCH_MAX_EMBED_CHARS
  );

  return {
    id: input.id,
    url: input.url,
    title: input.title,
    excerpt: input.excerpt || excerptFromText(input.body),
    type: input.type,
    textToEmbed,
  };
}

async function collectBlogDocuments(): Promise<SearchDocumentInput[]> {
  const url = process.env.EMDASH_TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!url || !authToken) {
    throw new Error(
      "Blog indexing requires EMDASH_TURSO_DATABASE_URL and TURSO_AUTH_TOKEN."
    );
  }

  const db = createClient({ url, authToken });
  let posts;

  try {
    posts = await loadSearchBlogPosts(db);
  } finally {
    db.close();
  }

  const documents: SearchDocumentInput[] = [];

  for (const post of posts) {
    const slug = post.slug;
    const title = asString(post.data?.title);

    if (!slug || !title) {
      continue;
    }

    const body = portableTextToSearchText(post.data?.content);

    const excerpt =
      asString(post.data?.excerpt) ??
      asString(post.data?.description) ??
      excerptFromText(body);

    documents.push(
      buildDocument({
        id: `blog:${slug}`,
        url: siteUrl(`/blog/${slug}/`),
        title,
        excerpt,
        type: "Post",
        body,
      })
    );
  }

  return documents;
}

async function collectTalkDocuments(): Promise<SearchDocumentInput[]> {
  const files = await readMarkdownDir(TALKS_DIR, ".md");

  return files.flatMap((file) => {
    const title = asString(file.data.title);

    if (!title) {
      return [];
    }

    const venue = isString(file.data.venue)
      ? file.data.venue
      : file.data.venue?.name;

    const excerpt = excerptFromText(
      [venue, stripMdxImports(file.body)].filter(Boolean).join(". ")
    );

    return [
      buildDocument({
        id: `talk:${file.id}`,
        url: siteUrl(`/talks/${file.id}/`),
        title,
        excerpt,
        type: "Talk",
        body: stripMdxImports(file.body),
      }),
    ];
  });
}

async function collectVideoDocuments(): Promise<{
  documents: SearchDocumentInput[];
  available: boolean;
}> {
  const url = process.env.EMDASH_TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!url || !authToken) {
    console.warn(
      "Skipping stream documents; EMDASH_TURSO_DATABASE_URL / TURSO_AUTH_TOKEN are not set."
    );

    return { documents: [], available: false };
  }

  const db = createClient({
    url,
    authToken,
  });

  const result = await db.execute(VIDEO_SQL);

  return {
    available: true,
    documents: result.rows.flatMap((row) => {
      const title = asString(row.title);
      const slug = asString(row.slug);
      const guestNames = asString(row.guest_names);
      const description = asString(row.description);

      if (!title || !slug || !description) {
        return [];
      }

      return [
        buildDocument({
          id: `video:${String(row.id)}`,
          url: siteUrl(`/videos/${slug}/`),
          title,
          excerpt: excerptFromText(description),
          type: "Stream",
          body: [guestNames, description].filter(Boolean).join("\n\n"),
        }),
      ];
    }),
  };
}

async function indexSearchDocuments() {
  const videos = await collectVideoDocuments();

  const documents = [
    ...(await collectBlogDocuments()),
    ...(await collectTalkDocuments()),
    ...videos.documents,
  ];

  console.log(`Collected ${documents.length} search documents.`);
  await ensureSearchTable();
  const existingHashes = await loadContentHashes();

  const staleOrNew = documents.filter((document) => {
    const hash = hashSearchContent(document.textToEmbed);

    return existingHashes.get(document.id) !== hash;
  });

  console.log(
    `${staleOrNew.length} document(s) need embeddings (${documents.length - staleOrNew.length} unchanged).`
  );

  if (staleOrNew.length > 0) {
    for (let i = 0; i < staleOrNew.length; i += SEARCH_EMBED_BATCH_SIZE) {
      const chunk = staleOrNew.slice(i, i + SEARCH_EMBED_BATCH_SIZE);
      console.log(
        `Embedding batch ${Math.floor(i / SEARCH_EMBED_BATCH_SIZE) + 1}/${Math.ceil(staleOrNew.length / SEARCH_EMBED_BATCH_SIZE)} (${chunk.length} docs)`
      );

      const vectors = await embedDocuments(
        chunk.map((document) => document.textToEmbed)
      );

      await upsertSearchDocuments(
        chunk.map((document, index) => ({
          ...document,
          contentHash: hashSearchContent(document.textToEmbed),
          embedding: vectors[index],
        }))
      );

      if (i + SEARCH_EMBED_BATCH_SIZE < staleOrNew.length) {
        await new Promise((resolve) =>
          setTimeout(resolve, SEARCH_EMBED_BATCH_DELAY_MS)
        );
      }
    }
  }

  const keepIds = documents.map((document) => document.id);

  if (!videos.available) {
    for (const id of existingHashes.keys()) {
      if (id.startsWith("video:")) {
        keepIds.push(id);
      }
    }

    console.warn(
      "Preserving existing stream documents; guest Turso was unavailable."
    );
  }

  await deleteMissingSearchDocuments(keepIds);
  await updateSearchTexts(
    documents.map((document) => ({
      id: document.id,
      searchText: document.textToEmbed,
    }))
  );
  console.log("Search index updated.");
}

indexSearchDocuments().catch((error) => {
  console.error(error);
  process.exit(1);
});
