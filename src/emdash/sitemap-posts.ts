import type { BlogPost } from "./blog";

const SITE_ORIGIN = "https://www.nickyt.co";

export function blogPostCanonicalUrl(site: URL, slug: string): string {
  const url = new URL(site.origin || SITE_ORIGIN);

  url.pathname = `/blog/${slug}/`;

  return url.href;
}

function validTime(value: Date | undefined): string | undefined {
  if (!(value instanceof Date) || Number.isNaN(value.getTime()))
    return undefined;

  return value.toISOString();
}

export function sitemapLastModified(post: BlogPost): string | undefined {
  const updated = validTime(post.data.updatedAt);

  if (updated) return updated;

  const published = validTime(post.data.publishedAt);

  if (published) return published;

  return validTime(post.data.date);
}

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function urlBlock(loc: string, lastmod: string | undefined): string {
  const lines = ["  <url>", `    <loc>${escapeXml(loc)}</loc>`];

  if (lastmod) {
    lines.push(`    <lastmod>${escapeXml(lastmod)}</lastmod>`);
  }

  lines.push("  </url>");

  return lines.join("\n");
}

export function renderBlogSitemap(
  posts: readonly BlogPost[],
  site: URL
): string {
  const blocks: string[] = [];

  for (const post of posts) {
    if (post.data.draft === true || post.id.length === 0) continue;

    blocks.push(
      urlBlock(blogPostCanonicalUrl(site, post.id), sitemapLastModified(post))
    );
  }

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...blocks,
    "</urlset>",
    "",
  ].join("\n");
}
