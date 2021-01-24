const {DateTime} = require('luxon');
const rssPlugin = require('@11ty/eleventy-plugin-rss');
const syntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight');
const fs = require('fs');

// Import filters
const dateFilter = require('./src/filters/date-filter.js');
const markdownFilter = require('./src/filters/markdown-filter.js');
const w3DateFilter = require('./src/filters/w3-date-filter.js');
const {
  convertDevEmbeds,
  removePostIsOnDevLink
} = require('./src/filters/devToFilters.js');

const {youtube, boostButton, googleAnalytics, socialImage} = require('./src/shortCodes');

// Import transforms
const htmlMinTransform = require('./src/transforms/html-min-transform.js');
const parseTransform = require('./src/transforms/parse-transform.js');

// Import data files
const site = require('./src/_data/site.json');

module.exports = function(config) {
  // Filters
  config.addFilter('dateFilter', dateFilter);
  config.addFilter('markdownFilter', markdownFilter);
  config.addFilter('w3DateFilter', w3DateFilter);
  config.addFilter('convertDevEmbeds', convertDevEmbeds);
  config.addFilter('removePostIsOnDevLink', removePostIsOnDevLink);
  config.addFilter('htmlDateString', dateObj =>
    DateTime.fromJSDate(dateObj).toFormat('yyyy-LL-dd')
  );

  // Layout aliases
  config.addLayoutAlias('home', 'layouts/home.njk');

  // Transforms
  config.addTransform('htmlmin', htmlMinTransform);
  config.addTransform('parse', parseTransform);

  // Passthrough copy
  config.addPassthroughCopy('src/fonts');
  config.addPassthroughCopy('src/images');
  config.addPassthroughCopy('src/js');
  config.addPassthroughCopy('node_modules/nunjucks/browser/nunjucks-slim.js');
  config.addPassthroughCopy('src/robots.txt');

  // Short Codes
  config.addShortcode('boostButton', boostButton);
  config.addShortcode('youtube', youtube);
  config.addShortcode('googleAnalytics', googleAnalytics);
  config.addShortcode('socialImage', socialImage);

  const now = new Date();

  /**
   * Determines whethere or not a post coming from DEV (the CMS) is valid or not to publish
   * on this blog.
   *
   * @param {object} post The post to validate.
   *
   * @returns {boolean} True if the post is valid for publishing, otherwise false.
   */
  function isValidPost(post) {
    const {tags = []} = post.data ?? {};

    return (
      !tags.includes('weeklylearn') &&
      !tags.includes('weeklyretro') &&
      !tags.includes('watercooler') &&
      !tags.includes('devhumor')
    );
  }

  function filterOutUnwantedTags(collection) {
    return collection.getFilteredByGlob('./src/posts/*.md').filter(isValidPost);
  }

  // Custom collections
  const livePosts = post => post.date <= now && !post.data.draft;
  config.addCollection('posts', collection => {
    return [...filterOutUnwantedTags(collection).filter(livePosts)].reverse();
  });

  config.addCollection('postFeed', collection => {
    return [...filterOutUnwantedTags(collection).filter(livePosts)]
      .reverse()
      .slice(0, site.maxPostsPerPage);
  });

  config.addCollection('sitemapPages', function(collection) {
    // get unsorted items
    return collection.getAll().filter(isValidPost);
  });

  // Plugins
  config.addPlugin(rssPlugin);
  config.addPlugin(syntaxHighlight);

  // 404
  config.setBrowserSyncConfig({
    callbacks: {
      ready: function(err, browserSync) {
        const content_404 = fs.readFileSync('dist/404.html');

        browserSync.addMiddleware('*', (req, res) => {
          // Provides the 404 content without redirect.
          res.write(content_404);
          res.end();
        });
      }
    }
  });

  return {
    dir: {
      input: 'src',
      output: 'dist'
    },
    passthroughFileCopy: true
  };
};
