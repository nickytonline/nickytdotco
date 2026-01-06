import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { site } from "../data/site";
import type { APIContext } from "astro";

export async function GET(context: APIContext) {
  const blog = await getCollection("blog", ({ data }) => {
    return import.meta.env.PROD ? data.draft !== true : true;
  });

  const sortedPosts = blog.sort((a, b) => {
    return b.data.date.getTime() - a.data.date.getTime();
  });

  return rss({
    title: site.name,
    description: site.shortDesc,
    site: context.site?.toString() || site.url,
    items: sortedPosts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.excerpt || post.data.description || "",
      link: `/blog/${post.slug}/`,
      categories: post.data.tags,
    })),
    customData: `<language>en-us</language>`,
  });
}
