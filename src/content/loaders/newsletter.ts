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
      // Use contentSnippet if available, otherwise extract plain text from HTML
      let description = "";
      if (item.contentSnippet) {
        description = item.contentSnippet;
      } else if (item["content:encoded"]) {
        // Strip HTML tags for a plain text description
        description = item["content:encoded"]
          .replace(/<[^>]*>/g, " ")
          .replace(/\s+/g, " ")
          .trim();
      }

      return {
        title: item.title || "",
        link: item.link || "",
        description: description.substring(0, 300), // Limit description length
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
