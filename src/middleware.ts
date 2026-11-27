import { defineMiddleware } from "astro:middleware";
import { trailingSlashRedirectPath } from "./utils/trailing-slash.ts";

export const onRequest = defineMiddleware((context, next) => {
  if (context.isPrerendered) return next();

  const method = context.request.method;

  if (method !== "GET" && method !== "HEAD") return next();

  const target = trailingSlashRedirectPath(
    context.url.pathname,
    context.url.search
  );

  if (!target) return next();

  return context.redirect(target, 301);
});
