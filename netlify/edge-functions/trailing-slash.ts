import { trailingSlashRedirectPath } from "../../src/utils/trailing-slash.ts";

export default async function trailingSlash(
  request: Request,
  context: { next: () => Promise<Response> }
): Promise<Response> {
  const method = request.method;

  if (method !== "GET" && method !== "HEAD") return context.next();

  const url = new URL(request.url);
  const target = trailingSlashRedirectPath(url.pathname, url.search);

  if (!target) return context.next();

  return Response.redirect(new URL(target, url.origin), 301);
}
