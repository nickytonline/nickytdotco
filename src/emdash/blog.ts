import {
  getEmDashCollection,
  getEmDashEntry,
  type InferCollectionData,
} from "emdash";

type EmDashPost = InferCollectionData<"posts">;

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
  /** Public DEV article URL. The Boost on DEV button renders only when this is set. */
  dev_to_url?: string;
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

const PAGE_SIZE = 100;
const MAX_PAGES = 20;

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

function mapData(data: EmDashPost, slug: string): BlogPostData {
  const date = new Date(data.date);
  return {
    title: asString(data.title) ?? slug,
    date,
    excerpt: asString(data.excerpt),
    description: asString(data.description),
    tags: asTags(data.tags),
    cover_image:
      data.cover_image === null ? null : (asString(data.cover_image) ?? null),
    canonical_url: asString(data.canonical_url),
    dev_to_url: asString(data.dev_to_url),
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

function mapLiveEntry(entry: { id: string; data: EmDashPost }): BlogPost {
  return { id: entry.id, data: mapData(entry.data, entry.id) };
}

export interface BlogCacheHint {
  tags?: string[];
  lastModified?: Date;
}

function mergeCacheHint(
  current: BlogCacheHint,
  next: BlogCacheHint | undefined
): BlogCacheHint {
  if (!next) return current;
  const tags = [...new Set([...(current.tags ?? []), ...(next.tags ?? [])])];
  const lastModified =
    current.lastModified && next.lastModified
      ? current.lastModified > next.lastModified
        ? current.lastModified
        : next.lastModified
      : (current.lastModified ?? next.lastModified);
  return {
    ...(tags.length > 0 ? { tags } : {}),
    ...(lastModified ? { lastModified } : {}),
  };
}

/** Published posts from EmDash. Public queries omit drafts. */
async function loadPosts(): Promise<{
  posts: BlogPost[];
  cacheHint: BlogCacheHint;
}> {
  const collected: BlogPost[] = [];
  let cacheHint: BlogCacheHint = {};
  let cursor: string | undefined;
  for (let page = 0; page < MAX_PAGES; page++) {
    const result = await getEmDashCollection("posts", {
      limit: PAGE_SIZE,
      cursor,
    });
    if (result.error) throw result.error;
    cacheHint = mergeCacheHint(cacheHint, result.cacheHint);
    for (const entry of result.entries) {
      collected.push(mapLiveEntry(entry));
    }
    if (!result.nextCursor) {
      return {
        posts: collected.sort(
          (a, b) => b.data.date.getTime() - a.data.date.getTime()
        ),
        cacheHint,
      };
    }
    cursor = result.nextCursor;
  }
  throw new Error("Blog post query exceeded 2000 rows");
}

function visiblePosts(posts: BlogPost[]): BlogPost[] {
  return import.meta.env.PROD
    ? posts.filter((post) => post.data.draft !== true)
    : posts;
}

export async function getBlogListing(): Promise<{
  posts: BlogPost[];
  cacheHint: BlogCacheHint;
}> {
  const loaded = await loadPosts();
  return { posts: visiblePosts(loaded.posts), cacheHint: loaded.cacheHint };
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  return (await getBlogListing()).posts;
}

export async function getBlogPostResult(slug: string): Promise<{
  post?: BlogPost;
  cacheHint: BlogCacheHint;
}> {
  const { entry, error, cacheHint } = await getEmDashEntry("posts", slug);
  if (error) throw error;
  if (!entry) return { cacheHint: cacheHint ?? {} };
  return {
    post: mapLiveEntry(entry),
    cacheHint: cacheHint ?? {},
  };
}

export async function getBlogPost(slug: string): Promise<BlogPost | undefined> {
  return (await getBlogPostResult(slug)).post;
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
