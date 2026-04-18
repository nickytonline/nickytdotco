import rss from "@astrojs/rss";
import { getCollection, getLiveCollection } from "astro:content";
import { site } from "../data/site";
import { slugifyVideo } from "../utils/video-utils";
import type { APIContext } from "astro";

export async function GET(context: APIContext) {
  const blog = await getCollection("blog", ({ data }) => {
    return import.meta.env.PROD ? data.draft !== true : true;
  });

  const videosResult = await getLiveCollection("streamVideos");
  const now = new Date();
  const videos = (videosResult.entries ?? []).filter(
    (e) => new Date(e.data.date) < now
  );

  const blogItems = blog.map((post) => ({
    title: post.data.title,
    pubDate: post.data.date,
    description: post.data.excerpt || post.data.description || "",
    link: `/blog/${post.id}/`,
    categories: post.data.tags,
  }));

  const videoItems = videos.map((video) => ({
    title: video.data.title,
    pubDate: new Date(video.data.date),
    description: video.data.description || "",
    link: `/videos/${slugifyVideo(video.data.title, video.data.guestName)}/`,
    categories: ["video"],
  }));

  const items = [...blogItems, ...videoItems].sort(
    (a, b) => b.pubDate.getTime() - a.pubDate.getTime()
  );

  return rss({
    title: site.name,
    description: site.shortDesc,
    site: context.site?.toString() || site.url,
    items,
    customData: `<language>en-us</language>`,
  });
}
