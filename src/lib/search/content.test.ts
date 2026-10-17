import { describe, expect, it } from "vitest";
import { portableTextToSearchText } from "./content.ts";

describe("portableTextToSearchText", () => {
  it("keeps prose, code, image alt text, links, and embeds", () => {
    expect(
      portableTextToSearchText([
        {
          _type: "block",
          markDefs: [{ _type: "link", href: "https://example.com" }],
          children: [
            { _type: "span", text: "Hello" },
            { _type: "span", text: "world" },
          ],
        },
        { _type: "code", code: "const n = 1;" },
        {
          _type: "image",
          alt: "cover sketch",
          asset: { url: "/assets/images/posts/sketch.png" },
        },
        { _type: "embed", id: "https://www.youtube.com/watch?v=abcdefghijk" },
      ])
    ).toBe(
      [
        "Hello",
        "world",
        "https://example.com",
        "const n = 1;",
        "cover sketch",
        "https://www.youtube.com/watch?v=abcdefghijk",
      ].join("\n")
    );
  });
});
