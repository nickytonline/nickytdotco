---
stackbit_url_path: posts/pairing-with-community-member-rafi-5169
title: Pairing with Community Member Rafi
date: '2021-01-22T21:36:29.748Z'
excerpt: >-
  On January 21st, DEV Community member Rafi joined Christina and I on the
  pairing stream to work on im...
thumb_img_path: >-
  https://res.cloudinary.com/practicaldev/image/fetch/s--BvMbIlsm--/c_imagga_scale,f_auto,fl_progressive,h_420,q_auto,w_1000/https://dev-to-uploads.s3.amazonaws.com/i/j4m63b3wupg2r2lpctc7.png
comments_count: 0
positive_reactions_count: 14
tags:
  - devstream
  - pairprogramming
  - css
  - html
canonical_url: 'https://www.iamdeveloper.com/posts/pairing-with-community-member-rafi-5169/'
template: post
---
On <time datetime="2021-01-21">January 21st</time>, DEV Community member Rafi joined Christina and I on the pairing stream to work on improving some accessibility issues in the onboarding for a Forem instance, e.g. DEV onboarding.


<iframe class="liquidTag" src="https://dev.to/embed/youtube?args=cVW5sVgouYA" style="border: 0; width: 100%;"></iframe>


Here is the issue that we were working on.


<iframe class="liquidTag" src="https://dev.to/embed/github?args=https%3A%2F%2Fgithub.com%2Fforem%2Fforem%2Fissues%2F9585" style="border: 0; width: 100%;"></iframe>


On this stream, we covered:

* accessibility issues currently affecting the onboarding process in a Forem instance
* we figured out why hyperlinks in labels were not focusable. Turns out setting the CSS property [display](https://developer.mozilla.org/en-US/docs/Web/CSS/display) with the value 
`contents`
 was the culprit. This was in the explanation of the usage of the 
`contents`
 value for the 
`display`
 CSS property in the Mozilla Developer Network (MDN) docs -- *"Due to a bug in browsers this will currently remove the element from the accessibility tree — screen readers will not look at what's inside. See the Accessibility concerns section below for more details."*
* part of the fix was exploring part of codebase's SASS that was using [@extend](https://sass-lang.com/documentation/at-rules/extend) as well as we were trying to figure out where a 
`margin-top`
 was being set.
* We had a bit of a setback with Rafi's web server dying for some reason, but we were still able to make do. That's the beauty of live coding. Unpredictable. 😎

<center>

![Moira from Schitt's Creek saying "One never knows what may hapen"](https://media.giphy.com/media/3ohs4ob5OHiDvF9caY/giphy-downsized-large.gif)

</center>

Thanks again for coming on the stream Rafi!

You can also find the three of us all over the web here:


<iframe class="liquidTag" src="https://dev.to/embed/user?args=rafi993" style="border: 0; width: 100%;"></iframe>



<iframe class="liquidTag" src="https://dev.to/embed/user?args=nickytonline" style="border: 0; width: 100%;"></iframe>



<iframe class="liquidTag" src="https://dev.to/embed/user?args=coffeecraftcode" style="border: 0; width: 100%;"></iframe>


* [Rafi's Website](https://rafi993.me)
* [DEV Twitch Stream](https://www.twitch.tv/thepracticaldev)
* [DEV YouTube Channel](https://www.youtube.com/c/thepracticaldevteam)
* [Nick's Twitch Stream](https://www.twitch.tv/nickytonline)
* [Nick's YouTube Channel](https://iamdeveloper.com/youtube)
* [Nick on Twitter](https://twitter.com/nickytonline)
* [Christina on Twitter](https://twitter.com/coffeecraftcode)

Looking forward to seeing you on future streams! If you're interested in pairing, fill out [this form](https://iamdeveloper.com/pair). We’d love to tackle an issue with you that the whole community could learn from!

[Follow DEV on Twitch](twitch.tv/thepracticaldev) to be notified when future streams begin.



*[This post is also available on DEV.](https://dev.to/devteam/pairing-with-community-member-rafi-5169)*


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
