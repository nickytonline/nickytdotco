export const SEARCH_EMBEDDING_MODEL = "gemini-embedding-001";
export const SEARCH_EMBEDDING_DIMENSIONS = 768;
export const SEARCH_DEFAULT_LIMIT = 8;
export const SEARCH_MAX_LIMIT = 20;
export const SEARCH_TABLE = "search_documents";
export const SEARCH_EMBED_BATCH_SIZE = 5;
export const SEARCH_EMBED_BATCH_DELAY_MS = 2500;
export const SEARCH_MAX_EMBED_CHARS = 6000;

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
