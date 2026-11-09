import {
  isSearchQueryTooLong,
  normalizeSearchQuery,
  parseSearchLimit,
} from "./normalize.ts";
import { SEARCH_DEFAULT_LIMIT, SEARCH_MAX_LIMIT } from "./constants.ts";
import type { SearchResponse } from "./types.ts";
import type { SearchResult, SearchDocumentType } from "./types.ts";
import { isObject, isString } from "../../utils/type-guards.ts";

export { isSearchQueryTooLong, normalizeSearchQuery, parseSearchLimit };

export type { SearchResponse, SearchResult } from "./types.ts";

class SearchRequestError extends Error {
  constructor(
    message: string,
    readonly status: number
  ) {
    super(message);
  }
}

function isSearchDocumentType(value: unknown): value is SearchDocumentType {
  return value === "Post" || value === "Talk" || value === "Stream";
}

function isSearchResult(value: unknown): value is SearchResult {
  if (!isObject(value)) return false;

  const fields = new Map(Object.entries(value));

  return (
    isString(fields.get("url")) &&
    isString(fields.get("title")) &&
    isString(fields.get("excerpt")) &&
    isSearchDocumentType(fields.get("type"))
  );
}

function isSearchResponse(value: unknown): value is SearchResponse {
  if (!isObject(value)) return false;

  const fields = new Map(Object.entries(value));
  const results = fields.get("results");

  return (
    isString(fields.get("query")) &&
    Array.isArray(results) &&
    results.every(isSearchResult)
  );
}

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
    throw new SearchRequestError(
      `Search request failed with status ${response.status}`,
      response.status
    );
  }

  const body: unknown = await response.json();

  if (!isSearchResponse(body)) {
    throw new Error("Search response did not match the expected schema.");
  }

  return body;
}
