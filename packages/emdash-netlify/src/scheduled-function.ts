import type { Config } from "@netlify/functions";
import { resolveEmDashSiteUrl } from "./site-url.ts";

export interface ScheduledPublishOptions {
  siteUrl: string | undefined;
  secret: string | undefined;
  fetchImpl?: typeof fetch;
}

/**
 * Ask the Astro server bundle to run EmDash maintenance.
 *
 * A Netlify scheduled function is a separate isolate from the Astro SSR
 * bundle, so it cannot call `runScheduledTasks()` directly (that import
 * needs EmDash's virtual modules). It POSTs to the on-demand route that can.
 */
export async function postScheduledPublish(
  options: ScheduledPublishOptions
): Promise<Response> {
  if (!options.secret || !options.siteUrl) {
    return new Response("EmDash schedule is not configured", { status: 503 });
  }
  const fetchImpl = options.fetchImpl ?? fetch;
  const response = await fetchImpl(
    new URL("/api/emdash-scheduled", options.siteUrl),
    {
      method: "POST",
      headers: { authorization: `Bearer ${options.secret}` },
    }
  );
  return new Response(await response.text(), { status: response.status });
}

/**
 * Netlify scheduled function entry. Runs every minute, matching the
 * Cloudflare cron EmDash uses for scheduled publishing.
 */
export default function handler(): Promise<Response> {
  return postScheduledPublish({
    siteUrl: resolveEmDashSiteUrl({
      url: process.env.URL,
      deployPrimeUrl: process.env.DEPLOY_PRIME_URL,
      context: process.env.CONTEXT,
    }),
    secret: process.env.EMDASH_SCHEDULE_SECRET,
  });
}

export const config: Config = {
  schedule: "* * * * *",
};
