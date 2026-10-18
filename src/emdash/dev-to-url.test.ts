import { describe, expect, it } from "vitest";
import {
  boostOnDevHref,
  devToSlugFromMarkdown,
  devToUrlAssignments,
} from "./dev-to-url.ts";

describe("boostOnDevHref", () => {
  it("keeps a DEV article URL", () => {
    expect(
      boostOnDevHref("https://dev.to/devteam/changelog-frontend-edition-30l7")
    ).toBe("https://dev.to/devteam/changelog-frontend-edition-30l7");
  });

  it("hides an empty or non-DEV value", () => {
    expect(boostOnDevHref(undefined)).toBeUndefined();
    expect(boostOnDevHref("")).toBeUndefined();
    expect(boostOnDevHref("   ")).toBeUndefined();
    expect(boostOnDevHref("not a url")).toBeUndefined();
    expect(
      boostOnDevHref("https://www.nickyt.co/blog/example/")
    ).toBeUndefined();
    expect(boostOnDevHref("javascript:alert(1)")).toBeUndefined();
  });
});

describe("devToSlugFromMarkdown", () => {
  it("reads a plain slug", () => {
    expect(
      devToSlugFromMarkdown(`---
title: 2018 Resolutions
dev_to_slug: 2018-resolutions-1deo
---
body
`)
    ).toBe("2018-resolutions-1deo");
  });

  it("reads a folded YAML slug", () => {
    expect(
      devToSlugFromMarkdown(`---
title: >-
  A long title
dev_to_slug: >-
  advent-of-ai-2025-day-5-i-built-a-touchless-flight-tracker-you-control-with-hand-gestures-1jn8
---
body
`)
    ).toBe(
      "advent-of-ai-2025-day-5-i-built-a-touchless-flight-tracker-you-control-with-hand-gestures-1jn8"
    );
  });

  it("returns undefined when the field is missing", () => {
    expect(devToSlugFromMarkdown("---\ntitle: Hello\n---\n")).toBeUndefined();
  });
});

describe("devToUrlAssignments", () => {
  it("uses the article URL for the historical DEV slug", () => {
    const { assignments, unmatched } = devToUrlAssignments(
      [
        {
          slug: "changelog-frontend-edition",
          devToSlug: "changelog-frontend-edition-30l7",
        },
        { slug: "missing-on-dev", devToSlug: "gone-abc" },
      ],
      [
        {
          slug: "changelog-frontend-edition-30l7",
          url: "https://dev.to/devteam/changelog-frontend-edition-30l7",
        },
      ]
    );
    expect(assignments).toEqual([
      {
        slug: "changelog-frontend-edition",
        devToUrl: "https://dev.to/devteam/changelog-frontend-edition-30l7",
      },
    ]);
    expect(unmatched).toEqual(["missing-on-dev"]);
  });
});
