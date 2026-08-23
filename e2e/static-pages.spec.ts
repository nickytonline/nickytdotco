import { test, expect } from "@playwright/test";

test.describe("about page", () => {
  test("renders bio content and a book-me-to-speak link", async ({ page }) => {
    await page.goto("/about");

    await expect(
      page.getByRole("heading", { level: 1, name: "About" })
    ).toBeVisible();
    await expect(
      page.getByRole("img", { name: "Headshot of Nick Taylor" })
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Book me to speak" })
    ).toHaveAttribute("href", /^mailto:nick@nickyt\.co/);
  });
});

test.describe("shared metadata", () => {
  test("uses the brand name for Open Graph site metadata", async ({ page }) => {
    await page.goto("/mcp");

    await expect(page.locator('meta[property="og:site_name"]')).toHaveAttribute(
      "content",
      "Nick Taylor"
    );
  });
});

test.describe("projects page", () => {
  test("lists curated projects with links to GitHub", async ({ page }) => {
    await page.goto("/projects");

    await expect(
      page.getByRole("heading", { level: 1, name: "Projects" })
    ).toBeVisible();

    const projectLinks = page.locator(
      'main article a[href^="https://github.com/"]'
    );
    await expect(projectLinks.first()).toBeVisible();

    await expect(
      page.getByRole("link", { name: "More on GitHub" })
    ).toHaveAttribute("href", "https://github.com/nickytonline");
    await expect(
      page.locator(
        'main article a[href="https://github.com/pomerium/mcp-app-typescript-template"]'
      )
    ).toBeVisible();
  });
});

test.describe("MCP topic hub", () => {
  test("connects MCP learning, projects, and talks", async ({ page }) => {
    await page.goto("/mcp");

    await expect(
      page.getByRole("heading", {
        level: 1,
        name: "Model Context Protocol (MCP)",
      })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { level: 2, name: "Learn" })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { level: 2, name: "Build" })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { level: 2, name: "Watch" })
    ).toBeVisible();
    await expect(
      page.locator('section[aria-label="Watch"] article').first()
    ).toContainText("MCP Security & Authorization");
    await expect(
      page
        .locator('section[aria-label="Watch"] article')
        .first()
        .locator('a[href="https://www.youtube.com/watch?v=U9rSRnjis7c"]')
    ).toBeVisible();
    await expect(
      page.locator('section[aria-label="Watch"] article').nth(1)
    ).toContainText("All Things MCP");
    await expect(
      page
        .locator('section[aria-label="Watch"] article')
        .nth(1)
        .locator('a[href="https://www.youtube.com/watch?v=D7KfnGdHayA"]')
    ).toBeVisible();
    await expect(
      page.locator(
        'section[aria-label="Watch"] a[href="/talks/agentic-access-oauth-gets-you-in-zero-trust-keeps-you-safe-all-things-open-2025"]'
      )
    ).toHaveCount(0);
    await expect(
      page
        .locator(
          'section[aria-label="Watch"] a[href="/talks/securing-mcp-servers-with-zero-trust-apollo-mcp-server-builder-series-2024"]'
        )
        .locator("..")
    ).toContainText("Apollo MCP Server Builder Series - July Session (NYC)");
    await expect(
      page.locator(
        'section[aria-label="Watch"] a[href="https://www.youtube.com/watch?v=GCjtGLvNvZo"]'
      )
    ).toBeVisible();
    await expect(
      page.locator(
        'section[aria-label="Watch"] a[href="https://www.youtube.com/watch?v=0u8ZHnWi4j0"]'
      )
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Browse all MCP content" })
    ).toHaveAttribute("href", "/tags/mcp");
    await expect(
      page.getByRole("link", { name: "See all projects" })
    ).toHaveAttribute("href", "/projects");
    await expect(
      page.getByRole("link", { name: "Browse talk archive" })
    ).toHaveAttribute("href", "/talks");
    await expect(
      page.getByRole("link", { name: "Browse video archive" })
    ).toHaveAttribute("href", "/videos");
    await expect(
      page.locator(
        'section[aria-label="Build"] a[href="https://github.com/pomerium/mcp-app-typescript-template"]'
      )
    ).toBeVisible();
    await expect(page.getByText("Writing", { exact: true })).toHaveCount(3);
    await expect(page.getByText("Course", { exact: true })).toHaveCount(1);
    await expect(
      page.locator(
        'a[href="https://labs.iximiuz.com/courses/securing-mcp-servers-and-mcp-apps-with-pomerium-2d28fcaa"]'
      )
    ).toBeVisible();
    const learnSection = page.locator('section[aria-label="Learn"]');
    await expect(
      learnSection.locator("article").first().locator('a[href*="iximiuz.com"]')
    ).toBeVisible();
    await expect(learnSection.locator("img")).toHaveCount(4);
    await expect(
      learnSection.locator('img[src*="iximiuz.com/content/files/courses"]')
    ).toHaveCount(1);

    await page.goto("/tags/mcp");
    await expect(
      page.getByRole("link", { name: "Explore the MCP hub" })
    ).toHaveAttribute("href", "/mcp");
  });
});

test.describe("newsletter page", () => {
  test("renders the subscribe CTA", async ({ page }) => {
    await page.goto("/newsletter");

    await expect(
      page.getByRole("heading", { level: 1, name: "Newsletter" })
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Subscribe to One Tip a Week" })
    ).toHaveAttribute("href", /onetipaweek\.com/i);
  });
});

test.describe("uses page", () => {
  test("renders the gear/tooling breakdown", async ({ page }) => {
    await page.goto("/uses");

    await expect(
      page.getByRole("heading", { level: 1, name: "Uses" })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { level: 2, name: "Editor" })
    ).toBeVisible();
  });
});

test.describe("socials page", () => {
  test("links out to each social profile", async ({ page }) => {
    await page.goto("/socials");

    await expect(
      page.getByRole("heading", { level: 1, name: "Socials" })
    ).toBeVisible();

    await expect(page.getByRole("link", { name: /GitHub/ })).toHaveAttribute(
      "href",
      "https://github.com/nickytonline"
    );
    await expect(page.getByRole("link", { name: /YouTube/ })).toHaveAttribute(
      "href",
      "https://youtube.com/@nickytonline"
    );
  });
});
