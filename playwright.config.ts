import { defineConfig, devices } from "@playwright/test";

const PORT = 8888;
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? `http://localhost:${PORT}`;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "html",
  use: {
    baseURL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: process.env.PLAYWRIGHT_BASE_URL
    ? undefined
    : {
        command:
          "command -v netlify >/dev/null 2>&1 || { echo 'netlify-cli not found on PATH. Install it globally: npm install -g netlify-cli (https://docs.netlify.com/cli/get-started/)' >&2; exit 1; }; npx varlock run -- netlify serve --country=US",
        url: baseURL,
        reuseExistingServer: !process.env.CI,
        timeout: 5 * 60 * 1000,
        stdout: "pipe",
        stderr: "pipe",
      },
});
