---json
{
  "title": "My 2019 Year in Review",
  "excerpt": "The Intro   2019 was great. Lot’s of interesting stuff happened. Let’s dig in. But first, I...",
  "date": "2020-01-02T03:50:01.743Z",
  "tags": [
    "yearinreview"
  ],
  "cover_image": "https://www.iamdeveloper.com/images/posts/_practicaldev_image_fetch_s--2NiTSnuS--_c_imagga_scale,f_auto,fl_progressive,h_420,q_auto,w_1000_https:__thepracticaldev.s3.amazonaws.com_i_z8awferjpkro7ig0ciey.jpg",
  "canonicalUrl": "https://www.iamdeveloper.com/posts/my-2019-year-in-review-23i1/",
  "reading_time_minutes": 17,
  "template": "post"
}
---

## The Intro

2019 was great. Lot’s of interesting stuff happened. Let’s dig in. But first, I say to you 2019... good day.

![NSYNC "Bye, bye bye!"](https://media.giphy.com/media/hFXwY4lER3oBO/giphy.gif)

## Open-Source

I enjoyed another great year in open source and also contributed to some new projects. I'll go through the most notable ones, not because the others are not important, it's just that these were the ones that sprung to mind while writing my review of 2019.

### Project: @raee/gatsby-remark-oembed

My site which is pretty much just a blog at the moment uses Gatsby. One interesting plugin I came across was from [@raee](https://dev.to/raae) called gatsby-remark-oembed. It allows you to embed resources as widgets that support oembed, e.g. Twitter.

{% github "https://github.com/raae/gatsby-remark-oembed" %}

I got it all installed but ran into issues. In the end, the documentation for setting up the plugin needed to be updated. I [put up a PR](https://github.com/raae/gatsby-remark-oembed/pull/35) to update the documentation, so others wouldn't stumble on the issue I ran into. And of course I wrote about it. 

{% link "https://dev.to/nickytonline/any-contribution-to-open-source-is-valuable-57d3" %}

### Project: Gatsby

This was a big contribution LOL. I added my site to the list of showcased sites. As a thank you for my first PR, I got myself some Gatsby socks. I also wrote a short post about this.

{% link "https://dev.to/nickytonline/showcase-your-gatsby-site-266" %}

### Project: Refined GitHub

For this project, I helped migrate the Refined GitHub extension to TypeScript. This was a huge endeavour that spanned several months. I am currently not using TypeScript at work, so this was one of my outlets to flex some TypeScript muscle. I [comment about this as a big win for me in April on DEV](https://dev.to/nickytonline/comment/a85d).

### Project: TypeScript

This was a contribution to the TypeScript repository but in the form of filing an issue. While working on the Refined GitHub extension refactor to TypeScript, I discovered an issue with the NamedNodeMap interface in the core types that ships with TypeScript. The issue got labelled as a bug so it is in their backlog now.

{% github "https://github.com/Microsoft/TypeScript/issues/30928" %}

### Project: dev.to codebase

I [continued to contribute](https://github.com/thepracticaldev/dev.to/commits?author=nickytonline) to my favourite open source project, DEV.

{% github "https://github.com/thepracticaldev/dev.to" %}

### Hacktoberfest

This year was my first year participating in Hacktoberfest. It was a fun endeavour which included contributions to DEV as well as adding some automation for properly formatting markdown files for the [learnstorybook.com](https://learnstorybook.com) project.

{% link "https://dev.to/nickytonline/my-hacktoberfest-2019-32i2" %}

### Open Source in 2020

I will definitely continue to contribute to open source in 2020. What about you?

## Getting Back in Shape

I’ve been athletic pretty much since elementary school, but in recent years, I’ve had a few setbacks with injuries. Last fall, I joined the corporate soccer team and a few practices in, I ended up tearing one of my calves. While I was recovering from my injury, I ended up putting on quite a few pounds, so end of April this year, I hit the tipping point and began my journey to getting back in shape.

{% instagram "B0ClFBSJ4Hu" %}

Initially, it was quite tough, because even though I had completed my physiotherapy for my torn calf, I was nowhere near being in any kind of running shape. I ended up joining an Orange Theory and the rest was history. I busted my butt and got back into pretty awesome shape, dropping literally 35-40lbs of fat.

{% instagram "B1xaOVvp820" %}

I put a couple back on as it’s the Christmas holidays, but will be getting back into the swing of things post-holidays.

## Automating Deployments for My Site

I don’t know about you, but updating dependencies for your site is a pain because if you need to build with the new dependencies and make sure everything still works fine. Or even code changes for new stuff. For my blog, it is not a mission-critical site, but I took my Cypress knowledge, a dash of Dependabot and Netlify to put it all together. Let the robots do the heavy lifting.

I have probably already saved a good 50 hours this year not updating and testing dependency updates and will probably save myself hundreds of hours, maybe the low thousands of hours next year.

And yes, I wrote a post about it.

{% link "https://dev.to/nickytonline/update-dependencies-with-dependabot-cypress-and-netlify-3lkf" %}

## Page Load Time Improvements for Shotgun

I [improved the page load times](https://dev.to/nickytonline/comment/ip05) of the product I work on, [Shotgun](https://shotgunsoftware.com), with some webpack and frontend build changes I made. One of our high profile clients, [Lucasfilm Ltd. was very happy](https://dev.to/nickytonline/comment/ip05) about the improvements. It felt really good when our support team posted in Slack that Lucasfilm noticed a 20% speed improvement based on their own internal testing. 🔥

## Interviewing at Facebook

One day, I received a message on LinkedIn and noticed that it was a message from a recruiter from Facebook. Even though I was quite happy with my current job, it seemed silly not to entertain the thought of potentially working at Facebook and the fact that they contacted me made me feel pretty good.

I passed the initial phone screen and then prepped for my first interview that would be with a frontend engineer from one of the teams at Facebook. I spent a lot of time preparing, and ended up doing really well. To be honest, I didn’t think I would make it past the first interview. I just always assumed the big companies were never achievable. A side effect of having imposter syndrome even after years of experience. 🙃

I moved on to the second interview, and once again did well. I got the phone call from Facebook that they wanted to move to the final step, an interview in Menlo Park. They flew me down for the weekend and then I was to interview on Monday. I had never been to California, so I was very excited to go.

![Facebook badge](https://www.iamdeveloper.com/images/posts/_i_547t4w3um93ilrhlbq2g.png)

One of my cousins lives in California, so I also took the opportunity to visit some family. Aside from that, I contacted [Brian Vaughn](https://twitter.com/brian_d_vaughn), one of the core React team members just to see if he wanted to grab a bite to eat/coffee with a random Canadian. I’ll be honest, I generally do not ask strangers to meet up, but he seemed like such a nice person on Twitter and GitHub, that I just went for it. We grabbed some sushi and a coffee on Sunday and just chit-chatted. It was really nice of him to do that while I was there.

{% instagram "B3Aii_CpCP0" %}

Thanks Brian and I am definitely hooked on Philz coffee now! Philz Coffee… please come to Canada, specifically Montreal. 😆

{% instagram "B3AjS5kpdh5" %}

On Monday, I had an intense day of interviewing at Facebook, but there was a lunch break. At lunchtime, none other than [Andrew Clark](https://twitter.com/acdlite) from the React core team joined me for lunch. It was awesome. We spent an hour together at lunch talking about all kinds of things including React. Thanks for lunch Andrew! Andrew is super nice BTW.

It gets better. After lunch, Andrew took me to grab a coffee on the Facebook campus. He mentioned that [Sebastian Markbage](https://twitter.com/sebmarkbage), another React core team member, instituted a mandatory coffee break a couple of times during the day based on a Swedish tradition called [Fika](https://hejsweden.com/en/have-coffee-breaks-called-fika-swedish/). So we grabbed our coffees and I got to sit with the React team that is based in California. It was only about 15 minutes, but it was just another amazing unexpected thing to come out of interviewing with Facebook. Honestly, the entire team was super nice. I don't know if this is the norm when a frontend interviews at Facebook, but I am definitely not complaining.

I finished my day at Facebook exhausted and headed back on a redeye to Montreal. Regardless of what the final outcome was of the interview process with Facebook, it was an amazing experience for me. In the end, things did not work out, but had I never accepted that initial phone call with the recruiter from Facebook, I never would have met any of the React team or visited my cousin. Remember folks, take chances!

And yes, I have a post about that.

{% link "https://dev.to/nickytonline/take-chances-and-standout-because-who-knows-3kh6" %}

## Building a Course

This is a work in progress, but I started work on a TypeScript course. It's not finished yet and I have never written a course or any type of education material, but I am very excited to get it completed. Special shoutout to @aspittel for providing me with some great coaching for writing this course.

I will definitely let you all know when it's available.

## VS Code Tips

I created the [@vscodetips](https://twitter.com/vscodetips) Twitter account back in September 2017 and it looks like this year, it’s gained a lot of traction. It gained ~2000 users in 2019. By no means a huge amount of followers in the Twittersphere at almost 3500 users, but I’m still pretty happy about that. People seemed to enjoy the tips I post or things I retweet related to VS Code. If you’re one of VS Code Tips followers, thanks!

[VS Code tips is also on DEV](It’s 2020, post [year in review](https://dev.to/nickytonline/my-2019-year-in-review-23i1), so let’s start off with some 2020 content.

{% twitter "1213657972322324482" %}

I was updating my personal site the other day and thought, why don’t I write about some of the tech I’ve been using, some tools I use in my day-to-day as well as other resources that I use, even if they aren't everyday "go-to"s in regards to frontend. I've also popped in some resources that I think will just be helpful.

Let's get to it!

## Open-Source and Free Resources

### Netlify

I use [Netlify](https://www.netlify.com/) on the free tier to host my site. They offer a great service and it integrates well with GitHub and continuous integration. I am not cheap, it is just that at the moment, I do not need more than the free tier. I actually went over my build minutes last month and paid a small fee, so now that they have my credit card... 😆

I wrote about automating my deployments to Netlify here. 👇

{% link "https://dev.to/nickytonline/update-dependencies-with-dependabot-cypress-and-netlify-3lkf" %}

Note: [Zeit](https://zeit.co/) is amazing as well. I just happen to be using Netlify.

### Lighthouse CI

I have not used this on a project yet, just the Lighthouse audit tools in the browser, but Lighthouse CI looks pretty amazing. Integrate Lighthouse audits into your continuous integration (CI).

{% github "https://github.com/GoogleChrome/lighthouse-ci" %}

### undraw.co

This site is amazing if you're looking for some quality illustrations in SVG or PNG format. Katerina Limpitsouni, who created undraw.co has done some fantastic work. She's not on DEV, but [give her a follow](https://twitter.com/NinaLimpi) and [undraw](https://twitter.com/unDraw_co) on Twitter.

### a11y tools

I am not an accessibility expert (so many things in the frontend! 😆), so tools like the ones below are super helpful. Someone who knows quite a bit about this topic though, is Lindsay Kopacz (@lkopacz). Definitely a great follow.

### Tota11y

This is a great accessibility visualization toolkit that was started by [Jordan Scales](https://twitter.com/jdan) while he was working at Khan Academy.

{% github "https://github.com/Khan/tota11y" %}

Fun fact, I converted it to a Chrome/Firefox extension for those interested.

{% link "https://dev.to/nickytonline/an-a11y-extension-coming-to-a-browser-near-you-1mg2" %}

#### axe

Deque's axe browser extension is another great one. It is available for [Chrome](https://chrome.google.com/webstore/detail/axe-web-accessibility-tes/lhdoppojpmngadmnindnejefpokejbdd) and [Firefox](https://addons.mozilla.org/en-CA/firefox/addon/axe-devtools/). It's great for finding accessibility issues in your app.

#### WAVE

WebAIM's [WAVE](https://wave.webaim.org/extension/) browser extension is great as well for finding accessibility issues in your app.

### cssgrid.io

@wesbos has great courses. He teaches things so well and in a fun way. [cssgrid.io](https://cssgrid.io/) is a great course for learning CSS grid that Mozilla sponsored, which is how Wes was able to make this course free. I highly recommend it. Note to self to go through this course again.

### JavaScript 30

Wes at it again with another great free course. Check out [JavaScript 30](https://javascript30.com/) to up your JavaScript game with fun little projects.

### Every Layout

I purchased [Every Layout](https://every-layout.dev/) while on sale last year, but the site content is all free. Andy Bell (@hankchizljaw) and Heydon Pickering do an amazing job.

### Some Staple Sites

There are tonnes of sites out there, so I'm just going to drop a few since this post is already an 11 minute read LOL.

* [CSS Tricks](https://css-tricks.com)
* [MDN](https://developer.mozilla.org/)
* [Dev Docs](https://devdocs.io)

### Know Your CSS Triggers

I do not know the list of all CSS triggers by heart, so [CSS Triggers](https://csstriggers.com/) is a great resource.

Also, speaking of CSS Tricks, here's a [short but quick explanation](https://css-tricks.com/css-triggers/) by Chris Coyier (@chriscoyier) about CSS triggers. 

### Kata Time

One that I revisit every now and then is [JS Katas](https://jskatas.org/), previously called ES6 Katas. This is a great way to keep your JS skills fresh.

### Learning Gamified

This is a great genre of learning. There are paid resources, but a couple of notable free ones are:

* [Flexbox Froggy](https://flexboxfroggy.com/)
* [Flexbox Zombies](https://geddski.teachable.com/p/flexbox-zombies)
* [CSSBattle](https://cssbattle.dev/)

### Anything Stephanie Eckles

All the below resources can be found at [Stephanie's web site](https://thinkdobecreate.com/).

- [ModernCSS.dev](https://ModernCSS.dev) - Modern CSS solutions for old CSS problems
- [smolcss.dev](https://smolcss.dev/) - Minimal snippets for modern CSS layouts and components
- [11ty.rocks](https://11ty.rocks/) - A great [Eleventy](https://www.11ty.dev/) resource
- [stylestage.dev](https://stylestage.dev) - A modern CSS showcase styled by community contributions

### TypeScript

This one, I will admit, is probably overkill for my personal site which is currently pretty much just a blog, but at my current job, we're not using [TypeScript](https://www.typescriptlang.org/), so I decided to keep my TypeScript skills fresh by using it.

Having said that, I've worked on several large projects using TypeScript and can 100% say, it allows for quicker refactorings, discoverability and avoiding silly errors. I have a mini-series on TypeScript for those interested.

{% link "https://dev.to/nickytonline/why-you-might-want-to-consider-using-typescript-6j3" %}

If you've been on the fence about TypeScript, consider giving it a try in 2020. There is a huge ecosystem of types now and a lot of the popular frameworks either provide out of the box support or pretty easy setups to get going with TypoScript:

* React via [Create React App](https://create-react-app.dev/docs/adding-typescript/). TLDR; `npx create-react-app my-app --template typescript`
* Angular (TypeScript out of the box)
* Vue with [some simple setup]
(https://vuejs.org/v2/guide/typescript.html)
* Next.js (TypeScript out of the box)
* [NestJS](https://nestjs.com/) has a [TypeScript Starter project](https://github.com/nestjs/typescript-starter)

There is also TSDX, which is some fantastic work by Jared Palmer (@jaredpalmer). It's a great bootstrapping tool for TypeScript for different types of projects and it's officially endorsed by the TypeScript team.

{% github "https://github.com/jaredpalmer/tsdx" %}

And you know what? If you're still not a fan of types, that's OK. 😺

### The JavaScript Event Loop

[Philip Roberts](https://twitter.com/philip_roberts) talk at JSConf EU "What the heck is the event loop anyway?" is a great explanation of the event loop.

{% youtube "8aGhZQkoFbQ" %}

### Some JavaScript Knowledge Nuggets care of Jake Archibald

This is definitely a great watch for those looking to understand JavaScript's event loop building off of Philip Robert's talk above.

{% youtube "cCOL7MC4Pl0" %}

Jake also has a great blog post about [Tasks, microtasks, queues and schedules](https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/).

### Storybook

Storybook is such a great tool for building components and design systems. It started off as a tool just for React and since then has expanded to all the major frameworks as well as plain old HTML. Check out [learnstorybook.com](https://learnstorybook.com).

### The Keyframers

I will be the first to admit that I have not done a lot of work with animations, so I tend to Google stuff a lot when it comes to this space. Two gentleman that are experts in animation though have a great podcast and YouTube channel where they rebuild animations. The Keyframers is an awesome collaboration by @davidkpiano and @shshaw.

{% twitter "1211998464692891648" %}

I still have many episodes to watch and to learn from.

### VisBug Browser Extension

A newer frontend tool out there that looks really interesting is [VisBug](https://chrome.google.com/webstore/detail/visbug/cdockenadnadldjbbgcallicgledbeoc?hl=en). I tried it out briefly, but I must admit, I have not dug into this too deep yet.

This is the handy work of [Adam Argyle](https://www.twitter.com/argyleink).

{% youtube "lc9PZxX6mIQ" %}

**Update January 8th 2020:** Adam Tweeted back to me that you can launch tota11y from VisBug. Cool stuff. Thanks Adam!

{% twitter "1215052867716804608" %}

Note: This browser extension is currently only available for Chrome.

### Your Browser's Developer Tools

This might sound like an obvious tool, but I have worked with people who do not use them that much.

Someone that knows these tools well and that I highly suggest you follow is Umar Hansa (@umaar). He is on DEV and has no activity, but links in his bio can lead you to other places to find him on the web. He has [a great newsletter for dev tips](https://umaar.com/dev-tips/), that I highly recommend subscribing to.

### Playing in Traffic

What's going on with your web requests? Looks like there is a traffic jam. These tools have your back:

* [Fiddler](https://www.telerik.com/download/fiddler) (cross-platform, but at the moment, it's only decent on a Windows machine.) Fiddler was my go-to for anything network related when I was on a Windows machine. Replaying requests, modifying payloads, proxying through it to capture traffic from the site/application you're working on.
* [Postman](https://www.getpostman.com/)
* [Postwoman](https://postwoman.io/)
{% link "https://dev.to/liyasthomas/postwoman-v1-0-a-free-fast-beautiful-alternative-to-postman-mn0" %}

### Josh Comeau's Picks

Josh Comeau is a talented frontend who currently works for Gatsby. He Tweeted during the holidays some other great open-source/free resources that I suggest you check out. Here's the Tweet thread. He's also a great follow.

{% twitter "1212416797254832130" %}

### JavaScript January

Emily Freeman (@editingemily) started this in I believe 2017. Lots of great articles on JavaScript. It's a new January, so check out [javascriptjanuary.com](https://www.javascriptjanuary.com/).

### DEV!

DEV has so many great posts from people from all over the globe in regards to frontend. I'll share some that I love, but definitely navigate around. So many great ones.

{% link "https://dev.to/ananyaneogi/html-can-do-that-c0n" %}

Lydia Hallie's (@lydiahallie) posts on JavaScript

{% twitter "1213135686502699008" %}

Michael Chan's React Holiday Series

{% link "https://dev.to/chantastic/learn-react-in-25-short-lessons-react-holiday-2019-24np" %}

### Visual Studio Code

This falls under the obvious category probably, but it's worth mentioning it since it is open-source.

This has been my go-to editor for work-related stuff since believe it or not 2015. Back in 2015, I was working on a product for an e-commerce company and TypeScript was to be used in the frontend. At the time, VS Code was the only editor to have TypeScript support. Back in 2015, there were no extensions for VS Code. It was only about a year and a half later that extension support was added. Since then, the [extension ecosystem](https://marketplace.visualstudio.com/vscode) has exploded.

A great addition to the ecosystem has been the [Live Share extension pack](https://marketplace.visualstudio.com/items?itemName=MS-vsliveshare.vsliveshare-pack). This is such a great way to do [pair programming](https://en.wikipedia.org/wiki/Pair_programming). 🍐

{% twitter "1075155769870307329" %}

If you're interested, it is a little outdated, but here is my VS Code setup. These days, I roll with Sarah Edo's [Night Owl](https://marketplace.visualstudio.com/items?itemName=sdras.night-owl) theme and the wonderful font, [Dank Mono](https://dank.sh) (yes I paid for it, but it's nowhere near the price of Operator Mono).

{% link "https://dev.to/nickytonline/my-visual-studio-code-setup-2ima" %}

### VS Code Tips

I created the [@vscodetips](https://twitter.com/vscodetips) Twitter account back in September 2017. People seem to enjoy the tips I post or things I retweet related to VS Code. If VS Code is your jam, consider giving it a follow.

[VS Code tips is also on DEV](https://dev.to/vscodetips), but I have not done much there yet. You can check out the profile here

### Refined GitHub Browser Extension

Refined GitHub is not frontend specific, but a lot of us use GitHub for work. It's a great extension available for [Chrome](https://chrome.google.com/webstore/detail/refined-github/hlepfoohegkhhmjieoechaddaejaokhf) or [FireFox](https://addons.mozilla.org/en-US/firefox/addon/refined-github-/). The Chrome extension also works for some Chromium-based browsers. The ones I can confirm it does work on are [Brave](http://brave.com/) and the new Microsoft [Edge](https://www.microsoftedgeinsider.com/en-us/).

There are too many features to mention, but my favourites are automatically deleting a branch after it is merged, and prompting you to create a PR if you're on GitHub and just pushed a branch or made changes to a branch that currently does not have a PR open.

![Screen shot of Refined GitHub prompting a user to create a PR](https://www.iamdeveloper.com/images/posts/_i_qo9qd11owzquv5j3zywa.png)

The extension integrates so well, I no longer know what is a new GitHub feature or a Refined GitHub feature.

{% github "https://github.com/sindresorhus/refined-github" %}

### Online Editors/Playgrounds

More and more development is being done directly on the web, whether it be proof of concepts or full-blown apps. So much has happened in this space in the past few years. 👏

![Playground smoking and on fire](https://media.giphy.com/media/aXilAPXOrdX3i/giphy-downsized-large.gif)

Here's some staples:

* [codepen](https://codepen.io/)
* [CodeSandbox](https://codesandbox.io/)
* [Stackblitz](https://stackblitz.com/)
* [jsbin](https://jsbin.com/)
* [jsfiddle](https://jsfiddle.net/)
* [repl.it](https://repl.it/)


## Paid Tools/Resources

I do not have any affiliate links in any of the stuff posted below. They are just great resources that help me. Let's get started.

### Refactoring UI

I purchased the [Refactoring UI](https://refactoringui.com/book/) book last year and loved it. I've given it a full read and will probably give it another read. The price varies depending on the type of package you go with. I got a great pre-release sale deal, so I grabbed the whole enchilada.

There is also a YouTube channel that you can subscribe to or just search for Refactoring UI on YouTube.

{% youtube "5gdYHlYAKDY" %}

Also, Steve Schoger ([@steveschoger](https://www.twitter.com/steveschoger) on Twitter), one of the authors of the book, Tweets a lot too about Refactoring UI. A great follow.

### Every Layout

As mentioned above, I purchased [Every Layout](https://every-layout.dev/checkout/). This is a great buy and the additional resources are great. I've been reading the ebook (not finished yet) and have really been enjoying it. Great work Andy and Heydon!

### xScope

There are browser extensions that do part of what xScope does, but a few years ago, a co-worker introduced me to [xScope](https://xscope.app). The only downside to this tool is that it is only available for Mac. If you are on a Mac though, I highly recommend it.

![Screenshot of xScope in action](https://www.iamdeveloper.com/images/posts/_i_z9ib0s1cc88dwa7qvv5n.png) 

### Sizzy

[Sizzy](https://sizzy.app/) is a new one in my toolbelt, but so far I am loving it. I snagged it at a great price during Boxing Day week. In a nutshell, it allows you to work on a site or application and see how it appears in different devices. It has more to it than that, but I am still new to it, so I probably haven't unleashed all its awesomeness yet. Kudos to @thekitze for building this awesomeness.

![Screenshot of Sizzy in action](https://www.iamdeveloper.com/images/posts/_i_cqu87zz9l97zk55ng3p5.png)

### Learning through Video

These will most likely not come as a surprise, but it's worth mentioning them.

* [Egghead](https://egghead.io) (a happy subscriber)
* [Frontend Masters](https://frontendmasters.com/) (a happy subscriber. Thank you for the subscription [Shotgun](https://www.shotgunsoftware.com/) (my previous employer)!)
* [testingjavascript.com](https://testingjavascript.com/) (a happy license owner. Thanks x 2 Shotgun!)
* Anything Wes Bos. Check out his [courses](https://wesbos.com/courses/).

Also, there is a new kid on the block, [Educative](https://educative.io). Looks like they are gaining some traction, so probably worth checking out as well. They're also on DEV, posting great content.

### That's All She Wrote

There are so many resources out there but this is what my current brain dump brought to the table and at some point we all have to go to the bathroom. 😆 I probably could have organized this better, but for now, this is how the dump came out.

If you have resources not listed that you think other frontend developers would benefit from, drop them in the comments! I hope you enjoyed the read and you can go to the bathroom as well now.

Until next time peeps!

![Stay tuned](https://media.giphy.com/media/J4zA6LplubvC5weDyo/giphy.gif)

The cover image is a partial screenshot of my site's thank you page, but the illustration comes from the wonderful work of Katerina Limpitsouni's [undraw.co](https://undraw.co)
), but I have not done much there yet. You can check out the profile here

## New Beginnings Starting in 2020

As the year came to a close, I decided to accept an unbelievably amazing opportunity. I am very excited about it! It is a fully remote position working with a dope team. I cannot wait to get started. I will share more about this in early 2020.

Thanks for reading and Happy New Year!

Photo by [NordWood Themes](https://unsplash.com/@nordwood?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/s/photos/2019?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)
