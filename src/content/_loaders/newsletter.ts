import type { LiveLoader } from "astro/loaders";
import Parser from "rss-parser";

export interface NewsletterPost {
  title: string;
  link: string;
  description: string;
  date: string;
  [key: string]: unknown;
}

const NEWSLETTER_RSS_URL = "https://rss.beehiiv.com/feeds/NggVbrRMab.xml";

function decodeEntities(text: string): string {
  return text
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function extractText(html: string): string {
  const noStyle = html.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, " ");
  const noTags = noStyle.replace(/<[^>]*>/g, " ");
  return decodeEntities(noTags).replace(/\s+/g, " ").trim();
}

async function fetchNewsletterFeed(): Promise<NewsletterPost[]> {
  const parser = new Parser({
    customFields: {
      item: ["content:encoded"],
    },
  });
  const feed = await parser.parseURL(NEWSLETTER_RSS_URL);

  return feed.items
    .filter((item) => item.title && item.link && item.pubDate)
    .map((item) => {
      const html = (item["content:encoded"] as string) || "";
      const text = extractText(html);
      const description =
        text.length > 200 ? text.slice(0, 200).trimEnd() + "..." : text;

      return {
        title: item.title || "",
        link: item.link || "",
        description,
        date: item.pubDate || new Date().toISOString(),
      };
    });
}

export const newsletterLoader: LiveLoader<NewsletterPost, { id: string }> = {
  name: "newsletter",
  async loadCollection() {
    const posts = await fetchNewsletterFeed();

    return {
      entries: posts.map((post, index) => ({
        id: `newsletter-${index}-${post.link}`,
        data: post,
      })),
    };
  },
  async loadEntry({ filter }) {
    if (!filter?.id) {
      return { error: new Error("Missing newsletter post id filter.") };
    }

    const posts = await fetchNewsletterFeed();
    const post = posts.find(
      (_, index) => `newsletter-${index}-${posts[index].link}` === filter.id
    );

    if (!post) {
      return {
        error: new Error(`Newsletter post not found: ${filter.id}`),
      };
    }

    return {
      id: filter.id,
      data: post,
    };
  },
};
