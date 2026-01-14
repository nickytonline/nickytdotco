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
  name: "Just Some Dev",
  shortDesc: "Welcome to Nick Taylor's personal website.",
  url: getSiteUrl(),
  twitterHandle: "@nickytonline",
  mastodonHandle: "@nickytonline@hachyderm.io",
  authorName: "Nick Taylor",
  maxPostsPerPage: 2,
  paymentPointer: "$ilp.uphold.com/MZMhAWA7bkGa",
  faviconPath: "/assets/images/favicon.svg",
};

export default site;
