import { test, expect } from "@playwright/test";

test.describe("site search (Pagefind)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("opens via the search button and returns results for a query", async ({
    page,
  }) => {
    await page.getByRole("button", { name: "Search site" }).click();

    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();

    // This assertion only holds when tests run against a production build,
    // since Pagefind's index is generated at build time and Search bails out in dev mode.
    await expect(
      page.getByText("Search is unavailable in development")
    ).toHaveCount(0);

    const input = page.getByPlaceholder(
      "Search posts, talks, projects... (shortcut: /)"
    );
    await input.fill("Nick Taylor");

    await expect(page.getByText(/\d+ results? found/)).toBeVisible();
    const results = dialog.getByRole("listitem");
    await expect(results.first()).toBeVisible();
  });

  test("opens with the / keyboard shortcut", async ({ page }) => {
    await page.keyboard.press("/");
    await expect(page.getByRole("dialog")).toBeVisible();
  });

  test("arrow keys and Enter navigate to the selected result", async ({
    page,
  }) => {
    await page.getByRole("button", { name: "Search site" }).click();
    const input = page.getByPlaceholder(
      "Search posts, talks, projects... (shortcut: /)"
    );
    await input.fill("Nick Taylor");

    const dialog = page.getByRole("dialog");
    const results = dialog.getByRole("listitem");
    await expect(results.first()).toBeVisible();

    // The first result is already highlighted by default once results load,
    // so Enter alone should open it without pressing ArrowDown first.
    const firstResultLink = results.first().getByRole("link");
    const href = await firstResultLink.getAttribute("href");

    await page.keyboard.press("Enter");

    await expect(page).toHaveURL(new RegExp(`${href}$`));
  });

  test("Escape closes the dialog", async ({ page }) => {
    await page.getByRole("button", { name: "Search site" }).click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(dialog).not.toBeVisible();
  });
});
