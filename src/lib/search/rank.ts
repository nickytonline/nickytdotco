import type { SearchResult } from "./types.ts";

/**
 * Site search always embeds the query and ranks by cosine distance.
 * Word overlap does not replace embeddings: it only decides eligibility
 * when the typed tokens appear in a document (a name like "roxy", or a
 * topic word like "cypress"). Unrelated vector neighbors are dropped
 * unless they are actually close to the query.
 */
export interface ScoredSearchHit extends SearchResult {
  distance: number;
}

const SEARCH_STOPWORDS = new Set([
  "a",
  "an",
  "and",
  "at",
  "for",
  "from",
  "in",
  "of",
  "on",
  "or",
  "the",
  "to",
  "with",
]);

export function searchTokens(query: string): string[] {
  const raw: string[] = [];
  const seen = new Set<string>();
  for (const part of query.toLowerCase().split(/[^a-z0-9]+/)) {
    if (part.length < 2 || seen.has(part)) {
      continue;
    }
    seen.add(part);
    raw.push(part);
  }

  if (raw.length === 0) {
    const fallback = query.trim().toLowerCase();
    return fallback.length >= 2 ? [fallback] : [];
  }

  const content = raw.filter((token) => !SEARCH_STOPWORDS.has(token));
  return content.length > 0 ? content : raw;
}

export function documentMatchesTokens(text: string, tokens: string[]): boolean {
  if (tokens.length === 0) {
    return false;
  }
  const haystack = text.toLowerCase();
  return tokens.every((token) => haystack.includes(token));
}

export function filterWeakVectorHits<T extends { distance: number }>(
  hits: T[],
  maxDistance: number,
  gap: number
): T[] {
  const finite = hits.filter((hit) => Number.isFinite(hit.distance));
  if (finite.length === 0) {
    return [];
  }
  const best = Math.min(...finite.map((hit) => hit.distance));
  const cutoff = Math.min(maxDistance, best + gap);
  return finite.filter((hit) => hit.distance <= cutoff);
}

export function selectSearchHits<T extends { distance: number }>(
  lexicalHits: T[],
  vectorHits: T[],
  limit: number,
  maxDistance: number,
  gap: number
): T[] {
  const rankedLexical = [...lexicalHits]
    .filter((hit) => Number.isFinite(hit.distance))
    .sort((left, right) => left.distance - right.distance);

  if (rankedLexical.length > 0) {
    return rankedLexical.slice(0, limit);
  }

  return filterWeakVectorHits(vectorHits, maxDistance, gap)
    .sort((left, right) => left.distance - right.distance)
    .slice(0, limit);
}
