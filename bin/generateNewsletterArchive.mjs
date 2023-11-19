import Parser from "rss-parser";
import site from "../src/_data/site.js";
import { socialImage } from "../src/shortCodes/index.js";
import slugify from "slugify";

const isDevMode = process.env.NODE_ENV === "development";

if (isDevMode) {
  const dotenv = await import("dotenv");
  // add code to import env variables using dotenv
  dotenv.config();
}

const parser = new Parser();
const feed = await parser.parseURL(site.newsletterRss);
const { DEV_API_KEY } = process.env;
const DEV_TO_API_URL = "https://dev.to/api";

if (!DEV_API_KEY) {
  console.error("No DEV_API_KEY environment variable set.");
}

function generateEmbed(url, embedType = "embed") {
  return `{% ${embedType} ${url} %}\n`;
}

const youtubeEmbedMatcher =
  /\n<a (?:class="video"\s+)?href="(?<YouTubeUrl>https:\/\/(youtu.be|(www\.)?youtube.com)[^"@]+?)">.+?<\/a>/gms;
const twitchEmbedMatcher =
  /\n<a\s+href="(?<TwitchUrl>https:\/\/(?:www\.)?twitch.tv\/[^"]+)">.+?<\/a>/gms;
const tagsMatcher = /<!-- tags:(?<tags>.+?)-->/s;
const codepenEmbedMatcher =
  /\n<a\s+href="(?<url>https:\/\/(?:www\.)?codepen.io\/[^"]+)">.+?<\/a>/gms;

const devToEmbedsMatcher = /\n(https:\/\/dev.to\/.+?)\n/gms;

function sanitizeContent(rawContent) {
  let updatedContent = rawContent.trim();

  // Get rid of HTML comment that holds tags. The tags are used in the frontmatter
  updatedContent = updatedContent
    .replace(tagsMatcher, "")
    .replace("\n\n$", "\n");

  // Replace YouTube embeds with embed shortcodes
  const youtubeEmbeds = updatedContent.matchAll(youtubeEmbedMatcher);

  for (const youtubeEmbed of youtubeEmbeds) {
    const { YouTubeUrl } = youtubeEmbed.groups;
    updatedContent = updatedContent.replace(
      youtubeEmbed[0],
      generateEmbed(YouTubeUrl)
    );
  }

  // Replace Twitch embeds with embed shortcodes
  const twitchEmbeds = updatedContent.matchAll(twitchEmbedMatcher);

  for (const twitchEmbed of twitchEmbeds) {
    const { TwitchUrl } = twitchEmbed.groups;
    updatedContent = updatedContent.replace(
      twitchEmbed[0],
      generateEmbed(TwitchUrl)
    );
  }

  // Replace Twitch embeds with embed shortcodes
  const codepenEmbeds = updatedContent.matchAll(codepenEmbedMatcher);

  for (const codepenEmbed of codepenEmbeds) {
    const { url } = codepenEmbed.groups;
    updatedContent = updatedContent.replace(
      codepenEmbed[0],
      generateEmbed(url, "codepen")
    );
  }

  updatedContent = updatedContent
    .replaceAll(devToEmbedsMatcher, `\n{% embed ${"$1"} %}`)
    .replaceAll(/<h2\s+[^>]+>/gi, "<h2>")

    // begin replacing inline styles from social cards in newsletter
    .replaceAll(
      /style="width: 100%; background: #fff; border: 1px #ced3d9 solid; border-radius: 5px; margin-top: 1em; overflow: auto; margin-bottom: 1em;"/g,
      'class="news-social-card"'
    )
    .replaceAll(/style="float: left"/g, 'class="float-left"')
    .replaceAll(
      /style="float: left; color: #393f48; padding-left: 1em; padding-right: 1em;"/g,
      'class="float-left news-social-card-text"'
    )
    .replaceAll(/style="[^"]+"/gi, "")
    // end replacing inline styles from social cards in newsletter
    .replaceAll(
      "?utm_campaign=Yet%20Another%20Newsletter%20LOL&amp;utm_medium=email&amp;utm_source=Revue%20newsletter",
      ""
    )
    .replace(/<!--\[if mso\]>.+?<!\[endif\]-->/gs, "");

  return updatedContent;
}

async function generateNewsletterPost(feedItem) {
  const {
    title,
    link: canonical_url,
    content,
    contentSnippet,
    isoDate,
  } = feedItem;
  const tags = content
    .match(tagsMatcher)
    ?.groups.tags.split(",")
    .map((tag) => tag.trim()) ?? ["newsletter"];

  try {
    // dev.to doesn't support webp for cover images so explicitly render as png
    const main_image = socialImage(title, contentSnippet).replace(
      ",f_auto",
      ",f_png"
    );
    const article = {
      article: {
        title,
        published: true,
        body_markdown: `<!-- ${main_image} -->\n${sanitizeContent(
          content
        )}\nIf you liked this newsletter, you can [subscribe](https://www.nickyt.co/pages/newsletter/) or if RSS is your jam, you can also [subscribe via RSS](https://buttondown.email/nickytonline/rss).\n<!-- my newsletter -->`,
        tags,
        series: "Yet Another Newsletter LOL",
        canonical_url,
      },
    };

    const response = await fetch(DEV_TO_API_URL + "/articles", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": DEV_API_KEY,
      },
      body: JSON.stringify(article),
    });

    if (response.status !== 201) {
      throw new Error(
        `Couldn't create article on dev.to: ${response.statusText}`
      );
    }
  } catch (error) {
    throw new Error("Couldn't create article on dev.to", error);
  }
}

// Only create/update the latest newsletter issue as this runs the day a newsletter is published
const latestNewsletter = feed.items.find(
  (issue) =>
    new Date(issue.isoDate).toDateString() === new Date().toDateString()
);

await generateNewsletterPost(latestNewsletter);

console.log("Finished publishing newsletter to dev.to");
