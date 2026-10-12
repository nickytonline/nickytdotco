import { describe, expect, it, vi } from "vitest";
import {
  convertSpecializedLiquidTagsToEmbed,
  extractLiquidEmbedTags,
  replaceBrokenLiquidEmbeds,
  shouldSkipUrlValidation,
} from "./devToLiquidEmbeds.ts";

describe("extractLiquidEmbedTags", () => {
  it("finds URL-based liquid tags with optional spacing and quotes", () => {
    const body = [
      "{% embed https://example.com/a %}",
      "{%embed https://example.com/b %}",
      "{%github https://github.com/org/repo %}",
      '{% codepen "https://codepen.io/user/pen/abc" %}',
      "{% youtube dQw4w9WgXcQ %}",
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
      {
        fullTag: '{% codepen "https://codepen.io/user/pen/abc" %}',
        tagName: "codepen",
        url: "https://codepen.io/user/pen/abc",
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

describe("convertSpecializedLiquidTagsToEmbed", () => {
  it("rewrites github and other URL tags to universal embed", () => {
    const body = [
      "{%github https://github.com/org/repo %}",
      "{% link https://dev.to/someone/post %}",
      "{% embed https://already.example/ok %}",
      "{% youtube dQw4w9WgXcQ %}",
    ].join("\n");

    expect(convertSpecializedLiquidTagsToEmbed(body)).toEqual({
      markdown: [
        "{% embed https://github.com/org/repo %}",
        "{% embed https://dev.to/someone/post %}",
        "{% embed https://already.example/ok %}",
        "{% youtube dQw4w9WgXcQ %}",
      ].join("\n"),
      convertedUrls: [
        "https://github.com/org/repo",
        "https://dev.to/someone/post",
      ],
    });
  });
});

describe("replaceBrokenLiquidEmbeds", () => {
  it("converts specialized tags to embed, then dead embeds to markdown", async () => {
    const body = [
      "Before",
      "{% embed https://dead.example/podcast %}",
      "{% embed https://live.example/ok %}",
      "{%github https://github.com/missing/repo %}",
      "{% github https://github.com/live/repo %}",
      "{% embed https://twitter.com/nickytonline/status/1 %}",
      "After",
    ].join("\n");

    const checkUrl = vi.fn(async (url: string) => {
      return (
        url === "https://live.example/ok" ||
        url === "https://github.com/live/repo"
      );
    });

    const result = await replaceBrokenLiquidEmbeds(body, checkUrl);

    expect(result.convertedToEmbedUrls).toEqual([
      "https://github.com/missing/repo",
      "https://github.com/live/repo",
    ]);
    expect(result.replacedWithMarkdownUrls).toEqual([
      "https://dead.example/podcast",
      "https://github.com/missing/repo",
    ]);
    expect(result.replacedUrls).toEqual([
      "https://github.com/missing/repo",
      "https://github.com/live/repo",
      "https://dead.example/podcast",
      "https://github.com/missing/repo",
    ]);
    expect(result.markdown).toBe(
      [
        "Before",
        "[https://dead.example/podcast](https://dead.example/podcast)",
        "{% embed https://live.example/ok %}",
        "[https://github.com/missing/repo](https://github.com/missing/repo)",
        "{% embed https://github.com/live/repo %}",
        "{% embed https://twitter.com/nickytonline/status/1 %}",
        "After",
      ].join("\n")
    );
    expect(checkUrl).not.toHaveBeenCalledWith(
      "https://twitter.com/nickytonline/status/1"
    );
  });

  it("returns the original markdown when every embed is reachable and no specialized tags exist", async () => {
    const body = "{% embed https://live.example/ok %}";
    const result = await replaceBrokenLiquidEmbeds(body, async () => true);

    expect(result).toEqual({
      markdown: body,
      convertedToEmbedUrls: [],
      replacedWithMarkdownUrls: [],
      replacedUrls: [],
    });
  });

  it("converts a live specialized tag to embed without markdown fallback", async () => {
    const body = "{%github https://github.com/live/repo %}";
    const result = await replaceBrokenLiquidEmbeds(body, async () => true);

    expect(result).toEqual({
      markdown: "{% embed https://github.com/live/repo %}",
      convertedToEmbedUrls: ["https://github.com/live/repo"],
      replacedWithMarkdownUrls: [],
      replacedUrls: ["https://github.com/live/repo"],
    });
  });
});
