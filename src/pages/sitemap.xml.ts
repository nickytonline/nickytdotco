import type { APIContext } from "astro";

export const prerender = false;

export function GET(context: APIContext) {
  return context.redirect("/sitemap-index.xml", 301);
}
