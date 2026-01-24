#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import yaml from "js-yaml";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const STREAMS_DIR = path.join(__dirname, "../src/content/streams");
const API_KEY = process.env.YOUTUBE_API_KEY;
const PLAYLIST_ID = process.env.YOUTUBE_PLAYLIST_ID;

const YOUTUBE_API_BASE = "https://www.googleapis.com/youtube/v3";

interface YouTubeVideo {
  videoId: string;
  title: string;
  description: string;
  publishedAt: string;
  thumbnailUrl: string;
  channelTitle: string;
}

interface YouTubePlaylistItem {
  snippet: {
    title: string;
    description: string;
    publishedAt: string;
    thumbnails: {
      maxresdefault?: { url: string };
      high?: { url: string };
      medium?: { url: string };
      default?: { url: string };
    };
    resourceId: {
      videoId: string;
    };
    channelTitle: string;
  };
}

interface YouTubePlaylistResponse {
  items: YouTubePlaylistItem[];
  nextPageToken?: string;
}

interface StreamFrontmatter {
  title: string;
  date: string;
  videoId: string;
  description?: string;
  thumbnailUrl: string;
  channelTitle: string;
}

/**
 * Safely extracts error message from unknown error
 */
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

/**
 * Clean video description by removing "Places to follow Nick:" section
 */
function cleanDescription(description: string): string {
  const marker = "Places to follow Nick:";
  const index = description.indexOf(marker);

  if (index === -1) {
    return description.trim();
  }

  return description.substring(0, index).trim();
}

/**
 * Convert a string to kebab-case (lowercase with hyphens)
 */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, "-") // Replace spaces and underscores with hyphens
    .replace(/[^\w-]+/g, "") // Remove non-word characters except hyphens
    .replace(/--+/g, "-") // Replace multiple hyphens with single hyphen
    .replace(/^-+/, "") // Remove leading hyphens
    .replace(/-+$/, ""); // Remove trailing hyphens
}

/**
 * Sleep for a given number of milliseconds
 */
async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Fetch with retry logic for rate limiting and transient errors
 */
async function fetchWithRetry(
  url: string,
  maxRetries = 5,
  initialDelay = 2000
): Promise<Response> {
  let attempt = 0;
  let delay = initialDelay;

  while (attempt <= maxRetries) {
    try {
      const response = await fetch(url);

      // If successful or client error (not rate limit), return
      if (response.ok || (response.status >= 400 && response.status !== 429)) {
        return response;
      }

      // Rate limited
      if (response.status === 429) {
        attempt++;
        if (attempt > maxRetries) {
          throw new Error(
            `Failed after ${maxRetries} retries due to rate limiting (429)`
          );
        }

        const retryAfter = response.headers.get("Retry-After");
        const waitTime = retryAfter ? parseInt(retryAfter, 10) * 1000 : delay;
        console.warn(
          `⚠️  Rate limited (429). Retrying in ${waitTime / 1000}s (attempt ${attempt}/${maxRetries})...`
        );
        await sleep(waitTime);
        delay *= 2; // Exponential backoff
        continue;
      }

      // Server error, retry
      if (response.status >= 500) {
        attempt++;
        if (attempt > maxRetries) {
          throw new Error(
            `Failed after ${maxRetries} retries due to server errors (${response.status})`
          );
        }

        console.warn(
          `⚠️  Server error (${response.status}). Retrying in ${delay / 1000}s (attempt ${attempt}/${maxRetries})...`
        );
        await sleep(delay);
        delay *= 2;
        continue;
      }

      return response;
    } catch (error) {
      attempt++;
      if (attempt > maxRetries) {
        throw error;
      }

      console.warn(
        `⚠️  Network error: ${getErrorMessage(error)}. Retrying in ${delay / 1000}s (attempt ${attempt}/${maxRetries})...`
      );
      await sleep(delay);
      delay *= 2;
    }
  }

  throw new Error("Unreachable code in fetchWithRetry");
}

/**
 * Fetch all videos from a YouTube playlist (handles pagination)
 */
