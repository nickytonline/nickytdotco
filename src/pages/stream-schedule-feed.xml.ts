import rss from "@astrojs/rss";
import { getLiveCollection } from "astro:content";
import { site } from "@/data/site";
import type { APIContext } from "astro";

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
    items: sortedStreams.map((stream) => ({
      title: `${stream.data.title} - ${stream.data.guestName}`,
      pubDate: new Date(stream.data.date),
      description: stream.data.description,
      link:
        stream.data.youtubeStreamLink ||
        stream.data.linkedinStreamLink ||
        site.url,
      categories: [stream.data.type],
    })),
    customData: `<language>en-us</language>`,
  });

  // Set cache headers for 3 days (259200 seconds)
  response.headers.set("Cache-Control", "public, max-age=259200");

  return response;
}
