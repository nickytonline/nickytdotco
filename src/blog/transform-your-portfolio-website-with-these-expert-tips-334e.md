---json
{
  "title": "Transform Your Portfolio Website with These Expert Tips",
  "excerpt": "Yes that title sounds a bit clickbaity, but I assure you this post is not all fluff. Buckle up!  I...",
  "date": "2023-03-12T14:12:11.189Z",
  "tags": [
    "beginners",
    "webdev",
    "portfolio",
    "frontend"
  ],
  "cover_image": "https://www.nickyt.co/images/posts/_practicaldev_image_fetch_s--mgPMEmM4--_c_imagga_scale,f_auto,fl_progressive,h_420,q_auto,w_1000_https:__dev-to-uploads.s3.amazonaws.com_uploads_articles_55c1umcrwwox207gat3i.png",
  "canonical_url": "https://www.nickyt.co/blog/transform-your-portfolio-website-with-these-expert-tips-334e/",
  "reading_time_minutes": 3,
  "template": "post"
}
---

Yes that title sounds a bit clickbaity, but I assure you this post is not all fluff. Buckle up!

I speak to a lot of folks breaking into tech. Many of these folks have a portfolio website, as it's a requirement to land a role, especially that first one.

Some things have probably been repeated, but they need repeating. You have to stand out in a sea of people who all want the same thing as you.

Say you're in a boot camp. You all typically do the same projects aside from your keystone project, but this can even apply to your keystone project.

1. Go that extra mile. Automate the deployment. There are great platforms that simplify this task, like [Netlify](https://www.netlify.com/) (disclaimer I work there 😎). You can set it up to deploy on pushing code to your repository and get a deploy preview if you have pull requests etc.

2. Consider accessibility (a11y). You don't need to be an accessibility expert, but you can get many a11y wins from just a bit of reading. I have a great list of a11y resources in my [Frontend Developer Resources 2022 article](https://www.iamdeveloper.com/blog/frontend-developer-resources-2022-4cp2/#heading-accessibility).

3. Consider adding some testing to the projects. That could be [unit tests](https://martinfowler.com/bliki/UnitTest.html), [component tests](https://applitools.com/learn/concepts/component-testing/) using something like [Testing Library](https://testing-library.com/docs/), [Storybook](https://storybook.js.org/), or [Cypress Component Testing](https://docs.cypress.io/guides/component-testing/overview). Or even end-to-end (E2E) testing using something like [Cypress](https://www.cypress.io/) or [Playwright](https://playwright.dev/). Btw, I'm giving a talk for The Collab Lab this week on [E2E testing with Cypress for anyone interested](https://www.iamdeveloper.com/pages/talks/#heading-end-to-end-testing-with-cypress).

4. Automate something aside from the deployment. Use something like  [GitHub Actions](https://docs.github.com/en/actions). There are lots of pre-built actions at your disposal, but creating your own for a task could be fun and make you stand out.

5. Get feedback from great welcoming communities. I've named some of my favourite ones to be a part of in this post:

{% embed "https://dev.to/nickytonline/where-do-you-find-community-458p" %}

All the above is excellent advice you may have heard or heard parts of. Still, the one big thing that I <em>never hear about and see consistently</em>, is the lack of a [custom domain](https://blog.hubspot.com/website/custom-domains) for a portfolio site.

Instead of having your portfolio site at e.g. https://my-awesome-portfilio.netlify.app, have something like https://janesmith.dev.

It looks more professional and shows that you know a bit about [DNS](https://jvns.ca/blog/2022/04/26/new-zine--how-dns-works-/) as you need to set it up to point to where your site is hosted. And they're not that expensive typically. 5-10$ USD can usually land you a decent domain name.

There are many services out there that allow you to purchase a custom domain, but one that I've been delighted with is [Namecheap](https://www.namecheap.com/). The prices are super reasonable, and I've never had any issues.

Hope these points help you out! Until the next one!
