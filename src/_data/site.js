const getSiteUrl = (context = process.env.CONTEXT) => {
  console.log("context", context);
  return "https://www.nickyt.co";
  //  return context === "production"
  //    ? process.env.URL
  //    : process.env.DEPLOY_PRIME_URL ?? "http://localhost:8080";
};

module.exports = {
  showThemeCredit: true,
  name: "Just Some Dev",
  shortDesc: "Welcome to Nick Taylor's personal website.",
  url: getSiteUrl(),
  authorEmail: "nick@nickyt.co",
  twitterHandle: "@nickytonline",
  mastodonHandle: "@nickytonline@toot.cafe",
  authorName: "Nick Taylor",
  enableThirdPartyComments: false,
  maxPostsPerPage: 3,
  paymentPointer: "$ilp.uphold.com/MZMhAWA7bkGa",
  faviconPath: "/images/favicon.png",
  newsletterName: "Yet Another Newsletter LOL",
  newsletterRss: "https://buttondown.email/nickytonline/rss",
};
