#!/usr/bin/env node
import "dotenv/config";

import { JSDOM } from "jsdom";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs/promises";
import { readFileSync } from "fs";
import yaml from "js-yaml";
import siteData from "../src/data/site.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Safely extracts error message from unknown error
 */
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

/**
 * Type guard for series names object
 */
function isSeriesNamesObject(value: unknown): value is Record<number, string> {
  if (!value || typeof value !== "object") return false;
  return Object.entries(value).every(
    ([key, val]) => !isNaN(Number(key)) && typeof val === "string",
  );
}

const { DEV_API_KEY } = process.env;
const SLUG_INCLUSION_LIST: string[] = JSON.parse(
  readFileSync(path.join(__dirname, "slugInclusionList.json"), "utf-8"),
);

const { url: siteUrl } = siteData;
const DEV_TO_API_URL = "https://dev.to/api";

const SERIES_MAP_PATH = path.join(__dirname, "series-names.js");

let SERIES_NAMES: Record<number, string> = {};
try {
  const seriesModule = await import(SERIES_MAP_PATH);
  if (seriesModule?.default && isSeriesNamesObject(seriesModule.default)) {
    SERIES_NAMES = seriesModule.default;
  }
} catch (_e) {
  SERIES_NAMES = {};
}

interface ConversionResult {
  content: string;
  imports: string[];
}

interface DevToOrganization {
  username: string;
}

interface DevToPost {
  id: number;
  title: string;
  description: string;
  published: boolean;
  published_at: string;
  slug: string;
  published_timestamp: string;
  body_markdown: string;
  body_html?: string;
  cover_image: string | null;
  tag_list: string[] | string;
  reading_time_minutes: number;
  canonical_url: string;
  collection_id?: number;
  organization?: DevToOrganization;
  comments_count?: number;
  public_reactions_count?: number;
  positive_reactions_count?: number;
}

interface PostFrontmatter {
  title: string;
  excerpt: string;
  date: string;
  tags: string[];
  cover_image: string | null;
  canonical_url: string;
  reading_time_minutes: number;
  template: string;
  series?: {
    name: string;
    collection_id: number;
  };
}

/**
 * Convert DEV.to liquid tags to Astro component syntax
 */
