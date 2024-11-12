#!/usr/bin/env node
const path = require("path");
const { talks } = require("../src/_data/talks");
const fs = require("fs").promises;

const TALKS_DIRECTORY = path.join(__dirname, "../src/talks");

/*

Sample post format:

{
  "title": "Strongly Typed JSON in TypeScript",
  "description": "Someone in one of the Slack communities I'm a part of asked today how to type JSON in TypeScript,...",
  "published": true,
  "published_at": "2022-04-01T03:36:19.595Z",
  "slug": "strongly-typed-json-in-typescript-5gb2",
  "published_timestamp": "2022-04-01T03:36:19Z",
  "body_markdown": ""
*/

/**
 * Generates a markdown file for the given blog post.
 *
 * @param {object} talk The talk to generate a markdown file for.
 */
async function createTalkFile(talk) {
  const [
    slug,
    {
      title,
      date,
      venue,
      video,
      summary,
      slideDeck,
      sourceCode,
      tags = [],
      additionalLinks,
    },
  ] = talk;

  const jsonFrontmatter = {
    title,
    excerpt: summary,
    venue: venue.name,
    date: date.toISOString(),
    tags: [...tags, "talks"],
    template: "post",
  };

  const markdownBody = `
      ${video?.type === "youtube" ? `{% embed "${video.url}" %}` : ""}
      ${video?.type === "vimeo" ? `{% embed "${video.url}" %}` : ""}
      ${
        video?.type === "custom"
          ? `<a href="${video.url}" title="${title}"><img src="${video.image.url}" width="${video.image.width}" height="${video.image.height}" /></a>`
          : ""
      }${
        video?.pending
          ? `<p class="weight-bold">Video will be available soon</p>`
          : ""
      }${
        !video
          ? `<p class="weight-bold">There is no video available for this talk</p>`
          : ""
      }<p><span class="weight-bold">Venue:</span> <a href="${venue.url}">${
        venue.name
      }</a></p>
      ${
        summary
          ? `<span class="weight-bold">Summary:</span> ${summary}</p>`
          : ""
      }
      ${
        slideDeck || sourceCode || additionalLinks
          ? `<p class="weight-bold">Links:</p>
            <ul>
              ${
                slideDeck
                  ? `<li>
                  <a href="${slideDeck}">slide deck</a>
                </li>`
                  : ""
              }
              ${
                sourceCode
                  ? `<li>
                  <a href="${sourceCode}">source code</a>
                </li>`
                  : ""
              }

              ${
                additionalLinks
                  ? additionalLinks
                      .map((link) => {
                        return `
                    <li>
                      <a href="${link.url}">${link.title}</a>
                    </li>
                  `;
                      })
                      .join("")
                  : ``
              }
            </ul>`
          : ""
      }
  `;

  const markdown = `---json\n${JSON.stringify(
    jsonFrontmatter,
    null,
    2,
  )}\n---\n\n${sanitizeMarkdownEmbeds(markdownBody).trim()}\n`;

  const talkFile = path.join(TALKS_DIRECTORY, `${slug}.md`);
  await fs.writeFile(talkFile, markdown);

  return { status: "success" };
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
    .replaceAll(
      /{%\s*?(?<shortcode>[^\s+]*)\s+?(?<id>[^'"\s]+)\s*?%}/g,
      '{% $1 "$2" %}',
    )
    // Fixes a liquid JS issues when {{ code }} is used in a markdown code block
    // see https://github.com/11ty/eleventy/issues/2273
    .replaceAll(
      /```(?<language>.*)\n(?<code>(.|\n)+?)\n```/g,
      "```$1\n{% raw %}\n$2\n{% endraw %}\n```",
    )
    // We need to add raw shortcodes to prevent shortcodes within code blocks from rendering.
    // For now, this only supports single-line code blocks.
    .replaceAll(/(`{%[^%]+%}`)/g, "{% raw %}$1{% endraw %}");

  return sanitizedMarkdown;
}

(async () => {
  await Promise.all([
    fs.mkdir(TALKS_DIRECTORY, { recursive: true }),
    fs.mkdir(TALKS_DIRECTORY, {
      recursive: true,
    }),
  ]);

  for (const talk of talks.entries()) {
    const { status } = await createTalkFile(talk);

    if (status !== "success") {
      console.error(
        `Failed to create post file for ${JSON.stringify(talk, null, 2)}`,
      );

      throw new Error(`Unabled to generate markdown file: status ${status}`);
    }
  }
})();
