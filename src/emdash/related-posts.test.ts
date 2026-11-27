import { describe, expect, it } from "vitest";
import { relatedPostSlugs, resolveRelatedPost } from "./related-posts.ts";

describe("resolveRelatedPost", () => {
  it("resolves the worktrees post to the git config post", () => {
    expect(
      resolveRelatedPost("git-worktrees-git-done-right", {
        id: "five-git-config-settings-every-dev-needs",
        data: { title: "Five Git Config Settings Every Dev Needs" },
      })
    ).toEqual({
      title: "Five Git Config Settings Every Dev Needs",
      href: "/blog/five-git-config-settings-every-dev-needs/",
    });
  });

  it("resolves the Goose post to the TypeScript MCP template post", () => {
    expect(
      resolveRelatedPost(
        "what-makes-goose-different-from-other-ai-coding-agents",
        {
          id: "build-your-first-or-next-mcp-server-with-the-typescript-mcp-template",
          data: {
            title:
              "Build Your First (or Next) MCP Server with the TypeScript MCP Template",
          },
        }
      )
    ).toEqual({
      title:
        "Build Your First (or Next) MCP Server with the TypeScript MCP Template",
      href: "/blog/build-your-first-or-next-mcp-server-with-the-typescript-mcp-template/",
    });
  });

  it("returns nothing when the post has no related slug", () => {
    expect(
      resolveRelatedPost("hi-im-nick-taylor", {
        id: "hi-im-nick-taylor",
        data: { title: "Hi, I'm Nick Taylor" },
      })
    ).toBeUndefined();
  });

  it("throws when a related slug does not match a published post", () => {
    expect(() =>
      resolveRelatedPost("git-worktrees-git-done-right", undefined)
    ).toThrow(
      'Related post "five-git-config-settings-every-dev-needs" for "git-worktrees-git-done-right" does not exist'
    );

    expect(() =>
      resolveRelatedPost("source-post", undefined, {
        "source-post": "not-a-real-post",
      })
    ).toThrow(
      'Related post "not-a-real-post" for "source-post" does not exist'
    );

    expect(() =>
      resolveRelatedPost(
        "source-post",
        { id: "some-other-post", data: { title: "Other" } },
        { "source-post": "not-a-real-post" }
      )
    ).toThrow(
      'Related post "not-a-real-post" for "source-post" does not exist'
    );

    expect(() =>
      resolveRelatedPost(
        "source-post",
        {
          id: "hidden-post",
          data: { title: "Hidden", draft: true },
        },
        { "source-post": "hidden-post" }
      )
    ).toThrow('Related post "hidden-post" for "source-post" does not exist');

    expect(() =>
      resolveRelatedPost("source-post", undefined, { "source-post": "  " })
    ).toThrow('Related post "" for "source-post" does not exist');
  });

  it("fails closed for every configured slug when the target is missing", () => {
    for (const sourceSlug of Object.keys(relatedPostSlugs)) {
      expect(() => resolveRelatedPost(sourceSlug, undefined)).toThrow(
        /does not exist/
      );
    }
  });
});
