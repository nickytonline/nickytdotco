import { test, expect } from "@playwright/test";
import { escapeRegExp } from "./test-utils";

test.describe("talks archive", () => {
  test("lists talks grouped by year with a breadcrumb", async ({ page }) => {
    await page.goto("/talks");

    const breadcrumb = page.getByRole("navigation", { name: "Breadcrumb" });
    await expect(
      breadcrumb.getByRole("link", { name: "Speaking" })
    ).toHaveAttribute("href", "/speaking");

    await expect(
      page.getByRole("heading", { level: 1, name: "Talks" })
    ).toBeVisible();

    const yearHeadings = page.getByRole("heading", { level: 2 });
    await expect(yearHeadings.first()).toHaveText(/^\s*\d{4}\s*$/);
  });

  test("browse by tag link goes to the talks tag listing", async ({ page }) => {
    await page.goto("/talks");
    await page.getByRole("link", { name: "Browse by tag" }).click();
    await expect(page).toHaveURL(/\/tags\/talks\/?$/);
  });

  test("navigating to a talk shows title, venue, and breadcrumb", async ({
    page,
  }) => {
    await page.goto("/talks");
    const link = page.locator('main a[href^="/talks/"]').first();
    const href = await link.getAttribute("href");
    await link.click();

    await expect(page).toHaveURL(new RegExp(`${escapeRegExp(href!)}/?$`));
    await expect(
      page.getByRole("main").getByRole("heading", { level: 1 })
    ).toBeVisible();

    const breadcrumb = page.getByRole("navigation", { name: "Breadcrumb" });
    await expect(
      breadcrumb.getByRole("link", { name: "Talks" })
    ).toHaveAttribute("href", "/talks");
  });

  test("distinguishes repeated talk appearances in document titles", async ({
    page,
  }) => {
    await page.goto(
      "/talks/agentic-access-oauth-gets-you-in-zero-trust-keeps-you-safe-blackhat-usa-2025"
    );
    await expect(page).toHaveTitle(
      /Agentic Access: OAuth Gets You In, Zero Trust Keeps You Safe — BlackHat USA 2025 — 6th August 2025 \| Nick Taylor's Talks/
    );

    await page.goto(
      "/talks/agentic-access-oauth-gets-you-in-zero-trust-keeps-you-safe-all-things-open-2025"
    );
    await expect(page).toHaveTitle(
      /Agentic Access: OAuth Gets You In, Zero Trust Keeps You Safe — All Things Open 2025 — 13th October 2025 \| Nick Taylor's Talks/
    );
  });

  test("emits Event structured data", async ({ page }) => {
    await page.goto(
      "/talks/agentic-access-oauth-gets-you-in-zero-trust-keeps-you-safe-blackhat-usa-2025"
    );

    await expect(
      page
        .locator('script[type="application/ld+json"]')
        .filter({ hasText: '"@type":"Event"' })
    ).toHaveCount(1);
  });
});

test.describe("speaking page", () => {
  test("renders the speaking pitch with a talks link", async ({ page }) => {
    await page.goto("/speaking");

    await expect(
      page.getByRole("heading", { level: 1, name: "Speaking" })
    ).toBeVisible();
    await expect(
      page.getByRole("main").getByRole("link", { name: "Talks" })
    ).toHaveAttribute("href", "/talks");
    await expect(
      page.getByRole("link", { name: "Guest appearances" })
    ).toHaveAttribute(
      "href",
      "https://www.youtube.com/playlist?list=PLcR4ZgxWXeIAa0VXPJQ7fgXkx73A5TeGU"
    );
    await expect(
      page.getByRole("link", { name: "Book me for a talk or guest appearance" })
    ).toHaveAttribute(
      "href",
      /^mailto:nick@nickyt\.co\?subject=Speaking%20or%20Guest%20Appearance%20Inquiry/
    );
  });
});
