import { describe, expect, it } from "vitest";
import type { BlogPost } from "./blog";
import {
  blogPostCanonicalUrl,
  renderBlogSitemap,
  sitemapLastModified,
} from "./sitemap-posts.ts";

const site = new URL("https://www.nickyt.co");

function post(
  id: string,
  date: string,
  extra: Partial<BlogPost["data"]> = {}
): BlogPost {
  return {
    id,
    data: {
      title: id,
      date: new Date(date),
      content: [],
      ...extra,
    },
  };
}

describe("renderBlogSitemap", () => {
  it("lists every published post and skips drafts and blank slugs", () => {
    const xml = renderBlogSitemap(
      [
        post("alpha", "2024-01-02T00:00:00.000Z"),
        post("draft-post", "2024-03-01T00:00:00.000Z", { draft: true }),
        post("", "2024-04-01T00:00:00.000Z"),
        post("beta", "2025-06-07T08:09:10.000Z"),
      ],
      site
    );

    const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
      (match) => match[1]
    );

    expect(locs).toEqual([
      "https://www.nickyt.co/blog/alpha/",
      "https://www.nickyt.co/blog/beta/",
    ]);
    expect(xml).toContain("<urlset");
    expect(locs).toHaveLength(2);
  });

  it("uses absolute canonical URLs with a trailing slash", () => {
    expect(blogPostCanonicalUrl(site, "stop-using-cat")).toBe(
      "https://www.nickyt.co/blog/stop-using-cat/"
    );
  });

  it("emits lastmod from the newest real timestamp and omits it when none exist", () => {
    const edited = post("edited", "2020-01-01T00:00:00.000Z", {
      publishedAt: new Date("2021-02-03T00:00:00.000Z"),
      updatedAt: new Date("2022-03-04T05:06:07.000Z"),
    });

    const dated = post("dated", "2019-08-09T00:00:00.000Z");
    const undated = post("undated", "not-a-date");

    expect(sitemapLastModified(edited)).toBe("2022-03-04T05:06:07.000Z");
    expect(sitemapLastModified(dated)).toBe("2019-08-09T00:00:00.000Z");
    expect(sitemapLastModified(undated)).toBeUndefined();

    const xml = renderBlogSitemap([edited, undated], site);

    expect(xml).toContain("<lastmod>2022-03-04T05:06:07.000Z</lastmod>");
    expect(xml).not.toMatch(/undated[\s\S]*<lastmod>/);
    expect(xml).toContain(
      "<loc>https://www.nickyt.co/blog/undated/</loc>\n  </url>"
    );
  });

  it("escapes characters that would break the XML", () => {
    const xml = renderBlogSitemap(
      [post("a&b", "2024-01-01T00:00:00.000Z")],
      site
    );

    expect(xml).toContain("<loc>https://www.nickyt.co/blog/a&amp;b/</loc>");
    expect(xml).not.toContain("<loc>https://www.nickyt.co/blog/a&b/</loc>");
  });
});
