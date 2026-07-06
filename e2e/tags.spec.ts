import { test, expect } from "@playwright/test";

test.describe("tags", () => {
  test("tags index shows popular and all-tags sections", async ({ page }) => {
    await page.goto("/tags");

    await expect(
      page.getByRole("heading", { level: 1, name: "Tags" })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { level: 2, name: "Popular Tags" })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { level: 2, name: "All Tags" })
    ).toBeVisible();

    await expect(page.getByRole("link", { name: "All Tags" })).toHaveAttribute(
      "aria-current",
      "page"
    );
  });

  test("switching to the Blog Posts filter goes to /tags/blog", async ({
    page,
  }) => {
    await page.goto("/tags");
    await page.getByRole("link", { name: "Blog Posts", exact: true }).click();
    await expect(page).toHaveURL(/\/tags\/blog\/?$/);
    await expect(
      page.getByRole("heading", { level: 1, name: "Blog Post Tags" })
    ).toBeVisible();
  });

  test("switching to the Talks filter goes to /tags/talks", async ({
    page,
  }) => {
    await page.goto("/tags");
    await page.getByRole("link", { name: "Talks", exact: true }).click();
    await expect(page).toHaveURL(/\/tags\/talks\/?$/);
  });

  test("clicking a tag shows matching content with a breadcrumb", async ({
    page,
  }) => {
    await page.goto("/tags");
    const tagLink = page.locator('main a[href^="/tags/"]').last();
    const href = await tagLink.getAttribute("href");
    await tagLink.click();

    await expect(page).toHaveURL(new RegExp(`${href}/?$`));

    const breadcrumb = page.getByRole("navigation", { name: "Breadcrumb" });
    await expect(
      breadcrumb.getByRole("link", { name: "Tags" })
    ).toHaveAttribute("href", "/tags");
    await expect(
      page.getByRole("main").getByRole("heading", { level: 1 })
    ).toContainText("Content tagged with");
  });
});
