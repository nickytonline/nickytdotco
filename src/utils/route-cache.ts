/**
 * Browser revalidation plus Netlify's Astro route cache.
 * `cache.set` becomes `Netlify-CDN-Cache-Control` (durable, tagged) when
 * `cacheNetlify()` is configured. Publish routes purge those tags.
 */
export const CONTENT_CACHE_MAX_AGE_SECONDS = 86_400;
/** Serve a stale page while a purged or expired render runs. */
export const CONTENT_CACHE_SWR_SECONDS = 604_800;
/**
 * Short window for pages whose TTL is the next event. Long SWR would keep
 * an "upcoming" badge up after the event.
 */
export const EXPIRING_CACHE_SWR_SECONDS = 300;
/** RSS and llms.txt also list Turso videos, which are not EmDash tags. */
export const MIXED_FEED_CACHE_MAX_AGE_SECONDS = 3_600;

/** Netlify rejects purges above this many tags. */
const PURGE_BATCH_SIZE = 100;

export interface ContentCacheHint {
  tags?: string[];
  lastModified?: Date;
}

export interface RouteCache {
  readonly enabled: boolean;
  set(
    input:
      | {
          maxAge?: number;
          swr?: number;
          tags?: string[];
          lastModified?: Date;
        }
      | false
  ): void;
  invalidate(input: { tags?: string[] }): Promise<void>;
}

export function cacheRenderedContent(
  headers: Headers,
  cache: RouteCache,
  hint: ContentCacheHint | undefined,
  maxAgeSeconds: number,
  swrSeconds: number = CONTENT_CACHE_SWR_SECONDS
): void {
  headers.set("Cache-Control", "public, max-age=0, must-revalidate");
  cache.set({
    maxAge: maxAgeSeconds,
    swr: swrSeconds,
    tags: hint?.tags,
    lastModified: hint?.lastModified,
  });
}

export function publishedCacheTags(
  refs: Array<{ collection: string; id: string }>
): string[] {
  return refs.flatMap((ref) => [ref.collection, ref.id]);
}

export async function purgeContentTags(
  cache: RouteCache,
  tags: string[]
): Promise<void> {
  if (!cache.enabled) return;
  const unique = [...new Set(tags.filter((tag) => tag.length > 0))];
  for (let index = 0; index < unique.length; index += PURGE_BATCH_SIZE) {
    await cache.invalidate({
      tags: unique.slice(index, index + PURGE_BATCH_SIZE),
    });
  }
}
