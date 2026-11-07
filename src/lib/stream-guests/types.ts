/**
 * Normalized stream guest model (phase 1 scaffold).
 *
 * Live loaders still map the flat `stream_guests` row. These types describe
 * the target shape after guests + stream_episode_guests exist in Turso.
 */

export type StreamShowType = "nickyt.live" | "pomerium-live";

/** One person in `guests`. */
export interface Guest {
  id: number;
  slug: string;
  name: string;
  /** Canonical / current title; appearance override may differ. */
  title?: string;
  bio?: string;
  twitter?: string;
  twitch?: string;
  github?: string;
  youtube?: string;
  bluesky?: string;
  website?: string;
  linkedin?: string;
  avatarUrl?: string;
  /** EmDash CMS linkage once guest pages exist. */
  emdashSlug?: string;
}

/** Guest as attached to a specific episode (join row + guest). */
export interface EpisodeGuest extends Guest {
  /** Title at appearance time; prefer over Guest.title when set. */
  appearanceTitle?: string;
  sortOrder: number;
}

/**
 * Episode row: today's `stream_guests` table, later rename → `stream_episodes`.
 * Guest identity lives on `guests` / `EpisodeGuest[]`, not denormalized here.
 */
export interface StreamEpisode {
  id: number;
  type: StreamShowType;
  date: string;
  title: string;
  description: string;
  youtubeStreamLink?: string;
  linkedinStreamLink?: string;
  onSchedule: boolean;
  guests: EpisodeGuest[];
}

/**
 * Flat shape still returned by loaders / UI until cutover.
 * Multi-guest names remain comma-joined in `guestName` for compat.
 */
export interface FlatStreamGuestRow {
  type: StreamShowType;
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
  linkedin?: string;
  ogImageURL?: string;
}
