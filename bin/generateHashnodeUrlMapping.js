#!/usr/bin/env node

const Parser = require('rss-parser');
const fs = require('fs/promises');
const path = require('path');

const HASHNODE_RSS_FEED_URL = 'https://hashnode.iamdeveloper.com/rss.xml';
const hashnodeUrlsFilePath = path.resolve(__dirname, '../src/_data/hashnodeUrls.json');

/**
 * Generates Eleventy data for generating boost links for Hashnode.
 *
 * @param {string} feedUrl The URL of the Hashnode RSS feed.
 * @returns {object} Eleventy data for generating boost links for Hashnode.
 */
async function generateHashnodeFeedMapping(feedUrl) {
  const parser = new Parser();

  const feed = await parser.parseURL(feedUrl);

  const items = feed.items.reduce((slugsAndUrls, item) => {
    slugsAndUrls[item.link.replace(/.+\//, '')] = item.link;

    return slugsAndUrls;
  }, {});

  return items;
}

async function saveSlugsAndUrls(filepath, data) {
  await fs.writeFile(filepath, JSON.stringify(data));
}

(async () => {
  const slugsAndUrls = await generateHashnodeFeedMapping(HASHNODE_RSS_FEED_URL);
  await saveSlugsAndUrls(hashnodeUrlsFilePath, slugsAndUrls);
})();
