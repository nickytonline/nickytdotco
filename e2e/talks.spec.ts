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

    const eventStructuredDataCount = await page
      .locator('script[type="application/ld+json"]')
      .evaluateAll(
        (scripts) =>
          scripts.filter((script) => {
            const data = JSON.parse(script.textContent ?? "{}");
            return data["@type"] === "Event";
          }).length
      );

    expect(eventStructuredDataCount).toBe(1);
  });

  test("upcoming talks render a markdown ticket promo", async ({ page }) => {
    await page.goto(
      "/talks/share-work-not-access-control-identity-for-multiplayer-agents-ai-context-san-jose-2026"
    );

    const promo = page.getByRole("complementary", { name: "Ticket offer" });
    await expect(promo).toBeVisible();
    await expect(
      promo.getByRole("link", { name: "NICKTAYLOR50" })
    ).toHaveAttribute("href", "https://luma.com/sanjose26?coupon=NICKTAYLOR50");
    await expect(
      promo.getByRole("link", { name: /register on Luma/i })
    ).toHaveAttribute("href", "https://luma.com/sanjose26?coupon=NICKTAYLOR50");
  });

  test("past talks do not show a ticket promo", async ({ page }) => {
    await page.goto("/talks/build-your-first-mcp-app-commit-your-code-2026");

    await expect(
      page.getByRole("complementary", { name: "Ticket offer" })
    ).toHaveCount(0);
  });

  test("past talks do not show an upcoming pill", async ({ page }) => {
    await page.goto("/talks/build-your-first-mcp-app-commit-your-code-2026");

    await expect(
      page.getByRole("main").getByRole("heading", {
        level: 1,
        name: "Build your First MCP App",
      })
    ).toBeVisible();
    await expect(page.getByText("Upcoming talk")).toHaveCount(0);
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
      page.getByRole("link", { name: "Speaking inquiries" })
    ).toHaveAttribute(
      "href",
      /^mailto:nick@nickyt\.co\?subject=Speaking%20or%20Guest%20Appearance%20Inquiry/
    );
  });
});
