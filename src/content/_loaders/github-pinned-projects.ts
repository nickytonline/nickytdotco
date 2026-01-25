import type { LiveLoader } from "astro/loaders";
import { ENV } from "varlock/env";

export type GitHubPinnedProject = {
  owner: string;
  name: string;
  description: string;
  url: string;
  stargazerCount: number;
  forkCount: number;
  primaryLanguage?: {
    name: string;
    color: string;
  } | null;
};

interface GQLOwner {
  login: string;
}

interface GQLPrimaryLanguage {
  name: string;
  color: string;
}

interface GQLRepository {
  __typename: "Repository";
  owner: GQLOwner;
  name: string;
  description: string;
  url: string;
  stargazerCount: number;
  forkCount: number;
  primaryLanguage?: GQLPrimaryLanguage | null;
}

interface GQLGist {
  __typename: "Gist";
  owner: GQLOwner;
  description: string;
  url: string;
  stargazerCount: number;
}

type GQLPinnedItem = GQLRepository | GQLGist;

interface GraphQLResponse {
  data: {
    user?: {
      pinnedItems: {
        nodes: (GQLPinnedItem | null)[];
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
          __typename
          ... on Repository {
            owner {
              login
            }
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
            owner {
              login
            }
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
  const response = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${ENV.GITHUB_TOKEN}`,
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
    .filter((node): node is GQLPinnedItem => node !== null)
    .map((node): GitHubPinnedProject => {
      if (node.__typename === "Repository") {
        return {
          owner: node.owner.login,
          name: node.name,
          description: node.description,
          url: node.url,
          stargazerCount: node.stargazerCount,
          forkCount: node.forkCount,
          primaryLanguage: node.primaryLanguage,
        };
      }

      // If it's a Gist
      return {
        owner: node.owner.login,
        name: node.description || "Pinned Gist",
        description: node.description || "No description provided.",
        url: node.url,
        stargazerCount: node.stargazerCount,
        forkCount: 0,
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