function convertLiquidTagsToAstroComponents(content: string): ConversionResult {
  let newContent = content;
  const imports = new Set<string>();

  // YouTube: {% youtube "videoId" %} or {% youtube videoId %} or {% youtube "videoId", "startTime" %}
  newContent = newContent.replace(
    /{%\s*youtube\s+"?([^"\s,]+)"?(?:,\s+"?([^"\s]+)"?)?\s*%}/g,
    (_match, videoId: string, startTime?: string) => {
      imports.add(
        'import YouTubeEmbed from "@/components/embeds/YouTubeEmbed.astro";',
      );
      return startTime
        ? `<YouTubeEmbed videoId="${videoId}" startTime="${startTime}" />`
        : `<YouTubeEmbed videoId="${videoId}" />`;
    },
  );

  // Twitter/X: {% twitter "tweetId" %} or {% twitter tweetId %} or {% x "tweetId" %} or {% x tweetId %}
  newContent = newContent.replace(
    /{%\s*(twitter|x)\s+"?([^"\s]+)"?\s*%}/g,
    (_match, _type: string, tweetId: string) => {
      imports.add(
        'import TwitterEmbed from "@/components/embeds/TwitterEmbed.astro";',
      );
      return `<TwitterEmbed tweetId="${tweetId}" />`;
    },
  );

  // CodePen: {% codepen "url" %} or {% codepen url %}
  newContent = newContent.replace(
    /{%\s*codepen\s+"?([^"\s]+)"?\s*%}/g,
    (_match, url) => {
      imports.add(
        'import CodePenEmbed from "@/components/embeds/CodePenEmbed.astro";',
      );
      return `<CodePenEmbed url="${url}" />`;
    },
  );

  // GitHub: {% github "url" %} or {% github url %}
  newContent = newContent.replace(
    /{%\s*github\s+"?([^"\s]+)"?\s*%}/g,
    (_match, url) => {
      imports.add(
        'import GitHubEmbed from "@/components/embeds/GitHubEmbed.astro";',
      );
      return `<GitHubEmbed url="${url}" />`;
    },
  );

  // Generic embed: {% embed "url" %} or {% embed url %}
  newContent = newContent.replace(
    /{%\s*embed\s+"?([^"\s]+)"?\s*%}/g,
    (_match, url) => {
      imports.add('import Embed from "@/components/Embed.astro";');
      return `<Embed url="${url}" />`;
    },
  );

  // Dev.to link: {% link "url" %} or {% link url %}
  newContent = newContent.replace(
    /{%\s*link\s+"?([^"\s]+)"?\s*%}/g,
    (_match, url) => {
      imports.add(
        'import DevLinkEmbed from "@/components/embeds/DevLinkEmbed.astro";',
      );
      return `<DevLinkEmbed url="${url}" />`;
    },
  );

  // Twitch: {% twitch "videoId" %} or {% twitch videoId %}
  newContent = newContent.replace(
    /{%\s*twitch\s+"?([^"\s]+)"?\s*%}/g,
    (_match, videoId) => {
      imports.add(
        'import TwitchEmbed from "@/components/embeds/TwitchEmbed.astro";',
      );
      return `<TwitchEmbed videoId="${videoId}" />`;
    },
  );

  // Vimeo: {% vimeo "videoId" %} or {% vimeo videoId %}
  newContent = newContent.replace(
    /{%\s*vimeo\s+"?([^"\s]+)"?\s*%}/g,
    (_match, videoId) => {
      imports.add(
        'import VimeoEmbed from "@/components/embeds/VimeoEmbed.astro";',
      );
      return `<VimeoEmbed videoId="${videoId}" />`;
    },
  );

  // Spotify: {% spotify "uri" %} or {% spotify uri %}
  newContent = newContent.replace(
    /{%\s*spotify\s+"?([^"\s]+)"?\s*%}/g,
    (_match, uri) => {
      imports.add(
        'import SpotifyEmbed from "@/components/embeds/SpotifyEmbed.astro";',
      );
      return `<SpotifyEmbed uri="${uri}" />`;
    },
  );

  // CodeSandbox: {% codesandbox "sandboxId" %} or {% codesandbox sandboxId %}
  newContent = newContent.replace(
    /{%\s*codesandbox\s+"?([^"\s]+)"?\s*%}/g,
    (_match, sandboxId) => {
      imports.add(
        'import CodeSandboxEmbed from "@/components/embeds/CodeSandboxEmbed.astro";',
      );
      return `<CodeSandboxEmbed sandboxId="${sandboxId}" />`;
    },
  );

  // Instagram: {% instagram "url" %} or {% instagram url %}
  newContent = newContent.replace(
    /{%\s*instagram\s+"?([^"\s]+)"?\s*%}/g,
    (_match, url) => {
      imports.add(
        'import InstagramEmbed from "@/components/embeds/InstagramEmbed.astro";',
      );
      return `<InstagramEmbed url="${url}" />`;
    },
  );

  // ::youtube{videoId="..." startTime="..."}
  newContent = newContent.replace(
    /::youtube\{videoId="([^"]+)"(?:\s+startTime="([^"]+)")?\}/g,
    (_match, videoId, startTime) => {
      imports.add(
        'import YouTubeEmbed from "@/components/embeds/YouTubeEmbed.astro";',
      );
      return startTime
        ? `<YouTubeEmbed videoId="${videoId}" startTime="${startTime}" />`
        : `<YouTubeEmbed videoId="${videoId}" />`;
    },
  );

  // ::twitter{tweetId="..."} or ::x{tweetId="..."}
  newContent = newContent.replace(
    /::(twitter|x)\{tweetId="([^"]+)"\}/g,
    (_match, _type, tweetId) => {
      imports.add(
        'import TwitterEmbed from "@/components/embeds/TwitterEmbed.astro";',
      );
      return `<TwitterEmbed tweetId="${tweetId}" />`;
    },
  );

  // ::codepen{url="..."}
  newContent = newContent.replace(
    /::codepen\{url="([^"]+)"\}/g,
    (_match, url) => {
      imports.add(
        'import CodePenEmbed from "@/components/embeds/CodePenEmbed.astro";',
      );
      return `<CodePenEmbed url="${url}" />`;
    },
  );

  // ::github{url="..."}
  newContent = newContent.replace(
    /::github\{url="([^"]+)"\}/g,
    (_match, url) => {
      imports.add(
        'import GitHubEmbed from "@/components/embeds/GitHubEmbed.astro";',
      );
      return `<GitHubEmbed url="${url}" />`;
    },
  );

  // ::embed{url="..."}
  newContent = newContent.replace(
    /::embed\{url="([^"]+)"\}/g,
    (_match, url) => {
      imports.add(
        'import GenericEmbed from "@/components/embeds/GenericEmbed.astro";',
      );
      return `<GenericEmbed url="${url}" />`;
    },
  );

  // ::link{url="..."}
  newContent = newContent.replace(/::link\{url="([^"]+)"\}/g, (_match, url) => {
    imports.add(
      'import DevLinkEmbed from "@/components/embeds/DevLinkEmbed.astro";',
    );
    return `<DevLinkEmbed url="${url}" />`;
  });

  // ::twitch{videoId="..."}
  newContent = newContent.replace(
    /::twitch\{videoId="([^"]+)"\}/g,
    (_match, videoId) => {
      imports.add(
        'import TwitchEmbed from "@/components/embeds/TwitchEmbed.astro";',
      );
      return `<TwitchEmbed videoId="${videoId}" />`;
    },
  );

  // ::vimeo{videoId="..."}
  newContent = newContent.replace(
    /::vimeo\{videoId="([^"]+)"\}/g,
    (_match, videoId) => {
      imports.add(
        'import VimeoEmbed from "@/components/embeds/VimeoEmbed.astro";',
      );
      return `<VimeoEmbed videoId="${videoId}" />`;
    },
  );

  // ::spotify{uri="..."}
  newContent = newContent.replace(
    /::spotify\{uri="([^"]+)"\}/g,
    (_match, uri) => {
      imports.add(
        'import SpotifyEmbed from "@/components/embeds/SpotifyEmbed.astro";',
      );
      return `<SpotifyEmbed uri="${uri}" />`;
    },
  );

  // ::codesandbox{sandboxId="..."}
  newContent = newContent.replace(
    /::codesandbox\{sandboxId="([^"]+)"\}/g,
    (_match, sandboxId) => {
      imports.add(
        'import CodeSandboxEmbed from "@/components/embeds/CodeSandboxEmbed.astro";',
      );
      return `<CodeSandboxEmbed sandboxId="${sandboxId}" />`;
    },
  );

  // ::instagram{url="..."}
  newContent = newContent.replace(
    /::instagram\{url="([^"]+)"\}/g,
    (_match, url) => {
      imports.add(
        'import InstagramEmbed from "@/components/embeds/InstagramEmbed.astro";',
      );
      return `<InstagramEmbed url="${url}" />`;
    },
  );

  return {
    content: newContent,
    imports: Array.from(imports),
  };
}

