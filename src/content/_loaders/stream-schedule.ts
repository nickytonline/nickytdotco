import { createClient } from "@libsql/client/http";
import type { Row, Value } from "@libsql/client";
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
type StreamType = "nickyt.live" | "pomerium-live";

function isString(value: Value): value is string {
  return typeof value === "string";
}

function isStreamType(value: Value): value is StreamType {
  return (
    isString(value) && (value === "nickyt.live" || value === "pomerium-live")
  );
}

function sanitizeHttpUrl(value: Value): string | undefined {
  if (!isString(value) || !value) return undefined;
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

function mapRowToSchedule(row: Row): StreamGuestInfo {
  const { type, date, title, description, guest_name } = row;

  if (
    !isString(date) ||
    !isString(guest_name) ||
    !isString(title) ||
    !isString(description)
  ) {
    throw new Error("Missing required stream schedule fields.");
  }

  if (!isStreamType(type)) {
    throw new Error(`Invalid stream type: ${type}`);
  }

  return {
    type,
    date,
    guestName: guest_name,
    guestTitle: isString(row.guest_title) ? row.guest_title : "",
    title,
    description,
    youtubeStreamLink: isString(row.youtube_stream_link)
      ? row.youtube_stream_link
      : undefined,
    linkedinStreamLink: sanitizeHttpUrl(row.linkedin_stream_link),
    twitter: isString(row.twitter) ? row.twitter : undefined,
    twitch: isString(row.twitch) ? row.twitch : undefined,
    github: isString(row.github) ? row.github : undefined,
    youtube: isString(row.youtube) ? row.youtube : undefined,
    bluesky: isString(row.bluesky) ? row.bluesky : undefined,
    website: isString(row.website) ? row.website : undefined,
    linkedin: isString(row.linkedin) ? row.linkedin : undefined,
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
      const data = mapRowToSchedule(row);

      if (!isString(row.slug) || !isString(row.youtube_stream_link)) {
        throw new Error("Missing required past stream fields.");
      }

      return {
        ...data,
        slug: row.slug,
        youtubeStreamLink: row.youtube_stream_link,
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
          return {
            id: String(row.id),
            data: mapRowToSchedule(row),
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

      const row = result.rows[0];

      if (!row) {
        return {
          error: new Error(`No stream guest found with id: ${filter.id}`),
        };
      }

      return {
        id: String(row.id),
        data: mapRowToSchedule(row),
      };
    },
  };
