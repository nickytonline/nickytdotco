/** EmDash field slug. Labels in the admin are "dev.to URL". */
export const DEV_TO_URL_FIELD = "dev_to_url";

export const DEV_TO_URL_LABEL = "dev.to URL";

const DEV_HOSTS = new Set(["dev.to", "www.dev.to"]);

export interface HistoricalDevToSlug {
  slug: string;
  devToSlug: string;
}

export interface DevArticleRef {
  slug: string;
  url: string;
}

export interface DevToUrlAssignment {
  slug: string;
  devToUrl: string;
}

/**
 * Href for the Boost on DEV button.
 * Empty, invalid, and non-DEV values stay hidden.
 */
export function boostOnDevHref(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  let url: URL;
  try {
    url = new URL(trimmed);
  } catch {
    return undefined;
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") return undefined;
  if (!DEV_HOSTS.has(url.hostname)) return undefined;
  return url.toString();
}

/**
 * Read `dev_to_slug` from a blog markdown file.
 * The removed MDX files stored the DEV slug, including YAML folded values.
 */
export function devToSlugFromMarkdown(source: string): string | undefined {
  const frontmatter = source.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!frontmatter) return undefined;
  const lines = frontmatter[1].split(/\r?\n/);
  for (let index = 0; index < lines.length; index++) {
    const match = lines[index].match(/^dev_to_slug:\s*(.*)$/);
    if (!match) continue;
    const value = match[1].trim();
    if (
      value === "" ||
      value === ">" ||
      value === ">-" ||
      value === "|" ||
      value === "|-"
    ) {
      const parts: string[] = [];
      for (let next = index + 1; next < lines.length; next++) {
        if (!/^\s+\S/.test(lines[next])) break;
        parts.push(lines[next].trim());
      }
      const folded = parts.join(value.startsWith("|") ? "\n" : " ").trim();
      return folded || undefined;
    }
    const unquoted = value.replace(/^['"]|['"]$/g, "").trim();
    return unquoted || undefined;
  }
  return undefined;
}

/**
 * Pair each historical post with the public DEV article URL for its slug.
 * Organization articles use their own path, so the username is not assumed.
 */
export function devToUrlAssignments(
  posts: readonly HistoricalDevToSlug[],
  articles: readonly DevArticleRef[]
): { assignments: DevToUrlAssignment[]; unmatched: string[] } {
  const urlsByDevSlug = new Map<string, string>();
  for (const article of articles) {
    const href = boostOnDevHref(article.url);
    if (!article.slug || !href || urlsByDevSlug.has(article.slug)) continue;
    urlsByDevSlug.set(article.slug, href);
  }

  const assignments: DevToUrlAssignment[] = [];
  const unmatched: string[] = [];
  for (const post of posts) {
    const devToUrl = urlsByDevSlug.get(post.devToSlug);
    if (!devToUrl) {
      unmatched.push(post.slug);
      continue;
    }
    assignments.push({ slug: post.slug, devToUrl });
  }
  return { assignments, unmatched };
}
