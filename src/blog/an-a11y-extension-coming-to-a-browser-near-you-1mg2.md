---json
{
  "title": "An a11y extension coming to a browser near you",
  "excerpt": "Last year when I was looking to take on a new role somewhere, one of the places I interviewed at was...",
  "date": "2019-04-01T01:02:21.000Z",
  "tags": [
    "a11y",
    "javascript",
    "browserextension"
  ],
  "cover_image": "https://www.iamdeveloper.com/images/posts/_practicaldev_image_fetch_s--KQEdO3mC--_c_imagga_scale,f_auto,fl_progressive,h_420,q_auto,w_1000_https:__thepracticaldev.s3.amazonaws.com_i_ir0wzbkqn1rw9vu67irj.png",
  "canonicalUrl": "https://www.iamdeveloper.com/posts/an-a11y-extension-coming-to-a-browser-near-you-1mg2/",
  "reading_time_minutes": 2,
  "template": "post"
}
---

Last year when I was looking to take on a new role somewhere, one of the places I interviewed at was Khan Academy. TLDR, I wasn’t hired 😉. However, as a candidate, I wanted to stand out. Relevant post 👇

{% link "https://dev.to/nickytonline/take-chances-and-standout-because-who-knows-3kh6" %}

In a nutshell, I [put up a PR](https://github.com/Khan/tota11y/pull/131) to Khan’s tota11y repository to convert their a11y tool to a browser extension.

{% github "https://github.com/Khan/tota11y" %}

The goal of the PR was, aside from standing out, was to make it an extension without interfering with how their tool works when loaded as a [bookmarklet](https://khan.github.io/tota11y/#Try-it).

I’ll be up front, I’m not an a11y expert, so this tool was actually really good for me to learn a few things. Here’s a shot of it in action.

{% twitter "1040818193911173120" %}

One of the coolest features is the screen reader wand (Khan's work, not mine).

![tota11y screen reader wand in action](https://www.iamdeveloper.com/images/posts/_uploads_articles_69eecgpq40a25yed3u0z.jpeg)

The PR isn’t merged yet, but will hopefully be in the next month or so. Regardless, you can try it out today as an unpacked extension in Chrome, FireFox, Brave or any browser that lets you load Chrome Webstore extensions. All you need to do is [clone my branch](https://github.com/nickytonline/tota11y/tree/poc/tota11y-as-chrome-extension) and build it locally. See the [README](https://github.com/nickytonline/tota11y/tree/poc/tota11y-as-chrome-extension#loading-tota11y-as-an-unpacked-chrome-extension) for instructions for loading it as an unpacked extension.

I hope you find it useful and shoutout to the devs at Khan for making this great tool.
