---
stackbit_url_path: posts/nan-and-set-keys-21n6
title: NaN and Set Keys
date: '2021-06-05T12:08:27.334Z'
excerpt: >-
  On Thursday, during my JavaScriptHours stream, we came across something
  interesting.  In JavaScript,...
thumb_img_path: >-
  https://res.cloudinary.com/practicaldev/image/fetch/s--6k6LoX3G--/c_imagga_scale,f_auto,fl_progressive,h_420,q_auto,w_1000/https://dev-to-uploads.s3.amazonaws.com/uploads/articles/4jsgcriiqp4o7nbu8rmn.jpeg
comments_count: 4
positive_reactions_count: 15
tags:
  - discuss
  - help
  - javascript
canonical_url: 'https://dev.to/nickytonline/nan-and-set-keys-21n6'
template: post
---
On Thursday, during my JavaScriptHours stream, we came across something interesting.

In JavaScript, 
`NaN !== NaN`
. With a 
`Set`
, the values are unique. If you try to add the same value, there will always be one of it in the 
`Set`
.

During the stream, I created a 
`Set`
 and added 
`NaN`
 to it twice. Some of the audience in the chat as well as myself were surprised and perplexed that the 
`Set`
 contained one value after adding 
`NaN`
 twice given that 
`NaN !== NaN`
.


<iframe class="liquidTag" src="https://dev.to/embed/twitter?args=1400498933554683904" style="border: 0; width: 100%;"></iframe>


Does anyone know why this is? My only guess is that maybe there is a 
`Symbol`
 that indicates 
`NaN`
 is unique even though 
`NaN !== NaN`
.

*[This post is also available on DEV.](https://dev.to/nickytonline/nan-and-set-keys-21n6)*


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
