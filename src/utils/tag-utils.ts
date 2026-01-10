import type { CollectionEntry } from "astro:content";

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
  limit: number = 3,
): CollectionEntry<"talks">[] {
  const currentTags = currentTalk.data.tags || [];
  const currentSlug = currentTalk.id;

  if (!currentTags.length) {
    return [];
  }

  // Calculate relevance score for each talk (number of shared tags)
  const scoredTalks = allTalks
    .filter((talk) => talk.id !== currentSlug) // Exclude current talk
    .map((talk) => {
      const talkTags = talk.data.tags || [];
      const sharedTags = talkTags.filter((tag) => currentTags.includes(tag));
      return {
        talk,
        score: sharedTags.length,
      };
    })
    .filter((item) => item.score > 0) // Only include talks with at least one shared tag
    .sort((a, b) => {
      // Sort by score descending, then by date descending if scores are equal
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      return b.talk.data.date.getTime() - a.talk.data.date.getTime();
    });

  return scoredTalks.slice(0, limit).map((item) => item.talk);
}
