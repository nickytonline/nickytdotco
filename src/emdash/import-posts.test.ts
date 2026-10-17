import { describe, expect, it } from "vitest";
import { selectMissingPosts } from "./import-posts";

describe("selectMissingPosts", () => {
  const posts = [
    { slug: "older" },
    { slug: "middle" },
    { slug: null },
    { slug: "newer" },
  ];

  it("skips slugs already stored and keeps seed order", () => {
    expect(selectMissingPosts(posts, new Set(["middle"]), 10)).toEqual([
      { slug: "older" },
      { slug: "newer" },
    ]);
  });

  it("returns the next chunk only", () => {
    expect(selectMissingPosts(posts, new Set(), 1)).toEqual([
      { slug: "older" },
    ]);
  });
});
