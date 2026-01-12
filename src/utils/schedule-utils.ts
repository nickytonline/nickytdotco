import Parser from "rss-parser";

export interface StreamGuestInfo extends Record<string, unknown> {
  type: "nickyt.live" | "pomerium-live";
  date: string;
  title: string;
  description: string;
  youtubeStreamLink?: string;
  linkedinStreamLink?: string;
  guestName: string;
  guestTitle?: string;
  twitter?: string;
  youtube?: string;
  twitch?: string;
  github?: string;
  bluesky?: string;
  website?: string;
  ogImageURL?: string;
  linkedin?: string;
}

export function getHeadingId(name: string, dateTime: string) {
  const [date] = dateTime.split("T");
  return `${date}-${encodeURIComponent(name.replace(/\s+/, "-"))}`.toLowerCase();
}

export function getLocalizedDate({
  date,
  locale,
  timezone,
  showTime = false,
}: {
  date: string;
  locale: string;
  timezone: string;
  showTime: boolean;
}) {
  const timeStyle = showTime ? "long" : undefined;
  const options: Intl.DateTimeFormatOptions = {
    timeZone: timezone,
    dateStyle: "full",
    timeStyle,
  };

  return new Date(date).toLocaleString(locale, options);
}

// Pomerium Live use the YouTube feed for @pomerium_io
export async function getPomeriumLiveStreamSchedule() {
  const parser = new Parser();

  // Option 1: Using channel's upcoming live streams playlist
  const feed = await parser.parseURL(
    "https://www.youtube.com/feeds/videos.xml?channel_id=UCBJq3tmXb-1fOvv2bFc8l0A"
  );

  // Filter for only upcoming live streams
  return feed.items.map((item) => {
    return {
      type: "pomerium-live" as const,
      title: item.title,
      link: item.link,
      description: item.content as string,
      date: item.pubDate,
      ogImage: item.media?.thumbnail?.[0]?.$.url ?? "",
    };
  });
}
