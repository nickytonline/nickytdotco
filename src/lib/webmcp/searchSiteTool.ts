import {
  SEARCH_DEFAULT_LIMIT,
  SEARCH_MAX_LIMIT,
  SEARCH_MAX_QUERY_CHARS,
  SEARCH_MIN_QUERY_CHARS,
} from "../search/constants";

export const SEARCH_SITE_TOOL_NAME = "search_site";

export const SEARCH_SITE_TOOL_TITLE = "Search site";

export const SEARCH_SITE_TOOL_DESCRIPTION =
  "Search nickyt.co for blog posts, conference talks, and livestream videos. " +
  "Returns matching titles, URLs, excerpts, and content types (Post, Talk, or Stream).";

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

/**
 * Registers the site search tool with WebMCP when the API is present.
 * Returns false when WebMCP is unavailable (no-op progressive enhancement).
 */
export async function registerSearchSiteTool(
  execute: WebMCP.ToolExecuteCallback,
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
      execute,
    },
    options
  );

  return true;
}
