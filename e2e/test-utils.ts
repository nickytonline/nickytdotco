import { expect, type Locator } from "@playwright/test";

export function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** The UTC fallback and a UTC browser's own format both contain "UTC". */
export async function expectBrowserLocalTime(time: Locator) {
  await expect(time).toBeVisible();
  await expect(time).toHaveAttribute("data-localized", "true");
  const formatted = await time.evaluate((node) => {
    const element = node as HTMLElement;
    const raw = element.dataset.localDatetime ?? "";
    const showTime = element.dataset.showTime === "true";
    return {
      actual: element.textContent,
      expected: new Date(raw).toLocaleString(undefined, {
        dateStyle: "full",
        timeStyle: showTime ? "long" : undefined,
      }),
    };
  });
  expect(formatted.actual).toBe(formatted.expected);
}