/**
 * Decodes HTML entities in a string.
 * @param text - Text with HTML entities
 * @returns Decoded text
 */
function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(Number(dec)))
    .replace(/&#x([0-9A-Fa-f]+);/g, (_, hex) =>
      String.fromCharCode(parseInt(hex, 16)),
    )
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, "&");
}

/**
 * Fetches series name from dev.to series page and persists the mapping.
 * Uses native Node.js fetch (v18+).
 *
 * @param collectionId - The dev.to collection ID
 * @param fallbackTitle - Fallback title (e.g., article title) if fetch fails
 * @param username - dev.to username
 * @returns Series name
 */
async function getOrFetchSeriesName(
  collectionId: number,
  fallbackTitle: string,
  username = "nickytonline",
): Promise<string> {
  // Return cached/mapped value if available
  if (SERIES_NAMES[collectionId]) {
    return SERIES_NAMES[collectionId];
  }

  // Fetch the series page from dev.to
  const url = `https://dev.to/${username}/series/${collectionId}`;
  try {
    const resp = await fetchWithRetry(url);
    if (!resp.ok) {
      console.warn(
        `  ⚠️  Could not fetch series page for ID ${collectionId} (status ${resp.status}).`,
      );
      return fallbackTitle || `Series ${collectionId}`;
    }
    const html = await resp.text();
    // Parse the <h1> which contains the series name
    const match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
    let title = match ? match[1].trim() : null;

    // Remove any nested HTML tags from title
    if (title) {
      // Use JSDOM to strip HTML tags safely
      const dom = new JSDOM(`<body>${title}</body>`);
      title = dom.window.document.body.textContent?.trim() || null;
    }

    // Decode HTML entities
    if (title) {
      title = decodeHtmlEntities(title);
    }

    if (title) {
      title = title.replace(/\s*Series['']s?\s*Articles$/i, "").trim();
    }

    if (!title) {
      title = fallbackTitle || `Series ${collectionId}`;
    }

    // Update in-memory mapping
    SERIES_NAMES[collectionId] = title;

    const data = `// Auto-generated. Do not edit manually!\nexport default ${JSON.stringify(SERIES_NAMES, null, 2)};\n`;
    await fs.writeFile(SERIES_MAP_PATH, data);
    console.log(`  ✏️  Discovered new series: ${collectionId} = "${title}"`);

    return title;
  } catch (error) {
    console.warn(
      `  ⚠️  Error fetching series ${collectionId}: ${getErrorMessage(error)}`,
    );
    return fallbackTitle || `Series ${collectionId}`;
  }
}

