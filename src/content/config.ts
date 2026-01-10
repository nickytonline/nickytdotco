import { z, defineCollection } from "astro:content";

/**
 * A Zod schema that validates a string is either an absolute URL or a relative path.
 */
const urlOrRelative = z
  .string()
  .min(1)
  .refine(
    (value) => {
      try {
        new URL(value, "https://example.com");
        return true;
      } catch {
        return false;
      }
    },
    {
      message: "Must be an absolute URL or relative path",
    }
  );

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

const talksCollection = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    date: z.date(),
    video: z
      .object({
        url: z.string().url(),
        type: z.enum(["youtube", "vimeo", "custom"]),
        image: z
          .object({
            url: urlOrRelative,
            width: z.number(),
            height: z.number(),
          })
          .optional(),
      })
      .optional(),
    venue: z.object({
      name: z.string(),
      url: urlOrRelative.optional(),
    }),
    tags: z.array(z.string()),
    slideDeck: urlOrRelative.optional(),
    sourceCode: urlOrRelative.optional(),
    additionalLinks: z
      .array(
        z.object({
          title: z.string(),
          url: urlOrRelative,
        })
      )
      .optional(),
  }),
});

export const collections = {
  blog: blogCollection,
  talks: talksCollection,
};
