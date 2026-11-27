import { describe, expect, it } from "vitest";
import {
  renderTalkSitemap,
  talkCanonicalUrl,
  talkSitemapLastModified,
  type TalkSitemapEntry,
} from "./sitemap.ts";

const site = new URL("https://www.nickyt.co");

function talk(id: string, date: string | undefined): TalkSitemapEntry {
  return {
    id,
    data: {
      date: date ? new Date(date) : undefined,
    },
  };
}

describe("renderTalkSitemap", () => {
  it("lists every talk at a trailing-slash URL and skips blank slugs", () => {
    const xml = renderTalkSitemap(
      [
        talk("alpha", "2024-01-02T00:00:00.000Z"),
        talk("", "2024-04-01T00:00:00.000Z"),
        talk("beta", "2025-06-07T08:09:10.000Z"),
      ],
      site
    );

    const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
      (match) => match[1]
    );

    expect(locs).toEqual([
      "https://www.nickyt.co/talks/alpha/",
      "https://www.nickyt.co/talks/beta/",
    ]);
    expect(locs.every((loc) => loc.endsWith("/"))).toBe(true);
    expect(xml).toContain("<urlset");
  });

  it("uses absolute canonical URLs with a trailing slash", () => {
    expect(talkCanonicalUrl(site, "build-your-first-mcp-app")).toBe(
      "https://www.nickyt.co/talks/build-your-first-mcp-app/"
    );
  });

  it("emits lastmod from the talk date and omits it when the date is missing", () => {
    const dated = talk("dated", "2019-08-09T00:00:00.000Z");
    const undated = talk("undated", "not-a-date");

    expect(talkSitemapLastModified(dated)).toBe("2019-08-09T00:00:00.000Z");
    expect(talkSitemapLastModified(undated)).toBeUndefined();

    const xml = renderTalkSitemap([dated, undated], site);

    expect(xml).toContain("<lastmod>2019-08-09T00:00:00.000Z</lastmod>");
    expect(xml).toContain(
      "<loc>https://www.nickyt.co/talks/undated/</loc>\n  </url>"
    );
  });

  it("escapes characters that would break the XML", () => {
    const xml = renderTalkSitemap(
      [talk("a&b", "2024-01-01T00:00:00.000Z")],
      site
    );

    expect(xml).toContain("<loc>https://www.nickyt.co/talks/a&amp;b/</loc>");
    expect(xml).not.toContain("<loc>https://www.nickyt.co/talks/a&b/</loc>");
  });
});
