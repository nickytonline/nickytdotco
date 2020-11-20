---
title: Pock an awesome utility for the Mac Touchbar
date: '2020-01-21T02:51:30.510Z'
excerpt: >-
  Photo by ian dooley on Unsplash  I'm on a Mac and I honestly have no use for
  the Dock. I actually hid...
thumb_img_path: >-
  https://res.cloudinary.com/practicaldev/image/fetch/s--wu3fsFJF--/c_imagga_scale,f_auto,fl_progressive,h_420,q_auto,w_1000/https://thepracticaldev.s3.amazonaws.com/i/1lnsa2cfa2m4oogcas4f.jpg
comments_count: 5
positive_reactions_count: 38
tags:
  - productivity
canonical_url: >-
  https://www.iamdeveloper.com/posts/pock-an-awesome-utility-for-the-mac-touchbar-11ia/
template: post
---
Photo by [ian dooley](https://unsplash.com/@sadswim?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/s/photos/productivity?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)

I'm on a Mac and I honestly have no use for the Dock. I actually hide it for an eternity so it never appears by running the following command.


`defaults write com.apple.Dock autohide-delay -float 1000000`


I use Alfred and that basically gives me all I really need in terms of opening apps and then I can use <kbd>⌘</kbd> + <kbd>TAB</kbd> to switch apps.

I also do not really use the touch bar except for mapping it to function keys (<kbd>F1</kbd> - <kbd>F12</kbd>) when I have a browser open or VS Code.

![Keyboard preferences for mapping function keys in touch bar for certain apps](https://thepracticaldev.s3.amazonaws.com/i/5xj2scviq8o2kivnyhy0.png)

Having said that, I came across a very interesting project a few weeks ago called Pock that lets you put the Dock into the touch bar. This combined with "permanently" hiding the Dock makes the touch bar more useful for me. If I'm honest, it's just to see if I have a Slack notification, but that alone is worth it.

![Pock in action](https://thepracticaldev.s3.amazonaws.com/i/qyf7zba4vejkjcjvd6lu.jpg)


<iframe class="liquidTag" src="https://dev.to/embed/github?args=https%3A%2F%2Fgithub.com%2Fpigigaldi%2FPock" style="border: 0; width: 100%;"></iframe>


*[This post is also available on DEV.](https://dev.to/nickytonline/pock-an-awesome-utility-for-the-mac-touchbar-11ia)*


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
