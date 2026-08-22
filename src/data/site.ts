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
  name: "Nick Taylor — Developer advocate building secure AI infrastructure.",
  shortDesc:
    "Nick Taylor builds and teaches secure AI infrastructure, developer tooling, and open source.",
  url: getSiteUrl(),
  twitterHandle: "@nickytonline",
  mastodonHandle: "@nickytonline@hachyderm.io",
  authorName: "Nick Taylor",
  maxPostsPerPage: 3,
  paymentPointer: "$ilp.uphold.com/MZMhAWA7bkGa",
  faviconPath: "/assets/images/favicon.svg",
};

export default site;
