import { getEmDashCollection, getEmDashEntry } from "emdash";

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

function mapLiveEntry(entry: {
  id: string;
  data: Record<string, unknown>;
}): BlogPost {
  return { id: entry.id, data: mapData(entry.data, entry.id) };
}

/** Published posts from EmDash. Public queries omit drafts. */
async function loadPosts(): Promise<BlogPost[]> {
  const collected: BlogPost[] = [];
  let cursor: string | undefined;
  for (let page = 0; page < MAX_PAGES; page++) {
    const result = await getEmDashCollection("posts", {
      limit: PAGE_SIZE,
      cursor,
    });
    if (result.error) throw result.error;
    for (const entry of result.entries) {
      collected.push(
        mapLiveEntry({
          id: entry.id,
          data: entry.data as Record<string, unknown>,
        })
      );
    }
    if (!result.nextCursor) {
      return collected.sort(
        (a, b) => b.data.date.getTime() - a.data.date.getTime()
      );
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

export async function getBlogPosts(): Promise<BlogPost[]> {
  return visiblePosts(await loadPosts());
}

export async function getBlogPost(slug: string): Promise<BlogPost | undefined> {
  const { entry, error } = await getEmDashEntry("posts", slug);
  if (error) throw error;
  if (!entry) return undefined;
  return mapLiveEntry({
    id: entry.id,
    data: entry.data as Record<string, unknown>,
  });
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
