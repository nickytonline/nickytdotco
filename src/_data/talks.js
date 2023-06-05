const rawTalks = [
  {
    title: 'Fresh: A New Full Stack Web Framework for Deno',
    date: new Date('2023-04-20T12:00:00.000Z'),
    video: {
      type: 'custom',
      image: {
        url: 'https://gn-portal-og-images.vercel.app/fresh-a-new-full-stack-web-framework-for-deno?v3-1685773499140',
        width: 1200,
        height: 628,
      },
      url: 'https://portal.gitnation.org/contents/fresh-a-new-full-stack-web-framework-for-deno',
    },
    venue: {name: 'Node Congress', url: 'https://nodecongress.com/'},
    slideDeck: 'https://iamdeveloper.com/fresh',
    summary: `Fresh is a web framework based on Web standards built to run on the edge anywhere you can run Deno. Fresh takes inspiration from existing frameworks to provide features like file-based routing, Islands architecture, server-side rendering and Typescript. Another compelling reason to consider Fresh is that there is no build step.`,
    sourceCode: 'https://github.com/nickytonline/fresh-talk-demo',
    tags: ['deno', 'typescript'],
  },
  {
    title: 'End to End Testing with Cypress',
    date: new Date('2023-03-14T12:00:00.000Z'),
    venue: {
      name: 'The Collab Lab Tech Talks',
      url: 'https://the-collab-lab.codes/tech-talks/',
    },
    video: {
      type: 'youtube',
      url: 'https://www.youtube.com/watch?v=clj-71r4gEI',
    },
    summary: `This talk provides an introduction to the Cypress end-to-end (E2E) testing framework. We cover the benefits of E2E testing and then do a short demo using a Collab Lab cohort's project.`,
    slideDeck: 'https://iamdeveloper.com/cypress2023',
    sourceCode: 'https://github.com/nickytonline/tcl-meetup-cypress',
    tags: ['cypress', 'testing'],
  },
  {
    title: 'Fresh: A New Full Stack Web Framework for Deno',
    date: new Date('2022-12-13T12:00:00.000Z'),
    video: {
      type: 'youtube',
      url: 'https://www.youtube.com/watch?v=JWjcWQz5g3U&t=2160s',
    },
    venue: {name: 'ChicagoJS', url: 'https://chicagojs.org/'},
    slideDeck: 'https://iamdeveloper.com/ChicagoFresh',
    summary: `Fresh is a web framework based on Web standards built to run on the edge anywhere you can run Deno. Fresh takes inspiration from existing frameworks to provide features like file-based routing, Islands architecture, server-side rendering and Typescript. Another compelling reason to consider Fresh is that there is no build step.`,
    sourceCode: 'https://github.com/nickytonline/chicago-js-dec-2022-fresh-demo',
    tags: ['deno', 'typescript'],
  },
  {
    title: 'Expert Panel: Trending Tools and Frameworks – What’s Hype and What’s Not',
    date: new Date('2022-06-23T12:00:00.000Z'),
    video: {
      type: 'vimeo',
      url: 'https://player.vimeo.com/video/724340575?h=118d599345&color=ff0179&title=0&byline=0&portrait=0',
    },
    venue: {
      name: `Applitools & Netlify Present FRONT-END <TEST>{FEST}`,
      url: 'https://applitools.com/on-demand-videos/front-end-test-fest-june-2022/',
    },
    summary: `Joe Colantonio moderates this lively Q&A panel where Tiffany Le-Nguyen,
  Skyler Brungardt, Nick Taylor, and Dan Giordano share their thoughts on
  upcoming tools and framework innovations at their respective companies.`,
    tags: ['testing'],
  },
  {
    title: 'Automate syndication and ownership of your content with Eleventy',
    date: new Date('2022-05-26T12:00:00.000Z'),
    video: {
      type: 'youtube',
      url: 'https://www.youtube.com/watch?v=Yy4eHUjLWAs',
    },
    summary: `<p>I use <a href="http://dev.to/">dev.to</a> as a headless CMS. We go through how I pull in my articles, transform and cache them, and how to sync links for Hashnode and dev.to with my own posts. We also touch on GitHub actions as well as deploying to Netlify.</p>`,
    venue: {
      name: 'Eleventy Meetup',
      url: 'https://11tymeetup.dev/events/ep-9-automatic-syndication-and-wordle-on-the-edge/',
    },
    slideDeck: 'https://www.iamdeveloper.com/11tyMeetupMay2022',
    additionalLinks: [
      {
        title:
          'Automate syndication of your content with Eleventy, dev.to, and GitHub Actions',
        url: 'https://www.iamdeveloper.com/posts/my-eleventy-meetup-talk-3b2p/',
      },
    ],
    tags: ['eleventy', 'automation', 'github actions', 'netlify'],
  },
  {
    title: `Asking Coding Questions`,
    date: new Date('2022-05-27T12:00:00.000Z'),
    venue: {
      name: 'Virtual Coffee Lunch & Learn',
      url: 'https://www.youtube.com/playlist?list=PLh9uT23TA65idCyc_orC85RefgY_-fKsG',
    },
    summary: `One of the primary skills you'll need as a developer is asking good questions. We talk about the process of working through a problem and how to ask questions. Because when we ask good questions, we're growing as developers, respecting the time of others, and putting in the work we need to do.`,
    video: {
      type: 'youtube',
      url: 'https://www.youtube.com/watch?v=DVqtr3iwkwQ',
    },
    additionalLinks: [
      {
        title: 'Navigating a new code base',
        url: 'https://dev.to/virtualcoffee/navigating-a-new-code-base-94d',
      },
    ],
    tags: ['career'],
  },
  {
    title: `Tools for web developers: Live coding and debugging`,
    date: new Date('2022-02-10T12:00:00.000Z'),
    venue: {
      name: 'codementor',
      url: 'https://www.codementor.io/events/tools-for-web-devs-dpqk2w3b1r',
    },
    summary: `No matter how experienced you are as a developer, one thing that will give you superpowers throughout your career is knowing your tools. Whether it's shortcuts in your favorite editor, the right commands for git, or tools for debugging, they will give your early career a boost, and continue to help you grow and advance as a developer.`,
    video: {
      type: 'youtube',
      url: 'https://www.youtube.com/watch?v=k0nSJ1MtSao',
    },
    slideDeck: 'https://iamdeveloper.com/codementor2022',
    tags: ['devtools', 'career'],
  },
  {
    title: 'AppWrite Hacktoberfest Kickoff',
    date: new Date('2021-04-02T12:00:00.000Z'),
    venue: {
      name: 'AppWrite Hacktoberfest Kickoff',
      url: 'https://dev.to/appwrite/appwrites-hacktoberfest-21-journey-4n91',
    },
    summary: `Nick Taylor talks about Forem and how you can contribute to the project during and after Hacktoberfest 2021.`,
    video: {
      type: 'youtube',
      url: 'https://www.youtube.com/watch?v=cyJAz-c1OWs&t=4183s',
    },
    slideDeck: 'https://iamdeveloper.com/hacktoberfest2021',
    tags: ['hacktoberfest', 'open source'],
  },
  {
    title: 'Getting Started with Streaming on Twitch',
    date: new Date('2021-09-20T12:00:00.000Z'),
    video: {
      type: 'youtube',
      url: 'https://www.youtube.com/watch?v=aDofyI6E2t4',
    },
    summary: `We cover how to get set up and streaming with Twitch using OBS. We cover some basics like live captioning, creating scenes, changing scenes, and having some fun with browser sources to add some interactivity to your stream. If you've been on the fence about whether or not to start streaming, this one's for you!`,
    venue: {
      name: 'Virtual Coffee Lunch & Learn',
      url: 'https://www.youtube.com/playlist?list=PLh9uT23TA65idCyc_orC85RefgY_-fKsG',
    },
    slideDeck: 'https://iamdeveloper.com/stream2021',
    additionalLinks: [
      {
        title: 'Getting Started with Streaming on Twitch',
        url: 'https://www.iamdeveloper.com/blog/getting-started-with-streaming-on-twitch-4im7',
      },
    ],
    tags: ['streaming', 'twitch', 'obs'],
  },

  {
    title: 'Debugging JavaScript',
    date: new Date('2021-04-02T12:00:00.000Z'),
    video: {
      type: 'youtube',
      url: 'https://www.youtube.com/watch?v=I9A0Pifn0Uw',
    },
    summary: `Learn how to debug JavaScript in the front-end/back-end as well as how to use your browser to debug other issues.`,
    venue: {
      name: 'Virtual Coffee Lunch & Learn',
      url: 'https://www.youtube.com/playlist?list=PLh9uT23TA65idCyc_orC85RefgY_-fKsG',
    },
    slideDeck: 'https://iamdeveloper.com/debug2021',
    tags: ['debugging', 'devtools', 'javascript'],
  },

  {
    title: 'Storybook 2021',
    date: new Date('2021-03-10T12:00:00.000Z'),
    video: {
      type: 'youtube',
      url: 'https://www.youtube.com/watch?v=ypsD-9qQzYg',
    },
    summary: `Storybook is a tool for building out components and documenting a system of components. It allows you to build components in an isolated environment. This promotes good component practices as well as potentially faster development time as you do not need to rely on the application(s) that consume them.`,
    venue: {
      name: 'The Collab Lab Tech Talks',
      url: 'https://www.meetup.com/tech-talks-by-the-collab-lab/events/276679138/',
    },
    slideDeck: 'https://iamdeveloper.com/storybook2021',
    tags: ['storybook', 'react', 'javascript'],
  },
  {
    title: 'Words Matter: Conventional Comments',
    date: new Date('2020-11-20T12:00:00.000Z'),
    video: {
      type: 'youtube',
      url: 'https://www.youtube.com/watch?v=MMabY-Cm_V4&t=3010s',
    },
    summary: `Virtual Coffee started as a once a week zoom chat in April 2020, and has grown into a community of devs at all stages of the journey, meeting, mentoring, hosting events, and most importantly, making friends. Our mission is to form community, allow room for growth and mentorship at all levels, and to provide a safe space for everyone interested in tech. Nick goes over conventional comments and how they can help you and your team.`,
    venue: {
      name: 'Virtual Coffee Lightning Talks',
      url: 'https://virtualcoffee.io',
    },
    slideDeck: 'https://iamdeveloper.com/lightning2020',
    additionalLinks: [
      {
        title: 'Conventional Comments',
        url: 'https://conventionalcomments.org',
      },
    ],
    tags: ['career', 'communication'],
  },
  {
    title: 'Getting the Most out of Open Source',
    date: new Date('2020-10-01T12:00:00.000Z'),
    video: {
      type: 'youtube',
      url: 'https://www.youtube.com/watch?v=Tn3MBiWYeEI',
    },
    summary: `Nick shares best practices, tips, and tools about how contributors and maintainers of all levels can have happy, productive, and meaningful interactions with the open source community.

Contributing to open source should be fun and rewarding! Whether you are a beginner or seasoned open source enthusiast, you’ll come away from this talk refreshed and ready to contribute to or maintain an open source project.`,
    venue: {
      name: 'DigitalOcean Tech Talk',
      url: 'https://www.digitalocean.com/community/tech_talks/getting-the-most-out-of-open-source',
    },
    slideDeck: 'https://iamdeveloper.com/hacktoberfest2020',
    tags: ['open source', 'hacktoberfest'],
  },
];

const talks = new Map(
  rawTalks.map((talk) => {
    const id = `${talk.title} ${talk.venue.name}`
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-');
    return [id, talk];
  })
);

module.exports = {talks};
