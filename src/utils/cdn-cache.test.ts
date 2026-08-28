import { describe, expect, it } from "vitest";
import {
  CDN_CACHE_MAX_SECONDS,
  cdnMaxAgeSeconds,
  eventExpiryTimestamp,
  isEventUpcoming,
  isUtcMidnight,
  soonestExpiryTimestamp,
} from "./cdn-cache.ts";

describe("eventExpiryTimestamp", () => {
  it("keeps timed events at that instant, including non-UTC offsets", () => {
    const date = new Date("2026-09-25T15:45:00-03:00");
    expect(isUtcMidnight(date)).toBe(false);
    expect(eventExpiryTimestamp(date)).toBe(date.getTime());
  });

  it("treats UTC midnight as date-only and expires at the next UTC midnight", () => {
    const date = new Date("2026-09-15T00:00:00.000Z");
    expect(isUtcMidnight(date)).toBe(true);
    expect(eventExpiryTimestamp(date)).toBe(
      Date.parse("2026-09-16T00:00:00.000Z")
    );
  });
});

describe("isEventUpcoming", () => {
  it("keeps a date-only event upcoming through that UTC day", () => {
    const date = new Date("2026-09-15T00:00:00.000Z");
    expect(isEventUpcoming(date, Date.parse("2026-09-15T18:00:00.000Z"))).toBe(
      true
    );
    expect(isEventUpcoming(date, Date.parse("2026-09-16T00:00:00.000Z"))).toBe(
      false
    );
  });
});

describe("cdnMaxAgeSeconds", () => {
  it("caps at one day when the next event is further out", () => {
    const now = Date.parse("2026-01-01T00:00:00.000Z");
    const next = Date.parse("2026-01-10T00:00:00.000Z");
    expect(cdnMaxAgeSeconds(next, now)).toBe(CDN_CACHE_MAX_SECONDS);
  });

  it("uses time until the event when sooner than one day", () => {
    const now = Date.parse("2026-01-01T00:00:00.000Z");
    const next = Date.parse("2026-01-01T02:00:00.000Z");
    expect(cdnMaxAgeSeconds(next, now)).toBe(7200);
  });

  it("is one day when there is no upcoming event", () => {
    expect(cdnMaxAgeSeconds(undefined, 0)).toBe(CDN_CACHE_MAX_SECONDS);
  });
});

describe("soonestExpiryTimestamp", () => {
  it("returns the earliest still-upcoming expiry", () => {
    const now = Date.parse("2026-01-01T00:00:00.000Z");
    expect(
      soonestExpiryTimestamp(
        [
          new Date("2026-01-01T03:00:00.000Z"),
          new Date("2026-01-01T01:00:00.000Z"),
        ],
        now
      )
    ).toBe(Date.parse("2026-01-01T01:00:00.000Z"));
  });
});
