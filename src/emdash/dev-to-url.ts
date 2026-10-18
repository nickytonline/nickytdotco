const DEV_HOSTS = new Set(["dev.to", "www.dev.to"]);

/**
 * Href for the Boost on DEV button.
 * Empty, invalid, and non-DEV values stay hidden.
 */
export function boostOnDevHref(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  let url: URL;
  try {
    url = new URL(trimmed);
  } catch {
    return undefined;
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") return undefined;
  if (!DEV_HOSTS.has(url.hostname)) return undefined;
  return url.toString();
}