async function fetchPlaylist(): Promise<YouTubeVideo[]> {
  if (!API_KEY) {
    throw new Error(
      "YOUTUBE_API_KEY environment variable is required. Please set it and try again."
    );
  }

  if (!PLAYLIST_ID) {
    throw new Error(
      "YOUTUBE_PLAYLIST_ID environment variable is required. Please set it and try again."
    );
  }

  const videos: YouTubeVideo[] = [];
  let pageToken: string | undefined;

  console.log(`📺 Fetching videos from YouTube playlist ${PLAYLIST_ID}...`);

  do {
    const url = new URL(`${YOUTUBE_API_BASE}/playlistItems`);
    url.searchParams.set("part", "snippet");
    url.searchParams.set("playlistId", PLAYLIST_ID);
    url.searchParams.set("maxResults", "50");
    url.searchParams.set("key", API_KEY);

    if (pageToken) {
      url.searchParams.set("pageToken", pageToken);
    }

    try {
      const response = await fetchWithRetry(url.toString());

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`YouTube API error (${response.status}): ${errorText}`);
      }

      const data: YouTubePlaylistResponse = await response.json();

      for (const item of data.items) {
        const { snippet } = item;
        const thumbnailUrl =
          snippet.thumbnails.maxresdefault?.url ||
          snippet.thumbnails.high?.url ||
          snippet.thumbnails.medium?.url ||
          snippet.thumbnails.default?.url ||
          "";

        videos.push({
          videoId: snippet.resourceId.videoId,
          title: snippet.title,
          description: cleanDescription(snippet.description || ""),
          publishedAt: snippet.publishedAt,
          thumbnailUrl,
          channelTitle: snippet.channelTitle,
        });
      }

      pageToken = data.nextPageToken;
      console.log(
        `  ✓ Fetched ${data.items.length} videos (total: ${videos.length})`
      );
    } catch (error) {
      console.error(`❌ Failed to fetch playlist: ${getErrorMessage(error)}`);
      throw error;
    }
  } while (pageToken);

  console.log(`✓ Successfully fetched ${videos.length} videos from playlist`);
  return videos;
}

/**
 * Generate MDX frontmatter and content for a video
 */
function generateMDX(video: YouTubeVideo): string {
  const frontmatter: StreamFrontmatter = {
    title: video.title,
    date: video.publishedAt,
    videoId: video.videoId,
    thumbnailUrl: video.thumbnailUrl,
    channelTitle: video.channelTitle,
  };

  // Only include description if it's not empty
  if (video.description.trim()) {
    frontmatter.description = video.description;
  }

  const yamlFrontmatter = yaml.dump(frontmatter);
  const content = video.description.trim()
    ? `\n${video.description.trim()}\n`
    : "";

  return `---\n${yamlFrontmatter}---${content}`;
}

/**
 * Check if a file exists
 */
async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

/**
 * Read existing MDX file and extract frontmatter
 */
async function readExistingMDX(
  filePath: string
): Promise<StreamFrontmatter | null> {
  try {
    const content = await fs.readFile(filePath, "utf-8");
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);

    if (!frontmatterMatch) {
      return null;
    }

    const frontmatter = yaml.load(frontmatterMatch[1]) as StreamFrontmatter;
    return frontmatter;
  } catch (error) {
    console.warn(
      `⚠️  Failed to read existing MDX file ${filePath}: ${getErrorMessage(error)}`
    );
    return null;
  }
}

/**
 * Check if video content has changed
 */
function hasVideoChanged(
  video: YouTubeVideo,
  existingFrontmatter: StreamFrontmatter
): boolean {
  return (
    video.title !== existingFrontmatter.title ||
    video.publishedAt !== existingFrontmatter.date ||
    video.description !== (existingFrontmatter.description || "") ||
    video.thumbnailUrl !== existingFrontmatter.thumbnailUrl ||
    video.channelTitle !== existingFrontmatter.channelTitle
  );
}

/**
 * Sync YouTube videos to MDX files
 */
