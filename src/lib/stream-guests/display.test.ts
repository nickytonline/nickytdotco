import { describe, expect, it } from "vitest";

import {
  appearanceDisplayTitle,
  episodeToFlatRow,
  formatGuestNames,
  primaryGuestName,
  splitGuestNames,
} from "./display";
import type { EpisodeGuest, StreamEpisode } from "./types";

function guest(
  overrides: Partial<EpisodeGuest> & Pick<EpisodeGuest, "id" | "name">
): EpisodeGuest {
  return {
    slug: overrides.slug ?? overrides.name.toLowerCase().replace(/\s+/g, "-"),
    sortOrder: 0,
    ...overrides,
  };
}

describe("splitGuestNames", () => {
  it("splits comma-separated names and trims", () => {
    expect(splitGuestNames("Ada Lovelace, Grace Hopper")).toEqual([
      "Ada Lovelace",
      "Grace Hopper",
    ]);
  });

  it("returns a single name when there is no comma", () => {
    expect(splitGuestNames("Ada Lovelace")).toEqual(["Ada Lovelace"]);
  });
});

describe("primaryGuestName", () => {
  it("uses the first guest for video slugs", () => {
    expect(primaryGuestName("Ada Lovelace, Grace Hopper")).toBe("Ada Lovelace");
  });
});

describe("formatGuestNames / appearanceDisplayTitle", () => {
  it("orders by sortOrder then id", () => {
    const guests = [
      guest({ id: 2, name: "Second", sortOrder: 1 }),
      guest({ id: 1, name: "First", sortOrder: 0 }),
    ];
    expect(formatGuestNames(guests)).toBe("First, Second");
  });

  it("prefers appearance title over canonical title", () => {
    expect(
      appearanceDisplayTitle(
        guest({
          id: 1,
          name: "Ada",
          title: "Mathematician",
          appearanceTitle: "Guest engineer",
        })
      )
    ).toBe("Guest engineer");
  });
});

describe("episodeToFlatRow", () => {
  it("flattens multi-guest episodes for legacy UI", () => {
    const episode: StreamEpisode = {
      id: 10,
      type: "nickyt.live",
      date: "2026-01-01T17:00:00.000Z",
      title: "Zero Trust chat",
      description: "A chat.",
      youtubeStreamLink: "https://www.youtube.com/watch?v=abcdefghijk",
      onSchedule: true,
      guests: [
        guest({
          id: 1,
          name: "Ada Lovelace",
          title: "Mathematician",
          github: "ada",
          sortOrder: 0,
        }),
        guest({
          id: 2,
          name: "Grace Hopper",
          appearanceTitle: "Rear Admiral",
          sortOrder: 1,
        }),
      ],
    };

    expect(episodeToFlatRow(episode)).toMatchObject({
      guestName: "Ada Lovelace, Grace Hopper",
      guestTitle: "Mathematician",
      github: "ada",
      title: "Zero Trust chat",
    });
  });
});
