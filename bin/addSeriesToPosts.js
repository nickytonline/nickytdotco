#!/usr/bin/env node
/**
 * One-time script to add series data to all existing posts
 * This fetches ALL posts from dev.to and updates their frontmatter with series information
 */
import "dotenv/config";
import path from "path";
import { promises as fs } from "fs";
import { fileURLToPath } from "url";

const { DEV_API_KEY } = process.env;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DEV_TO_API_URL = "https://dev.to/api";
const POSTS_DIRECTORY = path.join(__dirname, "../src/blog");

// Series ID to Name mapping (same as in generateDevToPosts.js)
const SERIES_NAMES = {
  34295: "Advent of AI 2025",
  // Add more as you discover them
};

if (!DEV_API_KEY) {
  throw new Error("Missing DEV_API_KEY environment variable");
}

/**
 * Gets the series name from collection_id or infers from title
 */
function getSeriesName(collection_id, title) {
  if (SERIES_NAMES[collection_id]) {
    return SERIES_NAMES[collection_id];
  }
  
  const patterns = [
    /^(.+?)\s*-\s*(?:Part|Day|Episode)\s*\d+/i,
    /^(.+?)\s*\(Part\s*\d+\)/i,
    /^(.+?)\s*#\d+/i,
  ];
  
  for (const pattern of patterns) {
    const match = title.match(pattern);
    if (match) {
      return match[1].trim();
    }
  }
  
  console.warn(`Could not infer series name for collection ${collection_id}, title: "${title}"`);
  return `Series ${collection_id}`;
}

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchWithRetry(url, options = {}, maxRetries = 5, initialDelay = 2000) {
  let attempt = 0;
  let delay = initialDelay;
  while (attempt <= maxRetries) {
    const response = await fetch(url, options);
    if (response.status !== 429) {
      return response;
    }
    attempt++;
    if (attempt > maxRetries) {
      throw new Error(`Failed after ${maxRetries} retries due to rate limiting (429)`);
    }
    const retryAfter = response.headers.get('Retry-After');
    const waitTime = retryAfter ? parseInt(retryAfter, 10) * 1000 : delay;
    console.warn(`Rate limited (429). Retrying in ${waitTime / 1000}s (attempt ${attempt}/${maxRetries})...`);
    await sleep(waitTime);
    delay *= 2;
  }
}

/**
 * Fetch article details by username and slug
 */
async function fetchArticleBySlug(username, slug) {
  const url = `${DEV_TO_API_URL}/articles/${username}/${slug}`;
  const response = await fetchWithRetry(url);
  
  if (!response.ok) {
    console.warn(`Failed to fetch ${slug}: ${response.status}`);
    return null;
  }
  
  return await response.json();
}

/**
 * Parse dev.to URL to get username and slug
 */
function parseDevToUrl(canonicalUrl) {
  const match = canonicalUrl.match(/dev\.to\/([^\/]+)\/([^\/]+)/);
  if (!match) return null;
  return { username: match[1], slug: match[2] };
}

/**
 * Update a blog post file with series data
 */
async function updatePostWithSeries(filePath, seriesData) {
  const content = await fs.readFile(filePath, 'utf-8');
  
  // Extract frontmatter and body
  const match = content.match(/^---json\n([\s\S]+?)\n---\n([\s\S]*)$/);
  if (!match) {
    console.warn(`Could not parse frontmatter in ${filePath}`);
    return false;
  }
  
  const frontmatter = JSON.parse(match[1]);
  const body = match[2];
  
  // Add series data
  frontmatter.series = seriesData;
  
  // Write back
  const updatedContent = `---json\n${JSON.stringify(frontmatter, null, 2)}\n---\n${body}`;
  await fs.writeFile(filePath, updatedContent);
  
  return true;
}

/**
 * Main sync function
 */
async function syncAllPostsWithSeries() {
  console.log('🔄 Starting one-time series sync for all posts...\n');
  
  const files = await fs.readdir(POSTS_DIRECTORY);
  const mdFiles = files.filter(f => f.endsWith('.md'));
  
  let processed = 0;
  let updated = 0;
  let skipped = 0;
  let errors = 0;
  
  for (const file of mdFiles) {
    const filePath = path.join(POSTS_DIRECTORY, file);
    processed++;
    
    try {
      // Read the frontmatter
      const content = await fs.readFile(filePath, 'utf-8');
      const match = content.match(/^---json\n([\s\S]+?)\n---/);
      
      if (!match) {
        console.log(`${processed}/${mdFiles.length} ⚠️  ${file}: No frontmatter found`);
        skipped++;
        continue;
      }
      
      const frontmatter = JSON.parse(match[1]);
      
      // Skip if already has series with collection_id
      if (frontmatter.series && frontmatter.series.collection_id) {
        console.log(`${processed}/${mdFiles.length} ⏭️  ${file}: Already has series data`);
        skipped++;
        continue;
      }
      
      // Try to get the slug from the filename (remove .md extension)
      const slug = file.replace(/\.md$/, '');
      
      // Check if this is a dev.to post (either canonical URL or try by slug)
      const canonicalUrl = frontmatter.canonical_url;
      let parsed = null;
      
      if (canonicalUrl && canonicalUrl.includes('dev.to')) {
        parsed = parseDevToUrl(canonicalUrl);
      }
      
      // If we couldn't parse from canonical URL, try with the slug and nickytonline username
      if (!parsed) {
        parsed = { username: 'nickytonline', slug: slug };
      }
      
      console.log(`${processed}/${mdFiles.length} 🔍 ${file}: Fetching from dev.to...`);
      const article = await fetchArticleBySlug(parsed.username, parsed.slug);
      
      if (!article) {
        console.log(`${processed}/${mdFiles.length} ❌ ${file}: Failed to fetch`);
        errors++;
        continue;
      }
      
      // Check for collection_id
      if (!article.collection_id) {
        console.log(`${processed}/${mdFiles.length} ℹ️  ${file}: Not in a series`);
        skipped++;
        continue;
      }
      
      // Add series data
      const seriesName = getSeriesName(article.collection_id, article.title);
      const seriesData = {
        name: seriesName,
        collection_id: article.collection_id
      };
      
      const success = await updatePostWithSeries(filePath, seriesData);
      
      if (success) {
        console.log(`${processed}/${mdFiles.length} ✅ ${file}: Added to series "${seriesName}" (ID: ${article.collection_id})`);
        updated++;
      } else {
        console.log(`${processed}/${mdFiles.length} ❌ ${file}: Failed to update`);
        errors++;
      }
      
      // Rate limiting - be nice to the API
      await sleep(500);
      
    } catch (error) {
      console.error(`${processed}/${mdFiles.length} ❌ ${file}: Error - ${error.message}`);
      errors++;
    }
  }
  
  console.log('\n📊 Summary:');
  console.log(`   Total files: ${mdFiles.length}`);
  console.log(`   ✅ Updated with series: ${updated}`);
  console.log(`   ⏭️  Skipped: ${skipped}`);
  console.log(`   ❌ Errors: ${errors}`);
  console.log('\n✨ Done!');
}

// Run the script
syncAllPostsWithSeries().catch(console.error);
