import { describe, expect, it } from "vitest";
import { getRelatedVideosForPost } from "./tag-utils.ts";

describe("getRelatedVideosForPost", () => {
  const post = {
    id: "git-worktrees-git-done-right",
    data: { tags: ["git", "ai"] },
  };

  it("ranks videos that share longer tags and skips short tags", () => {
    const videos = getRelatedVideosForPost(post, [
      {
        slug: "unrelated",
        title: "A chat about email",
        description: "Inbox zero",
        date: "2026-01-01",
      },
      {
        slug: "git-live",
        title: "Git worktrees on stream",
        description: "We tried worktrees",
        date: "2026-02-01",
      },
      {
        slug: "older-git",
        title: "Older git notes",
        description: "git config",
        date: "2025-01-01",
      },
    ]);

    expect(videos.map((video) => video.slug)).toEqual([
      "git-live",
      "older-git",
    ]);
  });

  it("returns nothing when the post has no tags", () => {
    expect(
      getRelatedVideosForPost({ id: "plain", data: {} }, [
        {
          slug: "git-live",
          title: "Git worktrees",
          date: "2026-02-01",
        },
      ])
    ).toEqual([]);
  });
});
