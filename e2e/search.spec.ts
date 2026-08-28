import { test, expect } from "@playwright/test";
import { SEARCH_DEBOUNCE_MS } from "../src/lib/search/constants";
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

  test("exposes keyboard shortcuts on the search button", async ({ page }) => {
    const searchButton = page.getByRole("button", { name: "Search site" });

    await expect(searchButton).toHaveAttribute(
      "aria-keyshortcuts",
      "Meta+K Control+K /"
    );
    await expect(searchButton.locator("kbd")).toHaveCount(0);
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

  test("does not call the search API for function-word-only queries", async ({
    page,
  }) => {
    let searchCalls = 0;
    await page.route("**/api/search*", async (route) => {
      searchCalls += 1;
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ query: "then they", results: [] }),
      });
    });

    await page.getByRole("button", { name: "Search site" }).click();
    const dialog = page.getByRole("dialog");
    await page
      .getByPlaceholder("Search posts, talks, projects...")
      .fill("then they");

    await expect(
      dialog.getByText(
        "Add a noun or verb to search blog posts, talks, and livestreams."
      )
    ).toBeVisible();
    await expect(dialog.getByRole("option")).toHaveCount(0);
    await page.waitForTimeout(SEARCH_DEBOUNCE_MS + 250);
    expect(searchCalls).toBe(0);

    await page.getByPlaceholder("Search posts, talks, projects...").fill("all");
    await expect(
      dialog.getByText(
        "Add a noun or verb to search blog posts, talks, and livestreams."
      )
    ).toBeVisible();
    await page.waitForTimeout(SEARCH_DEBOUNCE_MS + 250);
    expect(searchCalls).toBe(0);
  });

  test("calls the search API once a verb is present", async ({ page }) => {
    const searchRequests: string[] = [];
    await page.route("**/api/search*", async (route) => {
      searchRequests.push(route.request().url());
      await route.continue();
    });

    await page.getByRole("button", { name: "Search site" }).click();
    const dialog = page.getByRole("dialog");
    await page
      .getByPlaceholder("Search posts, talks, projects...")
      .fill("then they would");

    await expect(page.getByText(/\d+ results? found|No results/)).toBeVisible({
      timeout: 15000,
    });
    expect(searchRequests.length).toBeGreaterThan(0);
    expect(searchRequests[0]).toContain("q=then+they+would");
    await expect(dialog).toBeVisible();
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

  test("hides previous results while a new search is in flight", async ({
    page,
  }) => {
    const fulfillSearch = (query: string, title: string) => ({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        query,
        results: [
          {
            url: `/blog/${query.replaceAll(" ", "-").toLowerCase()}`,
            title,
            excerpt: `Excerpt for ${title}`,
            type: "Post",
          },
        ],
      }),
    });

    await page.route("**/api/search*", async (route) => {
      const url = new URL(route.request().url());
      const q = url.searchParams.get("q") ?? "";
      if (/rust/i.test(q)) {
        await new Promise((resolve) => setTimeout(resolve, 3000));
        await route.fulfill(fulfillSearch(q, "Cool Rust and WebAssembly"));
        return;
      }
      await route.fulfill(fulfillSearch(q, "Nick Taylor"));
    });

    await page.getByRole("button", { name: "Search site" }).click();
    const dialog = page.getByRole("dialog");
    const input = page.getByPlaceholder("Search posts, talks, projects...");
    await input.fill("Nick Taylor");

    const results = dialog.getByRole("option");
    await expect(results.first()).toBeVisible({ timeout: 15000 });
    await expect(results.first()).toContainText("Nick Taylor");

    await input.fill("Rust");

    await expect(dialog.getByText("Searching…")).toBeVisible();
    await expect(results).toHaveCount(0);

    await expect(results.first()).toBeVisible({ timeout: 15000 });
    await expect(results.first()).toContainText("Cool Rust and WebAssembly");
    await expect(dialog.getByText("Searching…")).toHaveCount(0);
  });
});
