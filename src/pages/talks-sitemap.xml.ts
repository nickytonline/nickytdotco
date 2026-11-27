import { getCollection } from "astro:content";
import type { APIContext } from "astro";
import { renderTalkSitemap } from "../emdash/sitemap";
import {
  setFixedCdnCacheHeaders,
  UNTIL_DEPLOY_CDN_CACHE_SECONDS,
} from "../utils/cdn-cache";

export const prerender = false;

export async function GET(context: APIContext) {
  const site = context.site ?? new URL("https://www.nickyt.co");
  const talks = await getCollection("talks");
  const body = renderTalkSitemap(talks, site);

  const response = new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });

  setFixedCdnCacheHeaders(response.headers, UNTIL_DEPLOY_CDN_CACHE_SECONDS);

  return response;
}
