const SITE_ORIGIN = "https://www.nickyt.co";

export interface SitemapUrl {
  loc: string;
  lastmod?: string;
}

export function collectionCanonicalUrl(
  site: URL,
  collection: string,
  slug: string
): string {
  const url = new URL(site.origin || SITE_ORIGIN);

  url.pathname = `/${collection}/${slug}/`;

  return url.href;
}

export function formatSitemapDate(value: Date | undefined): string | undefined {
  if (!(value instanceof Date) || Number.isNaN(value.getTime())) {
    return undefined;
  }

  return value.toISOString();
}

export function firstSitemapDate(
  ...values: Array<Date | undefined>
): string | undefined {
  for (const value of values) {
    const formatted = formatSitemapDate(value);

    if (formatted) return formatted;
  }

  return undefined;
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

export function renderSitemapUrlset(urls: readonly SitemapUrl[]): string {
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls.map((url) => urlBlock(url.loc, url.lastmod)),
    "</urlset>",
    "",
  ].join("\n");
}

export interface TalkSitemapEntry {
  id: string;
  data: {
    date?: Date;
  };
}

export function talkCanonicalUrl(site: URL, slug: string): string {
  return collectionCanonicalUrl(site, "talks", slug);
}

export function talkSitemapLastModified(
  talk: TalkSitemapEntry
): string | undefined {
  return formatSitemapDate(talk.data.date);
}

export function renderTalkSitemap(
  talks: readonly TalkSitemapEntry[],
  site: URL
): string {
  const urls: SitemapUrl[] = [];

  for (const talk of talks) {
    if (talk.id.length === 0) continue;

    urls.push({
      loc: talkCanonicalUrl(site, talk.id),
      lastmod: talkSitemapLastModified(talk),
    });
  }

  return renderSitemapUrlset(urls);
}
