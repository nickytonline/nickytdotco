#!/usr/bin/env node
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { load } from "js-yaml";
import slugify from "slugify";
import { site } from "../src/data/site.ts";
import {
  SEARCH_EMBED_BATCH_DELAY_MS,
  SEARCH_EMBED_BATCH_SIZE,
  SEARCH_MAX_EMBED_CHARS,
} from "../src/lib/search/constants.ts";
import {
  excerptFromText,
  hashSearchContent,
  stripMdxImports,
  truncateForEmbedding,
} from "../src/lib/search/content.ts";
import { embedDocuments } from "../src/lib/search/embeddings.ts";
import {
  deleteMissingSearchDocuments,
  ensureSearchTable,
  loadContentHashes,
  upsertSearchDocuments,
} from "../src/lib/search/turso.ts";
import type {
  SearchDocumentInput,
  SearchDocumentType,
} from "../src/lib/search/types.ts";
import { createClient } from "@libsql/client/http";

const VIDEO_SLUG_OPTS = { lower: true, strict: true } as const;

function slugifyVideoTitle(title: string, guestName: string): string {
  const primaryGuest = guestName.split(",")[0].trim();
  return `${slugify(title, VIDEO_SLUG_OPTS)}-${slugify(primaryGuest, VIDEO_SLUG_OPTS)}`;
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const BLOG_DIR = path.join(ROOT, "src/content/blog");
const TALKS_DIR = path.join(ROOT, "src/content/talks");

const VIDEO_SQL = `SELECT id, title, description, guest_name, date
  FROM stream_guests
  WHERE on_schedule = 1
    AND youtube_stream_link IS NOT NULL
    AND youtube_stream_link != ''
    AND (
      youtube_stream_link LIKE '%v=___________%'
      OR youtube_stream_link LIKE '%youtu.be/___________%'
      OR youtube_stream_link LIKE '%/live/___________%'
    )
  ORDER BY date DESC`;

interface MarkdownFile {
  id: string;
  data: Record<string, unknown>;
  body: string;
}

function parseFrontmatter(raw: string): {
  data: Record<string, unknown>;
  body: string;
} {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) {
    return { data: {}, body: raw };
  }
  const parsed = load(match[1]);
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    return { data: {}, body: match[2] };
  }
  return { data: parsed as Record<string, unknown>, body: match[2] };
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

function asString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value : undefined;
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
  const files = await readMarkdownDir(BLOG_DIR, ".mdx");
  const documents: SearchDocumentInput[] = [];
  for (const file of files) {
    if (file.data.draft === true) {
      continue;
    }
    const title = asString(file.data.title);
    if (!title) {
      continue;
    }
    const body = stripMdxImports(file.body);
    const excerpt =
      asString(file.data.excerpt) ??
      asString(file.data.description) ??
      excerptFromText(body);
    documents.push(
      buildDocument({
        id: `blog:${file.id}`,
        url: siteUrl(`/blog/${file.id}/`),
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
    const venue =
      file.data.venue && typeof file.data.venue === "object"
        ? asString((file.data.venue as { name?: unknown }).name)
        : undefined;
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
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;
  if (!url || !authToken) {
    console.warn(
      "Skipping stream documents; TURSO_DATABASE_URL / TURSO_AUTH_TOKEN are not set."
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
      const guestName = asString(row.guest_name);
      const description = asString(row.description);
      if (!title || !guestName || !description) {
        return [];
      }
      return [
        buildDocument({
          id: `video:${String(row.id)}`,
          url: siteUrl(`/videos/${slugifyVideoTitle(title, guestName)}/`),
          title,
          excerpt: excerptFromText(description),
          type: "Stream",
          body: `${guestName}\n\n${description}`,
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
  console.log("Search index updated.");
}

indexSearchDocuments().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
