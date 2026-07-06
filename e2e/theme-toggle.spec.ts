import { test, expect } from "@playwright/test";

test.describe("theme toggle", () => {
  test("toggles the dark class on the html element and persists it", async ({
    page,
  }) => {
    await page.goto("/");
    const html = page.locator("html");
    const toggle = page.getByRole("button", { name: "Toggle dark mode" });

    const startedDark = await html.evaluate((el) =>
      el.classList.contains("dark")
    );

    await toggle.click();
    if (startedDark) {
      await expect(html).not.toHaveClass(/dark/);
    } else {
      await expect(html).toHaveClass(/dark/);
    }

    const themeAfterToggle = await page.evaluate(() =>
      localStorage.getItem("theme")
    );
    expect(themeAfterToggle).toBe(startedDark ? "light" : "dark");

    // Persists across a full reload.
    await page.reload();
    if (startedDark) {
      await expect(html).not.toHaveClass(/dark/);
    } else {
      await expect(html).toHaveClass(/dark/);
    }
  });

  test("persists across client-side navigation", async ({ page }) => {
    await page.goto("/");
    const html = page.locator("html");
    const toggle = page.getByRole("button", { name: "Toggle dark mode" });

    await toggle.click();
    const themeAfterToggle = await html.evaluate((el) =>
      el.classList.contains("dark")
    );

    await page
      .getByRole("navigation", { name: "main navigation" })
      .getByRole("link", { name: "About" })
      .click();
    await expect(page).toHaveURL(/\/about\/?$/);

    const themeAfterNav = await html.evaluate((el) =>
      el.classList.contains("dark")
    );
    expect(themeAfterNav).toBe(themeAfterToggle);
  });
});
