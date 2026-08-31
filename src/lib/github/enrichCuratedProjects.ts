import type { CuratedProjectBase } from "../../data/curated-projects";
import {
  fetchRepositoryStats,
  type RepositoryRef,
  type RepositoryStats,
} from "./fetchRepositoryStats";

export interface EnrichedProject {
  owner: string;
  name: string;
  description: string;
  url: string;
  stargazerCount: number;
  forkCount: number;
  primaryLanguage?: { name: string; color: string } | null;
  myRole?: string;
  links?: CuratedProjectBase["links"];
}

function repositoryKey(owner: string, name: string): string {
  return `${owner}/${name}`;
}

export async function enrichCuratedProjects(
  projects: CuratedProjectBase[],
  deps: {
    fetch?: typeof globalThis.fetch;
    githubToken?: string;
  } = {}
): Promise<EnrichedProject[]> {
  const repositories: RepositoryRef[] = projects.map((project) => ({
    owner: project.owner,
    name: project.name,
  }));

  let statsByRepo = new Map<string, RepositoryStats>();

  try {
    statsByRepo = await fetchRepositoryStats(repositories, deps);
  } catch (error) {
    console.warn(
      "Could not fetch GitHub repository stats; using fallback values where available.",
      error
    );
  }

  return projects.map((project) => {
    const stats = statsByRepo.get(repositoryKey(project.owner, project.name));
    const fallback = project.fallbackStats;

    return {
      owner: project.owner,
      name: project.name,
      description: project.description,
      url: project.url,
      myRole: project.myRole,
      links: project.links,
      stargazerCount: stats?.stargazerCount ?? fallback?.stargazerCount ?? 0,
      forkCount: stats?.forkCount ?? fallback?.forkCount ?? 0,
      primaryLanguage:
        project.primaryLanguage ?? stats?.primaryLanguage ?? null,
    };
  });
}

export function toFeaturedProject(
  project: CuratedProjectBase,
  stats: Pick<EnrichedProject, "stargazerCount" | "forkCount">
): EnrichedProject {
  return {
    owner: project.owner,
    name: project.name,
    description: project.featuredDescription ?? project.description,
    url: project.url,
    myRole: project.myRole,
    links: project.featuredLinks ?? project.links,
    stargazerCount: stats.stargazerCount,
    forkCount: stats.forkCount,
    primaryLanguage: project.primaryLanguage ?? null,
  };
}
