import type { APIRoute } from "astro";
import { runScheduledTasks } from "emdash/middleware";
import { isAuthorizedScheduleRequest } from "../../../packages/emdash-netlify/src/schedule-auth.ts";
import { publishedCacheTags, purgeContentTags } from "../../utils/route-cache";

export const prerender = false;

/**
 * Heartbeat for EmDash scheduled publishing on Netlify.
 * The scheduled function in `netlify/functions` calls this route because
 * `runScheduledTasks()` has to run inside the Astro server bundle.
 * The sweep does not go through the content API, so this route purges the
 * same cache tags an editor publish would.
 */
export const POST: APIRoute = async ({ request, cache }) => {
  const secret = process.env.EMDASH_SCHEDULE_SECRET;

  if (!isAuthorizedScheduleRequest(request, secret)) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const { published } = await runScheduledTasks({
      onPublished: async (refs) => {
        await purgeContentTags(cache, publishedCacheTags(refs));
      },
      invalidateContentCache: (tags) => purgeContentTags(cache, tags),
    });

    return Response.json({ published: published.length });
  } catch (error) {
    console.error("[emdash-scheduled] Sweep failed:", error);

    return new Response("Scheduled publish failed", { status: 500 });
  }
};
