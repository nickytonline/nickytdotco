import { defineLiveCollection, z } from "astro:content";

import { streamScheduleLoader } from "./content/loaders/stream-schedule";
import { newsletterLoader } from "./content/loaders/newsletter";
import { githubPinnedProjectsLoader } from "./content/loaders/github-pinned-projects";

const streamSchedule = defineLiveCollection({
  loader: streamScheduleLoader,
  schema: z.object({
    type: z.enum(["nickyt.live", "pomerium-live"]),
    date: z.string().min(1),
    title: z.string().min(1),
    description: z.string().min(1),
    guestName: z.string().min(1),
    guestTitle: z.string().optional(),
    youtubeStreamLink: z.string().url().optional(),
    linkedinStreamLink: z.string().url().optional(),
    twitter: z.string().optional(),
    youtube: z.string().optional(),
    twitch: z.string().optional(),
    github: z.string().optional(),
    bluesky: z.string().optional(),
    website: z.string().url().optional(),
    ogImageURL: z.string().url().optional(),
    linkedin: z.string().optional(),
  }),
});

const newsletter = defineLiveCollection({
  loader: newsletterLoader,
  schema: z.object({
    title: z.string().min(1),
    link: z.string().url(),
    description: z.string(),
    date: z.string(),
  }),
});

const pinnedProjects = defineLiveCollection({
  loader: githubPinnedProjectsLoader,
  schema: z.object({
    name: z.string(),
    description: z.string(),
    url: z.string().url(),
    stargazerCount: z.number(),
    forkCount: z.number(),
    primaryLanguage: z
      .object({
        name: z.string(),
        color: z.string(),
      })
      .nullable()
      .optional(),
  }),
});

export const collections = {
  streamSchedule,
  newsletter,
  pinnedProjects,
};
