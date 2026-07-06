import { test, expect, type Page } from "@playwright/test";

async function firstBlogPostLink(page: Page) {
  await page.goto("/blog");
  const link = page.locator('main a[href^="/blog/"]').first();
  await expect(link).toBeVisible();
  return link;
}

test.describe("blog archive", () => {
  test("lists posts grouped by year with a total count", async ({ page }) => {
    await page.goto("/blog");

    await expect(
      page.getByRole("heading", { level: 1, name: "Blog Posts Archive" })
    ).toBeVisible();

    // Year headings are h2s rendered by BlogArchiveYear.
    const yearHeadings = page.getByRole("heading", { level: 2 });
    await expect(yearHeadings.first()).toHaveText(/^\d{4}$/);

    const postLinks = page.locator('main a[href^="/blog/"]');
    await expect(postLinks.first()).toBeVisible();
  });

  test("browse by tag link goes to the blog tag listing", async ({ page }) => {
    await page.goto("/blog");
    await page.getByRole("link", { name: "Browse by tag" }).click();
    await expect(page).toHaveURL(/\/tags\/blog\/?$/);
  });

  test("navigating to a post shows title, breadcrumb, and content", async ({
    page,
  }) => {
    const link = await firstBlogPostLink(page);
    const href = await link.getAttribute("href");
    await link.click();

    await expect(page).toHaveURL(new RegExp(`${href}/?$`));
    await expect(
      page.getByRole("main").getByRole("heading", { level: 1 })
    ).toBeVisible();

    const breadcrumb = page.getByRole("navigation", { name: "Breadcrumb" });
    await expect(
      breadcrumb.getByRole("link", { name: "Blog" })
    ).toHaveAttribute("href", "/blog");

    await expect(page.getByRole("article")).toBeVisible();
  });
});
