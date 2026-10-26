export interface ProjectLink {
  label: string;
  url: string;
}

export interface CuratedProjectBase {
  owner: string;
  name: string;
  description: string;
  url: string;
  myRole?: string;
  links?: ProjectLink[];
  primaryLanguage?: { name: string; color: string };
  /** Shown on the homepage featured card instead of `description`. */
  featuredDescription?: string;
  /** Shown on the homepage featured card instead of `links`. */
  featuredLinks?: ProjectLink[];
  /** Used when GitHub stats are unavailable. */
  fallbackStats?: { stargazerCount: number; forkCount: number };
  /** Used when GitHub openGraphImageUrl is unavailable. */
  fallbackImage?: string;
}

export const curatedProjects: CuratedProjectBase[] = [
  {
    owner: "nickytonline",
    name: "pomerium-quest",
    description:
      "A Zelda-style browser RPG that teaches how Pomerium works. Every gate is a real Pomerium route, every guard follows real policy, and when you're turned away the game shows the exact rule that failed — all behind a local k3d cluster with Keycloak as the Oracle.",
    featuredDescription:
      "A Zelda-style browser RPG that teaches Zero Trust with Pomerium. Every gate is a real route and policy; when a guard turns you away, you see the exact rule that failed.",
    url: "https://github.com/nickytonline/pomerium-quest",
    primaryLanguage: { name: "TypeScript", color: "var(--typescript)" },
    myRole: "Author & maintainer",
    fallbackStats: { stargazerCount: 1, forkCount: 0 },
    fallbackImage:
      "https://repository-images.githubusercontent.com/1432883457/ba866c8c-7793-4788-9c4c-fcf1d59a7399",
  },
  {
    owner: "nickytonline",
    name: "mcp-typescript-template",
    description:
      "Production-ready starter for building MCP servers in TypeScript. No build step needed during development, Vite for production, Vitest for testing, Pino logging, and Docker support out of the box.",
    url: "https://github.com/nickytonline/mcp-typescript-template",
    primaryLanguage: { name: "TypeScript", color: "var(--typescript)" },
    myRole: "Author & maintainer",
    links: [
      {
        label: "Blog post",
        url: "/blog/build-your-first-or-next-mcp-server-with-the-typescript-mcp-template/",
      },
    ],
    fallbackStats: { stargazerCount: 55, forkCount: 12 },
  },
  {
    owner: "pomerium",
    name: "mcp-app-typescript-template",
    description:
      "A well-architected starter for building MCP Apps with TypeScript, React widgets, the OpenAI Apps SDK, and Pomerium. Includes a Node.js server, Storybook, Vitest, and production-ready patterns.",
    url: "https://github.com/pomerium/mcp-app-typescript-template",
    primaryLanguage: { name: "TypeScript", color: "var(--typescript)" },
    myRole: "Author & maintainer",
    fallbackStats: { stargazerCount: 19, forkCount: 7 },
  },
  {
    owner: "openclaw",
    name: "openclaw",
    description:
      "Open-source personal AI assistant you run on your own devices, supporting 20+ messaging channels. I contributed the Trusted Proxy authentication mode — hardening access to the control plane UI and SSH.",
    url: "https://github.com/openclaw/openclaw",
    primaryLanguage: { name: "TypeScript", color: "var(--typescript)" },
    myRole: "Contributor",
    links: [
      { label: "Setup guide", url: "https://usepom.link/claw-guide" },
      {
        label: "AI Engineer Europe 2026 talk",
        url: "/talks/claws-out-securing-and-building-with-openclaw-ai-engineer-europe-2026",
      },
    ],
    fallbackStats: { stargazerCount: 381855, forkCount: 80092 },
  },
  {
    owner: "nickytonline",
    name: "beads-mcp",
    description:
      "A remote TypeScript MCP for Steve Yegge's Beads. Agents share an engineering backlog through eleven tools — ready, claim, handoff, and more — with JWT auth, agent skill discovery, and a containerized embedded Dolt store.",
    url: "https://github.com/nickytonline/beads-mcp",
    primaryLanguage: { name: "TypeScript", color: "var(--typescript)" },
    myRole: "Author & maintainer",
    fallbackStats: { stargazerCount: 1, forkCount: 0 },
  },
  {
    owner: "nickytonline",
    name: "dev-to-mcp",
    description:
      "A remote MCP server for the dev.to public API — no authentication required. Browse articles, search content, fetch user profiles, and pull comments from dev.to via any MCP-compatible client.",
    url: "https://github.com/nickytonline/dev-to-mcp",
    primaryLanguage: { name: "TypeScript", color: "var(--typescript)" },
    myRole: "Author & maintainer",
    links: [
      {
        label: "Blog post",
        url: "/blog/introducing-the-devto-mcp-server/",
      },
    ],
    fallbackStats: { stargazerCount: 44, forkCount: 15 },
  },
  {
    owner: "nickytonline",
    name: "clawspace",
    description:
      "Browser-based file explorer and editor for OpenClaw workspaces. Monaco editor (the same engine powering VS Code), file browsing, editing, saving, and reverting — faster than reaching for a terminal for quick workspace edits.",
    url: "https://github.com/nickytonline/clawspace",
    primaryLanguage: { name: "Astro", color: "#FF5D01" },
    myRole: "Author & maintainer",
    links: [
      {
        label: "Blog post",
        url: "/blog/clawspace-a-browser-based-file-explorer-for-openclaw/",
      },
    ],
    fallbackStats: { stargazerCount: 11, forkCount: 0 },
  },
];

export const featuredProjectRef = {
  owner: "nickytonline",
  name: "pomerium-quest",
} as const;
