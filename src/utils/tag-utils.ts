import type { CollectionEntry } from "astro:content";

interface ScoredItem<T> {
  item: T;
  score: number;
}

function scoreBySharedTags<T extends { data: { tags?: string[]; date: Date } }>(
  currentTags: string[],
  currentId: string,
  allItems: T[],
  getTags: (item: T) => string[]
): ScoredItem<T>[] {
  return allItems
    .filter((item) => (item as unknown as { id: string }).id !== currentId)
    .map((item) => {
      const itemTags = getTags(item);
      const sharedTags = itemTags.filter((tag) => currentTags.includes(tag));
      return { item, score: sharedTags.length };
    })
    .filter((scored) => scored.score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      return b.item.data.date.getTime() - a.item.data.date.getTime();
    });
}

/**
 * Finds related talks based on shared tags
 *
 * @param currentTalk The current talk
 * @param allTalks All available talks
 * @param limit Maximum number of related talks to return
 * @returns Array of related talks sorted by relevance
 */
export function getRelatedTalks(
  currentTalk: CollectionEntry<"talks">,
  allTalks: CollectionEntry<"talks">[],
  limit: number = 3
): CollectionEntry<"talks">[] {
  const currentTags = currentTalk.data.tags || [];
  if (!currentTags.length) return [];

  const scored = scoreBySharedTags(
    currentTags,
    currentTalk.id,
    allTalks,
    (talk) => talk.data.tags || []
  );
  return scored.slice(0, limit).map((s) => s.item);
}

/**
 * Finds talks related to a blog post based on shared tags
 *
 * @param currentPost The current blog post
 * @param allTalks All available talks
 * @param limit Maximum number of related talks to return
 * @returns Array of related talks sorted by relevance
 */
export function getRelatedTalksForPost(
  currentPost: CollectionEntry<"blog">,
  allTalks: CollectionEntry<"talks">[],
  limit: number = 3
): CollectionEntry<"talks">[] {
  const currentTags = currentPost.data.tags || [];
  if (!currentTags.length) return [];

  const scored = scoreBySharedTags(
    currentTags,
    currentPost.id,
    allTalks,
    (talk) => talk.data.tags || []
  );
  return scored.slice(0, limit).map((s) => s.item);
}

/**
 * Finds blog posts related to a talk based on shared tags
 *
 * @param currentTalk The current talk
 * @param allPosts All available blog posts
 * @param limit Maximum number of related posts to return
 * @returns Array of related posts sorted by relevance
 */
export function getRelatedPostsForTalk(
  currentTalk: CollectionEntry<"talks">,
  allPosts: CollectionEntry<"blog">[],
  limit: number = 3
): CollectionEntry<"blog">[] {
  const currentTags = currentTalk.data.tags || [];
  if (!currentTags.length) return [];

  const scored = scoreBySharedTags(
    currentTags,
    currentTalk.id,
    allPosts,
    (post) => post.data.tags || []
  );
  return scored.slice(0, limit).map((s) => s.item);
}
