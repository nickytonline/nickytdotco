/**
 * Eleventy Search Plugin
 * Generates a search index from blog posts during the build process
 * Includes build warnings for performance and cache invalidation
 */

const fs = require("fs");
const path = require("path");

module.exports = function(eleventyConfig) {
  /**
   * Calculate gzipped size estimate (roughly 30-40% of original)
   * @param {number} sizeInBytes - Original size in bytes
   * @returns {number} Estimated gzipped size in KB
   */
  function estimateGzipSize(sizeInBytes) {
    return Math.round((sizeInBytes * 0.35) / 1024);
  }

  /**
   * Calculate estimated parse time based on index size
   * Rough estimate: ~1ms per 10KB
   * @param {number} sizeInKB - Size in kilobytes
   * @returns {string} Formatted parse time
   */
  function estimateParseTime(sizeInKB) {
    const timeMs = Math.max(1, Math.round(sizeInKB / 10));
    return timeMs < 1000 ? `${timeMs}ms` : `${(timeMs / 1000).toFixed(2)}s`;
  }

  /**
   * Extract excerpt from post content
   * @param {string} content - Full post content
   * @param {number} length - Maximum excerpt length (default 160 chars)
   * @returns {string} Trimmed excerpt without HTML
   */
  function extractExcerpt(content, length = 160) {
    // Remove HTML tags and markdown syntax
    let text = content
      .replace(/<[^>]*>/g, "")
      .replace(/[#*`\[\]()]/g, "")
      .trim();

    // Truncate to specified length
    if (text.length > length) {
      text = text.substring(0, length).trim() + "...";
    }

    return text;
  }

  /**
   * Validate index size and log performance metrics
   * @param {Array} index - Search index array
   * @param {number} rawSizeKB - Raw file size in KB
   */
  function validateAndReportIndex(index, rawSizeKB) {
    const postCount = index.length;
    const gzipSizeKB = estimateGzipSize(rawSizeKB * 1024);
    const parseTime = estimateParseTime(gzipSizeKB);
    const storageEstimateKB = Math.round(rawSizeKB * 1.2); // Add 20% for overhead

    console.log("\n[Eleventy Search Plugin] Index Generation Report:");
    console.log(`  Posts indexed: ${postCount}`);
    console.log(`  Raw size: ${rawSizeKB}KB`);
    console.log(`  Gzipped estimate: ${gzipSizeKB}KB`);
    console.log(`  Estimated parse time: ${parseTime}`);
    console.log(`  localStorage usage estimate: ~${storageEstimateKB}KB\n`);

    // Warning at 250+ posts
    if (postCount >= 250) {
      console.warn(
        "[Eleventy Search Plugin] ⚠️  WARNING: Large search index detected (250+ posts)"
      );
      console.warn(
        "  Considerations for performance and user experience:"
      );
      console.warn(`  • Gzipped size: ${gzipSizeKB}KB`);
      console.warn(`  • Parse time: ${parseTime}`);
      console.warn(`  • localStorage: ~${storageEstimateKB}KB`);
      console.warn(
        "  Recommendations:"
      );
      console.warn(
        "    - Consider implementing pagination in search results"
      );
      console.warn(
        "    - Use web workers for index parsing on slower devices"
      );
      console.warn(
        "    - Implement lazy-loading of detailed post content"
      );
      console.warn(
        "    - Monitor real-world performance metrics with analytics\n"
      );
    }

    // Error at 350+ posts
    if (postCount >= 350) {
      const errorMsg =
        "[Eleventy Search Plugin] ❌ ERROR: Search index too large (350+ posts)";
      console.error(errorMsg);
      console.error(
        "  The generated index exceeds recommended size limits."
      );
      console.error(
        "  Recommendations to resolve:"
      );
      console.error(
        "    - Archive older posts to a separate searchable collection"
      );
      console.error(
        "    - Split the search index by category or year"
      );
      console.error(
        "    - Implement server-side search for large archives"
      );
      console.error(
        "    - Use pagination with lazy-loading for search results\n"
      );
      throw new Error(
        `Search index too large: ${postCount} posts. Build halted to prevent performance degradation.`
      );
    }
  }

  /**
   * Eleventy after build event hook
   * Writes search index JSON file to output directory
   */
  eleventyConfig.on("eleventy.after", async ({ dir, results }) => {
    try {
      // Build search index from collections
      const searchIndex = [];

      // Get all blog posts
      results.forEach((result) => {
        if (result.inputPath && result.inputPath.includes("/blog/") && result.inputPath.endsWith(".md")) {
          const data = result.data || {};

          // Only index published posts
          if (data.title && !data.draft) {
            searchIndex.push({
              id: data.page?.fileSlug || path.basename(result.inputPath, ".md"),
              title: data.title,
              url: result.url || data.page?.url || "",
              excerpt: data.excerpt || extractExcerpt(result.content || ""),
              date: data.date || new Date().toISOString(),
              tags: Array.isArray(data.tags) ? data.tags : (data.tags ? [data.tags] : [])
            });
          }
        }
      });

      // Sort by date (newest first)
      searchIndex.sort((a, b) => new Date(b.date) - new Date(a.date));

      // Add build metadata
      const buildMetadata = {
        version: "1.0.0",
        buildTime: new Date().toISOString(),
        postCount: searchIndex.length
      };

      // Create complete output with metadata
      const outputData = {
        meta: buildMetadata,
        posts: searchIndex
      };

      const outputJSON = JSON.stringify(outputData, null, 2);
      const rawSizeKB = Math.round((outputJSON.length / 1024) * 100) / 100;

      // Validate and report metrics
      validateAndReportIndex(searchIndex, rawSizeKB);

      // Write to output directory
      const outputDir = dir.output || "_site";
      const outputPath = path.join(outputDir, "search-index.json");

      // Ensure output directory exists
      fs.mkdirSync(path.dirname(outputPath), { recursive: true });
      fs.writeFileSync(outputPath, outputJSON, "utf-8");

      console.log(
        `[Eleventy Search Plugin] ✓ search-index.json generated (${searchIndex.length} posts)`
      );
    } catch (error) {
      console.error(
        "[Eleventy Search Plugin] Error generating search index:",
        error.message
      );
      throw error;
    }
  });
};
