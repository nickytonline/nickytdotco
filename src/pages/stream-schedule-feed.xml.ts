import rss from "@astrojs/rss";
import { getLiveCollection } from "astro:content";
import { site } from "@/data/site";
import { slugifyVideo } from "../utils/video-utils";
import type { APIContext } from "astro";

function getYouTubeThumbnailUrl(youtubeLink: string): string | null {
  try {
    const url = new URL(youtubeLink);
    const videoId =
      url.searchParams.get("v") ?? url.pathname.split("/live/")[1];
    return videoId
      ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
      : null;
  } catch {
    return null;
  }
}

export async function GET(context: APIContext) {
  const scheduleResult = await getLiveCollection("streamSchedule");

  if (scheduleResult.error) {
    console.error("Error fetching stream schedule:", scheduleResult.error);
    throw new Error("Failed to fetch stream schedule");
  }

  const streamSchedule = scheduleResult.entries ?? [];

  const sortedStreams = streamSchedule.sort((a, b) => {
    return new Date(b.data.date).getTime() - new Date(a.data.date).getTime();
  });

  const response = await rss({
    title: `${site.name} - Stream Schedule`,
    description: "Upcoming live streams and guest appearances",
    site: context.site?.toString() || site.url,
    xmlns: { media: "http://search.yahoo.com/mrss/" },
    items: sortedStreams.map((stream) => {
      const thumbnailUrl = stream.data.youtubeStreamLink
        ? getYouTubeThumbnailUrl(stream.data.youtubeStreamLink)
        : null;
      return {
        title: `${stream.data.title} - ${stream.data.guestName}`,
        pubDate: new Date(stream.data.date),
        description: stream.data.description,
        link: stream.data.youtubeStreamLink
          ? `${context.site || site.url}videos/${slugifyVideo(stream.data.title, stream.data.guestName)}`
          : stream.data.linkedinStreamLink || site.url,
        categories: [stream.data.type],
        customData: thumbnailUrl
          ? `<media:thumbnail url="${thumbnailUrl}" />`
          : undefined,
      };
    }),
    customData: `<language>en-us</language>`,
  });

  // Set cache headers for 3 days (259200 seconds)
  response.headers.set("Cache-Control", "public, max-age=259200");

  return response;
}
