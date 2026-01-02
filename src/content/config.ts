import { z, defineCollection } from "astro:content";

const blogCollection = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    excerpt: z.string().optional(),
    description: z.string().optional(),
    tags: z.array(z.string()).optional(),
    cover_image: z.string().optional().nullable(),
    canonical_url: z.string().url().optional(),
    draft: z.boolean().optional(),
    reading_time_minutes: z.number().optional(),
    template: z.string().optional(),
    series: z
      .object({
        name: z.string(),
        collection_id: z.number(),
      })
      .optional(),
  }),
});

export const collections = {
  blog: blogCollection,
};
