import type { SearchResult } from "./types.ts";

/**
 * Text match is the whole query as consecutive whole words, then
 * embeddings if that finds nothing. "roxy" does not match "proxy".
 * "roxy joing nick" does not match unless those words sit in a row.
 */
export interface ScoredSearchHit extends SearchResult {
  distance: number;
}

export function contentTokens(text: string): string[] {
  const tokens: string[] = [];
  for (const part of text.toLowerCase().split(/[^a-z0-9]+/)) {
    if (part.length >= 2) {
      tokens.push(part);
    }
  }
  return tokens;
}

export function phraseTokens(query: string): string[] {
  return contentTokens(query);
}

export function hasConsecutivePhrase(
  haystackTokens: string[],
  phrase: string[]
): boolean {
  if (phrase.length === 0 || haystackTokens.length < phrase.length) {
    return false;
  }
  for (let index = 0; index <= haystackTokens.length - phrase.length; index++) {
    if (
      phrase.every((token, offset) => haystackTokens[index + offset] === token)
    ) {
      return true;
    }
  }
  return false;
}

export function documentMatchesQueryPhrase(
  text: string,
  query: string
): boolean {
  return hasConsecutivePhrase(contentTokens(text), phraseTokens(query));
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
