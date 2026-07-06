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
