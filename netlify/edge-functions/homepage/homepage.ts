import { Context } from "https://edge.netlify.com";
import { getLatestGuestMarkup } from "../utils/markupUtils.ts";
import { getLatestGuest } from "../utils/streamUtils.ts";

const AIRTABLE_API_KEY = Deno.env.get("AIRTABLE_API_KEY");
const AIRTABLE_STREAM_GUEST_BASE_ID = Deno.env.get(
  "AIRTABLE_STREAM_GUEST_BASE_ID"
);

if (!AIRTABLE_API_KEY || !AIRTABLE_STREAM_GUEST_BASE_ID) {
  throw new Error("Missing required environment variables");
}

export default async (request: Request, context: Context) => {
  const url = new URL(request.url);

  if (!url.host.startsWith('www.nickyt.co')) {
    return
  }

  // Locale is the first language in the Accept-Language header or 'en-US' if not present
  const locale =
    request.headers.get("Accept-Language")?.split(",")[0] ||
    request.headers.get("Accept-Language") ||
    "en-US";
  const { timezone = "" } = context.geo;

  const latestGuest = await getLatestGuest({
    apiKey: AIRTABLE_API_KEY,
    baseId: AIRTABLE_STREAM_GUEST_BASE_ID,
  });
  const scheduleMarkup = latestGuest
    ? getLatestGuestMarkup({
      guest: latestGuest,
      locale,
      timezone,
    })
    : "";

  const response = await context.next();

  // Cache the response for 2 hours
  response.headers.set("Cache-Control", "public, max-age=43200, s-maxage=43200");
  response.headers.set("x-timezone", timezone);
  response.headers.set("Vary", "Accept-Language, x-timezone");

  const text = await response.text();

  return new Response(
    text.replace("replace-with-stream-guest", scheduleMarkup),
    response
  );
};

export const config = {
  // cache: "manual",
  path: "/",
  onError: "bypass",
};
