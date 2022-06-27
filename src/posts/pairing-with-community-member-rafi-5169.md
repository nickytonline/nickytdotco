---json
{
  "title": "Pairing with Community Member Rafi",
  "excerpt": "On January 21st, DEV Community member Rafi joined Christina and I on the pairing stream to work on...",
  "date": "2021-01-22T21:36:29.748Z",
  "tags": [
    "devstream",
    "pairprogramming",
    "css",
    "html"
  ],
  "cover_image": "https://www.iamdeveloper.com/images/posts/_practicaldev_image_fetch_s--BvMbIlsm--_c_imagga_scale,f_auto,fl_progressive,h_420,q_auto,w_1000_https:__dev-to-uploads.s3.amazonaws.com_i_j4m63b3wupg2r2lpctc7.png",
  "canonicalUrl": "https://www.iamdeveloper.com/posts/pairing-with-community-member-rafi-5169/",
  "reading_time_minutes": 2,
  "template": "post"
}
---

On <time datetime="2021-01-21">January 21st</time>, DEV Community member Rafi joined Christina and I on the pairing stream to work on improving some accessibility issues in the onboarding for a Forem instance, e.g. DEV onboarding.

{% youtube "cVW5sVgouYA" %}

Here is the issue that we were working on.

{% github "https://github.com/forem/forem/issues/9585" %}

On this stream, we covered:

* accessibility issues currently affecting the onboarding process in a Forem instance
* we figured out why hyperlinks in labels were not focusable. Turns out setting the CSS property [display](https://developer.mozilla.org/en-US/docs/Web/CSS/display) with the value `contents` was the culprit. This was in the explanation of the usage of the `contents` value for the `display` CSS property in the Mozilla Developer Network (MDN) docs -- *"Due to a bug in browsers this will currently remove the element from the accessibility tree — screen readers will not look at what's inside. See the Accessibility concerns section below for more details."*
* part of the fix was exploring part of codebase's SASS that was using [@extend](https://sass-lang.com/documentation/at-rules/extend) as well as we were trying to figure out where a `margin-top` was being set.
* We had a bit of a setback with Rafi's web server dying for some reason, but we were still able to make do. That's the beauty of live coding. Unpredictable. 😎

<center>

![Moira from Schitt's Creek saying "One never knows what may hapen"](https://media.giphy.com/media/3ohs4ob5OHiDvF9caY/giphy-downsized-large.gif)

</center>

Thanks again for coming on the stream Rafi!

You can also find the three of us all over the web here:

Rafi:

* [Rafi's Website](https://rafi993.me)

Nick:

* [Twitter](https://twitter.com/nickytonline)
* [Website](https://iamdeveloper.com/)
* [livecoding.ca](https://livecoding.ca)
* [YouTube](https://youtube.iamdeveloper.com)

Christina:

* [Twitter](https://twitter.com/coffeecraftcode)

Looking forward to seeing you on future streams! If you're interested in pairing, fill out [this form](https://iamdeveloper.com/pair). We’d love to tackle an issue with you that the whole community could learn from!

[Follow DEV on Twitch](twitch.tv/thepracticaldev) to be notified when future streams begin.
