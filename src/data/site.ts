const getSiteUrl = (_context = process.env.CONTEXT) => {
  return "https://www.nickyt.co";
};

export interface SiteConfig {
  name: string;
  shortDesc: string;
  url: string;
  twitterHandle: string;
  mastodonHandle: string;
  authorName: string;
  maxPostsPerPage: number;
  paymentPointer: string;
  faviconPath: string;
}

export const site: SiteConfig = {
  name: "Nick Taylor — Developer advocate at the intersection of AI, security, and software.",
  shortDesc:
    "Nick Taylor is a developer advocate at the intersection of AI, security, and software, building and teaching practical approaches to MCP, AI agents, Zero Trust, and developer infrastructure.",
  url: getSiteUrl(),
  twitterHandle: "@nickytonline",
  mastodonHandle: "@nickytonline@hachyderm.io",
  authorName: "Nick Taylor",
  maxPostsPerPage: 3,
  paymentPointer: "$ilp.uphold.com/MZMhAWA7bkGa",
  faviconPath: "/assets/images/favicon.svg",
};

export default site;
