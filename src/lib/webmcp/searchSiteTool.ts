import {
  SEARCH_DEFAULT_LIMIT,
  SEARCH_MAX_LIMIT,
  SEARCH_MAX_QUERY_CHARS,
  SEARCH_MIN_QUERY_CHARS,
} from "../search/constants";
import {
  isSearchQueryTooLong,
  normalizeSearchQuery,
  searchSite,
} from "../search/searchSite";

export const SEARCH_SITE_TOOL_NAME = "search_site";

export const SEARCH_SITE_TOOL_TITLE = "Search site";

export const SEARCH_SITE_TOOL_DESCRIPTION =
  "Search nickyt.co for blog posts, conference talks, and livestream videos. " +
  "Returns matching titles, URLs, excerpts, and content types (Post, Talk, or Stream).";

export const SEARCH_SITE_TOOL_ERROR = {
  "rate-limit": "Too many searches. Wait a moment and try again.",
  unavailable: "Search is temporarily unavailable. Try again.",
} as const;

export const searchSiteToolInputSchema = {
  type: "object",
  properties: {
    query: {
      type: "string",
      description: `Search query (${SEARCH_MIN_QUERY_CHARS}-${SEARCH_MAX_QUERY_CHARS} characters).`,
      minLength: SEARCH_MIN_QUERY_CHARS,
      maxLength: SEARCH_MAX_QUERY_CHARS,
    },
    limit: {
      type: "integer",
      description: `Maximum results to return (1-${SEARCH_MAX_LIMIT}). Defaults to ${SEARCH_DEFAULT_LIMIT}.`,
      minimum: 1,
      maximum: SEARCH_MAX_LIMIT,
    },
  },
  required: ["query"],
  additionalProperties: false,
};

export type SearchSiteToolInput = {
  query: string;
  limit?: number;
};

export type SearchSiteFn = typeof searchSite;

function isAbortError(error: unknown): boolean {
  return (
    (error instanceof DOMException && error.name === "AbortError") ||
    (error instanceof Error && error.name === "AbortError")
  );
}

/**
 * Headless WebMCP execute callback. Calls `/api/search` via `searchSite()`
 * and forwards the tool abort signal to fetch. Does not touch the Cmd-K UI.
 */
export async function executeSearchSiteTool(
  inputObject: object,
  { signal }: { signal: AbortSignal },
  search: SearchSiteFn = searchSite
): Promise<string> {
  const input = inputObject as SearchSiteToolInput;
  const queryValue = typeof input.query === "string" ? input.query : "";
  const trimmed = queryValue.trim();
  const normalized = normalizeSearchQuery(queryValue);

  if (normalized.length < SEARCH_MIN_QUERY_CHARS) {
    return JSON.stringify({
      error: `Query must be at least ${SEARCH_MIN_QUERY_CHARS} characters.`,
    });
  }

  if (isSearchQueryTooLong(normalized, SEARCH_MAX_QUERY_CHARS)) {
    return JSON.stringify({
      error: `Query must be at most ${SEARCH_MAX_QUERY_CHARS} characters.`,
    });
  }

  const limit = typeof input.limit === "number" ? input.limit : undefined;

  try {
    const response = await search(trimmed, limit, signal);
    return JSON.stringify({
      query: response.query,
      count: response.results.length,
      results: response.results,
    });
  } catch (error) {
    if (isAbortError(error) || signal.aborted) {
      throw error;
    }
    const statusCode = (error as { status?: number }).status;
    const kind = statusCode === 429 ? "rate-limit" : "unavailable";
    return JSON.stringify({
      error: SEARCH_SITE_TOOL_ERROR[kind],
    });
  }
}

/**
 * Registers the site search tool with WebMCP when the API is present.
 * Returns false when WebMCP is unavailable (no-op progressive enhancement).
 */
export async function registerSearchSiteTool(
  options?: WebMCP.ModelContextRegisterToolOptions
): Promise<boolean> {
  const modelContext = document.modelContext;
  if (!modelContext) {
    return false;
  }

  await modelContext.registerTool(
    {
      name: SEARCH_SITE_TOOL_NAME,
      title: SEARCH_SITE_TOOL_TITLE,
      description: SEARCH_SITE_TOOL_DESCRIPTION,
      inputSchema: searchSiteToolInputSchema,
      annotations: {
        readOnlyHint: true,
      },
      execute: (inputObject, executeOptions) =>
        executeSearchSiteTool(inputObject, executeOptions),
    },
    options
  );

  return true;
}
