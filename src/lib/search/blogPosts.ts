import type { Client } from "@libsql/client";
import { isString } from "../../utils/type-guards.ts";

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

    if (!isString(row.slug) || !isString(row.title)) {
      throw new Error("Published EmDash post is missing its slug or title.");
    }

    return [
      {
        slug: row.slug,
        data: {
          title: row.title,
          excerpt: isString(row.excerpt) ? row.excerpt : undefined,
          description: isString(row.description) ? row.description : undefined,
          content: isString(row.content)
            ? JSON.parse(row.content)
            : row.content,
        },
      },
    ];
  });
}
