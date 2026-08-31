import { describe, expect, it, vi } from "vitest";
import { curatedProjects } from "../../data/curated-projects";
import {
  enrichCuratedProjects,
  toFeaturedProject,
} from "./enrichCuratedProjects";

describe("enrichCuratedProjects", () => {
  it("merges live GitHub stats with curated project copy", async () => {
    const fetch = vi.fn(async () =>
      Response.json({
        data: {
          repo0: {
            stargazerCount: 99,
            forkCount: 21,
            primaryLanguage: { name: "TypeScript", color: "#3178c6" },
          },
        },
      })
    );

    const [project] = await enrichCuratedProjects([curatedProjects[0]!], {
      fetch,
      githubToken: "ghp_test",
    });

    expect(fetch).toHaveBeenCalledOnce();
    expect(project.stargazerCount).toBe(99);
    expect(project.forkCount).toBe(21);
    expect(project.description).toContain("Production-ready starter");
    expect(project.primaryLanguage).toEqual({
      name: "TypeScript",
      color: "var(--typescript)",
    });
  });

  it("falls back to cached stats when GitHub is unavailable", async () => {
    const fetch = vi.fn(async () => {
      throw new Error("network down");
    });

    const [project] = await enrichCuratedProjects([curatedProjects[0]!], {
      fetch,
      githubToken: "ghp_test",
    });

    expect(project.stargazerCount).toBe(55);
    expect(project.forkCount).toBe(12);
  });
});

describe("toFeaturedProject", () => {
  it("uses homepage-specific copy when present", () => {
    const featured = toFeaturedProject(curatedProjects[0]!, {
      stargazerCount: 77,
      forkCount: 8,
    });

    expect(featured.description).toContain("with Vite, Vitest, Pino logging");
    expect(featured.links?.[0]?.label).toBe("Read the build story");
    expect(featured.stargazerCount).toBe(77);
  });
});
