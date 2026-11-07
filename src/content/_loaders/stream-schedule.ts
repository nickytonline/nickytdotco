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

/**
 * Returns the value only if it is a valid http(s) URL, otherwise undefined.
 * Keeps z.url() schema fields from rejecting dirty Turso values.
 */
function sanitizeHttpUrl(value: unknown): string | undefined {
  if (typeof value !== "string" || !value) return undefined;
  const lower = value.toLowerCase();
  if (!lower.startsWith("http://") && !lower.startsWith("https://")) {
    return undefined;
  }
  try {
    new URL(value);
    return value;
  } catch {
    return undefined;
  }
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
    linkedinStreamLink: sanitizeHttpUrl(linkedin_stream_link),
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
    const client = createClient({
      url: ENV.EMDASH_TURSO_DATABASE_URL,
      authToken: ENV.TURSO_AUTH_TOKEN,
    });
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const result = await client.execute({
      sql: `SELECT
              e.slug,
              e.type,
              e.date,
              e.title,
              e.description,
              e.youtube_stream_link,
              e.linkedin_stream_link,
              COALESCE(NULLIF(group_concat(g.title, ', '), ''), 'Nick Taylor') AS guest_name
            FROM ec_livestreams e
            LEFT JOIN _emdash_content_references r
              ON r.parent_group = e.id
             AND r.relation_id = '01M6V4Y1GJVJVCRFJYMRAQE9YJ'
            LEFT JOIN ec_guests g
              ON g.id = r.child_group
             AND g.status = 'published'
             AND g.deleted_at IS NULL
            WHERE e.status = 'published'
              AND e.deleted_at IS NULL
              AND e.date < ?
              AND e.youtube_stream_link IS NOT NULL
              AND e.youtube_stream_link != ''
            GROUP BY e.id
            ORDER BY e.date DESC
            LIMIT 2`,
      args: [today.toISOString()],
    });

    return result.rows.map((row) => {
      const r = row as unknown as Record<string, unknown>;
      return {
        slug: r.slug as string,
        type: r.type as "nickyt.live" | "pomerium-live",
        date: r.date as string,
        guestName: r.guest_name as string,
        title: r.title as string,
        description: r.description as string,
        youtubeStreamLink: r.youtube_stream_link as string,
        linkedinStreamLink: sanitizeHttpUrl(r.linkedin_stream_link),
      } satisfies StreamGuestInfo;
    });
  } catch (error) {
    console.error("Error fetching past guests:", error);
    return [];
  }
}

export const streamScheduleLoader: LiveLoader<StreamGuestInfo, { id: string }> =
  {
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
            id: String(r.id),
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
        return {
          error: new Error(`No stream guest found with id: ${filter.id}`),
        };
      }

      const row = result.rows[0] as unknown as Record<string, unknown>;
      return {
        id: String(row.id),
        data: mapRowToSchedule(row),
      };
    },
  };
