---
stackbit_url_path: posts/npm-tipstricks-10ea
title: npm tips/tricks
date: '2018-01-10T03:44:30.902Z'
excerpt: Discussion of npm tips/tricks.
thumb_img_path: null
comments_count: 13
positive_reactions_count: 16
tags:
  - discuss
  - npm
  - node
  - javascript
canonical_url: 'https://www.iamdeveloper.com/posts/npm-tipstricks-10ea/'
template: post
---


I almost never install packages globally unless it’s something like yarn or yeoman. When you’re in the root of your Node/JS project, if you want to run something like mocha without an npm script, you’d do 
`./node_modules/.bin/mocha`
.

What I do to be able to just run e.g. 
`mocha`
 is I add 
`./node_modules/.bin`
 to my path in my shell’s profile/config file and whenever I’m in any of my Node/JS projects, I can just run e.g. 
`mocha`
.

Have any npm tips/tricks you want to share?

*[This post is also available on DEV.](https://dev.to/nickytonline/npm-tipstricks-10ea)*


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
