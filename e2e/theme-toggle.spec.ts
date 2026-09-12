import { test, expect } from "@playwright/test";

test.describe("theme toggle", () => {
  test("cycles light → dark → windows95 and persists", async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem("theme", "light");
    });
    await page.goto("/");
    const html = page.locator("html");
    const toggle = page.getByRole("button", { name: /Current theme:/i });

    await expect(html).not.toHaveClass(/dark|windows95/);

    await toggle.click();
    await expect(html).toHaveClass(/dark/);
    await expect(html).not.toHaveClass(/windows95/);
    expect(await page.evaluate(() => localStorage.getItem("theme"))).toBe(
      "dark"
    );

    await toggle.click();
    await expect(html).toHaveClass(/windows95/);
    await expect(html).not.toHaveClass(/dark/);
    expect(await page.evaluate(() => localStorage.getItem("theme"))).toBe(
      "windows95"
    );

    // Persists across a full reload.
    await page.reload();
    await expect(html).toHaveClass(/windows95/);
    await expect(html).not.toHaveClass(/dark/);

    await toggle.click();
    await expect(html).not.toHaveClass(/dark|windows95/);
    expect(await page.evaluate(() => localStorage.getItem("theme"))).toBe(
      "light"
    );
  });

  test("persists across client-side navigation", async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem("theme", "light");
    });
    await page.goto("/");
    const html = page.locator("html");
    const toggle = page.getByRole("button", { name: /Current theme:/i });

    await toggle.click(); // dark
    await toggle.click(); // windows95
    await expect(html).toHaveClass(/windows95/);

    await page
      .getByRole("navigation", { name: "main navigation" })
      .getByRole("link", { name: "About" })
      .click();
    await expect(page).toHaveURL(/\/about\/?$/);

    await expect(html).toHaveClass(/windows95/);
    await expect(html).not.toHaveClass(/dark/);
  });
});
