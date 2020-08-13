---
title: Forem's CSS Utility Classes
date: '2020-08-10T13:25:41.532Z'
excerpt: >-
  When I joined in January of this year, I had a call with one of our product designers, Pawel (@pp).We discussed the design system...
thumb_img_path: >-
  https://res.cloudinary.com/practicaldev/image/fetch/s--engQ9dAb--/c_imagga_scale,f_auto,fl_progressive,h_420,q_auto,w_1000/https://forem.dev/images/i/63i8i8cez2t6a2zus7mj.png
comments_count: 5
positive_reactions_count: 6
tags:
  - css
  - crayons
  - frontend
canonical_url: 'https://www.iamdeveloper.com/posts/forem-s-css-utility-classes-o6j/'
template: post
---
When I joined in January of this year, I had a call with one of our product designers, Pawel (@pp).

We discussed the design system that was to be built and I was on board for surfacing it in Storybook. It is still a work in progress, but you can see it in action at [storybook.forem.com](https://storybook.forem.com).

Fast forward a bit and we had another discussion about CSS. We opted to go with bespoke CSS utility classes.

Here's Pawel's PR for that if you're interested

{% github https://github.com/thepracticaldev/dev.to/pull/6334 %}

For those that have contributed to the Forem code base in the frontend, at some point, you have most likely touched some CSS. Not many have used our CSS utility classes though unless it was brought up as there is no documentation for it. Even core team members aren't really aware!

This PR changes that. Now there will be documentation hosted for utility classes in Storybook. ~~At the time of writing, the PR is still in review, but will most likely be merged this week.~~ It's merged!

{%github https://github.com/forem/forem/pull/9633 %}

It's mentioned in the PR, but you can check out the PR's [Storybook](https://deploy-preview-9633--storybookdevto.netlify.app/?path=/story/5-css-utility-classes-align-content--content-start) so that you can see it in action.

Also, thanks to Storybook's built-in filtering, it's easy to find a utility class, e.g. searching for flex.

![Screenshot of Forem's Storybook with CSS utility class documentation being filtered](https://forem.dev/images/i/xk7tqlczli3lwv2m8yfs.png)

If you have any questions or feedback, feel free to drop a comment in the PR, [send me a connect message](https://forem.dev/connect/@nickytonline) on forem.dev or hit me up on [Twitter](https://twitter.com/nickytonline).

Looking forward to your future contributions!




