import Parser from "rss-parser";

export interface StreamGuestInfo {
  type: "nickyt.live" | "2-full-2-stack" | "pomerium-live";
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

export function getLatestGuestMarkup({
  guests,
  locale,
  timezone,
}: {
  guests: StreamGuestInfo[];
  locale: string;
  timezone: string;
}) {
  if (!guests) {
    return ``;
  }

  return guests.reduce((acc, guest) => {
    const { date, title, guestName } = guest;
    const headingId = getHeadingId(guestName, title);
    const guestDate = getLocalizedDate({
      date,
      locale,
      timezone,
      showTime: true,
    });

    return (
      acc +
      `
    <ol class="post-list__items sf-flow pad-top-300" reversed>
      <li class="post-list__item">
        <h3 class="font-base leading-tight text-600 weight-mid">
          <a href="/pages/stream-schedule/#${headingId}" class="post-list__link" rel="bookmark">${title}</a>
        </h3>
        <time datetime="${date}" class="text-500 gap-top-300 weight-mid">${guestDate}</time>
      </li>
    </ol>
    `
    );
  }, '<h2 class="post-list__heading text-700 md:text-800">Upcoming Live Streams</h2>');
}

const GUEST_FIELDS = [
  "Date",
  "Name",
  "Guest Title",
  "Stream Title",
  "Stream Description",
  "YouTube Stream Link",
  "LinkedIn Stream Link",
  "Twitter Username",
  "Twitch Handle",
  "GitHub Handle",
  "YouTube Channel",
  "Website",
  "Bluesky",
  "LinkedIn",
  "type",
] as const;

export async function getStreamSchedule({
  apiKey,
  baseId,
}: {
  apiKey: string;
  baseId: string;
}): Promise<StreamGuestInfo[]> {
  // Only get guests on the stream schedule from the day before and on
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setHours(23, 59, 0, 0);

  const startDate = yesterday.toISOString();
  // Only get guests on the stream schedule from the day before and on
  const filter = `&filterByFormula=AND(IS_AFTER({Date}, '${startDate}'), {On%20Schedule})`;
  const sorter = `&sortField=Date&sortDirection=asc`;

  // Generates querystring key value pairs that look like this, Name&fields[]=Guest%20Title&fields[]=Stream%20Title
  const fields = GUEST_FIELDS.map(encodeURIComponent).join("&fields[]=");

  // Uses the Airtable API's filterByFormula (see https://support.airtable.com/docs/how-to-sort-filter-or-retrieve-ordered-records-in-the-api)
  const streamGuestInfoQueryUrl = `https://api.airtable.com/v0/${baseId}/Stream%20Guests?${filter}${sorter}&fields[]=${fields}`;

  const response = await fetch(streamGuestInfoQueryUrl, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  });

  interface GuestRecord {
    createdTime: string;
    fields: Partial<Record<(typeof GUEST_FIELDS)[number], string>>;
  }

  const { records } = (await response.json()) as { records: GuestRecord[] };
  // Can't use satifies. Functions bundler doesn't support it yet
  const schedule = records.map(({ fields }) => {
    const {
      Date: date,
      Name: guestName,
      "Guest Title": guestTitle,
      "Stream Title": title,
      "Stream Description": description,
      "YouTube Stream Link": youtubeStreamLink,
      "LinkedIn Stream Link": linkedinStreamLink,
      "Twitter Username": twitter,
      "Twitch Handle": twitch,
      "GitHub Handle": github,
      "YouTube Channel": youtube,
      LinkedIn: linkedin,
      Bluesky: bluesky,
      Website: website,
      type,
    } = fields;

    // Validate that type is one of the allowed values
    if (
      type !== "nickyt.live" &&
      type !== "2-full-2-stack" &&
      type !== "pomerium-live"
    ) {
      throw new Error(`Invalid stream type: ${type}`);
    }

    return {
      type: type as "nickyt.live" | "2-full-2-stack" | "pomerium-live",
      date: date!,
      guestName: guestName!,
      guestTitle: guestTitle ?? "",
      title: title!,
      description: description!,
      youtubeStreamLink: youtubeStreamLink ?? undefined,
      linkedinStreamLink: linkedinStreamLink ?? undefined,
      twitter: twitter ?? undefined,
      twitch: twitch ?? undefined,
      github: github ?? undefined,
      youtube: youtube ?? undefined,
      bluesky: bluesky ?? undefined,
      website: website ?? undefined,
      linkedin: linkedin ?? undefined,
    } satisfies StreamGuestInfo;
  });

  return schedule;
}

export type CfeScheduleItem = {
  type: "2-full-2-stack";
  title: string | undefined;
  link: string | undefined;
  description: string;
  date: string;
  ogImage: string;
};

async function getOgImage(url: string) {
  try {
    const response = await fetch(url);
    const html = await response.text();
    const match = html.match(
      /<meta.+property=['"]og:image['"].+content=['"]([^"']+)['"]/,
    );

    return match?.[1] ?? "";
  } catch (e) {
    console.error(e);
    return "";
  }
}

export async function get2Full2StackStreamSchedule() {
  const parser = new Parser();

  const feed = await parser.parseURL("https://cfe.dev/rss.xml");

  const items = feed.items
    .filter(
      (item) =>
        item.link?.startsWith("https://cfe.dev/talkshows/2full2stack") &&
        new Date(item.pubDate!) > new Date(),
    )
    .map(async (m) => {
      return {
        type: "2-full-2-stack" as const,
        title: m.title,
        link: m.link,
        description: m.content as string,
        date: m.pubDate ?? new Date().toISOString(),
        ogImage: await getOgImage(m.link!),
      };
    });

  return await Promise.all(items);
}

// Pomerium Live use the YouTube feed for @pomerium_io
export async function getPomeriumLiveStreamSchedule() {
  const parser = new Parser();

  // Option 1: Using channel's upcoming live streams playlist
  const feed = await parser.parseURL(
    "https://www.youtube.com/feeds/videos.xml?channel_id=UCBJq3tmXb-1fOvv2bFc8l0A",
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
