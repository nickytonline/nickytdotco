export const curatedTagLabels = {
  accessibility: "Accessibility",
  agenticai: "Agentic AI",
  ai: "AI",
  astro: "Astro",
  css: "CSS",
  deno: "Deno",
  developertools: "Developer tooling",
  devops: "DevOps",
  devrel: "DevRel",
  docker: "Docker",
  git: "Git",
  github: "GitHub",
  javascript: "JavaScript",
  kubernetes: "Kubernetes",
  mcp: "MCP",
  opensource: "Open source",
  productivity: "Productivity",
  react: "React",
  security: "Security",
  testing: "Testing",
  typescript: "TypeScript",
  zerotrust: "Zero Trust",
} satisfies Record<string, string>;

const curatedTagLabelMap = new Map(Object.entries(curatedTagLabels));

export function getCuratedTagLabel(tag: string): string {
  return curatedTagLabelMap.get(tag) ?? tag;
}

export const curatedTagSlugs = new Set(Object.keys(curatedTagLabels));
