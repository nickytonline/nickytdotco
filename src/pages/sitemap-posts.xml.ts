import type { APIContext } from "astro";
import { getBlogListing } from "../emdash/blog";
import { renderBlogSitemap } from "../emdash/sitemap-posts";
import {
  cacheRenderedContent,
  CONTENT_CACHE_MAX_AGE_SECONDS,
} from "../utils/route-cache";

export const prerender = false;

export async function GET(context: APIContext) {
  const site = context.site ?? new URL("https://www.nickyt.co");
  const { posts, cacheHint } = await getBlogListing();
  const body = renderBlogSitemap(posts, site);

  const response = new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });

  cacheRenderedContent(
    response.headers,
    context.cache,
    cacheHint,
    CONTENT_CACHE_MAX_AGE_SECONDS
  );

  return response;
}
