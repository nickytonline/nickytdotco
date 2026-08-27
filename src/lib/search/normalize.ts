export function normalizeSearchQuery(query: string): string {
  return query.trim().replace(/\s+/g, " ").toLowerCase();
}

export function isSearchQueryTooLong(query: string, maxChars: number): boolean {
  return query.length > maxChars;
}

export function l2Normalize(values: number[]): number[] {
  let sumSquares = 0;
  for (const value of values) {
    sumSquares += value * value;
  }
  const magnitude = Math.sqrt(sumSquares);
  if (magnitude === 0) {
    return values;
  }
  return values.map((value) => value / magnitude);
}

export function parseSearchLimit(
  raw: string | null,
  defaultLimit: number,
  maxLimit: number
): number {
  if (raw == null || raw === "") {
    return defaultLimit;
  }
  const parsed = Number(raw);
  if (!Number.isFinite(parsed)) {
    return defaultLimit;
  }
  return Math.min(Math.max(1, Math.floor(parsed)), maxLimit);
}
