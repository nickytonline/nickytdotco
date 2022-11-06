---json
{
  "title": "Ecosystem and Frameworks: My Role at Netlify",
  "excerpt": "I'm curious what frontend frameworks you're all interested in these days? Powerful meta frameworks...",
  "date": "2022-05-12T03:29:20.000Z",
  "tags": [
    "frontend",
    "javascript",
    "career",
    "opensource"
  ],
  "cover_image": "https://www.iamdeveloper.com/images/posts/_practicaldev_image_fetch_s--QZ53kjKB--_c_imagga_scale,f_auto,fl_progressive,h_420,q_auto,w_1000_https:__dev-to-uploads.s3.amazonaws.com_uploads_articles_w9ynhhbmy7bvh3e4nxnx.jpeg",
  "canonicalUrl": "https://www.iamdeveloper.com/posts/ecosystem-and-frameworks-my-role-at-netlify-306b",
  "reading_time_minutes": 2,
  "template": "post"
}
---

I'm curious what frontend frameworks you're all interested in these days? Powerful meta frameworks have been built using libraries like Vue and React. [Next.js](https://nextjs.org/) comes to mind: [Remix](https://remix.run) is a new contender, and we have other notable projects like [SvelteKit](https://github.com/sveltejs/kit), [Astro](https://github.com/withastro/astro), [Eleventy](https://github.com/11ty/eleventy), etc.

I'm on the ecosystem team working on frameworks in my new role at [Netlify](https://netlify.com). Our job, at the moment, because I'm sure it will evolve, is to ensure whatever you deploy to Netlify deploys seamlessly. I'm not saying this to promote Netlify, although it is incredible. It's to express my excitement at this type of role.

I need to know/learn how all these frameworks work, which is exciting.

For example, if you weren't aware, Netlify released their [Edge functions offering](https://docs.netlify.com/netlify-labs/experimental-features/edge-functions/) a couple of weeks ago. My coworker Salma has a great post about them.

{% embed "https://dev.to/whitep4nth3r/were-all-living-on-it-but-what-exactly-is-the-edge-4n5l" %}

My other awesome coworker Eduardo released a [deep dive article about Netlify Edge functions](https://www.netlify.com/blog/deep-dive-into-netlify-edge-functions/) if you want to check that out as well.

I bring this up because I get to continue to work in open source in my role at Netlify. For some background, Edge functions use the amazing [Deno](https://deno.land/) project, a modern open-source runtime for JavaScript and Typescript. We're big fans of OSS at Netlify. ♥️

{% embed "https://github.com/denoland" %}

I was [looking into an issue with Netlify Edge functions within the Remix framework](https://github.com/remix-run/remix/issues/3003).

{% embed "https://github.com/remix-run/remix" %}

One of the core team members had issues getting Edge functions to work with Remix. After some fun detective work, I figured out the issue. TLDR; a polyfill wasn't web standards compliant, so the bug only occurred when Edge functions were enabled because Deno is compliant. In contrast, regular serverless functions use the non-web standards compliant polyfill in Node.js land.

It's not fixed yet, at least when writing this post, but the Remix core team is working on it. It was tons of fun to figure things out publicly and share my findings, as this is open-source baby!

I'm stoked to continue exploring this role, working with the developer community, our customers, my coworkers, and open-source community!

Peace peeps!

Photo by [Alex Kondratiev](https://unsplash.com/@alexkondratiev?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/s/photos/experiment?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)