const POSTS_DIRECTORY = path.join(__dirname, "../src/content/blog");
const VSCODE_TIPS_POSTS_DIRECTORY = path.join(
  __dirname,
  "../src/content/vscodetips",
);
const POSTS_IMAGES_PUBLIC_DIRECTORY = "/assets/images/posts";
const POSTS_IMAGES_DIRECTORY = path.join(
  __dirname,
  "../public",
  POSTS_IMAGES_PUBLIC_DIRECTORY,
);
const EMBEDDED_POSTS_MARKUP_FILE = path.join(
  __dirname,
  "../src/_data/embeddedPostsMarkup.json",
);
const TWITTER_EMBEDS_FILE = path.join(
  __dirname,
  "../src/_data/twitterEmbeds.json",
);

const currentBlogPostEmbeds: Record<string, unknown> = JSON.parse(
  readFileSync(EMBEDDED_POSTS_MARKUP_FILE, "utf-8"),
);
const blogPostEmbeds = new Map<string, unknown>(
  Object.entries(currentBlogPostEmbeds),
);

// Load existing Twitter embeds or initialize empty object
let currentTwitterEmbeds: Record<string, string> = {};
try {
  currentTwitterEmbeds = JSON.parse(readFileSync(TWITTER_EMBEDS_FILE, "utf-8"));
} catch (error) {
  // File doesn't exist yet, will be created
  currentTwitterEmbeds = {};
}
const twitterEmbeds = new Map<string, string>(
  Object.entries(currentTwitterEmbeds),
);

/**
 * Checks if a file exists
 * @param filePath - File path to check
 * @returns True if file exists, false otherwise
 */
async function fileExists(filePath: string): Promise<boolean> {
  return !!(await fs.stat(filePath).catch((_error) => false));
}

