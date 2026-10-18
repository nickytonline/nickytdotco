import { createClient } from "@libsql/client";
import { describe, expect, it } from "vitest";
import { loadSearchBlogPosts } from "./blogPosts.ts";

async function fixture() {
  const db = createClient({ url: ":memory:" });
  await db.execute(`CREATE TABLE ec_posts (
    slug TEXT, title TEXT, content TEXT, excerpt TEXT, description TEXT,
    status TEXT, deleted_at TEXT, draft INTEGER, draft_revision_id TEXT
  )`);
  return db;
}

describe("loadSearchBlogPosts", () => {
  it("reads all live posts and excludes drafts, scheduled, archived and deleted posts", async () => {
    const db = await fixture();
    try {
      const content = [{ _type: "block", children: [{ text: "Live prose" }] }];
      for (let i = 0; i < 105; i++) {
        await db.execute({
          sql: "INSERT INTO ec_posts VALUES (?, ?, ?, ?, ?, 'published', NULL, 0, 'pending-draft')",
          args: [
            `post-${i}`,
            `Post ${i}`,
            JSON.stringify(content),
            "Excerpt",
            "Description",
          ],
        });
      }
      for (const status of ["draft", "scheduled", "archived"]) {
        await db.execute({
          sql: "INSERT INTO ec_posts (slug, title, status) VALUES (?, ?, ?)",
          args: [status, status, status],
        });
      }
      await db.execute(
        "INSERT INTO ec_posts (slug, title, status, deleted_at) VALUES ('deleted', 'Deleted', 'published', '2026-10-18')"
      );
      await db.execute(
        "INSERT INTO ec_posts (slug, title, status, draft) VALUES ('hidden', 'Hidden', 'published', 1)"
      );
      const posts = await loadSearchBlogPosts(db);
      expect(posts).toHaveLength(105);
      expect(posts[0]).toEqual({
        slug: "post-0",
        data: {
          title: "Post 0",
          content,
          excerpt: "Excerpt",
          description: "Description",
        },
      });
    } finally {
      db.close();
    }
  });

  it("propagates missing-table and malformed-content errors instead of returning an empty catalog", async () => {
    const db = createClient({ url: ":memory:" });
    try {
      await expect(loadSearchBlogPosts(db)).rejects.toThrow();
    } finally {
      db.close();
    }
    const malformed = await fixture();
    try {
      await malformed.execute(
        "INSERT INTO ec_posts (slug, title, status, content) VALUES ('broken', 'Broken', 'published', '[invalid')"
      );
      await expect(loadSearchBlogPosts(malformed)).rejects.toThrow();
    } finally {
      malformed.close();
    }
  });
});
