import { createClient } from "@libsql/client/http";
import type { LiveLoader } from "astro/loaders";
import { ENV } from "varlock/env";

export interface StreamVideoInfo extends Record<string, unknown> {
  type: "nickyt.live" | "pomerium-live";
  date: string;
  title: string;
  description: string;
  youtubeStreamLink: string;
  guestName: string;
  guestTitle?: string;
  twitter?: string;
  youtube?: string;
  twitch?: string;
  github?: string;
  bluesky?: string;
  website?: string;
  linkedin?: string;
}

function getClient() {
  return createClient({
    url: ENV.TURSO_DATABASE_URL,
    authToken: ENV.TURSO_AUTH_TOKEN,
  });
}

function mapRowToVideo(row: Record<string, unknown>): StreamVideoInfo {
  const {
    type,
    date,
    title,
    description,
    guest_name,
    guest_title,
    youtube_stream_link,
    twitter,
    twitch,
    github,
    youtube,
    bluesky,
    website,
    linkedin,
  } = row;

  if (!date || !guest_name || !title || !description || !youtube_stream_link) {
    throw new Error("Missing required stream video fields.");
  }

  if (type !== "nickyt.live" && type !== "pomerium-live") {
    throw new Error(`Invalid stream type: ${type}`);
  }

  return {
    type: type as "nickyt.live" | "pomerium-live",
    date: date as string,
    guestName: guest_name as string,
    guestTitle: (guest_title as string) ?? undefined,
    title: title as string,
    description: description as string,
    youtubeStreamLink: youtube_stream_link as string,
    twitter: (twitter as string) ?? undefined,
    twitch: (twitch as string) ?? undefined,
    github: (github as string) ?? undefined,
    youtube: (youtube as string) ?? undefined,
    bluesky: (bluesky as string) ?? undefined,
    website: (website as string) ?? undefined,
    linkedin: (linkedin as string) ?? undefined,
  } satisfies StreamVideoInfo;
}

export const streamVideosLoader: LiveLoader<StreamVideoInfo, { id: string }> = {
  name: "stream-videos",

  async loadCollection() {
    const client = getClient();

    // TODO: Remove youtube_stream_link filter once all rows have links
    const result = await client.execute({
      sql: `SELECT * FROM stream_guests
            WHERE on_schedule = 1
              AND youtube_stream_link IS NOT NULL
              AND youtube_stream_link != ''
            ORDER BY date DESC`,
      args: [],
    });

    return {
      entries: result.rows.map((row) => {
        const r = row as unknown as Record<string, unknown>;
        return {
          id: String(r.id),
          data: mapRowToVideo(r),
        };
      }),
    };
  },

  async loadEntry({ filter }) {
    if (!filter?.id) {
      return { error: new Error("Missing record id filter.") };
    }

    const client = getClient();

    // TODO: Remove youtube_stream_link filter once all rows have links
    const result = await client.execute({
      sql: `SELECT * FROM stream_guests
            WHERE id = ?
              AND on_schedule = 1
              AND youtube_stream_link IS NOT NULL
              AND youtube_stream_link != ''`,
      args: [filter.id],
    });

    if (result.rows.length === 0) {
      return {
        error: new Error(`No stream video found with id: ${filter.id}`),
      };
    }

    const row = result.rows[0] as unknown as Record<string, unknown>;
    return {
      id: String(row.id),
      data: mapRowToVideo(row),
    };
  },
};
