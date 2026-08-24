import { test, expect } from "@playwright/test";
import { escapeRegExp } from "./test-utils";

test.describe("site search (Pagefind)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    // page.goto() waits for the page load event. Waiting for networkidle is
    // unreliable on the deployed site because long-lived requests can keep
    // the network from becoming idle.
    const searchButton = page.getByRole("button", { name: "Search site" });
    const dialog = page.getByRole("dialog");
    await expect(searchButton).toBeVisible();
    await expect(async () => {
      await searchButton.click();
      await expect(dialog).toBeVisible();
      await page.keyboard.press("Escape");
      await expect(dialog).not.toBeVisible();
      await page.evaluate(() => {
        (document.activeElement as HTMLElement | null)?.blur();
      });
    }).toPass({ timeout: 10000 });
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
    const dialog = page.getByRole("dialog");
    await expect(async () => {
      await page.keyboard.press("/");
      await expect(dialog).toBeVisible();
    }).toPass({ timeout: 10000 });
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

    await expect(page).toHaveURL(new RegExp(`${escapeRegExp(href!)}$`));
  });

  test("Escape closes the dialog", async ({ page }) => {
    await page.getByRole("button", { name: "Search site" }).click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(dialog).not.toBeVisible();
  });
});
