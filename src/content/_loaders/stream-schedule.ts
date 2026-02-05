import type { LiveLoader } from "astro/loaders";
import { ENV } from "varlock/env";

import type { StreamGuestInfo } from "../../utils/schedule-utils";

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

type GuestRecordFields = Partial<Record<(typeof GUEST_FIELDS)[number], string>>;

interface GuestRecord {
  id: string;
  createdTime: string;
  fields: GuestRecordFields;
}

const STREAM_GUESTS_TABLE = "Stream%20Guests";

function buildStreamGuestQueryUrl({
  apiKey,
  baseId,
}: {
  apiKey: string;
  baseId: string;
}) {
  // Only get guests on the stream schedule from the day before and on.
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setHours(23, 59, 0, 0);

  const startDate = yesterday.toISOString();

  const url = new URL(
    `https://api.airtable.com/v0/${baseId}/${STREAM_GUESTS_TABLE}`
  );
  url.searchParams.set(
    "filterByFormula",
    `AND(IS_AFTER({Date}, '${startDate}'), {On Schedule})`
  );
  url.searchParams.set("sortField", "Date");
  url.searchParams.set("sortDirection", "asc");
  GUEST_FIELDS.forEach((field) => {
    url.searchParams.append("fields[]", field);
  });

  return {
    url: url.toString(),
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  };
}

function mapRecordToSchedule(fields: GuestRecordFields): StreamGuestInfo {
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

  if (!date || !guestName || !title || !description) {
    throw new Error("Missing required stream schedule fields.");
  }

  // Validate that type is one of the allowed values.
  if (type !== "nickyt.live" && type !== "pomerium-live") {
    throw new Error(`Invalid stream type: ${type}`);
  }

  return {
    type: type as "nickyt.live" | "pomerium-live",
    date,
    guestName,
    guestTitle: guestTitle ?? "",
    title,
    description,
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
}

async function fetchStreamSchedule(): Promise<GuestRecord[]> {
  const apiKey = ENV.AIRTABLE_API_KEY;
  const baseId = ENV.AIRTABLE_STREAM_GUEST_BASE_ID;
  const { url, headers } = buildStreamGuestQueryUrl({ apiKey, baseId });

  const response = await fetch(url, { headers });
  if (!response.ok) {
    throw new Error(`Airtable schedule request failed: ${response.status}`);
  }

  const { records } = (await response.json()) as { records: GuestRecord[] };
  return records;
}

function buildPastGuestsQueryUrl({
  apiKey,
  baseId,
}: {
  apiKey: string;
  baseId: string;
}) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayISOString = today.toISOString();

  const url = new URL(
    `https://api.airtable.com/v0/${baseId}/${STREAM_GUESTS_TABLE}`
  );
  url.searchParams.set(
    "filterByFormula",
    `AND(IS_BEFORE({Date}, '${todayISOString}'), {YouTube Stream Link} != '', {On Schedule})`
  );
  url.searchParams.set("sortField", "Date");
  url.searchParams.set("sortDirection", "desc");
  url.searchParams.set("maxRecords", "2");
  GUEST_FIELDS.forEach((field) => {
    url.searchParams.append("fields[]", field);
  });

  return {
    url: url.toString(),
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  };
}

export async function fetchPastGuestsWithYouTube(): Promise<StreamGuestInfo[]> {
  try {
    const apiKey = ENV.AIRTABLE_API_KEY;
    const baseId = ENV.AIRTABLE_STREAM_GUEST_BASE_ID;
    const { url, headers } = buildPastGuestsQueryUrl({ apiKey, baseId });

    const response = await fetch(url, { headers });
    if (!response.ok) {
      throw new Error(
        `Airtable past guests request failed: ${response.status}`
      );
    }

    const { records } = (await response.json()) as { records: GuestRecord[] };
    return records.map((record) => mapRecordToSchedule(record.fields));
  } catch (error) {
    console.error("Error fetching past guests:", error);
    return [];
  }
}

export const streamScheduleLoader: LiveLoader<StreamGuestInfo, { id: string }> =
  {
    name: "stream-schedule",
    async loadCollection() {
      const records = await fetchStreamSchedule();

      return {
        entries: records.map((record) => ({
          id: record.id,
          data: mapRecordToSchedule(record.fields),
        })),
      };
    },
    async loadEntry({ filter }) {
      const apiKey = ENV.AIRTABLE_API_KEY;
      const baseId = ENV.AIRTABLE_STREAM_GUEST_BASE_ID;

      if (!filter?.id) {
        return { error: new Error("Missing Airtable record id filter.") };
      }

      const url = new URL(
        `${baseId}/${STREAM_GUESTS_TABLE}/${filter.id}`,
        "https://api.airtable.com/v0/"
      );
      GUEST_FIELDS.forEach((field) => {
        url.searchParams.append("fields[]", field);
      });

      const response = await fetch(url.toString(), {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      });

      if (!response.ok) {
        return {
          error: new Error(`Airtable entry request failed: ${response.status}`),
        };
      }

      const record = (await response.json()) as GuestRecord;

      return {
        id: record.id,
        data: mapRecordToSchedule(record.fields),
      };
    },
  };
