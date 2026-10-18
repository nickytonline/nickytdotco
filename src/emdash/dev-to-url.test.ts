import { describe, expect, it } from "vitest";
import { boostOnDevHref } from "./dev-to-url.ts";

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
