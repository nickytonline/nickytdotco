export const SEARCH_EMBEDDING_MODEL = "gemini-embedding-001";
export const SEARCH_EMBEDDING_DIMENSIONS = 768;
export const SEARCH_DEFAULT_LIMIT = 8;
export const SEARCH_MAX_LIMIT = 20;
export const SEARCH_TABLE = "search_documents";
export const SEARCH_QUERY_CACHE_TABLE = "search_query_embeddings";
export const SEARCH_EMBED_BATCH_SIZE = 5;
export const SEARCH_EMBED_BATCH_DELAY_MS = 5000;
export const SEARCH_MAX_EMBED_CHARS = 6000;
export const SEARCH_MIN_QUERY_CHARS = 2;
export const SEARCH_MAX_QUERY_CHARS = 200;
export const SEARCH_DEBOUNCE_MS = 500;
export const SEARCH_QUERY_CACHE_TTL_SECONDS = 60 * 60 * 24 * 7;
export const SEARCH_QUERY_CACHE_MAX_ROWS = 2000;
export const SEARCH_RATE_LIMIT_WINDOW_SECONDS = 60;
export const SEARCH_RATE_LIMIT_PER_IP = 20;

export const SEARCH_CDN_HEADERS = {
  "Cache-Control": "public, max-age=0, must-revalidate",
  "Netlify-CDN-Cache-Control":
    "public, durable, max-age=3600, stale-while-revalidate=86400",
  "Netlify-Vary": "query=q|limit",
} as const;

export const SEARCH_NO_STORE_HEADERS = {
  "Cache-Control": "no-store",
  "Netlify-CDN-Cache-Control": "no-store",
  "Netlify-Vary": "query=q|limit",
} as const;
