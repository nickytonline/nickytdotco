const FILE_EXTENSION = /\.[a-z0-9]+$/i;

const SKIPPED_ROOTS = ["/api", "/assets", "/fonts", "/pagefind"];

export function hasFileExtension(pathname: string): boolean {
  const segment = pathname.slice(pathname.lastIndexOf("/") + 1);

  return FILE_EXTENSION.test(segment);
}

/** Page paths that must not gain a trailing slash. */
export function isSkippedTrailingSlashPath(pathname: string): boolean {
  if (pathname.startsWith("/_") || pathname.startsWith("/@")) return true;

  if (pathname.startsWith("/.well-known")) return true;

  if (pathname.startsWith("/src/") || pathname.startsWith("/node_modules/")) {
    return true;
  }

  for (const root of SKIPPED_ROOTS) {
    if (pathname === root || pathname.startsWith(`${root}/`)) return true;
  }

  return false;
}

export function withTrailingSlash(pathname: string): string {
  if (
    pathname === "/" ||
    pathname.endsWith("/") ||
    hasFileExtension(pathname)
  ) {
    return pathname;
  }

  return `${pathname}/`;
}

export function toCanonicalUrl(origin: string, pathname: string): string {
  const normalizedOrigin = origin.endsWith("/") ? origin.slice(0, -1) : origin;

  return `${normalizedOrigin}${withTrailingSlash(pathname)}`;
}

/**
 * Path to 301 to, including the query string, or undefined when the request
 * should be served as-is.
 */
export function trailingSlashRedirectPath(
  pathname: string,
  search: string
): string | undefined {
  if (pathname === "/" || pathname.endsWith("/")) return undefined;

  if (hasFileExtension(pathname) || isSkippedTrailingSlashPath(pathname)) {
    return undefined;
  }

  return `${pathname}/${search}`;
}
