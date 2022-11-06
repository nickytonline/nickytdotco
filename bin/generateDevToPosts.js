#!/usr/bin/env node
require('dotenv').config();

const jsdom = require('@tbranyen/jsdom');
const {JSDOM} = jsdom;
const path = require('path');
const fs = require('fs').promises;
const {DEV_API_KEY} = process.env;
const SLUG_INCLUSION_LIST = require('./slugInclusionList.json');

const DEV_TO_API_URL = 'https://dev.to/api';
const POSTS_DIRECTORY = path.join(__dirname, '../src/blog');
const VSCODE_TIPS_POSTS_DIRECTORY = path.join(__dirname, '../src/vscodetips');
const POSTS_IMAGES_PUBLIC_DIRECTORY = '/images/posts';
const POSTS_IMAGES_DIRECTORY = path.join(
  __dirname,
  '../src',
  POSTS_IMAGES_PUBLIC_DIRECTORY
);
const EMBEDDED_POSTS_MARKUP_FILE = path.join(
  __dirname,
  '../src/_data/embeddedPostsMarkup.json'
);
const TWITTER_EMBEDS_FILE = path.join(__dirname, '../src/_data/twitterEmbeds.json');
const currentBlogPostEmbeds = require('../src/_data/embeddedPostsMarkup.json');
const blogPostEmbeds = new Map(Object.entries(currentBlogPostEmbeds));

const currentTwitterEmbeds = require('../src/_data/twitterEmbeds.json');
const twitterEmbeds = new Map(Object.entries(currentTwitterEmbeds));
const DOM = new JSDOM(`<!DOCTYPE html><html><head></head><body></body></html>`, {
  resources: 'usable',
});

const {document} = DOM.window;
let {url: siteUrl} = require('../src/_data/site.json');

if (!DEV_API_KEY) {
  throw new Error('Missing DEV_API_KEY environment variable');
}

/**
 * Determine whether or not a file exists.
 *
 * @param {string} path
 *
 * @returns True if the file exists, otherwise false.
 */
async function fileExists(path) {
  return !!(await fs.stat(path).catch((_error) => false));
}

/**
 * Ensures that embeds coming from dev.to that are strings are in quotes in the markdown.
 * Otherwise Eleventy misinterprets and tries to parse them as a number.
 *
 * @param {string} markdown
 *
 * @returns sanitized markdown
 */
