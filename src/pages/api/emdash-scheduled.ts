import type { APIRoute } from "astro";
import { runScheduledTasks } from "emdash/middleware";
import { isAuthorizedScheduleRequest } from "../../../packages/emdash-netlify/src/schedule-auth.ts";

export const prerender = false;

/**
 * Heartbeat for EmDash scheduled publishing on Netlify.
 * The scheduled function in `netlify/functions` calls this route because
 * `runScheduledTasks()` has to run inside the Astro server bundle.
 */
export const POST: APIRoute = async ({ request }) => {
  const secret = process.env.EMDASH_SCHEDULE_SECRET;
  if (!isAuthorizedScheduleRequest(request, secret)) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const { published } = await runScheduledTasks();
    return Response.json({ published: published.length });
  } catch (error) {
    console.error("[emdash-scheduled] Sweep failed:", error);
    return new Response("Scheduled publish failed", { status: 500 });
  }
};
