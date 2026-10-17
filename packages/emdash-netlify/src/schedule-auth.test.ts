import { describe, expect, it, vi } from "vitest";
import { isAuthorizedScheduleRequest } from "./schedule-auth.ts";
import { postScheduledPublish } from "./scheduled-function.ts";

describe("isAuthorizedScheduleRequest", () => {
  it("accepts only the bearer secret", () => {
    const request = new Request("https://www.nickyt.co/api/emdash-scheduled", {
      headers: { authorization: "Bearer schedule-secret" },
    });
    expect(isAuthorizedScheduleRequest(request, "schedule-secret")).toBe(true);
    expect(isAuthorizedScheduleRequest(request, "other-secret")).toBe(false);
    expect(isAuthorizedScheduleRequest(request, undefined)).toBe(false);
  });
});

describe("postScheduledPublish", () => {
  it("does nothing until the site URL and secret are set", async () => {
    const response = await postScheduledPublish({
      siteUrl: undefined,
      secret: undefined,
    });
    expect(response.status).toBe(503);
  });

  it("posts the secret to the Astro maintenance route", async () => {
    const fetchImpl = vi.fn(async () => new Response("ok", { status: 200 }));
    const response = await postScheduledPublish({
      siteUrl: "https://preview.nickyt.co",
      secret: "schedule-secret",
      fetchImpl,
    });

    expect(response.status).toBe(200);
    expect(fetchImpl).toHaveBeenCalledWith(
      new URL("https://preview.nickyt.co/api/emdash-scheduled"),
      {
        method: "POST",
        headers: { authorization: "Bearer schedule-secret" },
      }
    );
  });
});
