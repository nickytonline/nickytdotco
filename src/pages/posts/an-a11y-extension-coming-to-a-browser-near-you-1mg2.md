---
title: An a11y extension coming to a browser near you
date: '2019-04-01T01:02:21.000Z'
excerpt: >-
  Last year when I was looking to take on a new role somewhere, one of the
  places I interviewed at was...
thumb_img_path: >-
  https://res.cloudinary.com/practicaldev/image/fetch/s--KQEdO3mC--/c_imagga_scale,f_auto,fl_progressive,h_420,q_auto,w_1000/https://thepracticaldev.s3.amazonaws.com/i/ir0wzbkqn1rw9vu67irj.png
comments_count: 6
positive_reactions_count: 40
tags:
  - a11y
  - javascript
  - browserextension
canonical_url: >-
  https://www.iamdeveloper.com/blog/2019-03-31-an-a11y-extension-coming-to-a-browser-near-you/
template: post
---


Last year when I was looking to take on a new role somewhere, one of the places I interviewed at was Khan Academy. TLDR, I wasn’t hired 😉. However, as a candidate, I wanted to stand out. Relevant post 👇


<iframe class="liquidTag" src="https://dev.to/embed/link?args=https%3A%2F%2Fdev.to%2Fnickytonline%2Ftake-chances-and-standout-because-who-knows-3kh6" style="border: 0; width: 100%;"></iframe>


In a nutshell, I [put up a PR](https://github.com/Khan/tota11y/pull/131) to Khan’s tota11y repository to convert their a11y tool to a browser extension.


<iframe class="liquidTag" src="https://dev.to/embed/github?args=https%3A%2F%2Fgithub.com%2FKhan%2Ftota11y" style="border: 0; width: 100%;"></iframe>


The goal of the PR was, aside from standing out, was to make it an extension without interfering with how their tool works when loaded as a [bookmarklet](https://khan.github.io/tota11y/# Try-it).

I’ll be up front, I’m not an a11y expert, so this tool was actually really good for me to learn a few things. Here’s a shot of it in action.


<iframe class="liquidTag" src="https://dev.to/embed/twitter?args=1040818193911173120" style="border: 0; width: 100%;"></iframe>


One of the coolest features is the screen reader wand (Khan's work, not mine).

![t0ta11y screen reader wand in action](https://www.iamdeveloper.com/img/tota11y-in-action.gif "t0ta11y screen reader wand in action")

The PR isn’t merged yet, but will hopefully be in the next month or so. Regardless, you can try it out today as an unpacked extension in Chrome, FireFox, Brave or any browser that lets you load Chrome Webstore extensions. All you need to do is [clone my branch](https://github.com/nickytonline/tota11y/tree/poc/tota11y-as-chrome-extension) and build it locally. See the [README](https://github.com/nickytonline/tota11y/tree/poc/tota11y-as-chrome-extension# loading-tota11y-as-an-unpacked-chrome-extension) for instructions for loading it as an unpacked extension.

I hope you find it useful and shoutout to the devs at Khan for making this great tool.

*[This post is also available on DEV.](https://dev.to/nickytonline/an-a11y-extension-coming-to-a-browser-near-you-1mg2)*


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
