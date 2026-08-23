import { test, expect } from "@playwright/test";

test.describe("home page", () => {
  test("renders the hero with a heading and headshot", async ({ page }) => {
    await page.goto("/");

    await expect(
      page.getByRole("heading", {
        level: 1,
        name: "Developer advocate at the intersection of AI, security, and software.",
      })
    ).toBeVisible();

    await expect(
      page.getByRole("img", { name: "Headshot of Nick Taylor" })
    ).toBeVisible();
  });

  test("links to @nickytonline socials from the intro", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("main").getByRole("link", { name: "@nickytonline" })
    ).toHaveAttribute("href", "/socials");
  });

  test("renders a curated Start here section with at least one content type", async ({
    page,
  }) => {
    await page.goto("/");

    await expect(
      page.getByRole("heading", { level: 2, name: "Start here" })
    ).toBeVisible();

    const subheadings = page.getByRole("heading", {
      level: 3,
      name: /Talks|Hands-On Tutorials|Writing/,
    });
    await expect(subheadings.first()).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Explore the MCP hub" })
    ).toHaveAttribute("href", "/mcp");
  });

  test("includes the selected AI and Zero Trust talks", async ({ page }) => {
    await page.goto("/");

    await expect(
      page.getByRole("heading", {
        level: 3,
        name: "Claws Out: Securing and Building with OpenClaw",
      })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", {
        level: 3,
        name: "Kubernetes Without Borders: Building Zero Trust Security for Dynamic Workloads",
      })
    ).toBeVisible();
  });

  test("promotes speaking and newsletter CTAs in the hero", async ({
    page,
  }) => {
    await page.goto("/");

    await expect(
      page.getByRole("link", { name: "Invite me to speak" })
    ).toHaveAttribute("href", "/speaking");
    await expect(
      page.getByRole("link", { name: "Get one dev tip a week" })
    ).toHaveAttribute(
      "href",
      /onetipaweek\.com\/?\?utm_source=nickytco&utm_medium=homepage-hero/i
    );
  });

  test("renders upcoming events or a capped Latest fallback", async ({
    page,
  }) => {
    await page.goto("/");

    const upcomingHeading = page.getByRole("heading", {
      level: 2,
      name: "Upcoming Events",
    });
    const latestHeading = page.getByRole("heading", {
      level: 2,
      name: "Latest",
    });

    await expect(upcomingHeading.or(latestHeading)).toHaveCount(1);

    const sectionHeading = (await upcomingHeading.count())
      ? upcomingHeading
      : latestHeading;
    await expect(sectionHeading).toBeVisible();

    const section = sectionHeading.locator("xpath=ancestor::section");
    const contentItems = section.locator("article, .stream-card");
    await expect(contentItems.first()).toBeVisible();

    if (await latestHeading.count()) {
      expect(await contentItems.count()).toBeLessThanOrEqual(4);
    }
  });

  test("orders upcoming events by date across event types", async ({
    page,
  }) => {
    await page.goto("/");

    const upcomingHeading = page.getByRole("heading", {
      level: 2,
      name: "Upcoming Events",
    });

    if (!(await upcomingHeading.count())) return;

    const section = upcomingHeading.locator("xpath=ancestor::section");
    const timestamps = await section
      .locator("[data-upcoming-event]")
      .evaluateAll((events) =>
        events.map((event) =>
          Number(event.getAttribute("data-event-timestamp"))
        )
      );

    expect(timestamps).toEqual([...timestamps].sort((a, b) => a - b));
  });

  test("sets a timezone response header from geo context", async ({
    request,
  }) => {
    const response = await request.get("/");
    expect(response.ok()).toBeTruthy();
    expect(response.headers()["timezone"]).toBeDefined();
  });

  test("embeds Person JSON-LD structured data", async ({ page }) => {
    await page.goto("/");
    const scripts = await page
      .locator('script[type="application/ld+json"]')
      .allTextContents();
    const person = scripts
      .map((text) => JSON.parse(text))
      .find((data) => data["@type"] === "Person");
    expect(person).toBeTruthy();
    expect(person.name).toBe("Nick Taylor");
  });

  test("promotes the newsletter after homepage content", async ({ page }) => {
    await page.goto("/");

    const newsletter = page.getByRole("heading", { name: "Newsletter" });
    await expect(newsletter).toBeAttached();
    const newsletterSection = page.locator(
      'section[aria-labelledby="newsletter-heading"]'
    );
    await expect(newsletterSection).toContainText(
      "One developer tip a week. Short & valuable. That's it!"
    );
    await expect(
      newsletterSection.getByRole("link", { name: "Subscribe", exact: true })
    ).toHaveAttribute(
      "href",
      /onetipaweek\.com\/?\?utm_source=nickytco&utm_medium=homepage/i
    );
  });
});
