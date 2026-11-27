import { describe, expect, it } from "vitest";
import {
  toCanonicalUrl,
  trailingSlashRedirectPath,
  withTrailingSlash,
} from "./trailing-slash.ts";

const origin = "https://www.nickyt.co";

describe("toCanonicalUrl", () => {
  it("ends page canonicals with a slash", () => {
    expect(toCanonicalUrl(origin, "/")).toBe("https://www.nickyt.co/");
    expect(toCanonicalUrl(origin, "/about")).toBe(
      "https://www.nickyt.co/about/"
    );
    expect(toCanonicalUrl(origin, "/about/")).toBe(
      "https://www.nickyt.co/about/"
    );
    expect(toCanonicalUrl(origin, "/blog/some-post")).toBe(
      "https://www.nickyt.co/blog/some-post/"
    );
    expect(toCanonicalUrl(origin, "/blog/some-post/")).toBe(
      "https://www.nickyt.co/blog/some-post/"
    );
    expect(toCanonicalUrl(origin, "/tags/mcp/blog")).toBe(
      "https://www.nickyt.co/tags/mcp/blog/"
    );
  });

  it("leaves files with extensions unchanged", () => {
    expect(toCanonicalUrl(origin, "/feed.xml")).toBe(
      "https://www.nickyt.co/feed.xml"
    );
    expect(toCanonicalUrl(origin, "/rss.xml")).toBe(
      "https://www.nickyt.co/rss.xml"
    );
    expect(toCanonicalUrl(origin, "/robots.txt")).toBe(
      "https://www.nickyt.co/robots.txt"
    );
    expect(toCanonicalUrl(origin, "/sitemap-index.xml")).toBe(
      "https://www.nickyt.co/sitemap-index.xml"
    );
    expect(toCanonicalUrl(origin, "/assets/images/page-og/blog.jpg")).toBe(
      "https://www.nickyt.co/assets/images/page-og/blog.jpg"
    );
  });
});

describe("trailingSlashRedirectPath", () => {
  it("sends extensionless pages to the trailing-slash path", () => {
    expect(trailingSlashRedirectPath("/blog/some-post", "")).toBe(
      "/blog/some-post/"
    );
    expect(trailingSlashRedirectPath("/about", "?utm=test")).toBe(
      "/about/?utm=test"
    );
    expect(trailingSlashRedirectPath("/", "")).toBeUndefined();
    expect(trailingSlashRedirectPath("/blog/some-post/", "?utm=test")).toBe(
      undefined
    );
  });

  it("does not redirect files, APIs, or internal routes", () => {
    expect(trailingSlashRedirectPath("/rss.xml", "")).toBeUndefined();
    expect(trailingSlashRedirectPath("/robots.txt", "")).toBeUndefined();
    expect(trailingSlashRedirectPath("/sitemap-index.xml", "")).toBeUndefined();
    expect(trailingSlashRedirectPath("/feed.xml", "?x=1")).toBeUndefined();
    expect(
      trailingSlashRedirectPath("/assets/images/favicon.svg", "")
    ).toBeUndefined();
    expect(
      trailingSlashRedirectPath("/api/search", "?q=astro")
    ).toBeUndefined();
    expect(trailingSlashRedirectPath("/_emdash/admin", "")).toBeUndefined();
    expect(
      trailingSlashRedirectPath("/.well-known/webfinger", "")
    ).toBeUndefined();
  });
});

describe("withTrailingSlash", () => {
  it("adds a slash only to extensionless page paths", () => {
    expect(withTrailingSlash("/blog/some-post")).toBe("/blog/some-post/");
    expect(withTrailingSlash("/blog/some-post/")).toBe("/blog/some-post/");
    expect(withTrailingSlash("/")).toBe("/");
    expect(withTrailingSlash("/llms.txt")).toBe("/llms.txt");
  });
});
