---
title: 'Changelog: DEV has Some Stories for You'
date: '2020-05-22T13:46:37.866Z'
excerpt: >-
  My first PR to the DEV repository was when I added Storybook to the project.
  In fact, this was in Mar...
thumb_img_path: >-
  https://res.cloudinary.com/practicaldev/image/fetch/s--Sqclji0m--/c_imagga_scale,f_auto,fl_progressive,h_420,q_auto,w_1000/https://res.cloudinary.com/practicaldev/image/fetch/s--QXgm3mdo--/c_imagga_scale%2Cf_auto%2Cfl_progressive%2Ch_420%2Cq_auto%2Cw_1000/https://dev-to-uploads.s3.amazonaws.com/i/ln7awag96agh8pxsjsui.jpg
comments_count: 6
positive_reactions_count: 54
tags:
  - meta
  - html
  - css
  - javascript
canonical_url: >-
  https://www.iamdeveloper.com/posts/changelog-dev-has-some-stories-for-you-15kn/
template: post
---
My first PR to the DEV repository was when I added Storybook to the project. In fact, this was in March of 2018, when the repository was private (which means that I can't even link you to the PR where I added it!)

<center>

![Screenshot of my first commits to the DEV codebase](https://dev-to-uploads.s3.amazonaws.com/i/x23u4dfcyplsubjkouzp.png)

</center>

If you're interested, here is the [commit](https://github.com/thepracticaldev/dev.to/commit/6a8df8c8ddec739280325c0000d6d32593f70ed0).

If you are new to Storybook I recommend giving this post I wrote a while back a read as well as checking out the [Storybook documentation](https://storybook.js.org/docs/basics/introduction/).


<iframe class="liquidTag" src="https://dev.to/embed/link?args=https%3A%2F%2Fdev.to%2Fnickytonline%2Fgetting-started-with-react-storybook-9jh" style="border: 0; width: 100%;"></iframe>


The TLDR is, Storybook allows you to build out components in isolation and test them visually based on the different states they could be in. Each story you write is the component in a different state.

I added some stories for some [Preact](https://preactjs.com/) components, but after that, Storybook never really got used. Fast forward to January 2020. I started working at DEV and I had some discussions with my awesome product designer Pawel, @pp, about the design system. I mentioned that Storybook was already in the project, but needed to be resuscitated. Once I got it back up and running, we started collaborating, building out design system components and some application components. 

Storybook could be run locally if you had the DEV codebase but it was not deploying as part of our CI/CD pipeline. After doing some pairing with @andy this week, we got it deploying to [Netlify](https://www.netlify.com/) (awesome service!) whenever JavaScript files changed on master.

### **All that to say, you can view our very work in progress Storybook at [storybook.dev.to](https://storybook.dev.to).**

Photo by [Robyn Budlender](https://unsplash.com/@robzy_m?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/s/photos/stories?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)

*[This post is also available on DEV.](https://dev.to/devteam/changelog-dev-has-some-stories-for-you-15kn)*


<script>
const parent = document.getElementsByTagName('head')[0];
const script = document.createElement('script');
script.type = 'text/javascript';
script.src = 'https://cdnjs.cloudflare.com/ajax/libs/iframe-resizer/4.1.1/iframeResizer.min.js';
script.charset = 'utf-8';
script.onload = function() {
    window.iFrameResize({}, '.liquidTag');
};
parent.appendChild(script);
</script>    
