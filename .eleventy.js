const { DateTime } = require("luxon");
const rssPlugin = require("@11ty/eleventy-plugin-rss");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const fs = require("fs");

// Import filters
const dateFilter = require("./src/filters/date-filter.js");
const markdownFilter = require("./src/filters/markdown-filter.js");
const w3DateFilter = require("./src/filters/w3-date-filter.js");

const {
  boostLink,
  youtubeEmbed,
  socialImage,
  embedEmbed,
  twitterEmbed,
  codepenEmbed,
  devLinkEmbed,
  devCommentEmbed,
  genericEmbed,
  instagramEmbed,
  codeSandboxEmbed,
} = require("./src/shortCodes");

// Import transforms
const htmlMinTransform = require("./src/transforms/html-min-transform.js");
const parseTransform = require("./src/transforms/parse-transform.js");

// Import data files
const site = require("./src/_data/site");
module.exports = function (config) {
  // Filters
  config.addFilter("dateFilter", dateFilter);
  config.addFilter("markdownFilter", markdownFilter);
  config.addFilter("w3DateFilter", w3DateFilter);
  config.addFilter("htmlDateString", (dateObj) =>
    DateTime.fromJSDate(dateObj).toFormat("yyyy-LL-dd"),
  );

  // Layout aliases
  config.addLayoutAlias("home", "layouts/home.njk");

  // Transforms
  config.addTransform("htmlmin", htmlMinTransform);
  config.addTransform("parse", parseTransform);

  // Passthrough copy
  config.addPassthroughCopy("src/fonts");
  config.addPassthroughCopy("src/images");
  config.addPassthroughCopy("src/js");
  config.addPassthroughCopy("src/robots.txt");

  // Short Codes
  config.addShortcode("boostLink", boostLink);
  config.addShortcode("youtube", youtubeEmbed);
  config.addShortcode("socialImage", socialImage);

  config.addShortcode("twitter", twitterEmbed);
  config.addShortcode("codepen", codepenEmbed);
  config.addShortcode("link", devLinkEmbed);
  config.addShortcode("devcomment", devCommentEmbed);
  config.addShortcode("github", genericEmbed);
  config.addShortcode("instagram", instagramEmbed);
  config.addShortcode("codesandbox", codeSandboxEmbed);

  config.addShortcode("embed", embedEmbed);

  // Custom collections
  config.addCollection("posts", (collection) => {
    const collections = collection
      .getFilteredByGlob("./src/blog/*.md")
      .reverse();

    return collections;
  });

  config.addCollection("postFeed", (collection) => {
    const col = collection
      .getFilteredByGlob("./src/blog/*.md")
      .reverse()
      .slice(0, site.maxPostsPerPage)
      .map((post) => {
        post.data.cover_image ??= socialImage(
          post.data.title,
          post.data.excerpt,
        );
        return post;
      });

    return col;
  });

  config.addCollection("sitemapPages", function (collection) {
    // get unsorted items
    return collection.getAll();
  });

  config.addCollection("talks", (collection) => {
    return collection.getFilteredByGlob("./src/talks/*.md").reverse();
  });

  config.addCollection("rssFeed", (collection) => {
    return collection.getFilteredByGlob("./src/{blog,talks}/*.md").reverse();
  });

  // Plugins
  config.addPlugin(rssPlugin);
  config.addPlugin(syntaxHighlight);

  // 404
  config.setBrowserSyncConfig({
    callbacks: {
      ready: function (err, browserSync) {
        const content_404 = fs.readFileSync("dist/404.html");

        browserSync.addMiddleware("*", (req, res) => {
          // Provides the 404 content without redirect.
          res.write(content_404);
          res.end();
        });
      },
    },
  });

  return {
    dir: {
      input: "src",
      output: "dist",
    },
    passthroughFileCopy: true,
  };
};
