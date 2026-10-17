import { getEmDashCollection, getEmDashEntry } from "emdash";
import seed from "../../.emdash/seed.json";

export interface BlogSeries {
  name: string;
  collection_id: number;
}

export interface PortableTextBlock {
  _type: string;
  _key?: string;
  style?: string;
  children?: Array<{ text?: string }>;
  [key: string]: unknown;
}

export interface BlogPostData {
  title: string;
  date: Date;
  excerpt?: string;
  description?: string;
  tags?: string[];
  cover_image?: string | null;
  canonical_url?: string;
  dev_to_slug: string;
  draft?: boolean;
  reading_time_minutes?: number;
  series?: BlogSeries;
  featured?: boolean;
  content: PortableTextBlock[];
}

export interface BlogPost {
  id: string;
  data: BlogPostData;
}

interface SeedEntry {
  slug?: string;
  status?: string;
  data?: Record<string, unknown>;
}

function asString(value: unknown): string | undefined {
  return typeof value === "string" && value.length > 0 ? value : undefined;
}

function asBlocks(value: unknown): PortableTextBlock[] {
  return Array.isArray(value) ? (value as PortableTextBlock[]) : [];
}

function asTags(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const tags = value.filter((tag): tag is string => typeof tag === "string");
  return tags.length > 0 ? tags : undefined;
}

function asSeries(value: unknown): BlogSeries | undefined {
  if (!value || typeof value !== "object") return undefined;
  const series = value as { name?: unknown; collection_id?: unknown };
  if (typeof series.name !== "string") return undefined;
  const collectionId = Number(series.collection_id);
  if (!Number.isFinite(collectionId)) return undefined;
  return { name: series.name, collection_id: collectionId };
}

function mapData(data: Record<string, unknown>, slug: string): BlogPostData {
  const dateValue = data.date;
  const date = new Date(
    typeof dateValue === "string" || dateValue instanceof Date ? dateValue : 0
  );
  return {
    title: asString(data.title) ?? slug,
    date,
    excerpt: asString(data.excerpt),
    description: asString(data.description),
    tags: asTags(data.tags),
    cover_image:
      data.cover_image === null ? null : (asString(data.cover_image) ?? null),
    canonical_url: asString(data.canonical_url),
    dev_to_slug: asString(data.dev_to_slug) ?? slug,
    draft: data.draft === true,
    reading_time_minutes:
      typeof data.reading_time_minutes === "number"
        ? data.reading_time_minutes
        : undefined,
    series: asSeries(data.series),
    featured: data.featured === true,
    content: asBlocks(data.content),
  };
}

function catalogPosts(): BlogPost[] {
  const entries =
    (seed as { content?: { posts?: SeedEntry[] } }).content?.posts ?? [];
  return entries
    .map((entry) => {
      const slug = entry.slug ?? "";
      if (!slug || !entry.data) return undefined;
      return {
        id: slug,
        data: mapData(entry.data, slug),
      };
    })
    .filter((post): post is BlogPost => Boolean(post))
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

const catalog = catalogPosts();

export function getBlogPosts(options?: {
  includeDrafts?: boolean;
}): BlogPost[] {
  const includeDrafts = options?.includeDrafts ?? !import.meta.env.PROD;
  return catalog.filter((post) => includeDrafts || post.data.draft !== true);
}

export function getBlogPost(slug: string): BlogPost | undefined {
  return getBlogPosts({ includeDrafts: true }).find((post) => post.id === slug);
}

function mapLiveEntry(entry: {
  id: string;
  data: Record<string, unknown>;
}): BlogPost {
  return { id: entry.id, data: mapData(entry.data, entry.id) };
}

async function livePosts(): Promise<BlogPost[] | undefined> {
  try {
    const { entries, error } = await getEmDashCollection("posts", {
      limit: 1000,
    });
    if (error || entries.length < catalog.length) return undefined;
    return entries
      .map((entry) =>
        mapLiveEntry({
          id: entry.id,
          data: entry.data as Record<string, unknown>,
        })
      )
      .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
  } catch {
    return undefined;
  }
}

/** CMS posts when the database has the full import. Otherwise the ported catalog. */
export async function getLiveBlogPosts(): Promise<BlogPost[]> {
  const live = await livePosts();
  const posts = live ?? getBlogPosts();
  return import.meta.env.PROD
    ? posts.filter((post) => post.data.draft !== true)
    : posts;
}

export async function getLiveBlogPost(
  slug: string
): Promise<BlogPost | undefined> {
  const fallback = getBlogPost(slug);
  try {
    const { entry, error } = await getEmDashEntry("posts", slug);
    if (error || !entry) return fallback;
    const live = mapLiveEntry({
      id: entry.id,
      data: entry.data as Record<string, unknown>,
    });
    if (live.data.content.length === 0) return fallback ?? live;
    return live;
  } catch {
    return fallback;
  }
}

export function headingsFor(
  post: BlogPost
): Array<{ depth: number; slug: string; text: string }> {
  return post.data.content.flatMap((block) => {
    if (block._type !== "block" || typeof block.style !== "string") return [];
    const match = /^h([1-6])$/.exec(block.style);
    if (!match) return [];
    const text = (block.children ?? [])
      .map((child) => child.text ?? "")
      .join("")
      .trim();
    if (!text) return [];
    const slug = text
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s-]/gu, "")
      .trim()
      .replace(/\s+/g, "-");
    return [{ depth: Number(match[1]), slug, text }];
  });
}
