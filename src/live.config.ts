import { defineLiveCollection, z } from "astro:content";

import { streamScheduleLoader } from "./content/loaders/stream-schedule";

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

export const collections = {
  streamSchedule,
};