function sanitizeMarkdownEmbeds(markdown) {
  const sanitizedMarkdown = markdown
    .replaceAll(/{%\s*?(?<shortcode>[^\s+]*)\s+?(?<id>[^'"\s]+)\s*?%}/g, '{% $1 "$2" %}')
    // Fixes a liquid JS issues when {{ code }} is used in a markdown code block
    // see https://github.com/11ty/eleventy/issues/2273
    .replaceAll(
      /```(?<language>.*)\n(?<code>(.|\n)+?)\n```/g,
      '```$1\n{% raw %}\n$2\n{% endraw %}\n```'
    )
    // We need to add raw shortcodes to prevent shortcodes within code blocks from rendering.
    // For now, this only supports single-line code blocks.
    .replaceAll(/(`{%[^%]+%}`)/g, '{% raw %}$1{% endraw %}');

  return sanitizedMarkdown;
}

/**
 * Determines whethere or not a post coming from DEV (the CMS) is valid or not to publish
 * on this blog.
 *
 * @param {object} post The post to validate.
 *
 * @returns {boolean} True if the post is valid for publishing, otherwise false.
 */
function isValidPost(post) {
  const {tag_list: tags = [], slug} = post;

  return (
    (!tags.includes('jokes') &&
      !tags.includes('weeklylearn') &&
      !tags.includes('weeklyretro') &&
      !tags.includes('watercooler') &&
      !tags.includes('devhumor') &&
      !tags.includes('discuss') &&
      !tags.includes('vscodetip') &&
      !tags.includes('explainlikeimfive') &&
      !tags.includes('help')) ||
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

/**
 * Retrieves the latest blog posts from dev.to.
 *
 * @returns {Promise<object[]>} A promise that resolves to an array of blog posts.
 */
async function getDevPosts() {
  const response = await fetch(DEV_TO_API_URL + '/articles/me/published?per_page=1000', {
    headers: {
      'api-key': DEV_API_KEY,
    },
  });
  const posts = await response.json();

  return posts.filter(isValidPost);
}

let retries = 0;

/**
 * Retrieves the blog post for the given blog post ID.
 *
 * @param {string} id The ID of the blog post to retrieve.
 *
 * @returns {Promise<object>} A promise that resolves to a blog posts.
 */
async function getDevPost(blogPostId) {
  const getArticleUrl = `${DEV_TO_API_URL}/articles/${blogPostId}`;
  const response = await fetch(getArticleUrl, {
    headers: {
      'api-key': DEV_API_KEY,
      'Content-Type': 'application/json',
    },
  });

  let post;

  try {
    post = await response.json();
  } catch (error) {
    if (retries > 3) {
      retries = 0;
      throw error;
    }

    console.log(`Retry attemps ${retries} for ${getArticleUrl}`);
    retries++;

    await getDevPost(blogPostId);
  }

  return post;
}

/**
 * Generates a markdown file for the given blog post.
 *
 * @param {object} post The blog post to generate a markdown file for.
 */
async function createPostFile(post) {
  const {
    body_markdown,
    title,
    description: excerpt,
    published_at: date,
    tag_list: tags,
    reading_time_minutes,
    cover_image,
    slug,
    canonical_url: canonicalUrl,
  } = post;
  const jsonFrontmatter = {
    title,
    excerpt,
    date,
    tags,
    cover_image,
    canonicalUrl,
    reading_time_minutes,
    template: 'post',
  };
  let markdownBody;

  if (/^---(\r|\n)/.test(body_markdown)) {
    // v1 editor
    markdownBody = body_markdown.replace(/^---(\r|\n)(.|\r|\n)*?---\n*/, '');
  } else {
    markdownBody = body_markdown;
  }

  const markdown = `---json\n${JSON.stringify(
    jsonFrontmatter,
    null,
    2
  )}\n---\n\n${sanitizeMarkdownEmbeds(markdownBody).trim()}\n`;

  const basePath = tags.includes('vscodetips')
    ? path.join(VSCODE_TIPS_POSTS_DIRECTORY, new Date(date).getFullYear().toString())
    : POSTS_DIRECTORY;
  const postFile = path.join(basePath, `${slug}.md`);
  await fs.writeFile(postFile, markdown);

  // Checking for a backtick before the Twitter embed so that we're not pulling in a code example of an embed.
  const twitterEmbedMatches = markdown.matchAll(
    /(?:[^`]{%\stwitter\s"(?<id>[^"\s]+)"\s%})|(?:{%\sembed\s"https:\/\/(?:www\.)?twitter\.com\/[^/]+\/status\/(?<id2>[^"\s]+?)(?:\?.+)?"\s%})/g
  );

  for (const {
    groups: {id, id2},
  } of twitterEmbedMatches) {
    const tweetId = id ?? id2;

    if (!twitterEmbeds.has(tweetId)) {
      // It doesn't matter who the user is. It's the Tweet ID that matters.
      const response = await fetch(
        `https://publish.twitter.com/oembed?url=${encodeURIComponent(
          `https://twitter.com/anyone/status/${tweetId}`
        )}`
      );

      console.log(
        `Grabbing markup for Tweet https://twitter.com/anyone/status/${tweetId}`
      );

      const {html} = await response.json();

      twitterEmbeds.set(tweetId, html);
    }
  }

  return {status: 'success'};
}

/**
 * Save an image URL to a local file.
 *
 * @param {string} imageUrl The URL of the image to save.
 * @param {string} imageFilePath The path to save the image to.
 *
 */
async function saveImageUrl(imageUrl, imageFilePath) {
  const response = await fetch(imageUrl);
  const buffer = Buffer(await response.arrayBuffer());

  await fs.writeFile(imageFilePath, buffer, () =>
    console.log(`Saved image ${imageUrl} to ${imageFilePath}!`)
  );
}

/**
 * Generates an image URL hosted by the domain the blog is hosted on.
 *
 * @param {URL} imageUrl
 * @returns {string} The new image URL.
 */
function generateNewImageUrl(imageUrl) {
  const imagefilename = imageUrl.pathname.replaceAll('/', '_');
  const newImageUrl = new URL(
    siteUrl + path.join(POSTS_IMAGES_PUBLIC_DIRECTORY, imagefilename)
  ).toString();

  return newImageUrl;
}

/**
 * Saves a markdown image URL to a local file and returns the new image URL.
 * TODO: Fix mixing two concerns.
 * @param {string} markdownImageUrl
 *
 * @returns {string} Returns the new image URL.
 */
async function saveMarkdownImageUrl(markdownImageUrl = null) {
  let newMarkdownImageUrl = null;

  if (markdownImageUrl) {
    const imageUrl = new URL(markdownImageUrl);
    const imagefilename = imageUrl.pathname.replaceAll('/', '_');
    const localCoverImagePath = path.join(POSTS_IMAGES_DIRECTORY, imagefilename);

    newMarkdownImageUrl = generateNewImageUrl(imageUrl);

    if (!(await fileExists(localCoverImagePath))) {
      console.log(`Saving image ${imageUrl} to ${localCoverImagePath}`);
      await saveImageUrl(markdownImageUrl, localCoverImagePath);
    }
  }

  return newMarkdownImageUrl;
}

/**
 * Saves all markdown images to local files to be served by the blog.
 *
 * @param {string[]} imagesToSave
 */
async function saveMarkdownImages(imagesToSave) {
  for (const imageToSave of imagesToSave) {
    await saveMarkdownImageUrl(imageToSave);
  }
}

/**
 * Updates all markdown image URLs with URLs hosted by the domain the blog is hosted on.
 * @param {string} markdown
 *
 * @returns The updated markdown.
 */
async function updateMarkdownImageUrls(markdown) {
  let updatedMarkdown = markdown;
  const imagesToSave = [];
  const matches = markdown.matchAll(/!\[.*?\]\((?<oldImageUrl>.*?)\)/g);

  for (const match of matches) {
    const {oldImageUrl} = match.groups;

    const imageUrl = new URL(oldImageUrl);

    if (!imageUrl.host.includes('giphy.com')) {
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

async function getDevBlogPostEmbedsMarkup(markdown, embeds) {
  // Checking for a backtick before the embed so that we're not pulling in a code example of an embed.
  const matches = markdown.matchAll(
    /[^`]{%\s*?(?<embedType>[^\s]+)\s+?(?<embedUrl>[^\s]+)/g
  );

  for (const match of matches) {
    const {embedType, embedUrl} = match.groups;

    let url = null;

    try {
      url = new URL(embedUrl);
    } catch (error) {
      url = null;
    }

    if (
      url &&
      !embeds.has(embedUrl) &&
      url.host === 'dev.to' &&
      embedType !== 'podcast' &&
      embedType !== 'tag'
    ) {
      const respones = await fetch(embedUrl);
      const markup = await respones.text();

      embeds.set(embedUrl, markup);
    }
  }
}

async function updateBlogPostEmbeds(embeds, filePaths) {
  let blogPostEmbedsMarkup = {};

  for (const [url] of embeds) {
    // You can't use the dev.to API to grab an article by slug, so we need to use the URL instead
    // to fetch the markup of the article page to extract the article ID.
    // This is only an issue for article embeds.
    const response = await fetch(url);
    const html = await response.text();
    const match = html.match(/data-article-id="(?<blogPostId>.+?)"/);

    if (match) {
      const {blogPostId} = match.groups;
      const {
        body_html,
        body_markdown,
        comments_count,
        public_reactions_count,
        positive_reactions_count,
        ...data
      } = await getDevPost(blogPostId);

      blogPostEmbedsMarkup[url] = data;
    } else {
      throw new Error(`Could not find blog post at ${url}`);
    }
  }

  const data = JSON.stringify(blogPostEmbedsMarkup, null, 2);

  await fs.writeFile(filePaths, data, () =>
    console.log(`Saved image ${imageUrl} to ${imageFilePath}!`)
  );
}

async function updateTwitterEmbeds(twitterEmbeds, filepath) {
  let tweetEmbeds = Object.fromEntries(twitterEmbeds);

  const data = JSON.stringify(tweetEmbeds, null, 2);

  await fs.writeFile(filepath, data, () =>
    console.log(`Saved Twitter embeds markup to ${filepath}!`)
  );
}

(async () => {
  await Promise.all([
    fs.mkdir(POSTS_DIRECTORY, {recursive: true}),
    fs.mkdir(POSTS_DIRECTORY, {
      recursive: true,
    }),
    fs.mkdir(
      path.join(VSCODE_TIPS_POSTS_DIRECTORY, new Date().getFullYear().toString()),
      {
        recursive: true,
      }
    ),
    fs.mkdir(POSTS_IMAGES_DIRECTORY, {recursive: true}),
  ]);

  const posts = await getDevPosts();

  // Only publish posts that are not under the vscodetips dev.to organization.
  for (const post of posts.filter((post) => {
    return (
      !['vscodetips', 'virtualcoffee'].includes(post.organization?.username) ||
      (post.organization?.username === 'vscodetips' &&
        post.tag_list.includes('vscodetips'))
    );
  })) {
    const updatedCoverImage = await saveMarkdownImageUrl(post.cover_image);
    const {markdown, imagesToSave} = await updateMarkdownImageUrls(post.body_markdown);

    await Promise.all([
      saveMarkdownImages(imagesToSave),
      getDevBlogPostEmbedsMarkup(markdown, blogPostEmbeds),
    ]);

    const updatedPost = {
      ...post,
      cover_image: updatedCoverImage,
      body_markdown: markdown,
    };
    const {status} = await createPostFile(updatedPost);

    if (status !== 'success') {
      console.error(`Failed to create post file for ${JSON.stringify(post, null, 2)}`);

      throw new Error(`Unabled to generate markdown file: status ${status}`);
    }
  }

  await updateTwitterEmbeds(twitterEmbeds, TWITTER_EMBEDS_FILE);
  await updateBlogPostEmbeds(blogPostEmbeds, EMBEDDED_POSTS_MARKUP_FILE);
})();
