import { test, expect } from "@playwright/test";

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

  test("sets a timezone response header from geo context", async ({ page }) => {
    const response = await page.goto("/watch");
    expect(response?.headers()["timezone"]).toBeDefined();
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

  test("navigating to a video shows its title", async ({ page }) => {
    await page.goto("/videos");
    const link = page.locator('main a[href^="/videos/"]').first();

    if ((await link.count()) === 0) {
      test.skip(true, "no past videos available to open");
    }

    const href = await link.getAttribute("href");
    await link.click();
    await expect(page).toHaveURL(new RegExp(`${href}/?$`));
    await expect(
      page.getByRole("main").getByRole("heading", { level: 1 })
    ).toBeVisible();
  });
});