async function syncStreams(): Promise<void> {
  try {
    // Ensure streams directory exists
    await fs.mkdir(STREAMS_DIR, { recursive: true });

    // Fetch all videos from playlist
    const videos = await fetchPlaylist();

    if (videos.length === 0) {
      console.warn("⚠️  No videos found in playlist");
      return;
    }

    // Build a map of videoId -> existing filename by reading all MDX files
    const existingFiles = await fs.readdir(STREAMS_DIR);
    const videoIdToFilename = new Map<string, string>();
    const existingFilenames = new Set<string>();

    for (const file of existingFiles) {
      if (!file.endsWith(".mdx")) continue;

      const filePath = path.join(STREAMS_DIR, file);
      const frontmatter = await readExistingMDX(filePath);

      if (frontmatter?.videoId) {
        videoIdToFilename.set(frontmatter.videoId, file);
        existingFilenames.add(file);
      }
    }

    const fetchedVideoIds = new Set(videos.map((v) => v.videoId));
    const usedFilenames = new Set<string>();

    let createdCount = 0;
    let updatedCount = 0;
    let skippedCount = 0;
    let renamedCount = 0;

    console.log(`\n📝 Processing ${videos.length} videos...`);

    // Create/update MDX files
    for (const video of videos) {
      try {
        // Generate filename from slugified title
        let baseSlug = slugify(video.title);

        // Ensure slug is not empty
        if (!baseSlug) {
          baseSlug = video.videoId;
        }

        // Handle duplicate filenames by appending a counter
        let filename = `${baseSlug}.mdx`;
        let counter = 1;

        while (
          usedFilenames.has(filename) &&
          !videoIdToFilename.get(video.videoId)?.includes(baseSlug)
        ) {
          filename = `${baseSlug}-${counter}.mdx`;
          counter++;
        }

        usedFilenames.add(filename);
        const newFilePath = path.join(STREAMS_DIR, filename);

        // Check if this video already exists (by videoId)
        const existingFilename = videoIdToFilename.get(video.videoId);

        if (existingFilename) {
          const existingFilePath = path.join(STREAMS_DIR, existingFilename);
          const existingFrontmatter = await readExistingMDX(existingFilePath);

          // Check if filename changed (title changed)
          if (existingFilename !== filename) {
            // Delete old file and create new one
            await fs.unlink(existingFilePath);
            const mdxContent = generateMDX(video);
            await fs.writeFile(newFilePath, mdxContent, "utf-8");
            console.log(`  🔄 Renamed: ${existingFilename} → ${filename}`);
            renamedCount++;
          } else if (
            existingFrontmatter &&
            hasVideoChanged(video, existingFrontmatter)
          ) {
            // Content changed, update file
            const mdxContent = generateMDX(video);
            await fs.writeFile(newFilePath, mdxContent, "utf-8");
            console.log(`  ✏️  Updated: ${video.title}`);
            updatedCount++;
          } else {
            // No changes
            skippedCount++;
          }
        } else {
          // New video, create file
          const mdxContent = generateMDX(video);
          await fs.writeFile(newFilePath, mdxContent, "utf-8");
          console.log(`  ✨ Created: ${filename}`);
          createdCount++;
        }
      } catch (error) {
        console.error(
          `❌ Failed to process video ${video.videoId}: ${getErrorMessage(error)}`
        );
        // Continue processing other videos
      }
    }

    // Delete MDX files for videos no longer in playlist
    const videosToDelete = Array.from(videoIdToFilename.entries()).filter(
      ([videoId]) => !fetchedVideoIds.has(videoId)
    );

    let deletedCount = 0;
    if (videosToDelete.length > 0) {
      console.log(`\n🗑️  Removing ${videosToDelete.length} deleted videos...`);

      for (const [videoId, filename] of videosToDelete) {
        const filePath = path.join(STREAMS_DIR, filename);
        try {
          await fs.unlink(filePath);
          console.log(`  🗑️  Deleted: ${filename}`);
          deletedCount++;
        } catch (error) {
          console.error(
            `❌ Failed to delete ${filename}: ${getErrorMessage(error)}`
          );
        }
      }
    }

    // Summary
    console.log("\n✅ Sync complete!");
    console.log(`  📊 Summary:`);
    console.log(`     - Created: ${createdCount}`);
    console.log(`     - Updated: ${updatedCount}`);
    console.log(`     - Renamed: ${renamedCount}`);
    console.log(`     - Deleted: ${deletedCount}`);
    console.log(`     - Skipped: ${skippedCount} (unchanged)`);
    console.log(`     - Total: ${videos.length} videos in playlist`);
  } catch (error) {
    console.error(`❌ Fatal error during sync: ${getErrorMessage(error)}`);
    process.exit(1);
  }
}

// Run the sync
syncStreams().catch((error) => {
  console.error(`❌ Unhandled error: ${getErrorMessage(error)}`);
  process.exit(1);
});
