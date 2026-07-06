import { test, expect } from "@playwright/test";

const NAV_LINKS: Array<{ name: string; href: string }> = [
  { name: "Home", href: "/" },
  { name: "Watch", href: "/watch" },
  { name: "Speaking", href: "/speaking" },
  { name: "Blog", href: "/blog" },
  { name: "Newsletter", href: "/newsletter" },
  { name: "Projects", href: "/projects" },
  { name: "About", href: "/about" },
];

test.describe("primary navigation", () => {
  test("header exposes a landmark nav with all top-level links", async ({
    page,
  }) => {
    await page.goto("/");

    const nav = page.getByRole("navigation", { name: "main navigation" });
    await expect(nav).toBeVisible();

    for (const link of NAV_LINKS) {
      await expect(
        nav.getByRole("link", { name: link.name, exact: true })
      ).toHaveAttribute("href", link.href);
    }
  });

  test("clicking each nav link navigates to the right page with an h1", async ({
    page,
  }) => {
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: "main navigation" });

    for (const link of NAV_LINKS.filter((l) => l.href !== "/")) {
      await nav.getByRole("link", { name: link.name, exact: true }).click();
      await expect(page).toHaveURL(new RegExp(`${link.href}/?$`));
      await expect(
        page.getByRole("main").getByRole("heading", { level: 1 })
      ).toBeVisible();
      await page.goBack();
    }
  });

  test("current page is marked with aria-current", async ({ page }) => {
    await page.goto("/blog");
    const nav = page.getByRole("navigation", { name: "main navigation" });
    await expect(nav.getByRole("link", { name: "Blog" })).toHaveAttribute(
      "aria-current",
      "page"
    );
  });

  test("logo links back to the home page", async ({ page }) => {
    await page.goto("/about");
    await page
      .getByRole("banner")
      .getByRole("link", { name: "nickyt.co", exact: true })
      .click();
    await expect(page).toHaveURL(/\/$/);
  });

  test("RSS link points to the feed", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("link", { name: "Subscribe via RSS Feed" })
    ).toHaveAttribute("href", "/feed.xml");
  });

  test("footer exposes secondary navigation", async ({ page }) => {
    await page.goto("/");
    const footerNav = page.getByRole("navigation", {
      name: "footer navigation",
    });
    await expect(
      footerNav.getByRole("link", { name: "Socials" })
    ).toHaveAttribute("href", "/socials");
    await expect(footerNav.getByRole("link", { name: "Uses" })).toHaveAttribute(
      "href",
      "/uses"
    );
  });

  test("skip link moves focus to main content", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Tab");
    await expect(
      page.getByRole("link", { name: "Skip to main content" })
    ).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/#main$/);
  });
});

test.describe("404 handling", () => {
  test("unknown routes render the not-found page", async ({ page }) => {
    const response = await page.goto("/this-page-definitely-does-not-exist");
    expect(response?.status()).toBe(404);
    await expect(
      page.getByRole("heading", { level: 1, name: "404 - not found" })
    ).toBeVisible();
  });
});
