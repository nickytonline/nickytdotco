import { marked } from "marked";
import Parser from "rss-parser";

export const DEFAULT_YT_FEED_URL =
  "https://www.youtube.com/feeds/videos.xml?channel_id=UCBLlEq0co24VFJIMEHNcPOQ";
export const NICKYT_LIVE_PLAYLIST_FEED_URL =
  "https://www.youtube.com/feeds/videos.xml?playlist_id=PLcR4ZgxWXeICy2QVTV-6HuEHfl9DcAuq7";
export const TWO_FULL_2_STACK_PLAYLIST_FEED_URL =
  "https://www.youtube.com/feeds/videos.xml?playlist_id=PLZDPKYkCEQk07B0HWWOKH3bqpqOUQuOOk";
export const GUEST_APPEARANCES_PLAYLIST_FEED_URL =
  "https://www.youtube.com/feeds/videos.xml?playlist_id=PLcR4ZgxWXeIAa0VXPJQ7fgXkx73A5TeGU";
export const POMERIUM_LIVE_PLAYLIST_FEED_URL =
  "https://www.youtube.com/feeds/videos.xml?playlist_id=PLZWncRoWaoFxwV4ZoTC-TydJYZ1c_FEGJ";

export function getYouTubeId(url: string) {
  return url?.match(/(?:live\/|v=)(?<videoId>[^?&]+)/)?.groups?.videoId;
}

export function injectSpecificVideo(
  videos: YouTubeVideo[],
  videoToInject: YouTubeVideo,
) {
  const injectedVideos = [...videos];
  const videoDate = new Date(videoToInject.date);

  // Find the correct position to insert the video based on date
  const insertIndex = injectedVideos.findIndex(
    (video) => new Date(video.date) < videoDate,
  );

  if (insertIndex === -1) {
    // If no older videos found, append to the end
    injectedVideos.push(videoToInject);
  } else {
    // Insert at the correct position
    injectedVideos.splice(insertIndex, 0, videoToInject);
  }

  return injectedVideos;
}

export async function getVideos({
  videoFeedUrl,
  descendingDate = true,
  numberOfVideos = 6,
}: {
  videoFeedUrl: string;
  descendingDate?: boolean;
  numberOfVideos?: number;
}) {
  const parser = new Parser({
    customFields: {
      item: ["media:group", "media:thumbnail"],
    },
  });

  const feed = await parser.parseURL(videoFeedUrl);

  let videos = feed.items.slice(0, numberOfVideos).map((m) => {
    return {
      title: m.title,
      link: m.link,
      description: m["media:group"]["media:description"][0],
      thumbnail: m["media:group"]["media:thumbnail"][0].$.url,
      date: m.pubDate ? new Date(m.pubDate) : new Date(),
    };
  }) as unknown as YouTubeVideo[];

  // Inject the specific video for guest appearances playlist
  if (videoFeedUrl === GUEST_APPEARANCES_PLAYLIST_FEED_URL) {
    const specialVideo: YouTubeVideo = {
      title: "The Kubernetes Podcast From Google @KubeConEU25 Day#3",
      link: "https://www.youtube.com/watch?v=mhToH2KgMtk",
      description:
        "The Kubernetes Podcast From Google was Live from KubeConEU2025 in London.\n\nWe spoke to some guests and covered what happened on Day#3",
      thumbnail: "https://img.youtube.com/vi/mhToH2KgMtk/maxresdefault.jpg",
      date: "2025-04-04T00:00:00Z", // KubeConEU25 Day 3
    };
    videos = injectSpecificVideo(videos, specialVideo);
  }

  // Sort all videos after injection
  return videos.sort((a, b) => {
    return descendingDate
      ? new Date(b.date).getTime() - new Date(a.date).getTime()
      : new Date(a.date).getTime() - new Date(b.date).getTime();
  });
}

export async function getLatestVideo(videoFeedUrl: string) {
  const videos = await getVideos({ videoFeedUrl, numberOfVideos: 1 });

  return videos[0];
}

export function sanitizeVideoDescription(description: string) {
  return marked.parse(
    description
      .replace(/Links:?.+/is, "")
      .replace(/Places to follow Nick.+/is, ""),
  );
}

function parseYouTubeStart(value: string | null): number | null {
  if (!value) return null;
  const normalized = value.trim();
  if (/^\d+$/.test(normalized)) {
    return Number(normalized);
  }
  if (/^\d+s$/.test(normalized)) {
    return Number(normalized.slice(0, -1));
  }
  const hmsMatch = normalized.match(/^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/);
  if (hmsMatch) {
    const hours = hmsMatch[1] ? Number(hmsMatch[1]) : 0;
    const minutes = hmsMatch[2] ? Number(hmsMatch[2]) : 0;
    const seconds = hmsMatch[3] ? Number(hmsMatch[3]) : 0;
    const total = hours * 3600 + minutes * 60 + seconds;
    if (total > 0) return total;
  }
  return null;
}

export function getYouTubeEmbedUrl(rawUrl: string): string {
  try {
    const url = new URL(rawUrl);
    const isShort = url.hostname.includes("youtu.be");
    const pathSegments = url.pathname.split("/").filter(Boolean);
    const videoId = isShort
      ? pathSegments[0] || ""
      : url.searchParams.get("v") || pathSegments[0] || "";
    if (!videoId) return rawUrl;

    const embedUrl = new URL(`https://www.youtube.com/embed/${videoId}`);

    const hashValue = url.hash.startsWith("#t=")
      ? url.hash.slice(3)
      : url.hash.startsWith("#")
        ? url.hash.slice(1)
        : null;
    const startValue =
      url.searchParams.get("start") || url.searchParams.get("t") || hashValue;
    const startSeconds = parseYouTubeStart(startValue);
    if (startSeconds !== null) {
      embedUrl.searchParams.set("start", startSeconds.toString());
    }

    const passthroughParams = [
      "list",
      "index",
      "controls",
      "rel",
      "autoplay",
    ] as const;
    passthroughParams.forEach((param) => {
      const value = url.searchParams.get(param);
      if (value) {
        embedUrl.searchParams.set(param, value);
      }
    });

    return embedUrl.toString();
  } catch (error) {
    console.log(error);
    return rawUrl;
  }
}
