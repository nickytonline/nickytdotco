import type { APIContext } from "astro";

export async function GET(context: APIContext) {
  const siteUrl = context.site?.toString() || "https://www.nickyt.co";

  const robotsTxt = `User-agent: *
Allow: /

Sitemap: ${new URL("sitemap-index.xml", siteUrl)}`;

  return new Response(robotsTxt, {
    headers: {
      "Content-Type": "text/plain",
    },
  });
}
