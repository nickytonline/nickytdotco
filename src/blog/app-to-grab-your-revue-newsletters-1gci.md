---json
{
  "title": "App to grab your Revue newsletters",
  "excerpt": "So I wrote about how Twitter is scrapping Revue.                                         Revue being...",
  "date": "2022-11-13T14:44:58.537Z",
  "tags": [
    "webdev",
    "serverless",
    "html",
    "typescript"
  ],
  "cover_image": "https://www.iamdeveloper.com/images/posts/_practicaldev_image_fetch_s--mINhBz4F--_c_imagga_scale,f_auto,fl_progressive,h_420,q_auto,w_1000_https:__dev-to-uploads.s3.amazonaws.com_uploads_articles_vhn3sri34nx84esgy3ii.png",
  "canonicalUrl": "https://www.iamdeveloper.com/blog/app-to-grab-your-revue-newsletters-1gci",
  "reading_time_minutes": 1,
  "template": "post"
}
---

So I wrote about how Twitter is scrapping Revue.

{% embed "https://dev.to/nickytonline/revue-being-phased-out-by-twitter-4kle" %}

I was able to pull down all my subscribers, as you can export them.

![Drop down on the Revue Subscribers page with an option to export all subscribers](https://www.iamdeveloper.com/images/posts/_uploads_articles_rmqf3723msiuv81ykoun.png)

That is important, but I also wanted all my past newsletter issues. Revue has an API, so [I wrote a Deno script to save them](https://gist.github.com/nickytonline/102bb45e625db6b9ae0157e293cfb0a3).

This works great, but I was like, let's make this easier for folks who want to grab their newsletters and not have to worry about coding all this. So I wrote a small app to do it.

It uses a [Netlify function](https://www.netlify.com/products/functions/) written in TypeScript to grab the newsletter issues and good old HTML with some inlined style and inlined JavaScript.

{% embed "https://twitter.com/nickytonline/status/1591627552128634880" %}

Here's the source code if you're interested. It's all open source, MIT licensed.

{% embed "https://github.com/nickytonline/get-revue-newsletters" %}

If you have a Revue newsletter, try it out at [revue.iamdeveloper.com](https://revue.iamdeveloper.com). All you need to do is get a Revue API key. To get one, go to [https://www.getrevue.co/app/integrations](https://www.getrevue.co/app/integrations) and request one. It should be at the bottom of the page. It takes around 24 hours to get your API key.
