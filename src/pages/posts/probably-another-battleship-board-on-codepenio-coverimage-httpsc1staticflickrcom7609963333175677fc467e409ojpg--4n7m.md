---
title: Probably another Battleship board on Code Pen
date: '2018-02-09T05:01:39.457Z'
excerpt: A basic Battleship board with some random hits and misses.
thumb_img_path: >-
  https://res.cloudinary.com/practicaldev/image/fetch/s--MCAKzX1f--/c_imagga_scale,f_auto,fl_progressive,h_420,q_auto,w_1000/https://c2.staticflickr.com/6/5184/5639332304_9f91e58360_b.jpg
comments_count: 0
positive_reactions_count: 11
tags:
  - css
  - codepen
canonical_url: >-
  https://www.iamdeveloper.com/posts/probably-another-battleship-board-on-codepenio-coverimage-httpsc1staticflickrcom7609963333175677fc467e409ojpg--4n7m/
template: post
---


Photo courtesy of Flickr user [drtran](https://www.flickr.com/photos/drtran/5639332304/sizes/l).

If you want to see the previous Code Pen I did, check out [A 💩 Notification Code Pen](https://dev.to/nickytonline/a--notification-code-pen-4o0n).

Continuing along with my [2018 Resolutions](https://dev.to/nickytonline/2018-resolutions-1deo) to make Code Pens this year, here is my latest.

As mentioned previously, one of the reasons I wanted to start making Code Pens was to see how much I can do without the help of JS. In this example, Javascript is only used to build the markup for the board because I was too lazy to make it all by hand. There's also a small function to simulate a game move as a miss/hit.

I've been doing [@wesbos](https://dev.to/wesbos)'s awesome [CSS Grid course](https://cssgrid.io), so I thought it would be fun to use these new skills to recreate a classic board game, Battleship. I'm sure there are probably tonnes of these on Code Pen, but honestly, I don't care. It was just fun making it. There's some tweaking to do still (centering of game pieces is off when I look at it on mobile), but so far, I'm happy with it.

Maybe at some point, I'll make the full game, but for now, a board with some simulated hits and misses.


<iframe class="liquidTag" src="https://dev.to/embed/codepen?args=https%3A%2F%2Fcodepen.io%2Fnickytonline%2Fpen%2FzRNMvO" style="border: 0; width: 100%;"></iframe>


I'll end with some cheese, "You sank my battleship!".

*[This post is also available on DEV.](https://dev.to/nickytonline/probably-another-battleship-board-on-codepenio-coverimage-httpsc1staticflickrcom7609963333175677fc467e409ojpg--4n7m)*


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
