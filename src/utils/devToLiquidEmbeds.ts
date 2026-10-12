/**
 * Helpers for repairing broken DEV/Forem liquid embeds that block article
 * updates (including canonical_url-only PUTs, which still re-evaluate markdown).
 */

const LIQUID_EMBED_TAG_RE = /{%\s*(embed|github)\s+([^%]+?)%}/gi;

/** Hosts Forem's UnifiedEmbed validator skips (never treated as 404). */
const FOREM_SKIP_VALIDATION_HOSTS = new Set([
  "twitter.com",
  "www.twitter.com",
  "x.com",
  "www.x.com",
  "bsky.app",
]);

export interface LiquidEmbedTag {
  fullTag: string;
  tagName: string;
  url: string;
}

export function extractLiquidEmbedTags(bodyMarkdown: string): LiquidEmbedTag[] {
  const tags: LiquidEmbedTag[] = [];

  for (const match of bodyMarkdown.matchAll(LIQUID_EMBED_TAG_RE)) {
    const fullTag = match[0];
    const tagName = match[1]!.toLowerCase();
    const rawArgs = match[2]!.trim();
    const url = rawArgs.split(/\s+/).find((part) => /^https?:\/\//i.test(part));

    if (!url) {
      continue;
    }

    tags.push({ fullTag, tagName, url });
  }

  return tags;
}

export function shouldSkipUrlValidation(url: string): boolean {
  try {
    return FOREM_SKIP_VALIDATION_HOSTS.has(new URL(url).hostname.toLowerCase());
  } catch {
    return false;
  }
}

/**
 * Returns true when the URL looks reachable the way Forem's embed validator
 * accepts it: 2xx, or 401/403 (auth/bot walls). 404 and other failures count
 * as broken.
 */
export async function isUrlReachableForForemEmbed(
  url: string,
  fetchImpl: typeof fetch = fetch
): Promise<boolean> {
  if (shouldSkipUrlValidation(url)) {
    return true;
  }

  try {
    const response = await fetchImpl(url, {
      method: "GET",
      redirect: "follow",
      headers: {
        "User-Agent": "nickytonline-blog-sync-embed-check",
      },
      signal: AbortSignal.timeout(15_000),
    });

    if (response.ok) {
      return true;
    }

    // Forem treats unauthorized/forbidden as "URL exists but metadata unavailable".
    if (response.status === 401 || response.status === 403) {
      return true;
    }

    return false;
  } catch {
    return false;
  }
}

export interface ReplaceBrokenLiquidEmbedsResult {
  markdown: string;
  replacedUrls: string[];
}

/**
 * Replaces unreachable `{% embed %}` / `{% github %}` liquid tags with plain
 * markdown links so Forem article updates can succeed.
 */
export async function replaceBrokenLiquidEmbeds(
  bodyMarkdown: string,
  checkUrl: (url: string) => Promise<boolean> = isUrlReachableForForemEmbed
): Promise<ReplaceBrokenLiquidEmbedsResult> {
  const tags = extractLiquidEmbedTags(bodyMarkdown);

  if (tags.length === 0) {
    return { markdown: bodyMarkdown, replacedUrls: [] };
  }

  let markdown = bodyMarkdown;
  const replacedUrls: string[] = [];

  for (const tag of tags) {
    if (shouldSkipUrlValidation(tag.url)) {
      continue;
    }

    const reachable = await checkUrl(tag.url);
    if (reachable) {
      continue;
    }

    // Only replace the first remaining occurrence of this exact tag text.
    const index = markdown.indexOf(tag.fullTag);
    if (index === -1) {
      continue;
    }

    markdown =
      markdown.slice(0, index) +
      `[${tag.url}](${tag.url})` +
      markdown.slice(index + tag.fullTag.length);
    replacedUrls.push(tag.url);
  }

  return { markdown, replacedUrls };
}
