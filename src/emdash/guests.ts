import { getEmDashEntry, type InferCollectionData } from "emdash";

type EmDashGuest = InferCollectionData<"guests">;
type EmDashLivestream = InferCollectionData<"livestreams">;

export interface GuestSocials {
  twitter?: string;
  twitch?: string;
  github?: string;
  youtube?: string;
  bluesky?: string;
  website?: string;
  linkedin?: string;
}

export interface GuestInfo extends GuestSocials {
  /** EmDash entry id — the public slug for `/guests/{slug}`. */
  slug: string;
  name: string;
  role?: string;
}

export interface GuestEpisode {
  slug: string;
  title: string;
  date: string;
  type?: string;
  youtubeStreamLink?: string;
}

function entrySlug(slug: string | null, id: string): string {
  return slug ?? (id.includes("/") ? id.split("/").pop()! : id);
}

export function mapGuestEntry(entry: {
  id: string;
  data: EmDashGuest;
}): GuestInfo {
  return {
    slug: entrySlug(entry.data.slug, entry.id),
    name: entry.data.title,
    role: entry.data.role,
    twitter: entry.data.twitter,
    twitch: entry.data.twitch,
    github: entry.data.github,
    youtube: entry.data.youtube,
    bluesky: entry.data.bluesky,
    website: entry.data.website,
    linkedin: entry.data.linkedin,
  };
}

function mapEpisode(entry: {
  id: string;
  data: EmDashLivestream;
}): GuestEpisode {
  return {
    slug: entrySlug(entry.data.slug, entry.id),
    title: entry.data.title,
    date: entry.data.date,
    type: entry.data.type,
    youtubeStreamLink: entry.data.youtube_stream_link,
  };
}

/**
 * Guests linked to an EmDash livestream whose slug matches the public
 * `/videos/{slug}` URL.
 */
export async function getLivestreamGuests(slug: string): Promise<GuestInfo[]> {
  const { entry, error } = await getEmDashEntry("livestreams", slug, {
    references: { guests: { limit: 24 } },
  });
  if (error) {
    console.error(
      `[guests] Failed to load guests for livestream ${slug}:`,
      error
    );
    return [];
  }
  if (!entry?.references?.guests?.entries?.length) return [];

  return entry.references.guests.entries.map(mapGuestEntry);
}

/** Compact byline: "Name", "A and B", or "A, B, and C". */
export function formatGuestByline(guests: GuestInfo[]): string {
  const names = guests.map((guest) => guest.name);
  if (names.length === 0) return "";
  if (names.length === 1) return names[0];
  if (names.length === 2) return `${names[0]} and ${names[1]}`;
  return `${names.slice(0, -1).join(", ")}, and ${names[names.length - 1]}`;
}

export async function getGuestPage(slug: string): Promise<{
  guest?: GuestInfo;
  episodes: GuestEpisode[];
} | null> {
  const { entry, error } = await getEmDashEntry("guests", slug, {
    references: { livestreams: { limit: 100 } },
  });
  if (error) {
    console.error(`[guests] Failed to load guest ${slug}:`, error);
    return null;
  }
  if (!entry) return null;

  const guest = mapGuestEntry(entry);

  const episodes = (entry.references?.livestreams?.entries ?? [])
    .map(mapEpisode)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return { guest, episodes };
}
