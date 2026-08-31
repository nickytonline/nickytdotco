import { ENV } from "varlock/env";

export interface RepositoryRef {
  owner: string;
  name: string;
}

export interface RepositoryStats {
  stargazerCount: number;
  forkCount: number;
  primaryLanguage?: { name: string; color: string } | null;
}

interface GraphQLRepository {
  stargazerCount: number;
  forkCount: number;
  primaryLanguage?: { name: string; color: string } | null;
}

interface GraphQLResponse {
  data?: Record<string, GraphQLRepository | null>;
  errors?: Array<{ message: string }>;
}

function repositoryKey(owner: string, name: string): string {
  return `${owner}/${name}`;
}

function buildStatsQuery(repositories: RepositoryRef[]): string {
  const fields = repositories
    .map(
      (repo, index) => `
    repo${index}: repository(owner: ${JSON.stringify(repo.owner)}, name: ${JSON.stringify(repo.name)}) {
      stargazerCount
      forkCount
      primaryLanguage {
        name
        color
      }
    }`
    )
    .join("\n");

  return `query FetchRepositoryStats {${fields}\n}`;
}

export async function fetchRepositoryStats(
  repositories: RepositoryRef[],
  deps: {
    fetch?: typeof globalThis.fetch;
    githubToken?: string;
  } = {}
): Promise<Map<string, RepositoryStats>> {
  const stats = new Map<string, RepositoryStats>();

  if (repositories.length === 0) {
    return stats;
  }

  const fetchImpl = deps.fetch ?? fetch;
  const githubToken = deps.githubToken ?? ENV.GITHUB_TOKEN;

  const response = await fetchImpl("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${githubToken}`,
    },
    body: JSON.stringify({ query: buildStatsQuery(repositories) }),
  });

  if (!response.ok) {
    throw new Error(
      `GitHub GraphQL request failed: ${response.status} ${response.statusText}`
    );
  }

  const json = (await response.json()) as GraphQLResponse;

  if (json.errors?.length) {
    console.warn(
      `GitHub GraphQL partial error: ${json.errors.map((error) => error.message).join(", ")}`
    );
  }

  if (!json.data) {
    throw new Error("GitHub GraphQL response did not include repository data.");
  }

  for (const [index, repo] of repositories.entries()) {
    const node = json.data[`repo${index}`];
    if (!node) {
      continue;
    }

    stats.set(repositoryKey(repo.owner, repo.name), {
      stargazerCount: node.stargazerCount,
      forkCount: node.forkCount,
      primaryLanguage: node.primaryLanguage,
    });
  }

  return stats;
}
