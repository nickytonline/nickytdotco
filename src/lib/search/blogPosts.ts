import type { Client } from "@libsql/client";

export interface SearchBlogPost {
  slug: string;
  data: {
    title: string;
    excerpt?: string;
    description?: string;
    content: unknown;
  };
}

/** Standalone Node indexing cannot use EmDash's Astro live collection runtime. */
export async function loadSearchBlogPosts(
  db: Pick<Client, "execute">
): Promise<SearchBlogPost[]> {
  // EmDash stores the live field values on ec_posts, including when a published
  // post has a pending draft revision. Match its public loader's status and
  // soft-delete filters; never read the draft revision snapshot.
  const result = await db.execute(
    "SELECT * FROM ec_posts WHERE status = 'published' AND deleted_at IS NULL"
  );
  return result.rows.flatMap((row) => {
    if (row.draft === 1) return [];
    if (typeof row.slug !== "string" || typeof row.title !== "string") {
      throw new Error("Published EmDash post is missing its slug or title.");
    }
    return [
      {
        slug: row.slug,
        data: {
          title: row.title,
          excerpt: typeof row.excerpt === "string" ? row.excerpt : undefined,
          description:
            typeof row.description === "string" ? row.description : undefined,
          content:
            typeof row.content === "string"
              ? JSON.parse(row.content)
              : row.content,
        },
      },
    ];
  });
}
