import { test, expect } from "@playwright/test";

test.describe("about page", () => {
  test("renders bio content and a book-me-to-speak link", async ({ page }) => {
    await page.goto("/about");

    await expect(
      page.getByRole("heading", { level: 1, name: "About" })
    ).toBeVisible();
    await expect(
      page.getByRole("img", { name: "Headshot of Nick Taylor" })
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Book me to speak" })
    ).toHaveAttribute("href", /^mailto:nick@nickyt\.co/);
  });
});

test.describe("projects page", () => {
  test("lists curated projects with links to GitHub", async ({ page }) => {
    await page.goto("/projects");

    await expect(
      page.getByRole("heading", { level: 1, name: "Projects" })
    ).toBeVisible();

    const projectLinks = page.locator(
      'main article a[href^="https://github.com/"]'
    );
    await expect(projectLinks.first()).toBeVisible();

    await expect(
      page.getByRole("link", { name: "More on GitHub" })
    ).toHaveAttribute("href", "https://github.com/nickytonline");
  });
});

test.describe("newsletter page", () => {
  test("renders the subscribe CTA", async ({ page }) => {
    await page.goto("/newsletter");

    await expect(
      page.getByRole("heading", { level: 1, name: "Newsletter" })
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Subscribe to One Tip a Week" })
    ).toHaveAttribute("href", /onetipaweek\.com/i);
  });
});

test.describe("uses page", () => {
  test("renders the gear/tooling breakdown", async ({ page }) => {
    await page.goto("/uses");

    await expect(
      page.getByRole("heading", { level: 1, name: "Uses" })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { level: 2, name: "Editor" })
    ).toBeVisible();
  });
});

test.describe("socials page", () => {
  test("links out to each social profile", async ({ page }) => {
    await page.goto("/socials");

    await expect(
      page.getByRole("heading", { level: 1, name: "Socials" })
    ).toBeVisible();

    await expect(page.getByRole("link", { name: /GitHub/ })).toHaveAttribute(
      "href",
      "https://github.com/nickytonline"
    );
    await expect(page.getByRole("link", { name: /YouTube/ })).toHaveAttribute(
      "href",
      "https://youtube.com/@nickytonline"
    );
  });
});
