import { createClient } from "@libsql/client/http";
import type { Row, Value } from "@libsql/client";
import type { LiveLoader } from "astro/loaders";
import { ENV } from "varlock/env";

export interface StreamVideoInfo extends Record<string, unknown> {
  slug: string;
  type: "nickyt.live" | "pomerium-live";
  date: string;
  title: string;
  description: string;
  youtubeStreamLink: string;
  linkedinStreamLink?: string;
  guestName: string;
}

function getClient() {
  return createClient({
    url: ENV.EMDASH_TURSO_DATABASE_URL,
    authToken: ENV.TURSO_AUTH_TOKEN,
  });
}

const YOUTUBE_VIDEO_ID_RE = /(?:v=|youtu\.be\/|\/live\/)([A-Za-z0-9_-]{11})/;

function hasYouTubeVideoId(url: string): boolean {
  return YOUTUBE_VIDEO_ID_RE.test(url);
}

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

  try {
    const url = new URL(value);

    return url.protocol === "http:" || url.protocol === "https:"
      ? url.toString()
      : undefined;
  } catch {
    return undefined;
  }
}

function mapRowToVideo(row: Row): StreamVideoInfo {
  const {
    slug,
    type,
    date,
    title,
    description,
    youtube_stream_link,
    linkedin_stream_link,
    guest_name,
  } = row;

  if (
    !isString(slug) ||
    !isString(date) ||
    !isString(title) ||
    !isString(description) ||
    !isString(youtube_stream_link) ||
    !isString(guest_name)
  ) {
    throw new Error("Missing required EmDash livestream fields.");
  }

  if (!isStreamType(type)) {
    throw new Error(`Invalid stream type: ${type}`);
  }

  if (!hasYouTubeVideoId(youtube_stream_link)) {
    throw new Error(
      `youtube_stream_link does not contain an extractable YouTube video ID: ${youtube_stream_link}`
    );
  }

  return {
    slug,
    type,
    date,
    title,
    description,
    youtubeStreamLink: youtube_stream_link,
    linkedinStreamLink: sanitizeHttpUrl(linkedin_stream_link),
    guestName: guest_name,
  } satisfies StreamVideoInfo;
}

const VIDEO_QUERY = `SELECT
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
    AND e.youtube_stream_link IS NOT NULL
    AND e.youtube_stream_link != ''`;

export const streamVideosLoader: LiveLoader<StreamVideoInfo, { id: string }> = {
  name: "stream-videos",

  async loadCollection() {
    const client = getClient();

    const result = await client.execute({
      sql: `${VIDEO_QUERY}
        GROUP BY e.id
        ORDER BY e.date DESC`,
      args: [],
    });

    return {
      entries: result.rows.map((row) => {
        const data = mapRowToVideo(row);

        return { id: data.slug, data };
      }),
    };
  },

  async loadEntry({ filter }) {
    if (!filter?.id) {
      return { error: new Error("Missing livestream slug filter.") };
    }

    const client = getClient();

    const result = await client.execute({
      sql: `${VIDEO_QUERY}
        AND e.slug = ?
        GROUP BY e.id`,
      args: [filter.id],
    });

    if (result.rows.length === 0) {
      return {
        error: new Error(`No EmDash livestream found with slug: ${filter.id}`),
      };
    }

    const row = result.rows[0];

    if (!row) {
      return {
        error: new Error(`No EmDash livestream found with slug: ${filter.id}`),
      };
    }

    const data = mapRowToVideo(row);

    return { id: data.slug, data };
  },
};
