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
}

export const curatedProjects: CuratedProjectBase[] = [
  {
    owner: "nickytonline",
    name: "mcp-typescript-template",
    description:
      "Production-ready starter for building MCP servers in TypeScript. No build step needed during development, Vite for production, Vitest for testing, Pino logging, and Docker support out of the box.",
    featuredDescription:
      "Production-ready starter for building MCP servers in TypeScript, with Vite, Vitest, Pino logging, and Docker support out of the box.",
    url: "https://github.com/nickytonline/mcp-typescript-template",
    primaryLanguage: { name: "TypeScript", color: "var(--typescript)" },
    myRole: "Author & maintainer",
    links: [
      {
        label: "Blog post",
        url: "/blog/build-your-first-or-next-mcp-server-with-the-typescript-mcp-template/",
      },
    ],
    featuredLinks: [
      {
        label: "Read the build story",
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
    owner: "pomerium",
    name: "mcp-app-demo",
    description:
      "A full chat client that started as a demo for securing MCP servers with Pomerium and grew into a real application. Supports multiple MCP servers with Zero Trust access control. Used internally and at conference demos.",
    url: "https://github.com/pomerium/mcp-app-demo",
    primaryLanguage: { name: "TypeScript", color: "var(--typescript)" },
    myRole: "Author & maintainer",
    fallbackStats: { stargazerCount: 51, forkCount: 7 },
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
  name: "mcp-typescript-template",
} as const;
