import * as url from 'url';
import {promises as fs, mkdirSync, existsSync} from 'fs';
import path from 'path';
import Parser from 'rss-parser';
import site from '../src/_data/site.json' assert {type: 'json'};
import {socialImage} from '../src/shortCodes/index.js';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
const NEWSLETTER_DIRECTORY = path.join(__dirname, '..', 'src', 'newsletter');
const parser = new Parser();
const feed = await parser.parseURL(site.newsletterRss);
const {DEV_API_KEY} = process.env;
const DEV_TO_API_URL = 'https://dev.to/api';

function generateEmbed(url, forDevTo = false) {
  return forDevTo ? `{% embed ${url} %}\n` : `{% embed "${url}" %}\n`;
}

const twitterEmbedRegex =
  /(<p><html>.+?href="(?<twitterUrl>https:\/\/twitter.com\/[^\/]+?\/status\/\d+)\?ref_src=twsrc%5Etfw">.+?<\/html><\/p>)|(<html><body>.+?href="(?<twitterUrl2>https:\/\/twitter.com\/[^\/]+?\/status\/\d+)\?ref_src=twsrc%5Etfw[^"]*">.+?<\/body><\/html>)/gms;
const youtubeEmbedRegex =
  /<a href="(?<YouTubeUrl>https:\/\/youtu.be\/[^\/]+)\?[^"]+">.+?<\/a>/gms;

function sanitizeContent(rawContent, forDevTo = false) {
  let updatedContent = rawContent.trim();
  const twitterEmbeds = updatedContent.matchAll(twitterEmbedRegex);

  for (const twitterEmbed of twitterEmbeds) {
    const {twitterUrl, twitterUrl2} = twitterEmbed.groups;
    updatedContent = updatedContent.replace(
      twitterEmbed[0],
      generateEmbed(twitterUrl ?? twitterUrl2, forDevTo)
    );
  }

  // Replace YouTube embeds with embed shortcodes
  const youtubeEmbeds = updatedContent.matchAll(youtubeEmbedRegex);

  for (const youtubeEmbed of youtubeEmbeds) {
    const {YouTubeUrl} = youtubeEmbed.groups;
    updatedContent = updatedContent.replace(
      youtubeEmbed[0],
      generateEmbed(YouTubeUrl, forDevTo)
    );
  }

  updatedContent = updatedContent
    .replaceAll(/<h2\s+[^>]+>/gi, '<h2>')
    .replaceAll(/style="[^"]+"/gi, '')
    .replaceAll(/class="[^"]+"/gi, '')
    .replaceAll(
      '?utm_campaign=Yet%20Another%20Newsletter%20LOL&amp;utm_medium=email&amp;utm_source=Revue%20newsletter',
      ''
    )
    .replace(/<!--\[if mso\]>.+?<!\[endif\]-->/gs, '');

  return updatedContent;
}

async function generateNewsletterPost(feedItem) {
  const {title, link, content, contentSnippet, isoDate} = feedItem;

  const jsonFrontmatter = {
    title,
    excerpt: contentSnippet,
    date: isoDate,
    tags: ['newsletter'],
    template: 'newsletter',
  };

  const url = new URL(link);

  const {filename} = url.pathname.match(/(?:\/([^/]+\/)+)(?<filename>.+)\//)?.groups;

  console.log(`Saving newsletter ${filename}`);

  const markdown = `---json\n${JSON.stringify(
    jsonFrontmatter,
    null,
    2
  )}\n---\n\n${sanitizeContent(content)}\n`;

  const newsIssuePath = path.join(NEWSLETTER_DIRECTORY, `${filename}.md`);
  const publishedToDevTo = existsSync(newsIssuePath);

  await fs.writeFile(newsIssuePath, markdown);

  if (publishedToDevTo) {
    console.log(`Newsletter ${filename} already published to dev.to`);
    return;
  }

  try {
    const main_image = socialImage(title, contentSnippet);
    const article = {
      article: {
        title,
        published: true,
        body_markdown: `<!-- cover image: ${main_image} -->\n\n${sanitizeContent(
          content,
          true
        )}`,
        tags: ['newsletter'],
        series: 'Yet Another Newsletter LOL',
        canonical_url: `${site.url}/newsletter/${filename}/`,
        // main_image, skipping for now as a Cloudinary URL in a dev.to Cloudinary URL goes boom.
      },
    };

    const response = await fetch(DEV_TO_API_URL + '/articles', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': DEV_API_KEY,
      },
      body: JSON.stringify(article),
    });

    if (response.status !== 201) {
      console.error(`Couldn't create article on dev.to: ${response.statusText}`);
    }
  } catch (error) {
    console.error("Couldn't create article on dev.to", error);
  }
}

if (!existsSync(NEWSLETTER_DIRECTORY)) {
  mkdirSync(NEWSLETTER_DIRECTORY);
}

await Promise.all(feed.items.map(generateNewsletterPost));

console.log('Finished generating newsletter archives');
