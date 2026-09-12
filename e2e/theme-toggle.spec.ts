import { test, expect } from "@playwright/test";

test.describe("theme switcher", () => {
  test("selects light, dark, and windows95 and persists", async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem("theme", "light");
    });
    await page.goto("/");
    const html = page.locator("html");
    const switcher = page.getByRole("radiogroup", { name: "Color theme" });
    const light = switcher.getByRole("radio", { name: "Light" });
    const dark = switcher.getByRole("radio", { name: "Dark" });
    const windows95 = switcher.getByRole("radio", { name: "Windows 95" });

    await expect(html).not.toHaveClass(/dark|windows95/);
    await expect(light).toHaveAttribute("aria-checked", "true");
    await expect(dark).toHaveAttribute("aria-checked", "false");
    await expect(windows95).toHaveAttribute("aria-checked", "false");

    await dark.click();
    await expect(html).toHaveClass(/dark/);
    await expect(html).not.toHaveClass(/windows95/);
    await expect(dark).toHaveAttribute("aria-checked", "true");
    expect(await page.evaluate(() => localStorage.getItem("theme"))).toBe(
      "dark"
    );

    await windows95.click();
    await expect(html).toHaveClass(/windows95/);
    await expect(html).not.toHaveClass(/dark/);
    await expect(windows95).toHaveAttribute("aria-checked", "true");
    expect(await page.evaluate(() => localStorage.getItem("theme"))).toBe(
      "windows95"
    );

    // Persists across a full reload.
    await page.reload();
    await expect(html).toHaveClass(/windows95/);
    await expect(html).not.toHaveClass(/dark/);
    await expect(
      page.getByRole("radiogroup", { name: "Color theme" }).getByRole("radio", {
        name: "Windows 95",
      })
    ).toHaveAttribute("aria-checked", "true");

    await light.click();
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
    const switcher = page.getByRole("radiogroup", { name: "Color theme" });

    await switcher.getByRole("radio", { name: "Windows 95" }).click();
    await expect(html).toHaveClass(/windows95/);

    await page
      .getByRole("navigation", { name: "main navigation" })
      .getByRole("link", { name: "About" })
      .click();
    await expect(page).toHaveURL(/\/about\/?$/);

    await expect(html).toHaveClass(/windows95/);
    await expect(html).not.toHaveClass(/dark/);
    await expect(
      page.getByRole("radiogroup", { name: "Color theme" }).getByRole("radio", {
        name: "Windows 95",
      })
    ).toHaveAttribute("aria-checked", "true");
  });
});
