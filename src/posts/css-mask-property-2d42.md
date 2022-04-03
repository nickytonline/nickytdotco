---json
{
  "title": "The CSS mask property",
  "excerpt": "Photo by Neven Krcmarek on Unsplash  Say you have a background that you want a certain colour, but...",
  "date": "2019-01-09T16:44:39.000Z",
  "tags": [
    "beginners",
    "css",
    "ui"
  ],
  "cover_image": "https://res.cloudinary.com/practicaldev/image/fetch/s--UPQWL4-u--/c_imagga_scale,f_auto,fl_progressive,h_420,q_auto,w_1000/https://thepracticaldev.s3.amazonaws.com/i/fzgrjq82fzh5gtm4jur5.jpg",
  "template": "post"
}
---
Photo by [Neven Krcmarek](https://unsplash.com/photos/0TH1H1rq_eY?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText "Neven Krcmarek on unsplash.com") on [Unsplash](https://unsplash.com/search/photos/cookie-cutter?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText "unsplash.com website")

Say you have a background that you want a certain colour, but you only want to show parts of the background. Enter the [CSS `mask` property](https://developer.mozilla.org/en-US/docs/Web/CSS/mask "MDN documentation for the CSS mask property"). Think of it like a cookie cutter. You want to bake a cookie, not a rectangular piece of dough. So how does this fit into a real world example on the web?

Have you ever had an icon you liked and wanted to put on your site, but were like, "It would look so much better if I could integrate it with the colours in my site"? CSS `mask` property to the rescue. As you can see, if you interact with the [codepen](https://codepen.io) below, as you change the colour via the colour picker, the colour of the logo, [dev.to](https://dev.to "dev.to website") in this example, will only apply the background colour to the parts of the SVG that are filled. Shout out to [simpleicons.org](https://simpleicons.org "simpleicons.org website") for the dev.to icon!

![](https://www.iamdeveloper.com/static/css-mask-property-in-actio-acec5ed6b7d7c56fea5542832dfd6cca.gif)

If you want to see it in action, take a look at the icons in the menu of my website, [iamdeveloper.com](https://www.iamdeveloper.com "www.iamdeveloper.com web site").

Support for the CSS mask property is [pretty good](https://caniuse.com/#feat=css-masks) unless you still need to support Internet Explorer. If that's the case, a quick Google will provide you with some fallback options.

Also, there's a little bonus with this blog post. I use [CSS variables](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_variables) and JavaScript to get the logo colour to change, so check that out too in the codepen.

*Note: If you're using a browser that does not support `<input type="color" />` it will act like a regular text input. You'll need to type in a valid hex colour and press ENTER on your screen keyboard for the colour to change*

Have some fun and try it out in the codepen! 👋

{% codepen "https://codepen.io/nickytonline/pen/ebxrpv" %}
