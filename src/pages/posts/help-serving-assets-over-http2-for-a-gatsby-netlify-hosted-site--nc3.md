---
stackbit_url_path: posts/help-serving-assets-over-http2-for-a-gatsby-netlify-hosted-site--nc3
title: 'Help serving assets over HTTP/2 for a Gatsby Netlify hosted site '
date: '2019-01-29T03:50:49.550Z'
excerpt: >-
  Photo by Lukas Juhas on Unsplash  Hi all. I threw out this Tweet into the
  Twitterverse, but thought i...
thumb_img_path: >-
  https://res.cloudinary.com/practicaldev/image/fetch/s--Wautikxg--/c_imagga_scale,f_auto,fl_progressive,h_420,q_auto,w_1000/https://thepracticaldev.s3.amazonaws.com/i/244k7ct9qj9jnvd4otjd.jpg
comments_count: 12
positive_reactions_count: 12
tags:
  - help
  - gatsby
  - netlify
canonical_url: >-
  https://www.iamdeveloper.com/posts/help-serving-assets-over-http2-for-a-gatsby-netlify-hosted-site--nc3/
template: post
---


Photo by [Lukas Juhas](https://unsplash.com/photos/2JJz3u_R_Ik?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/search/photos/help?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)

Hi all. I threw out this Tweet into the Twitterverse, but thought it would be wise to ask for help here as well.


<iframe class="liquidTag" src="https://dev.to/embed/twitter?args=1090084616189423616" style="border: 0; width: 100%;"></iframe>


I have a Gatsby site deployed to Netlify, and some of my assets are being served over HTTP/1.1. I know that Netlify [supports HTTP/2 by default for sites enabled with HTTP2](https://www.netlify.com/blog/2017/07/18/http/2-server-push-on-netlify/).

I know that I need to add entries into my 
`_headers`
 file, e.g.


```
/
  Link: </js/example-script.js>; rel=preload; as=script
  Link: </css/example-style.css>; rel=preload; as=style
```


but it would be a pain to update this after every deploy. Is anyone aware of a gatsby plugin that might do this, or how do you go about handling this with your Gatsby site when hosted on Netlify?

I can probably generate the 
`_headers`
 file as part of my build process, but my gut tells me someone has already done this 😉

The source code is here if anyone is interested.


<iframe class="liquidTag" src="https://dev.to/embed/github?args=https%3A%2F%2Fgithub.com%2Fnickytonline%2Fwww.iamdeveloper.com" style="border: 0; width: 100%;"></iframe>


*[This post is also available on DEV.](https://dev.to/nickytonline/help-serving-assets-over-http2-for-a-gatsby-netlify-hosted-site--nc3)*


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
