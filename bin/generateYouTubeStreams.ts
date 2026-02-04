#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import yaml from "js-yaml";
import { parseGuestFromDescription } from "../src/utils/youtube-parser.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const STREAMS_DIR = path.join(__dirname, "../src/content/streams");
const GUESTS_DIR = path.join(__dirname, "../src/content/guests");
const API_KEY = process.env.YOUTUBE_API_KEY;
const PLAYLIST_ID = process.env.YOUTUBE_PLAYLIST_ID;
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_STREAM_GUEST_BASE_ID;

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
  guest?: string;
  guestName?: string;
}

interface AirtableGuest {
  name: string;
  title?: string;
  website?: string;
  twitter?: string;
  github?: string;
  youtube?: string;
  linkedin?: string;
  bluesky?: string;
  twitch?: string;
  youtubeStreamLink?: string;
}

interface GuestFrontmatter {
  name: string;
  slug: string;
  title?: string;
  bio?: string;
  photo?: string;
  social: {
    website?: string;
    twitter?: string;
    github?: string;
    youtube?: string;
    linkedin?: string;
    bluesky?: string;
    twitch?: string;
  };
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
 * Extract video ID from YouTube URL
 */
function extractVideoIdFromUrl(url: string): string | null {
  if (!url) return null;
  const match = url.match(/[?&]v=([^&]+)/);
  return match ? match[1] : null;
}

/**
 * Normalize string for fuzzy matching (lowercase, remove punctuation)
 */
function normalizeForMatching(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Fetch all guest records from Airtable
 */
async function fetchAirtableGuests(): Promise<Map<string, AirtableGuest>> {
  const guestMap = new Map<string, AirtableGuest>();

  if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
    console.log("⚠️  Airtable credentials not found, skipping Airtable lookup");
    return guestMap;
  }

  try {
    console.log("📋 Fetching guest data from Airtable...");

    const url = new URL(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Stream%20Guests`
    );
    url.searchParams.set("fields[]", "Name");
    url.searchParams.set("fields[]", "Guest Title");
    url.searchParams.set("fields[]", "Stream Title");
    url.searchParams.set("fields[]", "YouTube Stream Link");
    url.searchParams.set("fields[]", "Website");
    url.searchParams.set("fields[]", "Twitter Username");
    url.searchParams.set("fields[]", "GitHub Handle");
    url.searchParams.set("fields[]", "YouTube Channel");
    url.searchParams.set("fields[]", "LinkedIn");
    url.searchParams.set("fields[]", "Bluesky");
    url.searchParams.set("fields[]", "Twitch Handle");

    const response = await fetchWithRetry(url.toString());

    if (!response.ok) {
      console.warn(
        `⚠️  Failed to fetch Airtable data: ${response.status} ${response.statusText}`
      );
      return guestMap;
    }

    const data = await response.json();
    const records = data.records || [];

    for (const record of records) {
      const fields = record.fields;
      if (!fields.Name) continue;

      const guest: AirtableGuest = {
        name: fields.Name,
        title: fields["Guest Title"],
        website: fields.Website,
        twitter: fields["Twitter Username"],
        github: fields["GitHub Handle"],
        youtube: fields["YouTube Channel"],
        linkedin: fields.LinkedIn,
        bluesky: fields.Bluesky,
        twitch: fields["Twitch Handle"],
        youtubeStreamLink: fields["YouTube Stream Link"],
      };

      // Index by video ID if available
      if (guest.youtubeStreamLink) {
        const videoId = extractVideoIdFromUrl(guest.youtubeStreamLink);
        if (videoId) {
          guestMap.set(`videoid:${videoId}`, guest);
        }
      }

      // Index by normalized stream title
      if (fields["Stream Title"]) {
        const normalizedTitle = normalizeForMatching(fields["Stream Title"]);
        guestMap.set(`title:${normalizedTitle}`, guest);
      }
    }

    console.log(`  ✓ Fetched ${records.length} guest records from Airtable`);
    return guestMap;
  } catch (error) {
    console.warn(
      `⚠️  Error fetching Airtable guests: ${getErrorMessage(error)}`
    );
    return guestMap;
  }
}

/**
 * Match a YouTube video against Airtable guest data
 */
function matchAirtableGuest(
  video: YouTubeVideo,
  airtableGuests: Map<string, AirtableGuest>
): AirtableGuest | null {
  // Try video ID match first
  const videoIdMatch = airtableGuests.get(`videoid:${video.videoId}`);
  if (videoIdMatch) {
    return videoIdMatch;
  }

  // Try fuzzy title match
  const normalizedTitle = normalizeForMatching(video.title);
  const titleMatch = airtableGuests.get(`title:${normalizedTitle}`);
  if (titleMatch) {
    return titleMatch;
  }

  return null;
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
function generateMDX(
  video: YouTubeVideo,
  guestSlug?: string,
  guestName?: string
): string {
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

  // Add guest information if available
  if (guestSlug) {
    frontmatter.guest = guestSlug;
  }
  if (guestName) {
    frontmatter.guestName = guestName;
  }

  const yamlFrontmatter = yaml.dump(frontmatter);
  const content = video.description.trim()
    ? `\n${video.description.trim()}\n`
    : "";

  return `---\n${yamlFrontmatter}---${content}`;
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
 * Clear out the streams directory before regenerating content.
 */
async function clearStreamsDirectory(): Promise<void> {
  const entries = await fs.readdir(STREAMS_DIR, { withFileTypes: true });

  if (entries.length === 0) {
    return;
  }

  console.log(`\n🧹 Clearing ${entries.length} existing stream files...`);

  for (const entry of entries) {
    const entryPath = path.join(STREAMS_DIR, entry.name);
    await fs.rm(entryPath, { recursive: true, force: true });
  }
}

/**
 * Create or update a guest MDX file
 */
async function createOrUpdateGuest(guestData: {
  name: string;
  title?: string;
  social: {
    website?: string;
    twitter?: string;
    github?: string;
    youtube?: string;
    linkedin?: string;
    bluesky?: string;
    twitch?: string;
  };
}): Promise<string> {
  // Ensure guests directory exists
  await fs.mkdir(GUESTS_DIR, { recursive: true });

  // Generate slug from name
  const slug = slugify(guestData.name);
  const filePath = path.join(GUESTS_DIR, `${slug}.mdx`);

  try {
    // Check if guest file already exists
    const existingContent = await fs.readFile(filePath, "utf-8");
    const frontmatterMatch = existingContent.match(/^---\n([\s\S]*?)\n---/);

    if (frontmatterMatch) {
      // Guest exists - merge data
      const existingFrontmatter = yaml.load(
        frontmatterMatch[1]
      ) as GuestFrontmatter;

      // Keep existing bio and photo, update social links
      const updatedFrontmatter: GuestFrontmatter = {
        name: guestData.name,
        slug,
        ...(guestData.title || existingFrontmatter.title
          ? { title: guestData.title || existingFrontmatter.title }
          : {}),
        ...(existingFrontmatter.bio ? { bio: existingFrontmatter.bio } : {}),
        ...(existingFrontmatter.photo ? { photo: existingFrontmatter.photo } : {}),
        social: {
          website:
            guestData.social.website || existingFrontmatter.social.website,
          twitter:
            guestData.social.twitter || existingFrontmatter.social.twitter,
          github: guestData.social.github || existingFrontmatter.social.github,
          youtube:
            guestData.social.youtube || existingFrontmatter.social.youtube,
          linkedin:
            guestData.social.linkedin || existingFrontmatter.social.linkedin,
          bluesky:
            guestData.social.bluesky || existingFrontmatter.social.bluesky,
          twitch: guestData.social.twitch || existingFrontmatter.social.twitch,
        },
      };

      const yamlFrontmatter = yaml.dump(updatedFrontmatter);
      const body = existingContent.substring(frontmatterMatch[0].length).trim();
      const mdxContent = `---\n${yamlFrontmatter}---\n\n${body}`;

      await fs.writeFile(filePath, mdxContent, "utf-8");
      return slug;
    }
  } catch (error) {
    // File doesn't exist, will create new
  }

  // Create new guest file
  const frontmatter: GuestFrontmatter = {
    name: guestData.name,
    slug,
    ...(guestData.title && { title: guestData.title }),
    social: guestData.social,
  };

  const yamlFrontmatter = yaml.dump(frontmatter);
  const mdxContent = `---\n${yamlFrontmatter}---\n\n# About ${guestData.name}\n\n[Bio will be added manually]\n`;

  await fs.writeFile(filePath, mdxContent, "utf-8");
  return slug;
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
    // Ensure streams and guests directories exist
    await fs.mkdir(STREAMS_DIR, { recursive: true });
    await fs.mkdir(GUESTS_DIR, { recursive: true });

    // Fetch all videos from playlist
    const videos = await fetchPlaylist();

    if (videos.length === 0) {
      console.warn("⚠️  No videos found in playlist");
      return;
    }

    // Fetch Airtable guest data
    const airtableGuests = await fetchAirtableGuests();

    await clearStreamsDirectory();

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
    let guestsCreatedCount = 0;
    let guestsUpdatedCount = 0;
    let streamsWithGuestCount = 0;
    let streamsWithoutGuestCount = 0;

    console.log(`\n📝 Processing ${videos.length} videos...`);

    // Create/update MDX files
    for (const video of videos) {
      try {
        // Extract guest information
        let guestSlug: string | undefined;
        let guestName: string | undefined;

        // Try Airtable match first
        const airtableMatch = matchAirtableGuest(video, airtableGuests);

        if (airtableMatch) {
          // Guest found in Airtable
          guestName = airtableMatch.name;
          const slug = slugify(airtableMatch.name);

          // Check if guest already exists
          const existingGuest = await fs
            .access(path.join(GUESTS_DIR, `${slug}.mdx`))
            .then(() => true)
            .catch(() => false);

          // Create or update guest MDX file
          guestSlug = await createOrUpdateGuest({
            name: airtableMatch.name,
            title: airtableMatch.title,
            social: {
              website: airtableMatch.website,
              twitter: airtableMatch.twitter,
              github: airtableMatch.github,
              youtube: airtableMatch.youtube,
              linkedin: airtableMatch.linkedin,
              bluesky: airtableMatch.bluesky,
              twitch: airtableMatch.twitch,
            },
          });

          if (!existingGuest) {
            guestsCreatedCount++;
            console.log(`    ✨ Created guest: ${guestName}`);
          } else {
            guestsUpdatedCount++;
          }

          streamsWithGuestCount++;
        } else {
          // Try parsing YouTube description
          const parsedGuest = parseGuestFromDescription(video.description);

          if (parsedGuest) {
            guestName = parsedGuest.name;
            const slug = slugify(parsedGuest.name);

            // Check if guest already exists
            const existingGuest = await fs
              .access(path.join(GUESTS_DIR, `${slug}.mdx`))
              .then(() => true)
              .catch(() => false);

            // Create or update guest MDX file
            guestSlug = await createOrUpdateGuest({
              name: parsedGuest.name,
              social: parsedGuest.social,
            });

            if (!existingGuest) {
              guestsCreatedCount++;
              console.log(
                `    ✨ Created guest: ${guestName} (from description)`
              );
            } else {
              guestsUpdatedCount++;
            }

            streamsWithGuestCount++;
          } else {
            // No guest found
            console.log(
              `    ⚠️  No guest found for: ${video.title} (${video.videoId})`
            );
            streamsWithoutGuestCount++;
          }
        }

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
            const mdxContent = generateMDX(video, guestSlug, guestName);
            await fs.writeFile(newFilePath, mdxContent, "utf-8");
            console.log(`  🔄 Renamed: ${existingFilename} → ${filename}`);
            renamedCount++;
          } else if (
            existingFrontmatter &&
            hasVideoChanged(video, existingFrontmatter)
          ) {
            // Content changed, update file
            const mdxContent = generateMDX(video, guestSlug, guestName);
            await fs.writeFile(newFilePath, mdxContent, "utf-8");
            console.log(`  ✏️  Updated: ${video.title}`);
            updatedCount++;
          } else {
            // No changes
            skippedCount++;
          }
        } else {
          // New video, create file
          const mdxContent = generateMDX(video, guestSlug, guestName);
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

      for (const [, filename] of videosToDelete) {
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
    console.log(`     Streams:`);
    console.log(`       - Created: ${createdCount}`);
    console.log(`       - Updated: ${updatedCount}`);
    console.log(`       - Renamed: ${renamedCount}`);
    console.log(`       - Deleted: ${deletedCount}`);
    console.log(`       - Skipped: ${skippedCount} (unchanged)`);
    console.log(`       - Total: ${videos.length} videos in playlist`);
    console.log(`     Guests:`);
    console.log(`       - Created: ${guestsCreatedCount}`);
    console.log(`       - Updated: ${guestsUpdatedCount}`);
    console.log(`       - Streams with guest: ${streamsWithGuestCount}`);
    console.log(`       - Streams without guest: ${streamsWithoutGuestCount}`);
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
