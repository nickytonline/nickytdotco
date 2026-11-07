import { getEmDashEntry } from "emdash";

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
  legacySlug?: string;
}

function asString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim().length > 0
    ? value.trim()
    : undefined;
}

export function mapGuestEntry(entry: {
  id: string;
  data: Record<string, unknown>;
  slug?: string | null;
}): GuestInfo | null {
  const name = asString(entry.data.title);
  if (!name) return null;

  const slug =
    asString(entry.slug) ??
    asString(entry.data.slug) ??
    // Referenced entries expose the public slug as `entry.id`.
    (entry.id.includes("/") ? entry.id.split("/").pop()! : entry.id);

  return {
    slug,
    name,
    role: asString(entry.data.role),
    twitter: asString(entry.data.twitter),
    twitch: asString(entry.data.twitch),
    github: asString(entry.data.github),
    youtube: asString(entry.data.youtube),
    bluesky: asString(entry.data.bluesky),
    website: asString(entry.data.website),
    linkedin: asString(entry.data.linkedin),
  };
}

function mapEpisode(entry: {
  id: string;
  data: Record<string, unknown>;
  slug?: string | null;
}): GuestEpisode | null {
  const title = asString(entry.data.title);
  const date = asString(entry.data.date);
  if (!title || !date) return null;

  const legacySlug = asString(entry.data.legacy_slug);
  const slug =
    legacySlug ?? asString(entry.slug) ?? asString(entry.data.slug) ?? entry.id;

  return {
    slug,
    title,
    date,
    type: asString(entry.data.type),
    legacySlug,
  };
}

/**
 * Guests linked to an EmDash livestream whose slug matches the public
 * `/videos/{slug}` legacy slug.
 */
export async function getLivestreamGuests(
  legacySlug: string
): Promise<GuestInfo[]> {
  const { entry, error } = await getEmDashEntry("livestreams", legacySlug, {
    references: { guests: { limit: 24 } },
  });
  if (error) {
    console.error(
      `[guests] Failed to load guests for livestream ${legacySlug}:`,
      error
    );
    return [];
  }
  if (!entry?.references?.guests?.entries?.length) return [];

  return entry.references.guests.entries
    .map((guestEntry) =>
      mapGuestEntry({
        id: guestEntry.id,
        data: guestEntry.data as Record<string, unknown>,
        slug: (guestEntry as { slug?: string }).slug,
      })
    )
    .filter((guest): guest is GuestInfo => guest !== null);
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

  const guest = mapGuestEntry({
    id: entry.id,
    data: entry.data as Record<string, unknown>,
    slug: (entry as { slug?: string }).slug ?? slug,
  });
  if (!guest) return null;

  const episodes = (entry.references?.livestreams?.entries ?? [])
    .map((streamEntry) =>
      mapEpisode({
        id: streamEntry.id,
        data: streamEntry.data as Record<string, unknown>,
        slug: (streamEntry as { slug?: string }).slug,
      })
    )
    .filter((episode): episode is GuestEpisode => episode !== null)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return { guest, episodes };
}
