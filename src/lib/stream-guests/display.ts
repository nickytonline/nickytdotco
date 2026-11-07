import type { EpisodeGuest, FlatStreamGuestRow, StreamEpisode } from "./types";

/** Split today's comma-separated guest_name into ordered names. */
export function splitGuestNames(guestName: string): string[] {
  return guestName
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
}

/** Primary guest = first listed; matches slugifyVideo behavior. */
export function primaryGuestName(guestName: string): string {
  return splitGuestNames(guestName)[0] ?? guestName.trim();
}

export function appearanceDisplayTitle(
  guest: EpisodeGuest
): string | undefined {
  return guest.appearanceTitle || guest.title || undefined;
}

/** Comma-joined names for UI / RSS / search that still expect one string. */
export function formatGuestNames(guests: EpisodeGuest[]): string {
  return [...guests]
    .sort((a, b) => a.sortOrder - b.sortOrder || a.id - b.id)
    .map((g) => g.name)
    .join(", ");
}

/**
 * Project a normalized episode into the flat loader/UI shape so existing
 * pages can keep consuming guestName / socials during dual-read.
 * Socials come from the primary (first) guest.
 */
export function episodeToFlatRow(episode: StreamEpisode): FlatStreamGuestRow {
  const ordered = [...episode.guests].sort(
    (a, b) => a.sortOrder - b.sortOrder || a.id - b.id
  );
  const primary = ordered[0];

  return {
    type: episode.type,
    date: episode.date,
    title: episode.title,
    description: episode.description,
    youtubeStreamLink: episode.youtubeStreamLink,
    linkedinStreamLink: episode.linkedinStreamLink,
    guestName: formatGuestNames(ordered),
    guestTitle: primary ? appearanceDisplayTitle(primary) : undefined,
    twitter: primary?.twitter,
    youtube: primary?.youtube,
    twitch: primary?.twitch,
    github: primary?.github,
    bluesky: primary?.bluesky,
    website: primary?.website,
    linkedin: primary?.linkedin,
  };
}
