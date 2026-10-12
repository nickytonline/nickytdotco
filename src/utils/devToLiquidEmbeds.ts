/**
 * Helpers for repairing broken DEV/Forem liquid embeds that block article
 * updates (including canonical_url-only PUTs, which still re-evaluate markdown).
 */

/** Any liquid tag whose args include an http(s) URL (embed, github, codepen, …). */
const LIQUID_URL_TAG_RE = /{%\s*([a-zA-Z]+)\s+([^%]+?)%}/gi;

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

function extractUrlFromLiquidArgs(rawArgs: string): string | undefined {
  return rawArgs
    .split(/\s+/)
    .map((part) => part.replace(/^["']|["']$/g, ""))
    .find((part) => /^https?:\/\//i.test(part));
}

export function extractLiquidEmbedTags(bodyMarkdown: string): LiquidEmbedTag[] {
  const tags: LiquidEmbedTag[] = [];

  for (const match of bodyMarkdown.matchAll(LIQUID_URL_TAG_RE)) {
    const fullTag = match[0];
    const tagName = match[1]!.toLowerCase();
    const url = extractUrlFromLiquidArgs(match[2]!.trim());

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
  /** Specialized URL tags rewritten to `{% embed url %}`. */
  convertedToEmbedUrls: string[];
  /** Unreachable `{% embed %}` tags rewritten to markdown links. */
  replacedWithMarkdownUrls: string[];
  /** All URLs touched by either repair step (for logging). */
  replacedUrls: string[];
}

function replaceFirstOccurrence(
  markdown: string,
  search: string,
  replacement: string
): string | null {
  const index = markdown.indexOf(search);
  if (index === -1) {
    return null;
  }

  return (
    markdown.slice(0, index) +
    replacement +
    markdown.slice(index + search.length)
  );
}

/**
 * Converts specialized URL-based liquid tags (e.g. `{% github url %}`,
 * `{% codepen url %}`, `{% link url %}`) to the universal `{% embed url %}`.
 */
export function convertSpecializedLiquidTagsToEmbed(bodyMarkdown: string): {
  markdown: string;
  convertedUrls: string[];
} {
  const tags = extractLiquidEmbedTags(bodyMarkdown).filter(
    (tag) => tag.tagName !== "embed"
  );

  let markdown = bodyMarkdown;
  const convertedUrls: string[] = [];

  for (const tag of tags) {
    const next = replaceFirstOccurrence(
      markdown,
      tag.fullTag,
      `{% embed ${tag.url} %}`
    );
    if (next === null) {
      continue;
    }

    markdown = next;
    convertedUrls.push(tag.url);
  }

  return { markdown, convertedUrls };
}

/**
 * On Forem 422, repair liquid tags in preferred order:
 * 1. Convert specialized URL tags to `{% embed url %}`.
 * 2. Convert unreachable `{% embed %}` tags to markdown links so validation can
 *    pass when the URL itself is dead.
 */
export async function replaceBrokenLiquidEmbeds(
  bodyMarkdown: string,
  checkUrl: (url: string) => Promise<boolean> = isUrlReachableForForemEmbed
): Promise<ReplaceBrokenLiquidEmbedsResult> {
  const { markdown: afterSpecialize, convertedUrls: convertedToEmbedUrls } =
    convertSpecializedLiquidTagsToEmbed(bodyMarkdown);

  const tags = extractLiquidEmbedTags(afterSpecialize).filter(
    (tag) => tag.tagName === "embed"
  );

  let markdown = afterSpecialize;
  const replacedWithMarkdownUrls: string[] = [];

  for (const tag of tags) {
    if (shouldSkipUrlValidation(tag.url)) {
      continue;
    }

    const reachable = await checkUrl(tag.url);
    if (reachable) {
      continue;
    }

    const next = replaceFirstOccurrence(
      markdown,
      tag.fullTag,
      `[${tag.url}](${tag.url})`
    );
    if (next === null) {
      continue;
    }

    markdown = next;
    replacedWithMarkdownUrls.push(tag.url);
  }

  return {
    markdown,
    convertedToEmbedUrls,
    replacedWithMarkdownUrls,
    replacedUrls: [...convertedToEmbedUrls, ...replacedWithMarkdownUrls],
  };
}
