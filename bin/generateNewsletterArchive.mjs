import * as url from 'url';
import {promises as fs, mkdirSync, existsSync} from 'fs';
import path from 'path';
import Parser from 'rss-parser';
import site from '../src/_data/site.json' assert {type: 'json'};

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
const NEWSLETTER_DIRECTORY = path.join(__dirname, '..', 'src', 'newsletter');
const parser = new Parser();
const feed = await parser.parseURL(site.newsletterRss);

function sanitizeContent(rawContent) {
  let updatedContent = rawContent.trim();

  const twitterEmbedRegex =
    /(<p><html>.+?href="(?<twitterUrl>https:\/\/twitter.com\/[^\/]+?\/status\/\d+)\?ref_src=twsrc%5Etfw">.+?<\/html><\/p>)|(<html><body>.+?href="(?<twitterUrl2>https:\/\/twitter.com\/[^\/]+?\/status\/\d+)\?ref_src=twsrc%5Etfw[^"]*">.+?<\/body><\/html>)/gms;
  const twitterEmbeds = updatedContent.matchAll(twitterEmbedRegex);

  for (const twitterEmbed of twitterEmbeds) {
    const {twitterUrl, twitterUrl2} = twitterEmbed.groups;
    updatedContent = updatedContent.replace(
      twitterEmbed[0],
      `{% embed "${twitterUrl ?? twitterUrl2}" %}\n`
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
  const {title, link, pubDate, content, contentSnippet, guid, isoDate} = feedItem;

  const jsonFrontmatter = {
    title,
    excerpt: contentSnippet,
    date: new Date(pubDate).toISOString(),
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

  await fs.writeFile(path.join(NEWSLETTER_DIRECTORY, `${filename}.md`), markdown);
}

if (!existsSync(NEWSLETTER_DIRECTORY)) {
  mkdirSync(NEWSLETTER_DIRECTORY);
}

await Promise.all(feed.items.map(generateNewsletterPost));

console.log('Finished generating newsletter archives');
