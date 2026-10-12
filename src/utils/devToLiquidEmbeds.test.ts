import { describe, expect, it, vi } from "vitest";
import {
  extractLiquidEmbedTags,
  replaceBrokenLiquidEmbeds,
  shouldSkipUrlValidation,
} from "./devToLiquidEmbeds.ts";

describe("extractLiquidEmbedTags", () => {
  it("finds embed and github liquid tags with optional spacing", () => {
    const body = [
      "{% embed https://example.com/a %}",
      "{%embed https://example.com/b %}",
      "{%github https://github.com/org/repo %}",
      "plain text",
    ].join("\n");

    expect(extractLiquidEmbedTags(body)).toEqual([
      {
        fullTag: "{% embed https://example.com/a %}",
        tagName: "embed",
        url: "https://example.com/a",
      },
      {
        fullTag: "{%embed https://example.com/b %}",
        tagName: "embed",
        url: "https://example.com/b",
      },
      {
        fullTag: "{%github https://github.com/org/repo %}",
        tagName: "github",
        url: "https://github.com/org/repo",
      },
    ]);
  });
});

describe("shouldSkipUrlValidation", () => {
  it("skips twitter/x/bsky hosts like Forem does", () => {
    expect(
      shouldSkipUrlValidation("https://twitter.com/nickytonline/status/1")
    ).toBe(true);
    expect(shouldSkipUrlValidation("https://x.com/nickytonline/status/1")).toBe(
      true
    );
    expect(shouldSkipUrlValidation("https://bsky.app/profile/x")).toBe(true);
    expect(shouldSkipUrlValidation("https://example.com/a")).toBe(false);
  });
});

describe("replaceBrokenLiquidEmbeds", () => {
  it("rewrites only unreachable liquid embeds to markdown links", async () => {
    const body = [
      "Before",
      "{% embed https://dead.example/podcast %}",
      "{% embed https://live.example/ok %}",
      "{%github https://github.com/missing/repo %}",
      "{% embed https://twitter.com/nickytonline/status/1 %}",
      "After",
    ].join("\n");

    const checkUrl = vi.fn(async (url: string) => {
      return url === "https://live.example/ok";
    });

    const result = await replaceBrokenLiquidEmbeds(body, checkUrl);

    expect(result.replacedUrls).toEqual([
      "https://dead.example/podcast",
      "https://github.com/missing/repo",
    ]);
    expect(result.markdown).toBe(
      [
        "Before",
        "[https://dead.example/podcast](https://dead.example/podcast)",
        "{% embed https://live.example/ok %}",
        "[https://github.com/missing/repo](https://github.com/missing/repo)",
        "{% embed https://twitter.com/nickytonline/status/1 %}",
        "After",
      ].join("\n")
    );
    expect(checkUrl).not.toHaveBeenCalledWith(
      "https://twitter.com/nickytonline/status/1"
    );
  });

  it("returns the original markdown when every embed is reachable", async () => {
    const body = "{% embed https://live.example/ok %}";
    const result = await replaceBrokenLiquidEmbeds(body, async () => true);

    expect(result).toEqual({ markdown: body, replacedUrls: [] });
  });
});
