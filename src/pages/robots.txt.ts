import type { APIContext } from "astro";

export async function GET(context: APIContext) {
  const siteUrl = context.site?.toString() || "https://www.nickyt.co";

  const robotsTxt = `User-agent: *
Allow: /

Sitemap: ${siteUrl}sitemap.xml`;

  return new Response(robotsTxt, {
    headers: {
      "Content-Type": "text/plain",
    },
  });
}
