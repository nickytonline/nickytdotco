---
title: 10 Things I Regret About Node.js
date: '2018-06-07T15:03:07.345Z'
excerpt: >-
  Photo courtesy of flickr user Trygve Lie.  The creator of Node JS, Ryan Dahl,
  recently gave a talk at...
thumb_img_path: >-
  https://res.cloudinary.com/practicaldev/image/fetch/s--6r6k3LWm--/c_imagga_scale,f_auto,fl_progressive,h_420,q_auto,w_1000/https://thepracticaldev.s3.amazonaws.com/i/pedrq8fz6ig8yugihvbt.jpg
comments_count: 23
positive_reactions_count: 122
tags:
  - discuss
  - typescript
  - go
  - node
canonical_url: 'https://www.iamdeveloper.com/posts/10-things-i-regret-about-nodejs-14m3/'
template: post
---

Photo courtesy of flickr user [Trygve Lie](https://www.flickr.com/photos/trygve_lie/5831902960/in/photolist-9Tm2z3-9TkXYG-9Snmm2-9TiaVg-986fu7-91Lys4-af3D6G-91PELy-91PFdw-91LxWD-ir76Ci-8vTR8o-91PEMA-guo8Zw-guot1K-8vQPsx-9Skm3e-91LydX-8vQP9D-8izGEj-guo94j-UD21ff-27wa2Xi-9Skmgc-9SqeLo-9SwjVQ-VAVtVQ-Kc6jW6-9Swk7s-8vTQMJ-9Sobs3-aCccoi-8vQP4a-gunPQK-9SkkHP-9SkjYa-8vQNvP-gunfvN-fhpKFt-a31Gwp-8vTRij-9Skmpr-8vQNt4-fhpJRe-ir6Gd4-SyeqvE-9Sqdf1-9Swkk3-keuT4b-UqDk2W).

The creator of Node JS, [Ryan Dahl](http://tinyclouds.org), recently gave a talk at JSConf EU 2018 titled "10 Things I Regret About Node.js"

<iframe class="liquidTag" src="https://dev.to/embed/youtube?args=M3BM9TB-8yA" style="border: 0; width: 100%;"></iframe>

It's a great talk about Node and he also goes into some details about his new project [Deno](https://github.com/ry/deno), a secure TypeScript runtime on V8.

Here's some of the things he regrets:

- dynamic languages are great for certain things. In a server though, you want things to be statically typed. (Probably why he wrote Deno in TypeScript and Go)
- design mistakes:
  - didn't stick with Promises in Node (in the beginning), keeping them could have sped up async/await development.
  - security
  - Build system (GYP)
  - package.json

Even Brendan Eich chimed in

<iframe class="liquidTag" src="https://dev.to/embed/twitter?args=1004425861410402304" style="border: 0; width: 100%;"></iframe>

Give it a watch. I'm curious what everyone's thoughts are.

_[This post is also available on DEV.](https://dev.to/nickytonline/10-things-i-regret-about-nodejs-14m3)_

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
