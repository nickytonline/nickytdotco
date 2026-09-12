import { test, expect } from "@playwright/test";

test.describe("theme switcher", () => {
  test("opens a fan menu, selects themes, and persists", async ({ page }) => {
    // Seed once via evaluate after load so reload is not reset by addInitScript.
    await page.goto("/");
    await page.evaluate(() => localStorage.setItem("theme", "light"));
    await page.reload();

    const html = page.locator("html");
    const trigger = page.getByRole("button", { name: /Color theme:/i });
    const menu = page.getByRole("radiogroup", { name: "Color theme options" });

    await expect(html).not.toHaveClass(/dark|windows95/);
    await expect(trigger).toHaveAttribute("aria-expanded", "false");

    await trigger.click();
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await expect(menu).toBeVisible();

    const light = menu.getByRole("radio", { name: "Light" });
    const dark = menu.getByRole("radio", { name: "Dark" });
    const windows95 = menu.getByRole("radio", { name: "Windows 95" });

    await expect(light).toHaveAttribute("aria-checked", "true");

    await dark.click();
    await expect(html).toHaveClass(/dark/);
    await expect(html).not.toHaveClass(/windows95/);
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(await page.evaluate(() => localStorage.getItem("theme"))).toBe(
      "dark"
    );

    await trigger.click();
    await windows95.click();
    await expect(html).toHaveClass(/windows95/);
    await expect(html).not.toHaveClass(/dark/);
    expect(await page.evaluate(() => localStorage.getItem("theme"))).toBe(
      "windows95"
    );

    // Persists across a full reload.
    await page.reload();
    await expect(html).toHaveClass(/windows95/);
    await expect(html).not.toHaveClass(/dark/);

    await page.getByRole("button", { name: /Color theme:/i }).click();
    await expect(
      page
        .getByRole("radiogroup", { name: "Color theme options" })
        .getByRole("radio", { name: "Windows 95" })
    ).toHaveAttribute("aria-checked", "true");

    await page
      .getByRole("radiogroup", { name: "Color theme options" })
      .getByRole("radio", { name: "Light" })
      .click();
    await expect(html).not.toHaveClass(/dark|windows95/);
    expect(await page.evaluate(() => localStorage.getItem("theme"))).toBe(
      "light"
    );
  });

  test("persists across client-side navigation", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => localStorage.setItem("theme", "light"));
    await page.reload();

    const html = page.locator("html");
    await page.getByRole("button", { name: /Color theme:/i }).click();
    await page
      .getByRole("radiogroup", { name: "Color theme options" })
      .getByRole("radio", { name: "Windows 95" })
      .click();
    await expect(html).toHaveClass(/windows95/);

    await page
      .getByRole("navigation", { name: "main navigation" })
      .getByRole("link", { name: "About" })
      .click();
    await expect(page).toHaveURL(/\/about\/?$/);

    await expect(html).toHaveClass(/windows95/);
    await expect(html).not.toHaveClass(/dark/);
  });

  test("fans below on a narrow viewport", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await page.evaluate(() => localStorage.setItem("theme", "light"));
    await page.reload();

    const root = page.locator("[data-theme-switcher]");
    await page.getByRole("button", { name: /Color theme:/i }).click();
    await expect(root).toHaveAttribute("data-open", "true");
    await expect(root).toHaveAttribute("data-direction", "down");
  });
});
