import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";

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

function hasYouTubeVideoId(value: string): boolean {
  try {
    const url = new URL(value);
    const hostname = url.hostname.toLowerCase().replace(/^www\./, "");
    const videoId =
      hostname === "youtu.be"
        ? url.pathname.split("/").filter(Boolean)[0]
        : hostname === "youtube.com" || hostname === "m.youtube.com"
          ? (url.searchParams.get("v") ??
            url.pathname.split("/").filter(Boolean).pop())
          : undefined;

    return Boolean(videoId && /^[A-Za-z0-9_-]{11}$/.test(videoId));
  } catch {
    return false;
  }
}

function hasVimeoVideoId(value: string): boolean {
  try {
    const url = new URL(value);
    const hostname = url.hostname.toLowerCase();
    return (
      (hostname === "vimeo.com" || hostname.endsWith(".vimeo.com")) &&
      /\/\d+(?:\/|$)/.test(url.pathname)
    );
  } catch {
    return false;
  }
}

const videoSchema = z
  .object({
    url: z.url(),
    type: z.enum(["youtube", "vimeo", "custom"]),
    image: z
      .object({
        url: urlOrRelative,
        width: z.number(),
        height: z.number(),
      })
      .optional(),
  })
  .superRefine((video, ctx) => {
    if (video.type === "youtube" && !hasYouTubeVideoId(video.url)) {
      ctx.addIssue({
        code: "custom",
        path: ["url"],
        message: "YouTube videos must include a valid 11-character video ID",
      });
    }

    if (video.type === "vimeo" && !hasVimeoVideoId(video.url)) {
      ctx.addIssue({
        code: "custom",
        path: ["url"],
        message: "Vimeo videos must include a numeric video ID",
      });
    }

    if (video.type === "custom" && !video.image) {
      ctx.addIssue({
        code: "custom",
        path: ["image"],
        message: "Custom videos must include a preview image",
      });
    }
  });

const talksCollection = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "src/content/talks" }),
  schema: z.object({
    title: z.string(),
    date: z.date(),
    endDate: z.date().optional(),
    upcoming: z.boolean().optional(),
    video: videoSchema.optional(),
    /** Past talk whose recording is not published yet. */
    videoComingSoon: z.boolean().optional(),
    venue: z.object({
      name: z.string(),
      url: urlOrRelative.optional(),
      location: z.string().optional(),
    }),
    tags: z.array(z.string()),
    cover_image: z.string().optional(),
    cover_image_large: z.string().optional(),
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
    sessionUrl: urlOrRelative.optional(),
    registrationUrl: urlOrRelative.optional(),
    featured: z.boolean().optional(),
    promo: z.string().optional(),
  }),
});

const guidesCollection = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "src/content/guides" }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    description: z.string(),
    url: z.url(),
    cover_image: z.string().optional(),
    source: z.string(),
    tags: z.array(z.string()).optional(),
    featured: z.boolean().optional(),
  }),
});

export const collections = {
  talks: talksCollection,
  guides: guidesCollection,
};
