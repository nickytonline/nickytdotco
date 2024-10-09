const rawTalks = [
  {
    title: "Why HTML Forms Still Rule the Web",
    date: new Date("2024-10-03T09:00:00.000Z"),
    slideDeck: "/slides/compose-24",
    venue: {
      name: "Netlify Compose 2024",
      url: "https://www.netlify.com/compose",
    },
    video: {
      type: "youtube",
      url: "https://youtu.be/1U7b7SwKv_s",
    },
    summary:
      "We've strayed too far from the simplicity and power of HTML forms. It’s time to undo the damage. Once relegated to basic data collection, forms offer a surprising depth of functionality that's being rediscovered by developers and embraced by modern frameworks like Astro, Fresh, Remix, and Next.js. We'll go back to the basics of HTML forms to dig into their history, look at the different input types, validation attributes, and advanced capabilities like the Constraint Validation API. Developers sometimes underestimate the power of CSS for building visually appealing and accessible forms. By using form-specific pseudo-classes like :focus, :hover, :invalid, and :valid, we can enhance the user experience without overcomplicating things by resorting to custom JavaScript. This not only simplifies code but also ensures a consistent user experience across browsers and devices, reinforcing the core strengths of HTML forms. We'll circle back to the present and see how frameworks like Astro, Fresh, Remix, and Next.js are leveraging forms via APIs like the FormData interface. Let’s rediscover the power of HTML forms and how they should be leveraged in modern web application development.",
    tags: ["html", "forms", "css", "javascript", "frameworks"],
  },
  {
    title: "Getting the Most out of Open Source",
    date: new Date("2023-10-19T12:00:00.000Z"),
    slideDeck: "/hack-for-la-2023",
    venue: {
      name: "Hack for LA",
      url: "https://hackforla.org",
    },
    video: {
      url: "https://drive.google.com/file/d/1HPdzQrFP5QwXDnvx7jCFhaWatKTmh-3u/view?usp=sharing",
      image: {
        url: "/images/talks/hack-for-la-open-source-talk.png",
        width: 1200,
        height: 628,
      },
      type: "custom",
    },
    summary:
      "Nick Taylor discusses his journey in open source, including his experiences at dev.to, Netlify, and now OpenSauced. Nick shares insights on how to get the most out of open source as a contributor and maintainer.",
    tags: ["opensource"],
  },
  {
    title: "Fresh: A Full Stack Web Framework for Deno",
    date: new Date("2024-02-21T12:00:00.000Z"),
    venue: {
      name: "Global Summit for Node.js '24",
      url: "https://events.geekle.us/nodejs24",
    },
    summary: `Fresh takes inspiration from existing frameworks to provide features like file-based routing, Islands architecture, server-side rendering and Typescript. We'll cover what makes Fresh possible, i.e. Deno and Preact, then dive into what Fresh is (a metaframework).`,
    slideDeck: "/slides/fresh",
    sourceCode:
      "https://www.google.com/url?q=https://github.com/nickytonline/fresh-demo&sa=D&source=editors&ust=1714400126354907&usg=AOvVaw3I6ffBd2E7TZQUzQNnb80D",
    tags: ["frameworks", "typescript", "deno"],
  },
  {
    title: "Fresh: A Full Stack Web Framework for Deno",
    date: new Date("2024-02-23T12:00:00.000Z"),
    venue: {
      name: "Confoo 2024",
      url: "https://confoo.ca/en/2024/session/fresh-a-full-stack-web-framework-for-deno",
    },
    slideDeck: "/slides/confoo-fresh",
    summary: `Fresh is a web framework based on Web standards built to run on the edge anywhere you can run Deno.

Fresh takes inspiration from existing frameworks to provide features like file-based routing, Islands architecture, server-side rendering and Typescript.

We’ll go through the features and architecture so that you can get up and running with Fresh today.`,
    sourceCode:
      "https://www.google.com/url?q=https://github.com/nickytonline/fresh-demo&sa=D&source=editors&ust=1714400126354907&usg=AOvVaw3I6ffBd2E7TZQUzQNnb80D",
    tags: ["frameworks", "typescript", "deno"],
  },

  {
    title: "End to End Testing for Browser Extensions",
    date: new Date("2024-02-21T12:00:00.000Z"),
    venue: {
      name: "Confoo 2024",
      url: "https://confoo.ca/en/2024/session/end-to-end-testing-for-browser-extensions",
    },
    summary: `We discuss the fundamentals of browser extensions (Chromium browsers & Firefox), explore the current options available for end-to-end testing, and dive in to some live coding to see it in action.

By the end of this presentation, you'll have the knowledge and skills to implement end-to-end testing for your own browser extension.`,
    slideDeck: "/slides/ext-e2e",
    tags: ["e2etesting"],
  },
  {
    title: "Career Lab Q2 2023: Watch Your Mentors Interview Each Other",
    date: new Date("2023-06-05T12:00:00.000Z"),
    video: {
      type: "youtube",
      url: "https://www.youtube.com/watch?v=M_UntxJu-s4",
    },
    venue: {
      name: "The Collab Lab: Career Lab",
      url: "https://the-collab-lab.codes/",
    },
    summary: `In this session, Nick Taylor and EJ Mason run a mock interview where EJ is the interviewer, and Nick is the interviewee. They go over Nick's frontend take-home assignment, and EJ also asks Nick questions about frontend about accessibility, JavaScript, HTML, CSS, and React.`,
    tags: ["career", "interviewing"],
  },
  {
    title: "Fresh: A New Full Stack Web Framework for Deno",
    date: new Date("2023-04-20T12:00:00.000Z"),
    video: {
      type: "custom",
      image: {
        url: "https://gn-portal-og-images.vercel.app/fresh-a-new-full-stack-web-framework-for-deno?v3-1685773499140",
        width: 1200,
        height: 628,
      },
      url: "https://portal.gitnation.org/contents/fresh-a-new-full-stack-web-framework-for-deno",
    },
    venue: { name: "Node Congress", url: "https://nodecongress.com/" },
    slideDeck: "/fresh",
    summary: `Fresh is a web framework based on Web standards built to run on the edge anywhere you can run Deno. Fresh takes inspiration from existing frameworks to provide features like file-based routing, Islands architecture, server-side rendering and Typescript. Another compelling reason to consider Fresh is that there is no build step.`,
    sourceCode: "https://github.com/nickytonline/fresh-talk-demo",
    tags: ["deno", "typescript"],
  },
  {
    title: "End to End Testing with Cypress",
    date: new Date("2023-03-14T12:00:00.000Z"),
    venue: {
      name: "The Collab Lab Tech Talks",
      url: "https://the-collab-lab.codes/tech-talks/",
    },
    video: {
      type: "youtube",
      url: "https://www.youtube.com/watch?v=clj-71r4gEI",
    },
    summary: `This talk provides an introduction to the Cypress end-to-end (E2E) testing framework. We cover the benefits of E2E testing and then do a short demo using a Collab Lab cohort's project.`,
    slideDeck: "/cypress2023",
    sourceCode: "https://github.com/nickytonline/tcl-meetup-cypress",
    tags: ["cypress", "testing"],
  },
  {
    title: "Fresh: A New Full Stack Web Framework for Deno",
    date: new Date("2022-12-13T12:00:00.000Z"),
    video: {
      type: "youtube",
      url: "https://www.youtube.com/watch?v=JWjcWQz5g3U&t=2160s",
    },
    venue: { name: "ChicagoJS", url: "https://chicagojs.org/" },
    slideDeck: "/ChicagoFresh",
    summary: `Fresh is a web framework based on Web standards built to run on the edge anywhere you can run Deno. Fresh takes inspiration from existing frameworks to provide features like file-based routing, Islands architecture, server-side rendering and Typescript. Another compelling reason to consider Fresh is that there is no build step.`,
    sourceCode:
      "https://github.com/nickytonline/chicago-js-dec-2022-fresh-demo",
    tags: ["deno", "typescript"],
  },
  {
    title:
      "Expert Panel: Trending Tools and Frameworks – What’s Hype and What’s Not",
    date: new Date("2022-06-23T12:00:00.000Z"),
    video: {
      type: "vimeo",
      url: "https://player.vimeo.com/video/724340575?h=118d599345&color=ff0179&title=0&byline=0&portrait=0",
    },
    venue: {
      name: `Applitools & Netlify Present FRONT-END <TEST>{FEST}`,
      url: "https://applitools.com/on-demand-videos/front-end-test-fest-june-2022/",
    },
    summary: `Joe Colantonio moderates this lively Q&A panel where Tiffany Le-Nguyen,
  Skyler Brungardt, Nick Taylor, and Dan Giordano share their thoughts on
  upcoming tools and framework innovations at their respective companies.`,
    tags: ["testing"],
  },
  {
    title: "Automate syndication and ownership of your content with Eleventy",
    date: new Date("2022-05-26T12:00:00.000Z"),
    video: {
      type: "youtube",
      url: "https://www.youtube.com/watch?v=Yy4eHUjLWAs",
    },
    summary: `<p>I use <a href="http://dev.to/">dev.to</a> as a headless CMS. We go through how I pull in my articles, transform and cache them, and how to sync links for Hashnode and dev.to with my own posts. We also touch on GitHub actions as well as deploying to Netlify.</p>`,
    venue: {
      name: "Eleventy Meetup",
      url: "https://11tymeetup.dev/events/ep-9-automatic-syndication-and-wordle-on-the-edge/",
    },
    slideDeck: "/11tyMeetupMay2022",
    additionalLinks: [
      {
        title:
          "Automate syndication of your content with Eleventy, dev.to, and GitHub Actions",
        url: "/posts/my-eleventy-meetup-talk-3b2p/",
      },
    ],
    tags: ["eleventy", "automation", "github actions", "netlify"],
  },
  {
    title: `Asking Coding Questions`,
    date: new Date("2022-05-27T12:00:00.000Z"),
    venue: {
      name: "Virtual Coffee Lunch & Learn",
      url: "https://www.youtube.com/playlist?list=PLh9uT23TA65idCyc_orC85RefgY_-fKsG",
    },
    summary: `One of the primary skills you'll need as a developer is asking good questions. We talk about the process of working through a problem and how to ask questions. Because when we ask good questions, we're growing as developers, respecting the time of others, and putting in the work we need to do.`,
    video: {
      type: "youtube",
      url: "https://www.youtube.com/watch?v=DVqtr3iwkwQ",
    },
    additionalLinks: [
      {
        title: "Navigating a new code base",
        url: "https://dev.to/virtualcoffee/navigating-a-new-code-base-94d",
      },
    ],
    tags: ["career"],
  },
  {
    title: `Tools for web developers: Live coding and debugging`,
    date: new Date("2022-02-10T12:00:00.000Z"),
    venue: {
      name: "codementor",
      url: "https://www.codementor.io/events/tools-for-web-devs-dpqk2w3b1r",
    },
    summary: `No matter how experienced you are as a developer, one thing that will give you superpowers throughout your career is knowing your tools. Whether it's shortcuts in your favorite editor, the right commands for git, or tools for debugging, they will give your early career a boost, and continue to help you grow and advance as a developer.`,
    video: {
      type: "youtube",
      url: "https://www.youtube.com/watch?v=k0nSJ1MtSao",
    },
    slideDeck: "/codementor2022",
    tags: ["devtools", "career"],
  },
  {
    title: "AppWrite Hacktoberfest Kickoff",
    date: new Date("2021-04-02T12:00:00.000Z"),
    venue: {
      name: "AppWrite Hacktoberfest Kickoff",
      url: "https://dev.to/appwrite/appwrites-hacktoberfest-21-journey-4n91",
    },
    summary: `Nick Taylor talks about Forem and how you can contribute to the project during and after Hacktoberfest 2021.`,
    video: {
      type: "youtube",
      url: "https://www.youtube.com/watch?v=cyJAz-c1OWs&t=4183s",
    },
    slideDeck: "/hacktoberfest2021",
    tags: ["hacktoberfest", "open source"],
  },
  {
    title: "Getting Started with Streaming on Twitch",
    date: new Date("2021-09-20T12:00:00.000Z"),
    video: {
      type: "youtube",
      url: "https://www.youtube.com/watch?v=aDofyI6E2t4",
    },
    summary: `We cover how to get set up and streaming with Twitch using OBS. We cover some basics like live captioning, creating scenes, changing scenes, and having some fun with browser sources to add some interactivity to your stream. If you've been on the fence about whether or not to start streaming, this one's for you!`,
    venue: {
      name: "Virtual Coffee Lunch & Learn",
      url: "https://www.youtube.com/playlist?list=PLh9uT23TA65idCyc_orC85RefgY_-fKsG",
    },
    slideDeck: "/stream2021",
    additionalLinks: [
      {
        title: "Getting Started with Streaming on Twitch",
        url: "/blog/getting-started-with-streaming-on-twitch-4im7",
      },
    ],
    tags: ["streaming", "twitch", "obs"],
  },

  {
    title: "Debugging JavaScript",
    date: new Date("2021-04-02T12:00:00.000Z"),
    video: {
      type: "youtube",
      url: "https://www.youtube.com/watch?v=I9A0Pifn0Uw",
    },
    summary: `Learn how to debug JavaScript in the front-end/back-end as well as how to use your browser to debug other issues.`,
    venue: {
      name: "Virtual Coffee Lunch & Learn",
      url: "https://www.youtube.com/playlist?list=PLh9uT23TA65idCyc_orC85RefgY_-fKsG",
    },
    slideDeck: "/debug2021",
    tags: ["debugging", "devtools", "javascript"],
  },

  {
    title: "Storybook 2021",
    date: new Date("2021-03-10T12:00:00.000Z"),
    video: {
      type: "youtube",
      url: "https://www.youtube.com/watch?v=ypsD-9qQzYg",
    },
    summary: `Storybook is a tool for building out components and documenting a system of components. It allows you to build components in an isolated environment. This promotes good component practices as well as potentially faster development time as you do not need to rely on the application(s) that consume them.`,
    venue: {
      name: "The Collab Lab Tech Talks",
      url: "https://www.meetup.com/tech-talks-by-the-collab-lab/events/276679138/",
    },
    slideDeck: "/storybook2021",
    tags: ["storybook", "react", "javascript"],
  },
  {
    title: "Words Matter: Conventional Comments",
    date: new Date("2020-11-20T12:00:00.000Z"),
    video: {
      type: "youtube",
      url: "https://www.youtube.com/watch?v=MMabY-Cm_V4&t=3010s",
    },
    summary: `Virtual Coffee started as a once a week zoom chat in April 2020, and has grown into a community of devs at all stages of the journey, meeting, mentoring, hosting events, and most importantly, making friends. Our mission is to form community, allow room for growth and mentorship at all levels, and to provide a safe space for everyone interested in tech. Nick goes over conventional comments and how they can help you and your team.`,
    venue: {
      name: "Virtual Coffee Lightning Talks",
      url: "https://virtualcoffee.io",
    },
    slideDeck: "/lightning2020",
    additionalLinks: [
      {
        title: "Conventional Comments",
        url: "https://conventionalcomments.org",
      },
    ],
    tags: ["career", "communication"],
  },
  {
    title: "Getting the Most out of Open Source",
    date: new Date("2020-10-01T12:00:00.000Z"),
    video: {
      type: "youtube",
      url: "https://www.youtube.com/watch?v=Tn3MBiWYeEI",
    },
    summary: `Nick shares best practices, tips, and tools about how contributors and maintainers of all levels can have happy, productive, and meaningful interactions with the open source community.

Contributing to open source should be fun and rewarding! Whether you are a beginner or seasoned open source enthusiast, you’ll come away from this talk refreshed and ready to contribute to or maintain an open source project.`,
    venue: {
      name: "DigitalOcean Tech Talk",
      url: "https://www.digitalocean.com/community/tech_talks/getting-the-most-out-of-open-source",
    },
    slideDeck: "/hacktoberfest2020",
    tags: ["open source", "hacktoberfest"],
  },
  {
    title:
      "Expert Panel—Future of Testing: How AI Can Accelerate Release Pipelines | Front-End Test Fest 2023",
    date: new Date("2023-06-07T12:00:00.000Z"),
    video: {
      type: "youtube",
      url: "https://youtube.com/watch?v=dlw_g3RoeEY",
    },
    venue: {
      name: `Applitools & Netlify Present FRONT-END <TEST>{FEST}`,
      url: "https://applitools.com/resources/events/fetf2023-panel-future-of-testing-how-ai-can-accelerate-release-pipelines/",
    },
    summary: `2023 has been a big year for AI. Joe Colantonio moderates a discussion exploring ways that front-end developers and testers can leverage generative AI and other AI-based tools in their delivery pipelines.`,
    tags: ["testing"],
  },
];

const talks = new Map(
  rawTalks.map((talk) => {
    const id = `${talk.title} ${talk.venue.name}`
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-");
    return [id, talk];
  }),
);

module.exports = { talks };
