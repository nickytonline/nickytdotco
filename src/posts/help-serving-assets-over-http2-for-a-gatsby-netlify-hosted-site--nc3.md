---json
{
  "title": "Help serving assets over HTTP/2 for a Gatsby Netlify hosted site ",
  "excerpt": "Photo by Lukas Juhas on Unsplash  Hi all. I threw out this Tweet into the Twitterverse, but thought i...",
  "date": "2019-01-29T03:50:49.550Z",
  "tags": [
    "help",
    "gatsby",
    "netlify"
  ],
  "cover_image": "https://res.cloudinary.com/practicaldev/image/fetch/s--Wautikxg--/c_imagga_scale,f_auto,fl_progressive,h_420,q_auto,w_1000/https://thepracticaldev.s3.amazonaws.com/i/244k7ct9qj9jnvd4otjd.jpg",
  "template": "post"
}
---
Photo by [Lukas Juhas](https://unsplash.com/photos/2JJz3u_R_Ik?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/search/photos/help?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)

Hi all. I threw out this Tweet into the Twitterverse, but thought it would be wise to ask for help here as well.

{% twitter "1090084616189423616" %}

I have a Gatsby site deployed to Netlify, and some of my assets are being served over HTTP/1.1. I know that Netlify [supports HTTP/2 by default for sites enabled with HTTP2](https://www.netlify.com/blog/2017/07/18/http/2-server-push-on-netlify/).

I know that I need to add entries into my `_headers` file, e.g.

```
/
  Link: </js/example-script.js>; rel=preload; as=script
  Link: </css/example-style.css>; rel=preload; as=style
```

but it would be a pain to update this after every deploy. Is anyone aware of a gatsby plugin that might do this, or how do you go about handling this with your Gatsby site when hosted on Netlify?

I can probably generate the `_headers` file as part of my build process, but my gut tells me someone has already done this 😉

The source code is here if anyone is interested.

{% github "https://github.com/nickytonline/www.iamdeveloper.com" %}




