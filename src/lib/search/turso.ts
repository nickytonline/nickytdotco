import { createClient, type Client } from "@libsql/client/http";
import { ENV } from "varlock/env";
import { SEARCH_EMBEDDING_DIMENSIONS, SEARCH_TABLE } from "./constants";
import type { SearchDocumentInput, SearchResult } from "./types";

let client: Client | undefined;

export function getSearchDb(): Client {
  if (!client) {
    client = createClient({
      url: ENV.TURSO_SEARCH_DATABASE_URL,
      authToken: ENV.TURSO_SEARCH_AUTH_TOKEN,
    });
  }
  return client;
}

export async function ensureSearchTable(db: Client = getSearchDb()) {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS ${SEARCH_TABLE} (
      id TEXT PRIMARY KEY,
      url TEXT NOT NULL,
      title TEXT NOT NULL,
      excerpt TEXT NOT NULL,
      type TEXT NOT NULL,
      content_hash TEXT NOT NULL,
      embedding F32_BLOB(${SEARCH_EMBEDDING_DIMENSIONS}) NOT NULL
    )
  `);
}

export async function loadContentHashes(
  db: Client = getSearchDb()
): Promise<Map<string, string>> {
  const result = await db.execute(
    `SELECT id, content_hash FROM ${SEARCH_TABLE}`
  );
  const hashes = new Map<string, string>();
  for (const row of result.rows) {
    hashes.set(String(row.id), String(row.content_hash));
  }
  return hashes;
}

export async function upsertSearchDocuments(
  documents: Array<
    SearchDocumentInput & { contentHash: string; embedding: number[] }
  >,
  db: Client = getSearchDb()
) {
  if (documents.length === 0) {
    return;
  }

  const statements = documents.map((document) => ({
    sql: `INSERT INTO ${SEARCH_TABLE} (id, url, title, excerpt, type, content_hash, embedding)
          VALUES (?, ?, ?, ?, ?, ?, vector32(?))
          ON CONFLICT(id) DO UPDATE SET
            url = excluded.url,
            title = excluded.title,
            excerpt = excluded.excerpt,
            type = excluded.type,
            content_hash = excluded.content_hash,
            embedding = excluded.embedding`,
    args: [
      document.id,
      document.url,
      document.title,
      document.excerpt,
      document.type,
      document.contentHash,
      JSON.stringify(document.embedding),
    ],
  }));

  await db.batch(statements, "write");
}

export async function deleteMissingSearchDocuments(
  keepIds: string[],
  db: Client = getSearchDb()
) {
  if (keepIds.length === 0) {
    await db.execute(`DELETE FROM ${SEARCH_TABLE}`);
    return;
  }

  const placeholders = keepIds.map(() => "?").join(", ");
  await db.execute({
    sql: `DELETE FROM ${SEARCH_TABLE} WHERE id NOT IN (${placeholders})`,
    args: keepIds,
  });
}

export async function searchDocuments(
  queryEmbedding: number[],
  limit: number,
  db: Client = getSearchDb()
): Promise<SearchResult[]> {
  const result = await db.execute({
    sql: `SELECT url, title, excerpt, type
          FROM ${SEARCH_TABLE}
          ORDER BY vector_distance_cos(embedding, vector32(?)) ASC
          LIMIT ?`,
    args: [JSON.stringify(queryEmbedding), limit],
  });

  return result.rows.map((row) => ({
    url: String(row.url),
    title: String(row.title),
    excerpt: String(row.excerpt),
    type: row.type as SearchResult["type"],
  }));
}
