export type RelatedVariant = "mixed" | "link";

export interface RelatedAssignment {
  variant: RelatedVariant;
  persist: boolean;
}

export function resolveRelatedVariant(input: {
  testEnabled: boolean;
  query: string | null;
  cookie: string | null;
  random?: number;
}): RelatedAssignment {
  const query = parseVariant(input.query);

  if (query) return { variant: query, persist: true };

  if (!input.testEnabled) return { variant: "mixed", persist: false };

  const cookie = parseVariant(input.cookie);

  if (cookie) return { variant: cookie, persist: false };

  const roll = input.random ?? Math.random();

  return { variant: roll < 0.5 ? "mixed" : "link", persist: true };
}

function parseVariant(value: string | null): RelatedVariant | undefined {
  if (value === "mixed" || value === "link") return value;

  return undefined;
}
