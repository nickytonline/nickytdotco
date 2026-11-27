export interface LatestItem {
  kind: string;
  id: string;
  date: Date;
}

export const LATEST_CONTENT_LIMIT = 4;

function byDateDescending<Entry extends LatestItem>(
  left: Entry,
  right: Entry
): number {
  return right.date.getTime() - left.date.getTime();
}

function includesItem<Entry extends LatestItem>(
  entries: readonly Entry[],
  candidate: Entry
): boolean {
  return entries.some(
    (entry) => entry.kind === candidate.kind && entry.id === candidate.id
  );
}

export function selectLatestContent<Entry extends LatestItem>(
  candidates: readonly Entry[],
  newestPost: Entry | undefined,
  limit: number = LATEST_CONTENT_LIMIT
): Entry[] {
  const selected = [...candidates].sort(byDateDescending).slice(0, limit);

  if (newestPost === undefined || includesItem(selected, newestPost)) {
    return selected;
  }

  return [...selected, newestPost].sort(byDateDescending);
}
