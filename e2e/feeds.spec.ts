import { test, expect } from "@playwright/test";

test.describe("machine-readable endpoints", () => {
  test("feed.xml is a valid RSS feed", async ({ request }) => {
    const response = await request.get("/feed.xml");
    expect(response.ok()).toBeTruthy();
    expect(response.headers()["content-type"]).toContain("xml");

    const body = await response.text();
    expect(body).toContain("<rss");
    expect(body).toContain("<item>");
  });

  test("stream-schedule-feed.xml responds successfully", async ({
    request,
  }) => {
    const response = await request.get("/stream-schedule-feed.xml");
    expect(response.ok()).toBeTruthy();
    expect(response.headers()["content-type"]).toContain("xml");
  });

  test("sitemap-index.xml and sitemap-0.xml are reachable", async ({
    request,
  }) => {
    const index = await request.get("/sitemap-index.xml");
    expect(index.ok()).toBeTruthy();
    expect(await index.text()).toContain("<sitemapindex");

    const sitemap = await request.get("/sitemap-0.xml");
    expect(sitemap.ok()).toBeTruthy();
    expect(await sitemap.text()).toContain("<urlset");
  });

  test("sitemap lists every published blog post", async ({ request }) => {
    const index = await request.get("/sitemap-index.xml");
    expect(index.ok()).toBeTruthy();
    expect(await index.text()).toContain(
      "https://www.nickyt.co/sitemap-posts.xml"
    );

    const [blog, postsSitemap] = await Promise.all([
      request.get("/blog"),
      request.get("/sitemap-posts.xml"),
    ]);

    expect(blog.ok()).toBeTruthy();
    expect(postsSitemap.ok()).toBeTruthy();
    expect(postsSitemap.headers()["content-type"]).toContain("xml");

    const linked = new Set(
      [...(await blog.text()).matchAll(/href="\/blog\/([a-z0-9-]+)\/?"/g)].map(
        (match) => match[1]
      )
    );
    const xml = await postsSitemap.text();
    const listed = new Set(
      [
        ...xml.matchAll(
          /<loc>https:\/\/www\.nickyt\.co\/blog\/([^<]+)<\/loc>/g
        ),
      ].map((match) => match[1].replace(/\/$/, ""))
    );

    expect(listed.size).toBeGreaterThan(0);
    expect(listed).toEqual(linked);
    expect(xml).toContain("<lastmod>");
    expect(xml).toMatch(
      /<loc>https:\/\/www\.nickyt\.co\/blog\/[a-z0-9-]+\/<\/loc>/
    );
  });

  test("robots.txt allows crawling and references the sitemap", async ({
    request,
  }) => {
    const response = await request.get("/robots.txt");
    expect(response.ok()).toBeTruthy();
    const body = await response.text();
    expect(body).toContain("User-agent: *");
    expect(body).toContain("Sitemap:");
  });

  test("llms.txt is reachable and describes the site", async ({ request }) => {
    const response = await request.get("/llms.txt");
    expect(response.ok()).toBeTruthy();
    const body = await response.text();
    expect(body.length).toBeGreaterThan(0);
  });
});
