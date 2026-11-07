/**
 * SQL fragments for the normalized schema.
 * Not wired into Astro live loaders yet — scaffold only.
 */

/** Episodes with ordered guests (for a future streamVideos / schedule cutover). */
export const EPISODES_WITH_GUESTS_SQL = `
SELECT
  e.id AS episode_id,
  e.type,
  e.date,
  e.title,
  e.description,
  e.youtube_stream_link,
  e.linkedin_stream_link,
  e.on_schedule,
  g.id AS guest_id,
  g.slug AS guest_slug,
  g.name AS guest_name,
  COALESCE(eg.guest_title, g.title) AS guest_title,
  g.twitter,
  g.twitch,
  g.github,
  g.youtube,
  g.bluesky,
  g.website,
  g.linkedin,
  g.avatar_url,
  g.emdash_slug,
  eg.sort_order
FROM stream_guests e
LEFT JOIN stream_episode_guests eg ON eg.episode_id = e.id
LEFT JOIN guests g ON g.id = eg.guest_id
WHERE e.on_schedule = 1
ORDER BY e.date DESC, eg.sort_order ASC, g.id ASC
`.trim();

/** All appearances for one guest (future /guests/[slug] page). */
export const GUEST_APPEARANCES_SQL = `
SELECT
  g.id AS guest_id,
  g.slug,
  g.name,
  g.title,
  g.bio,
  g.emdash_slug,
  e.id AS episode_id,
  e.type,
  e.date,
  e.title AS episode_title,
  e.description AS episode_description,
  e.youtube_stream_link,
  eg.guest_title AS appearance_title,
  eg.sort_order
FROM guests g
JOIN stream_episode_guests eg ON eg.guest_id = g.id
JOIN stream_guests e ON e.id = eg.episode_id
WHERE g.slug = ?
ORDER BY e.date DESC
`.trim();
