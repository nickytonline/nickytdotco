import { createClient } from "@libsql/client/http";
import type { LiveLoader } from "astro/loaders";
import { ENV } from "varlock/env";

import type { StreamGuestInfo } from "../../utils/schedule-utils";

function getClient() {
  return createClient({
    url: ENV.TURSO_DATABASE_URL,
    authToken: ENV.TURSO_AUTH_TOKEN,
  });
}

function mapRowToSchedule(row: Record<string, unknown>): StreamGuestInfo {
  const {
    type,
    date,
    title,
    description,
    guest_name,
    guest_title,
    youtube_stream_link,
    linkedin_stream_link,
    twitter,
    twitch,
    github,
    youtube,
    bluesky,
    website,
    linkedin,
  } = row;

  if (!date || !guest_name || !title || !description) {
    throw new Error("Missing required stream schedule fields.");
  }

  if (type !== "nickyt.live" && type !== "pomerium-live") {
    throw new Error(`Invalid stream type: ${type}`);
  }

  return {
    type: type as "nickyt.live" | "pomerium-live",
    date: date as string,
    guestName: guest_name as string,
    guestTitle: (guest_title as string) ?? "",
    title: title as string,
    description: description as string,
    youtubeStreamLink: (youtube_stream_link as string) ?? undefined,
    linkedinStreamLink: (linkedin_stream_link as string) ?? undefined,
    twitter: (twitter as string) ?? undefined,
    twitch: (twitch as string) ?? undefined,
    github: (github as string) ?? undefined,
    youtube: (youtube as string) ?? undefined,
    bluesky: (bluesky as string) ?? undefined,
    website: (website as string) ?? undefined,
    linkedin: (linkedin as string) ?? undefined,
  } satisfies StreamGuestInfo;
}

export async function fetchPastGuestsWithYouTube(): Promise<StreamGuestInfo[]> {
  try {
    const client = getClient();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const result = await client.execute({
      sql: `SELECT * FROM stream_guests
            WHERE on_schedule = 1
              AND date < ?
              AND youtube_stream_link IS NOT NULL
              AND youtube_stream_link != ''
            ORDER BY date DESC
            LIMIT 2`,
      args: [today.toISOString()],
    });

    return result.rows.map((row) => mapRowToSchedule(row as unknown as Record<string, unknown>));
  } catch (error) {
    console.error("Error fetching past guests:", error);
    return [];
  }
}

export const streamScheduleLoader: LiveLoader<StreamGuestInfo, { id: string }> = {
  name: "stream-schedule",

  async loadCollection() {
    const client = getClient();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(23, 59, 0, 0);

    const result = await client.execute({
      sql: `SELECT * FROM stream_guests
            WHERE on_schedule = 1
              AND date > ?
            ORDER BY date ASC`,
      args: [yesterday.toISOString()],
    });

    return {
      entries: result.rows.map((row) => {
        const r = row as unknown as Record<string, unknown>;
        return {
          id: r.id as string,
          data: mapRowToSchedule(r),
        };
      }),
    };
  },

  async loadEntry({ filter }) {
    if (!filter?.id) {
      return { error: new Error("Missing record id filter.") };
    }

    const client = getClient();
    const result = await client.execute({
      sql: `SELECT * FROM stream_guests WHERE id = ? AND on_schedule = 1`,
      args: [filter.id],
    });

    if (result.rows.length === 0) {
      return { error: new Error(`No stream guest found with id: ${filter.id}`) };
    }

    const row = result.rows[0] as unknown as Record<string, unknown>;
    return {
      id: row.id as string,
      data: mapRowToSchedule(row),
    };
  },
};
