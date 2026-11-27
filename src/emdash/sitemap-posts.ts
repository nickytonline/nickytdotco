import type { BlogPost } from "./blog";
import {
  collectionCanonicalUrl,
  firstSitemapDate,
  renderSitemapUrlset,
  type SitemapUrl,
} from "./sitemap";

export function blogPostCanonicalUrl(site: URL, slug: string): string {
  return collectionCanonicalUrl(site, "blog", slug);
}

export function sitemapLastModified(post: BlogPost): string | undefined {
  return firstSitemapDate(
    post.data.updatedAt,
    post.data.publishedAt,
    post.data.date
  );
}

export function renderBlogSitemap(
  posts: readonly BlogPost[],
  site: URL
): string {
  const urls: SitemapUrl[] = [];

  for (const post of posts) {
    if (post.data.draft === true || post.id.length === 0) continue;

    urls.push({
      loc: blogPostCanonicalUrl(site, post.id),
      lastmod: sitemapLastModified(post),
    });
  }

  return renderSitemapUrlset(urls);
}
