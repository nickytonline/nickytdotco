import type { APIRoute } from "astro";
import {
  SEARCH_CDN_HEADERS,
  SEARCH_DEFAULT_LIMIT,
  SEARCH_MAX_LIMIT,
  SEARCH_NO_STORE_HEADERS,
} from "../../lib/search/constants";
import { embedQuery } from "../../lib/search/embeddings";
import {
  normalizeSearchQuery,
  parseSearchLimit,
} from "../../lib/search/normalize";
import { ensureSearchTable, searchDocuments } from "../../lib/search/turso";

export const prerender = false;

function json(
  body: unknown,
  status: number,
  headers: Record<string, string>
): Response {
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
    SEARCH_MAX_LIMIT
  );

  if (!query) {
    return json(
      { error: "Missing q query parameter." },
      400,
      SEARCH_NO_STORE_HEADERS
    );
  }

  try {
    await ensureSearchTable();
    const embedding = await embedQuery(query);
    const results = await searchDocuments(embedding, limit);
    return json({ query, results }, 200, SEARCH_CDN_HEADERS);
  } catch (error) {
    console.error("Search request failed", error);
    return json(
      { error: "Search is temporarily unavailable." },
      503,
      SEARCH_NO_STORE_HEADERS
    );
  }
};
