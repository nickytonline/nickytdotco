export const CDN_CACHE_MAX_SECONDS = 86_400;
export const PROJECTS_CACHE_MAX_SECONDS = 259_200;

export function isUtcMidnight(date: Date): boolean {
  return (
    date.getUTCHours() === 0 &&
    date.getUTCMinutes() === 0 &&
    date.getUTCSeconds() === 0 &&
    date.getUTCMilliseconds() === 0
  );
}

/**
 * Instant when an event should drop off "upcoming".
 * Timed events expire at that timestamp. Date-only values (UTC midnight)
 * expire at the following UTC midnight so they stay up for that calendar day.
 */
export function eventExpiryTimestamp(date: Date): number {
  if (isUtcMidnight(date)) {
    return Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate() + 1
    );
  }
  return date.getTime();
}

export function isEventUpcoming(
  date: Date,
  nowMs: number = Date.now()
): boolean {
  return eventExpiryTimestamp(date) > nowMs;
}

export function soonestExpiryTimestamp(
  dates: Date[],
  nowMs: number = Date.now()
): number | undefined {
  const upcoming = dates
    .map(eventExpiryTimestamp)
    .filter((expiry) => expiry > nowMs);

  if (upcoming.length === 0) {
    return undefined;
  }

  return Math.min(...upcoming);
}

export function cdnMaxAgeSeconds(
  nextExpiryTimestamp: number | undefined,
  nowMs: number = Date.now()
): number {
  if (nextExpiryTimestamp == null) {
    return CDN_CACHE_MAX_SECONDS;
  }

  return Math.min(
    CDN_CACHE_MAX_SECONDS,
    Math.max(0, Math.floor((nextExpiryTimestamp - nowMs) / 1000))
  );
}

export function setCdnCacheHeaders(
  headers: Headers,
  nextExpiryTimestamp: number | undefined,
  nowMs: number = Date.now()
): void {
  const maxAge = cdnMaxAgeSeconds(nextExpiryTimestamp, nowMs);
  headers.set("Cache-Control", "public, max-age=0, must-revalidate");
  headers.set(
    "Netlify-CDN-Cache-Control",
    `public, max-age=${maxAge}, must-revalidate`
  );
}

export function setFixedCdnCacheHeaders(
  headers: Headers,
  maxAgeSeconds: number
): void {
  headers.set("Cache-Control", "public, max-age=0, must-revalidate");
  headers.set(
    "Netlify-CDN-Cache-Control",
    `public, max-age=${maxAgeSeconds}, must-revalidate`
  );
}
