export interface RelatedPostTarget {
  id: string;
  data: {
    title: string;
    draft?: boolean;
  };
}

export interface RelatedPost {
  title: string;
  href: string;
}

export const relatedPostSlugs = {
  "git-worktrees-git-done-right": "five-git-config-settings-every-dev-needs",
  "what-makes-goose-different-from-other-ai-coding-agents":
    "build-your-first-or-next-mcp-server-with-the-typescript-mcp-template",
} as const satisfies Readonly<Record<string, string>>;

export function relatedSlugFor(sourceSlug: string): string | undefined {
  for (const [slug, relatedSlug] of Object.entries(relatedPostSlugs)) {
    if (slug === sourceSlug) return relatedSlug;
  }

  return undefined;
}

export function resolveRelatedPost(
  sourceSlug: string,
  target: RelatedPostTarget | undefined,
  links: Readonly<Record<string, string>> = relatedPostSlugs
): RelatedPost | undefined {
  if (!(sourceSlug in links)) return undefined;

  const relatedSlug = links[sourceSlug]?.trim() ?? "";

  if (
    target === undefined ||
    target.id !== relatedSlug ||
    target.data.draft === true ||
    target.data.title.trim().length === 0
  ) {
    throw new Error(
      `Related post "${relatedSlug}" for "${sourceSlug}" does not exist`
    );
  }

  return {
    title: target.data.title.trim(),
    href: `/blog/${target.id}/`,
  };
}
