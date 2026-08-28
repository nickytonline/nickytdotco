import {
  isSearchQueryTooLong,
  normalizeSearchQuery,
  parseSearchLimit,
} from "./normalize.ts";
import { SEARCH_DEFAULT_LIMIT, SEARCH_MAX_LIMIT } from "./constants.ts";
import type { SearchResponse } from "./types.ts";

export { isSearchQueryTooLong, normalizeSearchQuery, parseSearchLimit };
export { queryHasNounOrVerb } from "./contentWords.ts";
export type { SearchResponse, SearchResult } from "./types.ts";

export async function searchSite(
  query: string,
  limit?: number,
  signal?: AbortSignal
): Promise<SearchResponse> {
  const normalized = normalizeSearchQuery(query);
  if (!normalized) {
    return { query: normalized, results: [] };
  }

  const params = new URLSearchParams({ q: normalized });
  if (limit !== undefined) {
    params.set(
      "limit",
      String(
        parseSearchLimit(String(limit), SEARCH_DEFAULT_LIMIT, SEARCH_MAX_LIMIT)
      )
    );
  }

  const response = await fetch(`/api/search?${params.toString()}`, { signal });
  if (!response.ok) {
    const error = new Error(
      `Search request failed with status ${response.status}`
    ) as Error & {
      status: number;
    };
    error.status = response.status;
    throw error;
  }

  return (await response.json()) as SearchResponse;
}
