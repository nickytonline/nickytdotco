import type { LiveLoader } from "astro/loaders";

export type GitHubPinnedProject = {
  name: string;
  description: string;
  url: string;
  stargazerCount: number;
  forkCount: number;
  primaryLanguage?: {
    name: string;
    color: string;
  } | null;
} & Record<string, unknown>;

interface GraphQLResponse {
  data: {
    user?: {
      pinnedItems: {
        nodes: (GitHubPinnedProject | null | Record<string, unknown>)[];
      };
    };
  };
  errors?: Array<{ message: string }>;
}

const PINNED_PROJECTS_QUERY = `
  query getPinnedProjects($login: String!) {
    user(login: $login) {
      pinnedItems(first: 10) {
        nodes {
          ... on Repository {
            name
            description
            url
            stargazerCount
            forkCount
            primaryLanguage {
              name
              color
            }
          }
          ... on Gist {
            description
            url
            stargazerCount: stargazerCount
          }
        }
      }
    }
  }
`;

async function fetchPinnedProjects(): Promise<GitHubPinnedProject[]> {
  const token = import.meta.env.GITHUB_TOKEN;
  if (!token) {
    throw new Error("Missing GITHUB_TOKEN environment variable.");
  }

  const response = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      query: PINNED_PROJECTS_QUERY,
      variables: { login: "nickytonline" },
    }),
  });

  if (!response.ok) {
    throw new Error(
      `GitHub GraphQL request failed: ${response.status} ${response.statusText}`
    );
  }

  const json = (await response.json()) as GraphQLResponse;

  if (json.errors) {
    console.warn(
      `GitHub GraphQL partial error: ${json.errors.map((e) => e.message).join(", ")}`
    );
  }

  if (!json.data?.user) {
    if (json.errors) {
      throw new Error(`GitHub GraphQL error: ${json.errors[0].message}`);
    }
    throw new Error(
      "Could not find GitHub user data. Check your GITHUB_TOKEN and username."
    );
  }

  // Filter out any empty objects or nulls that might come back
  return (json.data.user.pinnedItems.nodes || [])
    .filter(
      (node): node is GitHubPinnedProject | Record<string, unknown> => !!node
    )
    .map((node): GitHubPinnedProject => {
      // If it's a Repository, it will have a 'name' field
      if ("name" in node && typeof node.name === "string") {
        return node as GitHubPinnedProject;
      }

      // If it's a Gist, 'name' is missing, so we derive it from description
      // and ensure other required fields exist for the interface
      const gist = node as Record<string, unknown>;
      return {
        name: (gist.description as string) || "Pinned Gist",
        description: (gist.description as string) || "No description provided.",
        url: (gist.url as string) || "",
        stargazerCount: (gist.stargazerCount as number) || 0,
        forkCount: 0, // Gist forks aren't as easily accessible in this query
        primaryLanguage: null,
      };
    });
}

export const githubPinnedProjectsLoader: LiveLoader<
  GitHubPinnedProject,
  { id: string }
> = {
  name: "github-pinned-projects",
  async loadCollection() {
    try {
      const projects = await fetchPinnedProjects();
      return {
        entries: projects.map((project) => ({
          id: project.name,
          data: project,
        })),
      };
    } catch (error) {
      return {
        entries: [],
        error: error instanceof Error ? error : new Error(String(error)),
      };
    }
  },
  async loadEntry({ filter }) {
    if (!filter?.id) {
      return { error: new Error("Missing project id filter.") };
    }

    try {
      const projects = await fetchPinnedProjects();
      const project = projects.find((p) => p.name === filter.id);

      if (!project) {
        return { error: new Error(`Project not found: ${filter.id}`) };
      }

      return {
        id: project.name,
        data: project,
      };
    } catch (error) {
      return {
        error: error instanceof Error ? error : new Error(String(error)),
      };
    }
  },
};
