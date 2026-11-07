import { test, expect } from "@playwright/test";
import { escapeRegExp, expectBrowserLocalTime } from "./test-utils";

test.describe("watch page", () => {
  test("renders the watch pitch and links to video archives", async ({
    page,
  }) => {
    await page.goto("/watch");

    await expect(
      page.getByRole("heading", { level: 1, name: "Watch" })
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Browse video archives" })
    ).toHaveAttribute("href", "/videos");
  });

  test("lists the channels to watch on", async ({ page }) => {
    await page.goto("/watch");

    await expect(
      page.getByRole("heading", { level: 2, name: "Where to Watch" })
    ).toBeVisible();
    await expect(
      page.locator('a[href="https://youtube.com/@nickytonline"]')
    ).toBeVisible();
    await expect(
      page.locator('a[href="https://twitch.tv/nickytonline"]')
    ).toBeVisible();
  });

  test("localizes upcoming stream times in the browser", async ({
    page,
    request,
  }) => {
    const response = await request.get("/watch");
    expect(response.ok()).toBeTruthy();
    expect(response.headers()["timezone"]).toBeUndefined();

    await page.goto("/watch");
    const times = page.locator("time[data-local-datetime]");
    if ((await times.count()) === 0) return;

    await expectBrowserLocalTime(times.first());
  });
});

test.describe("video archives", () => {
  test("lists past streams grouped by year", async ({ page }) => {
    await page.goto("/videos");

    const breadcrumb = page.getByRole("navigation", { name: "Breadcrumb" });
    await expect(
      breadcrumb.getByRole("link", { name: "Watch" })
    ).toHaveAttribute("href", "/watch");

    await expect(
      page.getByRole("heading", { level: 1, name: "Video Archives" })
    ).toBeVisible();
  });

  test("navigating to a video shows its title", async ({ page, request }) => {
    await page.goto("/videos");
    const link = page.locator('main a[href^="/videos/"]').first();

    if ((await link.count()) === 0) {
      test.skip(true, "no past videos available to open");
    }

    const href = await link.getAttribute("href");
    const archiveResponse = await request.get(href!);
    expect(archiveResponse.ok()).toBeTruthy();
    expect(archiveResponse.headers()["timezone"]).toBeUndefined();

    await link.click();
    await expect(page).toHaveURL(new RegExp(`${escapeRegExp(href!)}/?$`));
    await expect(
      page.getByRole("main").getByRole("heading", { level: 1 })
    ).toBeVisible();
    const videoStructuredDataCount = await page
      .locator('script[type="application/ld+json"]')
      .evaluateAll(
        (scripts) =>
          scripts.filter((script) => {
            const data = JSON.parse(script.textContent ?? "{}");
            return data["@type"] === "VideoObject";
          }).length
      );

    expect(videoStructuredDataCount).toBe(1);
    await expect(page.getByText("Upcoming livestream")).toHaveCount(0);
    await expect(page.getByText("Watch live on:")).toHaveCount(0);
    await expect(
      page.getByRole("button", { name: /Add .+ to calendar/i })
    ).toHaveCount(0);
  });

  test("loads linked EmDash guests on migrated video pages", async ({
    page,
    request,
  }) => {
    const href = "/videos/how-people-ai-vol-4-multiple-guests";
    const response = await request.get(href);
    expect(response.ok()).toBeTruthy();

    await page.goto(href);

    const guests = page.locator(
      'section[aria-labelledby="stream-guests-heading"]'
    );
    await expect(guests).toBeVisible();
    await expect(
      guests.getByRole("link", { name: "Ray Deck" })
    ).toHaveAttribute("href", "/guests/ray-deck");
    await expect(
      guests.getByRole("link", { name: "Sarah Shook" })
    ).toHaveAttribute("href", "/guests/sarah-shook");
  });

  test("upcoming stream video pages show calendar and live links", async ({
    page,
  }) => {
    await page.goto("/watch");

    const upcomingHeading = page.getByRole("heading", {
      name: "Upcoming Live Streams",
    });
    if (!(await upcomingHeading.count())) {
      test.skip(true, "no upcoming streams scheduled");
    }

    const section = upcomingHeading.locator("xpath=ancestor::section");
    const videoLink = section.locator('a[href*="/videos/"]').first();
    if ((await videoLink.count()) === 0) {
      test.skip(true, "upcoming streams have no on-site video pages");
    }

    await videoLink.click();
    await expect(page.getByText("Upcoming livestream")).toBeVisible();
    await expect(page.getByText("Watch live on:")).toBeVisible();
    await expect(
      page.getByRole("button", { name: /Add .+ to calendar/i })
    ).toBeVisible();
  });

  test("upcoming stream video pages localize the start time in the browser", async ({
    page,
    request,
  }) => {
    await page.goto("/watch");

    const upcomingHeading = page.getByRole("heading", {
      name: "Upcoming Live Streams",
    });
    if (!(await upcomingHeading.count())) {
      test.skip(true, "no upcoming streams scheduled");
    }

    const section = upcomingHeading.locator("xpath=ancestor::section");
    const videoLink = section.locator('a[href*="/videos/"]').first();
    if ((await videoLink.count()) === 0) {
      test.skip(true, "upcoming streams have no on-site video pages");
    }

    const href = await videoLink.getAttribute("href");
    const response = await request.get(href!);
    expect(response.ok()).toBeTruthy();
    expect(response.headers()["timezone"]).toBeUndefined();

    await page.goto(href!);
    await expectBrowserLocalTime(page.locator("time[data-local-datetime]"));
  });
});