function sanitizeMarkdownEmbeds(markdown: string): ConversionResult {
  let sanitizedMarkdown = markdown
    .replaceAll(
      /{%\s*?(?<liquidTag>[^\s+]*)\s+?(?<id>[^'"\s]+)\s*?%}/g,
      '{% $1 "$2" %}',
    )
    .replaceAll(/\n<!-- places to follow me -->\n(.|\n)*$/g, "");

  sanitizedMarkdown = sanitizedMarkdown.replace(
    /!\[([^\]]+)\]/g,
    (_match, altText: string) => {
      const escapedAlt = altText.replace(/</g, "&lt;").replace(/>/g, "&gt;");
      return `![${escapedAlt}]`;
    },
  );

  // Convert all liquid tags to Astro component syntax
  return convertLiquidTagsToAstroComponents(sanitizedMarkdown);
}

/**
 * Determines whethere or not a post coming from DEV (the CMS) is valid or not to publish
 * on this blog.
 *
 * @param post The post to validate.
 *
 * @returns True if the post is valid for publishing, otherwise false.
 */
function isValidPost(post: DevToPost): boolean {
  const { tag_list: tags = [], slug, organization } = post;

  // Ensure tags is an array
  const tagArray = Array.isArray(tags)
    ? tags
    : tags.split(",").map((t) => t.trim());

  // Exclude posts from pomerium org
  if (organization && organization.username === "pomerium") {
    return false;
  }

  return (
    (!tagArray.includes("jokes") &&
      !tagArray.includes("weeklylearn") &&
      !tagArray.includes("weeklyretro") &&
      !tagArray.includes("watercooler") &&
      !tagArray.includes("devhumor") &&
      !tagArray.includes("discuss") &&
      !tagArray.includes("vscodetip") &&
      !tagArray.includes("explainlikeimfive") &&
      !tagArray.includes("help") &&
      // omits my newsletter posts which are already published on my site
      !tagArray.includes("newsletter")) ||
    SLUG_INCLUSION_LIST.includes(slug)
  );
}

/*

Sample post format:

{
  "title": "Strongly Typed JSON in TypeScript",
  "description": "Someone in one of the Slack communities I'm a part of asked today how to type JSON in TypeScript,...",
  "published": true,
  "published_at": "2022-04-01T03:36:19.595Z",
  "slug": "strongly-typed-json-in-typescript-5gb2",
  "published_timestamp": "2022-04-01T03:36:19Z",
  "body_markdown": "Someone in one of the Slack communities I'm a part of asked today how to type JSON in TypeScript, specifically importing JSON and then typing it. They wondered if casting the JSON to `unknown` and then casting to a known type when consumed was a good approach.\n\nThe solution is not that complicated. We just need to get our hands a little dirty and dig into the TypeScript compiler options for our project.\n\nBy default, if you import JSON, TypeScript will mention that it can't import it with the following error message:\n\n`Cannot find module './data.json'. Consider using '--resolveJsonModule' to import module with '.json' extension.ts(2732)`\n\n![](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/s5csqewe14a9n4kr523d.png)\n\nSo TypeScript tells us what to do. Add the `--resolveJsonModule` flag. This is helpful if we're running the TypeScript CLI, but that is not what we're doing. What needs to be done is to add the `resolveJsonModule` key to the compiler options in the tsconfig.json file and set it to `true`.\n\n```json\n{\n  \"compilerOptions\": {\n    \"resolveJsonModule\": true,\n    // more awesome compiler options\n  }\n}\n```\n\nOnce that's done, you'll notice that if you type `data.`, we have fully typed JSON data.\n\n![data variable in VS Code displaying autocomplete with properties of the data object](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/w5o2nxl0hik2gwhpy6m1.png)\n\nThis is great for using data in a typed manner, but what if we needed the JSON type elsewhere in the project? We can create a type for it using `typeof`.\n\n`type PersonalInfo = typeof data;`\n\n![The type PersonalInfo displaying its shape in CodeSandbox](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/g5sbz0a6386yfgwz7376.png)\n\nYou can play around with this CodeSandbox and have some fun seeing it all in action.\n\n{%codesandbox zealous-marco-urxdvy %}",
  "cover_image": "https://res.cloudinary.com/practicaldev/image/fetch/s--kzB8DJTv--/c_imagga_scale,f_auto,fl_progressive,h_420,q_auto,w_1000/https://dev-to-uploads.s3.amazonaws.com/uploads/articles/7sjay11pqa91it8euj0l.png",
  "tag_list": [
    "typescript",
    "beginners"
  ],
  "reading_time_minutes": 2,
}

*/

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchWithRetry(
  url: string,
  options: RequestInit = {},
  maxRetries = 5,
  initialDelay = 2000,
): Promise<Response> {
  let attempt = 0;
  let delay = initialDelay;
  while (attempt <= maxRetries) {
    const response = await fetch(url, options);
    if (response.status !== 429) {
      return response;
    }
    // Rate limited
    attempt++;
    if (attempt > maxRetries) {
      throw new Error(
        `Failed after ${maxRetries} retries due to rate limiting (429)`,
      );
    }
    const retryAfter = response.headers.get("Retry-After");
    const waitTime = retryAfter ? parseInt(retryAfter, 10) * 1000 : delay;
    console.warn(
      `Rate limited (429) on ${url}. Retrying in ${waitTime / 1000}s (attempt ${attempt}/${maxRetries})...`,
    );
    await sleep(waitTime);
    delay *= 2; // Exponential backoff
  }
  throw new Error("Unreachable code in fetchWithRetry");
}

/**
 * Retrieves the latest blog posts from dev.to.
 *
 * @returns A promise that resolves to an array of blog posts.
 */
async function getDevPosts(): Promise<DevToPost[]> {
  const response = await fetchWithRetry(
    DEV_TO_API_URL + "/articles/me/published?per_page=1000",
    {
      headers: {
        "api-key": DEV_API_KEY!,
      },
    },
  );
  if (!response.ok) {
    throw new Error(
      `Failed to fetch posts: ${response.status} ${response.statusText}`,
    );
  }
  const posts: DevToPost[] = await response.json();
  return posts.filter(isValidPost);
}

/**
 * Retrieves the blog post for the given blog post ID.
 *
 * @param blogPostId The ID of the blog post to retrieve.
 *
 * @returns A promise that resolves to a blog post.
 */
async function getDevPost(blogPostId: number): Promise<DevToPost> {
  const getArticleUrl = `${DEV_TO_API_URL}/articles/${blogPostId}`;
  const response = await fetchWithRetry(getArticleUrl, {
    headers: {
      "api-key": DEV_API_KEY!,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch post: ${response.status} ${response.statusText}`,
    );
  }

  let post: DevToPost;
  try {
    post = await response.json();
  } catch (error) {
    throw new Error(
      `Failed to parse post JSON for ${getArticleUrl}: ${getErrorMessage(error)}`,
    );
  }
  return post;
}

async function createPostFile(post: DevToPost): Promise<{ status: string }> {
  const {
    body_markdown,
    title,
    description: excerpt,
    published_at: date,
    tag_list: tags,
    reading_time_minutes,
    cover_image,
    slug,
    canonical_url,
  } = post;

  const tagArray = Array.isArray(tags)
    ? tags
    : tags.split(",").map((t) => t.trim());

  const jsonFrontmatter: PostFrontmatter = {
    title,
    excerpt,
    date,
    tags: tagArray,
    cover_image,
    canonical_url,
    reading_time_minutes,
    template: "post",
  };

  if (post.collection_id) {
    const seriesName = await getOrFetchSeriesName(post.collection_id, title);
    jsonFrontmatter.series = {
      name: seriesName,
      collection_id: post.collection_id,
    };

    console.log(
      `  📚 Added to series: "${seriesName}" (ID: ${post.collection_id})`,
    );
  }

  let markdownBody: string;

  if (/^---(\r|\n)/.test(body_markdown)) {
    markdownBody = body_markdown.replace(/^---(\r|\n)(.|\r|\n)*?---\n*/, "");
  } else {
    markdownBody = body_markdown;
  }

  const { content: sanitizedContent, imports } =
    sanitizeMarkdownEmbeds(markdownBody);

  const importsSection = imports.length > 0 ? `${imports.join("\n")}\n\n` : "";
  const yamlFrontmatter = yaml.dump(jsonFrontmatter);
  const markdown = `---\n${yamlFrontmatter}---\n${importsSection}${sanitizedContent.trim()}\n`;

  const basePath = tagArray.includes("vscodetips")
    ? path.join(
        VSCODE_TIPS_POSTS_DIRECTORY,
        new Date(date).getFullYear().toString(),
      )
    : POSTS_DIRECTORY;
  const postFile = path.join(basePath, `${slug}.mdx`);
  await fs.writeFile(postFile, markdown);

  const twitterEmbedMatches = markdown.matchAll(
    /(?:[^`]{%\stwitter\s"(?<id>[^"\s]+)"\s%})|(?:{%\sembed\s"https:\/\/(?:www\.)?twitter\.com\/[^/]+\/status\/(?<id2>[^"\s]+?)(?:\?.+)?"\s%})/g,
  );

  for (const match of twitterEmbedMatches) {
    const { id, id2 } = match.groups || {};
    const tweetId = id ?? id2;

    if (!tweetId || twitterEmbeds.has(tweetId)) {
      continue;
    }
    try {
      const response = await fetchWithRetry(
        `https://publish.twitter.com/oembed?url=${encodeURIComponent(
          `https://twitter.com/anyone/status/${tweetId}`,
        )}`,
      );

      if (!response.ok) {
        console.warn(
          `Failed to fetch Twitter embed for ${tweetId}: ${response.status}`,
        );
        continue;
      }

      console.log(
        `Grabbing markup for Tweet https://twitter.com/anyone/status/${tweetId}`,
      );

      const data: { html: string } = await response.json();
      const { html } = data;

      twitterEmbeds.set(tweetId, html);
    } catch (error) {
      console.warn(
        `Error fetching Twitter embed for ${tweetId}:`,
        getErrorMessage(error),
      );
      continue;
    }
  }

  return { status: "success" };
}

