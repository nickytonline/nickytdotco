import { test, expect } from "@playwright/test";

test.describe("home page", () => {
  test("renders the hero with a heading and headshot", async ({ page }) => {
    await page.goto("/");

    await expect(
      page.getByRole("heading", {
        level: 1,
        name: "Developer. Advocate. Builder.",
      })
    ).toBeVisible();

    await expect(
      page.getByRole("img", { name: "Headshot of Nick Taylor" })
    ).toBeVisible();
  });

  test("links to @nickytonline socials from the intro", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("main").getByRole("link", { name: "@nickytonline" })
    ).toHaveAttribute("href", "/socials");
  });

  test("renders a Latest section with at least one content type", async ({
    page,
  }) => {
    await page.goto("/");

    await expect(
      page.getByRole("heading", { level: 2, name: "Latest" })
    ).toBeVisible();

    // At least one of Talks / Blog Posts / Live Streams subsections should render,
    // since content is dynamic and not guaranteed to always include all three.
    const subheadings = page.getByRole("heading", { level: 3 });
    await expect(subheadings.first()).toBeVisible();
  });

  test("sets a timezone response header from geo context", async ({ page }) => {
    const response = await page.goto("/");
    expect(response?.headers()["timezone"]).toBeDefined();
  });

  test("embeds Person JSON-LD structured data", async ({ page }) => {
    await page.goto("/");
    const scripts = await page
      .locator('script[type="application/ld+json"]')
      .allTextContents();
    const person = scripts
      .map((text) => JSON.parse(text))
      .find((data) => data["@type"] === "Person");
    expect(person).toBeTruthy();
    expect(person.name).toBe("Nick Taylor");
  });

  // The site has hundreds of blog posts and many talks, so both "More" links
  // are effectively always present — assert them directly rather than skipping
  // when absent, so a regression that removes either link fails the test.
  test("More links from Latest sections lead to their archive pages", async ({
    page,
  }) => {
    await page.goto("/");
    const main = page.getByRole("main");

    await expect(
      main.getByRole("link", { name: /More talks/ })
    ).toHaveAttribute("href", "/talks");
    await expect(
      main.getByRole("link", { name: /More blog posts/ })
    ).toHaveAttribute("href", "/blog");
  });
});
