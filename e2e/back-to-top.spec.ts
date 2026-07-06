import { test, expect } from "@playwright/test";

test.describe("back to top button", () => {
  test("is hidden until the page is scrolled, then scrolls back up on click", async ({
    page,
  }) => {
    // The blog archive has enough content to reliably exceed the scroll threshold.
    await page.goto("/blog");
    const button = page.getByRole("button", { name: "Back to top" });

    await expect(button).toHaveCSS("opacity", "0");

    await page.mouse.wheel(0, 1200);
    await expect(button).toHaveCSS("opacity", "1");

    await button.click();
    await expect
      .poll(() => page.evaluate(() => window.scrollY))
      .toBeLessThan(50);
  });
});
