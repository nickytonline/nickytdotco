const getSiteUrl = (_context = process.env.CONTEXT) => {
  return "https://www.nickyt.co";
};

export interface SiteConfig {
  showThemeCredit: boolean;
  name: string;
  shortDesc: string;
  url: string;
  authorEmail: string;
  twitterHandle: string;
  mastodonHandle: string;
  authorName: string;
  enableThirdPartyComments: boolean;
  maxPostsPerPage: number;
  paymentPointer: string;
  faviconPath: string;
  newsletterName: string;
  newsletterRss: string;
}

export const site: SiteConfig = {
  showThemeCredit: true,
  name: "Just Some Dev",
  shortDesc: "Welcome to Nick Taylor's personal website.",
  url: getSiteUrl(),
  authorEmail: "nick@nickyt.co",
  twitterHandle: "@nickytonline",
  mastodonHandle: "@nickytonline@toot.cafe",
  authorName: "Nick Taylor",
  enableThirdPartyComments: false,
  maxPostsPerPage: 10,
  paymentPointer: "$ilp.uphold.com/MZMhAWA7bkGa",
  faviconPath: "/images/favicon.png",
  newsletterName: "Yet Another Newsletter LOL",
  newsletterRss: "https://buttondown.email/nickytonline/rss",
};

export default site;
