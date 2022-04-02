#!/usr/bin/env node
require('dotenv').config();

const {createMapFromString} = require('html-minifier/src/utils');
const fetch = require('node-fetch');
const path = require('path');
const fs = require('fs').promises;
const DEV_TO_API_URL = 'https://dev.to/api/articles/me/published?per_page=1000';
const {DEV_API_KEY} = process.env;
const postsDirectory = path.join(__dirname, '../src/posts');

function sanitizeMarkdown(markdown) {
  const sanitizedMarkdown = markdown.replaceAll(
    /{%\s*?(?<shortcode>[^\s+]*)\s+?(?<id>[^'"\s]+)\s*?%}/g,
    '{% $1 "$2" %}'
  );

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
  const {tag_list: tags = []} = post;

  return (
    !tags.includes('jokes') &&
    !tags.includes('weeklylearn') &&
    !tags.includes('weeklyretro') &&
    !tags.includes('watercooler') &&
    !tags.includes('devhumor') &&
    !tags.includes('discuss') &&
    !tags.includes('vscodetip')
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

async function getDevPosts() {
  const response = await fetch(DEV_TO_API_URL, {
    headers: {
      'api-key': DEV_API_KEY
    }
  });
  const posts = await response.json();

  return posts.filter(isValidPost);
}

// Fetch all articles minus markdown
// https://dev.to/api/articles/me/published?per_page=1000

// loop through each articles and grab markdown

// write each file in src/posts using the format for the filename as slug.md

async function createPostFile(post) {
  const {
    body_markdown,
    title,
    description: excerpt,
    published_at: date,
    tag_list: tags,
    cover_image,
    slug
  } = post;
  const jsonFrontmatter = {title, excerpt, date, tags, cover_image, template: 'post'};
  let markdownBody;

  if (/^---\n/.test(body_markdown)) {
    // v1 editor
    markdownBody = body_markdown.replace(/^---\n(.|[\r\n])*?---\n*/, '');
  } else {
    markdownBody = body_markdown;
  }

  const markdown = `---json\n${JSON.stringify(
    jsonFrontmatter,
    null,
    2
  )}\n---\n${markdownBody}\n`;

  const postFile = path.join(postsDirectory, `${slug}.md`);
  await fs.writeFile(postFile, sanitizeMarkdown(markdown));

  return {status: 'success'};
}

(async () => {
  await fs.mkdir(postsDirectory, {recursive: true});

  const posts = await getDevPosts();

  /*
---json
{
  "title": "My page title"
}
---
*/
  for (const post of posts) {
    const {status} = await createPostFile(post);
    console.log(status);
  }
})();
