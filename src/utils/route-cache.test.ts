import { describe, expect, it } from "vitest";
import {
  cacheRenderedContent,
  publishedCacheTags,
  purgeContentTags,
  type RouteCache,
} from "./route-cache";

function recordingCache(enabled = true) {
  const setCalls: unknown[] = [];
  const purged: string[][] = [];
  const cache: RouteCache = {
    enabled,
    set(input) {
      setCalls.push(input);
    },
    async invalidate(input) {
      purged.push(input.tags ?? []);
    },
  };
  return { cache, setCalls, purged };
}

describe("cacheRenderedContent", () => {
  it("keeps the browser revalidating and tags the CDN copy", () => {
    const headers = new Headers();
    const { cache, setCalls } = recordingCache();
    const modified = new Date("2026-11-02T12:00:00.000Z");

    cacheRenderedContent(
      headers,
      cache,
      { tags: ["posts", "01POST"], lastModified: modified },
      86_400,
      300
    );

    expect(headers.get("Cache-Control")).toBe(
      "public, max-age=0, must-revalidate"
    );
    expect(setCalls).toEqual([
      {
        maxAge: 86_400,
        swr: 300,
        tags: ["posts", "01POST"],
        lastModified: modified,
      },
    ]);
  });
});

describe("publishedCacheTags", () => {
  it("purges the collection and the row, matching EmDash publish", () => {
    expect(publishedCacheTags([{ collection: "posts", id: "01POST" }])).toEqual(
      ["posts", "01POST"]
    );
  });
});

describe("purgeContentTags", () => {
  it("does nothing when the route cache is off", async () => {
    const { cache, purged } = recordingCache(false);
    await purgeContentTags(cache, ["posts"]);
    expect(purged).toEqual([]);
  });

  it("purges unique tags in batches of 100", async () => {
    const { cache, purged } = recordingCache();
    const tags = [
      "posts",
      "posts",
      ...Array.from({ length: 100 }, (_, index) => `id-${index}`),
    ];
    await purgeContentTags(cache, tags);
    expect(purged).toHaveLength(2);
    expect(purged[0]).toHaveLength(100);
    expect(purged[1]).toEqual(["id-99"]);
  });
});
