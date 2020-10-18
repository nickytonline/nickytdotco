---
title: dom-chef - Build DOM Elements with JSX
date: '2019-02-02T23:45:45.270Z'
excerpt: dom-chef-  Build DOM Elements with JSX
thumb_img_path: >-
  https://res.cloudinary.com/practicaldev/image/fetch/s--zP7lTySV--/c_imagga_scale,f_auto,fl_progressive,h_420,q_auto,w_1000/https://thepracticaldev.s3.amazonaws.com/i/pkajv39sn98rgfgdeotf.jpg
comments_count: 1
positive_reactions_count: 44
tags:
  - githunt
  - webdev
  - javascript
  - ui
canonical_url: 'https://www.iamdeveloper.com/posts/dom-chef---build-dom-elements-with-jsx-5fi/'
template: post
---


Photo by [Wyron A](https://unsplash.com/photos/Lhb1DyyNr7U?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/search/photos/chef?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)

I came across dom-chef while working on a PR for [migrating Refined GitHub to TypeScript](https://github.com/sindresorhus/refined-github/pull/1750) (WIP and something that is interesting on its own if you're new to TypeScript).

At a quick first glance, I thought Refined GitHub was built with React, but as soon as I had that second sip of coffee, I realized it was just JS with some JSX in it.

![](https://media3.giphy.com/media/2JeyC2DvEhdRu/giphy.gif?cid=19f5b51a5c562926446e66326327f7e5)

The TLDR:
* No API, JSX gets auto transformed into actual DOM elements
* Protection from XSS injections
* Partial SVG support
* React-like props naming (including events)
* Mix any DOM elements inside

This is definitely interesting if you're a fan of JSX.

Check out the repository


<iframe class="liquidTag" src="https://dev.to/embed/github?args=https%3A%2F%2Fgithub.com%2Fvadimdemedes%2Fdom-chef" style="border: 0; width: 100%;"></iframe>


*[This post is also available on DEV.](https://dev.to/nickytonline/dom-chef---build-dom-elements-with-jsx-5fi)*


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
