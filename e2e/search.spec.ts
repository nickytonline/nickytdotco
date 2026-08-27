import { test, expect } from "@playwright/test";
import { escapeRegExp } from "./test-utils";

test.describe("site search", () => {
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

    const input = page.getByPlaceholder("Search posts, talks, projects...");
    await input.fill("Nick Taylor");

    await expect(page.getByText(/\d+ results? found/)).toBeVisible({
      timeout: 15000,
    });
    const results = dialog.getByRole("option");
    await expect(results.first()).toBeVisible();
  });

  test("opens with the / keyboard shortcut", async ({ page }) => {
    const dialog = page.getByRole("dialog");
    await expect(async () => {
      await page.keyboard.press("/");
      await expect(dialog).toBeVisible();
    }).toPass({ timeout: 10000 });
  });

  test("opens with Control+K and Meta+K", async ({ page }) => {
    const dialog = page.getByRole("dialog");

    await page.keyboard.press("Control+k");
    await expect(dialog).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(dialog).not.toBeVisible();

    await page.keyboard.press("Meta+k");
    await expect(dialog).toBeVisible();
  });

  test("exposes a platform keyboard shortcut hint on the search button", async ({
    page,
  }) => {
    const searchButton = page.getByRole("button", { name: "Search site" });

    await expect(searchButton).toHaveAttribute(
      "aria-keyshortcuts",
      /(Meta\+K|Control\+K)/
    );

    const shortcutKeys = searchButton.locator("kbd");
    await expect(shortcutKeys).toHaveCount(2);
    await expect(shortcutKeys.first()).toHaveText(/⌘K|Ctrl\+K/);
    await expect(shortcutKeys.last()).toHaveText("/");
    await expect(shortcutKeys.first()).toBeVisible();
    await expect(shortcutKeys.last()).toBeVisible();
  });

  test("hides the visible shortcut hint below the md breakpoint", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 720 });
    const searchButton = page.getByRole("button", { name: "Search site" });
    const shortcutKeys = searchButton.locator("kbd");

    await expect(shortcutKeys).toHaveCount(2);
    await expect(shortcutKeys.first()).toBeHidden();
    await expect(shortcutKeys.last()).toBeHidden();
  });

  test("arrow keys and Enter navigate to the selected result", async ({
    page,
  }) => {
    await page.getByRole("button", { name: "Search site" }).click();
    const input = page.getByPlaceholder("Search posts, talks, projects...");
    await input.fill("Nick Taylor");

    const dialog = page.getByRole("dialog");
    const results = dialog.getByRole("option");
    await expect(results.first()).toBeVisible({ timeout: 15000 });

    // The first result is already highlighted by default once results load,
    // so Enter alone should open it without pressing ArrowDown first.
    const href = await results.first().getAttribute("href");

    await page.keyboard.press("Enter");

    await expect(page).toHaveURL(new RegExp(`${escapeRegExp(href!)}$`));
  });

  test("exposes results as a combobox listbox with aria-activedescendant", async ({
    page,
  }) => {
    await page.getByRole("button", { name: "Search site" }).click();
    const input = page.getByRole("combobox", {
      name: "Search posts, talks, and projects",
    });
    await expect(input).toHaveAttribute("aria-expanded", "false");

    await input.fill("Nick Taylor");

    const dialog = page.getByRole("dialog");
    const results = dialog.getByRole("option");
    await expect(results.first()).toBeVisible({ timeout: 15000 });

    await expect(input).toHaveAttribute("aria-expanded", "true");
    await expect(input).toHaveAttribute("aria-autocomplete", "list");
    const listbox = dialog.getByRole("listbox", { name: "Search results" });
    await expect(listbox).toBeVisible();
    const listboxId = await listbox.getAttribute("id");
    expect(listboxId).toBeTruthy();
    await expect(input).toHaveAttribute("aria-controls", listboxId!);

    const firstOptionId = await results.first().getAttribute("id");
    expect(firstOptionId).toBeTruthy();
    await expect(input).toHaveAttribute(
      "aria-activedescendant",
      firstOptionId!
    );
    await expect(results.first()).toHaveAttribute("aria-selected", "true");

    const resultCount = await results.count();
    if (resultCount > 1) {
      await input.press("ArrowDown");
      const secondOptionId = await results.nth(1).getAttribute("id");
      await expect(input).toHaveAttribute(
        "aria-activedescendant",
        secondOptionId!
      );
      await expect(results.nth(1)).toHaveAttribute("aria-selected", "true");
      await expect(results.first()).toHaveAttribute("aria-selected", "false");
    }
  });

  test("Escape closes the dialog", async ({ page }) => {
    await page.getByRole("button", { name: "Search site" }).click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(dialog).not.toBeVisible();
  });

  test("one Escape closes the dialog after typing a query", async ({
    page,
  }) => {
    await page.getByRole("button", { name: "Search site" }).click();
    const dialog = page.getByRole("dialog");
    const input = page.getByPlaceholder("Search posts, talks, projects...");
    await input.fill("Nick Taylor");
    await expect(dialog.getByRole("option").first()).toBeVisible({
      timeout: 15000,
    });

    await page.keyboard.press("Escape");
    await expect(dialog).not.toBeVisible();
  });

  test("announces a 503 search failure in the live region", async ({
    page,
  }) => {
    await page.route("**/api/search*", async (route) => {
      await route.fulfill({
        status: 503,
        contentType: "application/json",
        body: JSON.stringify({ error: "Search is temporarily unavailable." }),
      });
    });

    await page.getByRole("button", { name: "Search site" }).click();
    const dialog = page.getByRole("dialog");
    await page.getByPlaceholder("Search posts, talks, projects...").fill("ab");

    const alert = dialog.getByRole("alert");
    await expect(alert).toContainText("Search is temporarily unavailable", {
      timeout: 15000,
    });
    await expect(
      dialog.getByText("Search is temporarily unavailable. Try again.")
    ).toBeVisible();
  });

  test("announces a 429 search failure in the live region", async ({
    page,
  }) => {
    await page.route("**/api/search*", async (route) => {
      await route.fulfill({
        status: 429,
        contentType: "application/json",
        body: JSON.stringify({ error: "Too many searches." }),
      });
    });

    await page.getByRole("button", { name: "Search site" }).click();
    const dialog = page.getByRole("dialog");
    await page.getByPlaceholder("Search posts, talks, projects...").fill("ab");

    const alert = dialog.getByRole("alert");
    await expect(alert).toContainText("Too many searches", {
      timeout: 15000,
    });
    await expect(
      dialog.getByText("Too many searches. Wait a moment and try again.")
    ).toBeVisible();
  });
});
