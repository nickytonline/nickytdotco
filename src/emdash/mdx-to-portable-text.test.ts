import { describe, expect, it } from "vitest";
import {
  collapseSoftBreaks,
  mdxBodyToPortableText,
  mediaComponentToUrl,
} from "./mdx-to-portable-text";

describe("mediaComponentToUrl", () => {
  it("keeps a direct Embed URL", () => {
    expect(
      mediaComponentToUrl("Embed", {
        url: "https://github.com/nickytonline/example",
      })
    ).toBe("https://github.com/nickytonline/example");
  });

  it("rebuilds Twitter, YouTube, Instagram, and CodeSandbox URLs", () => {
    expect(mediaComponentToUrl("TwitterEmbed", { tweetId: "123" })).toBe(
      "https://twitter.com/i/status/123"
    );
    expect(
      mediaComponentToUrl("YouTubeEmbed", {
        videoId: "abcdefghijk",
        startTime: "30",
      })
    ).toBe("https://www.youtube.com/watch?v=abcdefghijk&start=30");
    expect(
      mediaComponentToUrl("InstagramEmbed", {
        url: "https://www.instagram.com/p/abc/",
      })
    ).toBe("https://www.instagram.com/p/abc/");
    expect(mediaComponentToUrl("CodeSandboxEmbed", { sandboxId: "box" })).toBe(
      "https://codesandbox.io/s/box"
    );
  });

  it("ignores placeholder URLs used as documentation", () => {
    expect(mediaComponentToUrl("Embed", { url: "url" })).toBeNull();
  });
});

describe("mdxBodyToPortableText", () => {
  it("turns media components into embed blocks and leaves fenced examples alone", () => {
    const blocks = mdxBodyToPortableText(`
import Embed from "@/components/Embed.astro";
import TwitterEmbed from "@/components/embeds/TwitterEmbed.astro";

Hello
world

<TwitterEmbed tweetId="123" />

\`<Embed url="https://example.com" />\`

\`\`\`mdx
<Embed url="https://github.com/example/repo" />
\`\`\`
`);

    const embed = blocks.find((block) => block._type === "embed");
    expect(embed?.id).toBe("https://twitter.com/i/status/123");
    const code = blocks.find((block) => block._type === "code");
    expect(code?.code).toContain("<Embed");
    const paragraph = blocks.find(
      (block) =>
        block._type === "block" &&
        Array.isArray(block.children) &&
        (block.children as Array<{ text?: string }>).some((child) =>
          child.text?.includes("Hello world")
        )
    );
    expect(paragraph).toBeTruthy();
    const embeds = blocks.filter((block) => block._type === "embed");
    expect(embeds.map((block) => block.id)).toEqual([
      "https://twitter.com/i/status/123",
    ]);
  });
});

describe("collapseSoftBreaks", () => {
  it("joins wrapped list items", () => {
    expect(collapseSoftBreaks("- one\n  two\n")).toBe("- one two\n");
  });
});
