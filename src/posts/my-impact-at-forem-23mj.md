---
title: My Impact at Forem
date: '2022-03-23T16:08:40.433Z'
excerpt: >-
  This is my first post about impact. What do I mean by impact? How did you
  influence the place you...
thumb_img_path: null
comments_count: 7
positive_reactions_count: 0
tags:
  - career
canonical_url: 'https://www.iamdeveloper.com/posts/my-impact-at-forem-23mj.md'
template: post
hashnode_url: https://nickytonline.hashnode.dev/my-impact-at-forem
---

This is my first post about impact. What do I mean by impact?

How did you influence the place where you worked? Stuff like big projects or processes that you put in place that helped the company.

I'm going to start with the most recent company that I worked at, Forem, the software that powers sites like dev.to where you might be reading this blog post.

I'm proud of all the work I did while at Forem, and I wanted to take note of it all while it's still fresh in my head.

## Pre-commit hooks/Coding standards

My work focused mainly on the frontend, and I put pre-commit hooks that ran stuff like prettier, eslint and jest. It expanded to more than that, for example, running rubocop on Ruby files. Check out my post on pre-commit hooks if you're curious about all that.

<iframe class="liquidTag" src="https://dev.to/embed/link?args=https%3A%2F%2Fdev.to%2Fnickytonline%2Fstuff-i-always-set-up-for-frontend-work-56h2" style="border: 0; width: 100%;"></iframe>

Pre-commit hooks, linting, etc., were super important to me because I was the only frontend on the project for a long time. Hence, code maintenance was always on the brain and still is. 😎

## Moving to Preact X, Testing Library

We were running an older version of Preact. The older version was blocking us from using a lot of the functionality that was previously only available in React—hooks, fragments, context, componentDidCatch to name a few. Upgrading Preact wasn't a huge change, but the testing library we used for components in the project was. It worked with the older version of Preact and not the newer one.

Around this time, React Testing Library ([Preact Testing Library](https://preactjs.com/guide/v10/preact-testing-library/) in our case) had started gaining traction. It clicked with me how this library tested components. So, another significant change came with the migration to Preact X. You can read more about that in the referenced changelog post.

<iframe class="liquidTag" src="https://dev.to/embed/link?args=https%3A%2F%2Fdev.to%2Fnickytonline%2Fchangelog-frontend-edition-30l7" style="border: 0; width: 100%;"></iframe>

I mention this in the changelog post, but a big shoutout to my co-worker Ridhwana Khan (@ridhwana) for helping me migrate all the tests to preact-testing-library.

## Accessibility

I'm not an accessibility expert, but I had the chance to work with Marcy Sutton while at Forem. She joined us for about six weeks in the fall of 2020. I learned a lot from her. It also invigorated me to advocate for accessibility as we built out the product. We were building welcoming, inclusive communities, so it would seem hypocritical not to take accessibility into account.

I spoke to our head of engineering at the time, Molly Struve, to advocate for accessibility and explained that we need to make this an organization-wide initiative. She was on board. 😎

Did it start slow? For sure, but it gained traction, and it has now become a part of our process when developing the product.

A big shoutout to Suzanne Aitchison (@s_aitchison), our accessibility expert who joined the team in 2021 and helped push this initiative even further. Is the work done? No, but the application is leaps and bounds more accessible than in the fall of 2020.

## End to End (E2E) Testing

As the application grew more significant and feature-rich, it was super important to be able to feel good about what we shipped. I remember a period when things were breaking a little more frequently. Were we doing a terrible job? No, but that confidence was lacking when we sometimes shipped features/bug fixes. I advocated for E2E testing and got the green light.

It took about a month to get the CI/CD pipeline to run the tests and maybe another couple of weeks to tweak how we run them locally during development.

A big shoutout to my knowledgeable Rails co-workers Josh Puetz, Michael Kohl, Rhymes, and Mac Siri for helping find the best strategy for cleaning the database between test runs.

## Mentoring

As a more senior person on the team, you have to help scale the team and impart knowledge. I consistently did Pairing regarding all things frontend and programming in general. And another great thing about mentoring? You learn too!

## What Else?

I probably missed a few things, but these are the big lines. I'll probably add more to this as I enjoy my time off between roles.

The last thing I'll leave you with is to lift your teammates, listen to others, be kind, and have fun if you want to impact your organization.

Photo by <a href="https://unsplash.com/@sonika_agarwal?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Sonika Agarwal</a> on <a href="https://unsplash.com/s/photos/impact?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
