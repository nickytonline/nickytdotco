import type { CollectionEntry } from "astro:content";
import slugify from "slugify";

const PLACEHOLDER_IMAGE = "/assets/talks/no-video-thumb.svg";

export function extractYouTubeVideoId(url: string): string | undefined {
  return (
    url.match(/(?:v=|youtu\.be\/|\/live\/)([A-Za-z0-9_-]{11})/)?.[1] ??
    undefined
  );
}

export function slugifyVideo(title: string, guestName: string): string {
  const opts = { lower: true, strict: true };
  const primaryGuest = guestName.split(",")[0].trim();
  return `${slugify(title, opts)}-${slugify(primaryGuest, opts)}`;
}

/**
 * Get the thumbnail URL for a talk
 * @param talk - The talk to get the thumbnail URL for
 * @returns The thumbnail URL
 */
export function getThumbnailUrl(talk: CollectionEntry<"talks">) {
  if (talk.data.video?.image) {
    return talk.data.video.image.url;
  }

  if (talk.data.video?.type === "youtube") {
    const videoId = talk.data.video.url.match(
      new RegExp(
        String.raw`(?:youtube\.com/(?:[^/]+/.+/|(?:v|e(?:mbed)?)/|.*[?&]v=)|youtu\.be/)([^"&?/\s]{11})`
      )
    )?.[1];
    if (videoId) {
      return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
    }
  }

  if (talk.data.video?.type === "vimeo") {
    const videoId = talk.data.video.url.match(/(?:vimeo\.com\/)(\d+)/)?.[1];
    if (videoId) {
      return `https://vumbnail.com/${videoId}.jpg`;
    }
  }

  return PLACEHOLDER_IMAGE;
}