async function saveImageUrl(
  imageUrl: string,
  imageFilePath: string,
): Promise<void> {
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) {
      console.warn(`Failed to fetch image ${imageUrl}: ${response.status}`);
      return;
    }
    const buffer = Buffer.from(await response.arrayBuffer());

    await fs.writeFile(imageFilePath, buffer);
    console.log(`Saved image ${imageUrl} to ${imageFilePath}!`);
  } catch (error) {
    console.warn(`Error saving image ${imageUrl}:`, getErrorMessage(error));
  }
}

function generateNewImageUrl(imageUrl: URL): string {
  const imagefilename = imageUrl.pathname.replaceAll("/", "_");
  const newImageUrl = new URL(
    path.join(POSTS_IMAGES_PUBLIC_DIRECTORY, imagefilename),
    siteUrl,
  ).pathname;

  return newImageUrl;
}

async function saveMarkdownImageUrl(
  markdownImageUrl: string | null = null,
): Promise<string | null> {
  let newMarkdownImageUrl = null;

  if (markdownImageUrl) {
    const imageUrl = new URL(markdownImageUrl);
    const imagefilename = imageUrl.pathname.replaceAll("/", "_");
    const localCoverImagePath = path.join(
      POSTS_IMAGES_DIRECTORY,
      imagefilename,
    );

    newMarkdownImageUrl = generateNewImageUrl(imageUrl);

    if (!(await fileExists(localCoverImagePath))) {
      console.log(`Saving image ${imageUrl} to ${localCoverImagePath}`);
      await saveImageUrl(markdownImageUrl, localCoverImagePath);
    }
  }

  return newMarkdownImageUrl;
}

