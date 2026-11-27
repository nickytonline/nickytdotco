import { describe, expect, it } from "vitest";
import { selectLatestContent } from "./selectLatestContent.ts";

function entry(kind: "talk" | "stream" | "post", id: string, iso: string) {
  return {
    kind,
    id,
    date: new Date(iso),
    item: { id },
  };
}

describe("selectLatestContent", () => {
  it("keeps the newest post when newer talks and a stream fill the cap", () => {
    const newestPost = entry(
      "post",
      "how-i-travel-for-work",
      "2026-07-02T03:27:33.000Z"
    );

    const selected = selectLatestContent(
      [
        entry("talk", "expert-panel", "2026-11-10T10:15:00.000Z"),
        entry("talk", "agntcon", "2026-10-23T22:35:00.000Z"),
        entry("talk", "all-things-open", "2026-10-20T12:00:00.000Z"),
        entry("stream", "how-people-ai-vol-4", "2026-10-15T17:00:00.000Z"),
        newestPost,
        entry("post", "excaliclaw", "2026-04-25T00:00:00.000Z"),
      ],
      newestPost
    );

    expect(selected.map((item) => item.id)).toEqual([
      "expert-panel",
      "agntcon",
      "all-things-open",
      "how-people-ai-vol-4",
      "how-i-travel-for-work",
    ]);
  });

  it("does not duplicate a post that already fits in the cap", () => {
    const newestPost = entry("post", "fresh", "2026-12-01T00:00:00.000Z");

    const selected = selectLatestContent(
      [
        newestPost,
        entry("talk", "one", "2026-11-01T00:00:00.000Z"),
        entry("talk", "two", "2026-10-01T00:00:00.000Z"),
        entry("stream", "live", "2026-09-01T00:00:00.000Z"),
      ],
      newestPost
    );

    expect(selected.map((item) => item.id)).toEqual([
      "fresh",
      "one",
      "two",
      "live",
    ]);
  });

  it("returns the recency cap when there is no post", () => {
    const selected = selectLatestContent(
      [
        entry("talk", "one", "2026-11-01T00:00:00.000Z"),
        entry("talk", "two", "2026-10-01T00:00:00.000Z"),
      ],
      undefined
    );

    expect(selected.map((item) => item.id)).toEqual(["one", "two"]);
  });
});
