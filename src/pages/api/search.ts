import type { APIRoute } from "astro";
import {
  SEARCH_CDN_HEADERS,
  SEARCH_DEFAULT_LIMIT,
  SEARCH_MAX_LIMIT,
  SEARCH_MAX_QUERY_CHARS,
  SEARCH_NO_STORE_HEADERS,
} from "../../lib/search/constants";
import { embedQuery } from "../../lib/search/embeddings";
import {
  isSearchQueryTooLong,
  normalizeSearchQuery,
  parseSearchLimit,
} from "../../lib/search/normalize";
import {
  cacheQueryEmbedding,
  ensureSearchTable,
  getCachedQueryEmbedding,
  searchDocuments,
} from "../../lib/search/turso";
import { rewriteSearchResultUrl } from "../../lib/search/content";

export const prerender = false;

function json(body: unknown, status: number, headers: Record<string, string>): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  });
}

export const GET: APIRoute = async ({ url }) => {
  const query = normalizeSearchQuery(url.searchParams.get("q") ?? "");
  const limit = parseSearchLimit(
    url.searchParams.get("limit"),
    SEARCH_DEFAULT_LIMIT,
    SEARCH_MAX_LIMIT,
  );

  if (!query) {
    return json({ error: "Missing q query parameter." }, 400, SEARCH_NO_STORE_HEADERS);
  }

  if (isSearchQueryTooLong(query, SEARCH_MAX_QUERY_CHARS)) {
    return json(
      { error: `Query must be at most ${SEARCH_MAX_QUERY_CHARS} characters.` },
      400,
      SEARCH_NO_STORE_HEADERS,
    );
  }

  try {
    await ensureSearchTable();
    let embedding = await getCachedQueryEmbedding(query);
    if (!embedding) {
      embedding = await embedQuery(query);
      await cacheQueryEmbedding(query, embedding);
    }
    const results = await searchDocuments(embedding, limit);
    return json(
      {
        query,
        results: results.map((result) => ({
          ...result,
          url: rewriteSearchResultUrl(result.url, url.origin),
        })),
      },
      200,
      SEARCH_CDN_HEADERS,
    );
  } catch (error) {
    console.error("Search request failed", error);
    return json({ error: "Search is temporarily unavailable." }, 503, SEARCH_NO_STORE_HEADERS);
  }
};