async function saveMarkdownImages(imagesToSave: string[]): Promise<void> {
  for (const imageToSave of imagesToSave) {
    await saveMarkdownImageUrl(imageToSave);
  }
}

async function updateMarkdownImageUrls(markdown: string): Promise<{
  markdown: string;
  imagesToSave: string[];
}> {
  let updatedMarkdown = markdown;
  const imagesToSave: string[] = [];
  const matches = markdown.matchAll(
    /!\[.*?\]\((?<oldImageUrl>(?!\.\/)[^)]+)\)/g,
  );

  for (const match of matches) {
    const { oldImageUrl } = match.groups || {};
    if (!oldImageUrl) continue;

    const imageUrl = new URL(oldImageUrl);

    if (!imageUrl.host.includes("giphy.com")) {
      const newImageUrl = generateNewImageUrl(imageUrl);

      updatedMarkdown = updatedMarkdown.replace(oldImageUrl, newImageUrl);
      imagesToSave.push(oldImageUrl);
    }
  }

  return {
    markdown: updatedMarkdown,
    imagesToSave,
  };
}

async function getDevBlogPostEmbedsMarkup(
  markdown: string,
  embeds: Map<string, unknown>,
): Promise<void> {
  const matches = markdown.matchAll(
    /[^`]{%\s*?(?<embedType>[^\s]+)\s+?(?<embedUrl>[^\s]+)/g,
  );

  for (const match of matches) {
    const { embedType, embedUrl } = match.groups || {};
    if (!embedType || !embedUrl) continue;

    let url = null;

    try {
      url = new URL(embedUrl);
    } catch (error) {
      url = null;
    }

    if (
      url &&
      !embeds.has(embedUrl) &&
      url.host === "dev.to" &&
      embedType !== "podcast" &&
      embedType !== "tag"
    ) {
      try {
        const response = await fetch(embedUrl);
        if (!response.ok) {
          console.warn(`Failed to fetch embed ${embedUrl}: ${response.status}`);
          continue;
        }
        const markup = await response.text();
        embeds.set(embedUrl, markup);
      } catch (error) {
        console.warn(
          `Error fetching embed ${embedUrl}:`,
          getErrorMessage(error),
        );
        continue;
      }
    }
  }
}

async function updateBlogPostEmbeds(
  embeds: Map<string, unknown>,
  filePaths: string,
): Promise<void> {
  const blogPostEmbedsMarkup: Record<string, unknown> = {};

  for (const [url] of embeds) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        console.warn(
          `Skipping embed for ${url} - received status ${response.status}`,
        );
        continue;
      }

      const html = await response.text();
      const match = html.match(/data-article-id="(?<blogPostId>.+?)"/);

      if (match) {
        const { blogPostId } = match.groups || {};
        if (!blogPostId) continue;

        try {
          const post = await getDevPost(Number(blogPostId));
          const {
            body_html,
            body_markdown,
            comments_count,
            public_reactions_count,
            positive_reactions_count,
            ...data
          } = post;

          blogPostEmbedsMarkup[url] = data;
        } catch (error) {
          console.warn(
            `Failed to fetch blog post for ${url}:`,
            getErrorMessage(error),
          );
          continue;
        }
      } else {
        console.warn(`Could not find blog post ID at ${url}`);
        continue;
      }
    } catch (error) {
      console.warn(`Failed to process embed ${url}:`, getErrorMessage(error));
      continue;
    }
  }

  try {
    const data = JSON.stringify(blogPostEmbedsMarkup, null, 2);
    await fs.writeFile(filePaths, data);
    console.log(`Successfully saved blog post embeds to ${filePaths}`);
  } catch (error) {
    console.error(
      `Failed to write embeds file to ${filePaths}:`,
      getErrorMessage(error),
    );
    throw error;
  }
}

async function updateTwitterEmbeds(
  twitterEmbeds: Map<string, string>,
  filepath: string,
): Promise<void> {
  let tweetEmbeds = Object.fromEntries(twitterEmbeds);

  const data = JSON.stringify(tweetEmbeds, null, 2);

  await fs.writeFile(filepath, data);
  console.log(`Saved Twitter embeds markup to ${filepath}!`);
}

(async () => {
  await Promise.all([
    fs.mkdir(POSTS_DIRECTORY, { recursive: true }),
    fs.mkdir(POSTS_DIRECTORY, {
      recursive: true,
    }),
    fs.mkdir(
      path.join(
        VSCODE_TIPS_POSTS_DIRECTORY,
        new Date().getFullYear().toString(),
      ),
      {
        recursive: true,
      },
    ),
    fs.mkdir(POSTS_IMAGES_DIRECTORY, { recursive: true }),
  ]);

  const posts = await getDevPosts();

  const filteredPosts = posts.filter((post) => {
    const orgUsername = post.organization?.username || "";
    const tagList = Array.isArray(post.tag_list)
      ? post.tag_list
      : post.tag_list.split(",").map((t) => t.trim());

    return (
      !["vscodetips", "virtualcoffee", "pomerium"].includes(orgUsername) ||
      (orgUsername === "vscodetips" && tagList.includes("vscodetips"))
    );
  });

  console.log(`Processing ${filteredPosts.length} posts...`);

  for (const postSummary of filteredPosts) {
    const post = await getDevPost(postSummary.id);

    post.canonical_url = new URL(
      post.slug,
      "https://www.nickyt.co/blog/",
    ).toString();

    if (/<!-- my newsletter -->/.test(post.body_markdown)) {
      console.warn(`Skipping newsletter post ${post.title}`);
      continue;
    }
    const updatedCoverImage = await saveMarkdownImageUrl(post.cover_image);
    const { markdown, imagesToSave } = await updateMarkdownImageUrls(
      post.body_markdown,
    );

    await Promise.all([
      saveMarkdownImages(imagesToSave),
      getDevBlogPostEmbedsMarkup(markdown, blogPostEmbeds),
    ]);

    const updatedPost: DevToPost = {
      ...post,
      cover_image: updatedCoverImage,
      body_markdown: markdown,
    };
    const { status } = await createPostFile(updatedPost);

    if (status !== "success") {
      console.error(
        `Failed to create post file for ${JSON.stringify(post, null, 2)}`,
      );

      throw new Error(`Unabled to generate markdown file: status ${status}`);
    }
  }

  try {
    await updateTwitterEmbeds(twitterEmbeds, TWITTER_EMBEDS_FILE);
  } catch (error) {
    console.error("unable to update Twitter embeds", error);
  }

  try {
    await updateBlogPostEmbeds(blogPostEmbeds, EMBEDDED_POSTS_MARKUP_FILE);
  } catch (error) {
    console.error("unable to update DEV blog post embeds", error);
  }
})();
