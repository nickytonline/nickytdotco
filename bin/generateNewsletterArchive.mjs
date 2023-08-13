import * as url from "url";
import { promises as fs, mkdirSync, existsSync } from "fs";
import path from "path";
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

const __dirname = url.fileURLToPath(new URL(".", import.meta.url));
const NEWSLETTER_DIRECTORY = path.join(__dirname, "..", "src", "newsletter");
const parser = new Parser();
const feed = await parser.parseURL(site.newsletterRss);
const { DEV_API_KEY } = process.env;
const DEV_TO_API_URL = "https://dev.to/api";

function generateEmbed(url, forDevTo = false, devToEmbedType = "embed") {
  return forDevTo
    ? `{% ${devToEmbedType} ${url} %}\n`
    : `{% embed "${url}" %}\n`;
}

const twitterEmbedMatcher =
  /(<p><html>.+?href="(?<twitterUrl>https:\/\/twitter.com\/[^\/]+?\/status\/\d+)\?ref_src=twsrc%5Etfw">.+?<\/html><\/p>)|(<html><body>.+?href="(?<twitterUrl2>https:\/\/twitter.com\/[^\/]+?\/status\/\d+)\?ref_src=twsrc%5Etfw[^"]*">.+?<\/body><\/html>)/gms;
const youtubeEmbedMatcher =
  /\n<a (?:class="video"\s+)?href="(?<YouTubeUrl>https:\/\/(youtu.be|(www\.)?youtube.com)[^"@]+?)">.+?<\/a>/gms;
const twitchEmbedMatcher =
  /\n<a\s+href="(?<TwitchUrl>https:\/\/(?:www\.)?twitch.tv\/[^"]+)">.+?<\/a>/gms;
const tagsMatcher = /<!-- tags:\s+(?<tags>.+?)\s+-->/s;
const codepenEmbedMatcher =
  /<a\s+href="(?<url>[^?"]+)(?:\?[^"]+)?">.+?<\/a>/gms;

const devToEmbedsMatcher = /\n(https:\/\/dev.to\/.+?)\n/gms;

function sanitizeContent(rawContent, forDevTo = false) {
  let updatedContent = rawContent.trim();

  // Get rid of HTML comment that holds tags. The tags are used in the frontmatter
  updatedContent = updatedContent
    .replace(tagsMatcher, "")
    .replace("\n\n$", "\n");

  const twitterEmbeds = updatedContent.matchAll(twitterEmbedMatcher);

  for (const twitterEmbed of twitterEmbeds) {
    const { twitterUrl, twitterUrl2 } = twitterEmbed.groups;
    updatedContent = updatedContent.replace(
      twitterEmbed[0],
      generateEmbed(twitterUrl ?? twitterUrl2, forDevTo, "twitter")
    );
  }

  // Replace YouTube embeds with embed shortcodes
  const youtubeEmbeds = updatedContent.matchAll(youtubeEmbedMatcher);

  for (const youtubeEmbed of youtubeEmbeds) {
    const { YouTubeUrl } = youtubeEmbed.groups;
    updatedContent = updatedContent.replace(
      youtubeEmbed[0],
      generateEmbed(YouTubeUrl, forDevTo)
    );
  }

  // Replace Twitch embeds with embed shortcodes
  const twitchEmbeds = updatedContent.matchAll(twitchEmbedMatcher);

  for (const twitchEmbed of twitchEmbeds) {
    const { TwitchUrl } = twitchEmbed.groups;
    updatedContent = updatedContent.replace(
      twitchEmbed[0],
      generateEmbed(TwitchUrl, forDevTo)
    );
  }

  // Replace Twitch embeds with embed shortcodes
  const codepenEmbeds = updatedContent.matchAll(codepenEmbedMatcher);

  for (const codepenEmbed of codepenEmbeds) {
    const { url } = codepenEmbed.groups;
    updatedContent = updatedContent.replace(
      codepenEmbed[0],
      generateEmbed(url, forDevTo, "codepen")
    );
  }

  updatedContent = updatedContent
    .replaceAll(devToEmbedsMatcher, `\n{% embed ${forDevTo ? "$1" : '"$1"'} %}`)
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
    link: canonicalUrl,
    content,
    contentSnippet,
    isoDate,
  } = feedItem;
  const tags = content
    .match(tagsMatcher)
    ?.groups.tags.split(",")
    .map((tag) => tag.trim()) ?? ["newsletter"];

  const jsonFrontmatter = {
    title,
    excerpt: contentSnippet,
    date: isoDate,
    tags,
    canonical_url: canonicalUrl,
    template: "newsletter",
  };

  const filename = slugify(
    `${isoDate.split("T")[0]} ${title.replace(/:/g, " ")}`
  );
  console.log(`Saving newsletter ${filename}`);

  const markdown = `---json\n${JSON.stringify(
    jsonFrontmatter,
    null,
    2
  )}\n---\n\n${sanitizeContent(content)}\n`;

  const newsIssuePath = path.join(NEWSLETTER_DIRECTORY, `${filename}.md`);
  const publishedToDevTo = existsSync(newsIssuePath);

  await fs.writeFile(newsIssuePath, markdown);

  if (publishedToDevTo && !isDevMode) {
    console.log(`Newsletter ${filename} already published to dev.to`);
    return;
  }

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
          content,
          true
        )}\nIf you liked this newsletter, you can [subscribe](https://www.nickyt.co/pages/newsletter/) or if RSS is your jam, you can also [subscribe via RSS](https://www.nickyt.co/newsletter.rss).<!-- my newsletter -->`,
        tags,
        series: "Yet Another Newsletter LOL",
        canonical_url: canonicalUrl,
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
      console.error(
        `Couldn't create article on dev.to: ${response.statusText}`
      );
    }
  } catch (error) {
    console.error("Couldn't create article on dev.to", error);
  }
}

if (!existsSync(NEWSLETTER_DIRECTORY)) {
  mkdirSync(NEWSLETTER_DIRECTORY);
}

// Only create/update the latest newsletter issue as this runs the day a newsletter is published
const latestNewsletter = feed.items.find(
  (issue) =>
    new Date(issue.isoDate).toDateString() === new Date().toDateString()
);

await generateNewsletterPost(latestNewsletter);

console.log("Finished generating newsletter archives");
