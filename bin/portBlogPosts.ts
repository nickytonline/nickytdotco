import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parse as parseYaml } from "yaml";
import { mdxBodyToPortableText } from "../src/emdash/mdx-to-portable-text.ts";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const postsDirectory = path.join(root, "src/content/blog");
const seedPath = path.join(root, ".emdash/seed.json");

interface Frontmatter {
  title?: string;
  date?: string | Date;
  excerpt?: string;
  description?: string;
  tags?: string[];
  cover_image?: string | null;
  canonical_url?: string;
  dev_to_slug?: string;
  draft?: boolean;
  reading_time_minutes?: number;
  series?: { name?: string; collection_id?: number };
  featured?: boolean;
}

function splitFrontmatter(source: string): {
  frontmatter: Frontmatter;
  body: string;
} {
  if (!source.startsWith("---\n")) {
    return { frontmatter: {}, body: source };
  }
  const end = source.indexOf("\n---\n", 4);
  if (end === -1) return { frontmatter: {}, body: source };
  const raw = source.slice(4, end);
  const body = source.slice(end + 5);
  const parsed = parseYaml(raw);
  return {
    frontmatter:
      parsed && typeof parsed === "object" ? (parsed as Frontmatter) : {},
    body,
  };
}

const files = (await readdir(postsDirectory)).filter((file) =>
  file.endsWith(".mdx")
);
const unknownComponents = new Map<string, number>();
const posts = [];

for (const file of files.sort()) {
  const slug = file.replace(/\.mdx$/, "");
  const source = await readFile(path.join(postsDirectory, file), "utf8");
  const { frontmatter, body } = splitFrontmatter(source);
  if (!frontmatter.title) {
    console.warn(`Skipping ${file}: missing title`);
    continue;
  }
  const date = new Date(frontmatter.date ?? 0);
  const content = mdxBodyToPortableText(body);
  for (const match of body.matchAll(/<([A-Z][A-Za-z0-9]*)\b/g)) {
    const name = match[1];
    if (
      ![
        "Embed",
        "CodePenEmbed",
        "CodeSandboxEmbed",
        "DevLinkEmbed",
        "GenericEmbed",
        "GitHubEmbed",
        "InstagramEmbed",
        "SpotifyEmbed",
        "TwitchEmbed",
        "TwitterEmbed",
        "VimeoEmbed",
        "YouTubeEmbed",
      ].includes(name)
    ) {
      unknownComponents.set(name, (unknownComponents.get(name) ?? 0) + 1);
    }
  }

  posts.push({
    id: slug,
    slug,
    status: frontmatter.draft ? "draft" : "published",
    data: {
      title: frontmatter.title,
      excerpt: frontmatter.excerpt,
      description: frontmatter.description,
      date: Number.isNaN(date.getTime()) ? undefined : date.toISOString(),
      tags: frontmatter.tags,
      cover_image: frontmatter.cover_image ?? null,
      canonical_url: frontmatter.canonical_url,
      dev_to_slug: frontmatter.dev_to_slug ?? slug,
      draft: frontmatter.draft === true,
      reading_time_minutes: frontmatter.reading_time_minutes,
      series: frontmatter.series,
      featured: frontmatter.featured === true,
      content,
    },
  });
}

const seed = JSON.parse(await readFile(seedPath, "utf8")) as {
  meta?: { description?: string };
  collections?: Array<Record<string, unknown>>;
  content?: unknown;
};
const collection = seed.collections?.[0];
if (!collection || collection.slug !== "posts") {
  throw new Error(
    "Expected the EmDash seed to start with the posts collection"
  );
}
collection.urlPattern = "/blog/{slug}";
collection.dateField = "date";
collection.fields = [
  {
    slug: "title",
    label: "Title",
    type: "string",
    required: true,
    searchable: true,
  },
  { slug: "excerpt", label: "Excerpt", type: "text", searchable: true },
  { slug: "description", label: "Description", type: "text" },
  {
    slug: "date",
    label: "Date",
    type: "datetime",
    required: true,
    indexed: true,
  },
  { slug: "tags", label: "Tags", type: "json" },
  { slug: "cover_image", label: "Cover image", type: "string" },
  { slug: "canonical_url", label: "Canonical URL", type: "url" },
  { slug: "dev_to_slug", label: "dev.to slug", type: "string" },
  {
    slug: "reading_time_minutes",
    label: "Reading time (minutes)",
    type: "number",
  },
  { slug: "series", label: "Series", type: "json" },
  { slug: "featured", label: "Featured", type: "boolean" },
  { slug: "draft", label: "Draft", type: "boolean" },
  {
    slug: "content",
    label: "Content",
    type: "portableText",
    searchable: true,
  },
];
seed.meta = {
  ...seed.meta,
  description:
    "Blog posts ported from src/content/blog. Public URLs stay /blog/{slug}.",
};
seed.content = { posts };

await writeFile(seedPath, `${JSON.stringify(seed, null, 2)}\n`);
console.log(`Ported ${posts.length} posts into ${seedPath}`);
if (unknownComponents.size > 0) {
  console.log("Non-media components left in the markdown:");
  for (const [name, count] of unknownComponents) {
    console.log(`  ${name}: ${count}`);
  }
}
