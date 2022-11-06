---json
{
  "title": "DEV as a Headless CMS for your Gatsby Site",
  "excerpt": "Near the end of September 2019, @ben  posted this article.                                         Yo...",
  "date": "2020-04-15T13:09:54.295Z",
  "tags": [
    "stackbit",
    "headlesscms",
    "gatsby"
  ],
  "cover_image": "https://www.iamdeveloper.com/images/posts/_practicaldev_image_fetch_s--txUc6TTd--_c_imagga_scale,f_auto,fl_progressive,h_420,q_auto,w_1000_https:__dev-to-uploads.s3.amazonaws.com_i_6nx4xj3l7dk99em1bdww.png",
  "canonicalUrl": "https://www.iamdeveloper.com/posts/dev-as-a-headless-cms-for-your-gatsby-site-4mj2/",
  "reading_time_minutes": 3,
  "template": "post"
}
---

Near the end of September 2019, @ben posted this article.

{% link "https://dev.to/devteam/you-can-now-generate-self-hostable-static-blogs-right-from-your-dev-content-via-stackbit-7a5" %}

I won't go into all the details as they are already mentioned in the article, but the TLDR is, by creating a site via Stackbit, you can use DEV as a headless CMS for your self-hosted site.

To get set up, you can follow [these instructions](https://dev.to/connecting-with-stackbit) that Ben references in his post.

The only difference nowadays is the initial instruction. You can start the process of creating your site from the Settings/Integrations section on DEV for your account.

![Screenshot of Integration settings on DEV](https://www.iamdeveloper.com/images/posts/_i_v2aefqt8eny6nd4nkrbe.png)

Since my previous site was a Gatsby site, I decided to generate a Gatsby site using Stackbit and went with the Fresh theme.

![Stackbit site creation step two. Select a site platform](https://www.iamdeveloper.com/images/posts/_i_sa7ktos8omggvvducvp2.png)

![Stackbit site creation step one. Select a theme](https://www.iamdeveloper.com/images/posts/_i_0hdv0ev9tlvkjno28mwo.png)

And then within about a minute, I had my new site, built and deployed to Netlify at https://robust-petunia-478cc.netlify.com. 

{% github "https://github.com/nickytonline/robust-petunia" %}

My actual website is https://iamdeveloper.com, so at that point, I just configured my site in Netlify to point to iamdeveloper.com.

## Why Stackbit/DEV?

So why did I decide to do this if I already had a website running Gatsby with my blog posts? For several reasons.

1. I was getting tired of publishing in two places. First I would write a blog post on my site using Netlify CMS, wait for things to build and deploy, wait for DEV to pick up the changes of my site's RSS feed to generate a draft post and then finally format things so that I could leverage DEV's liquid tags and then post to DEV.
1. I prefer the DEV editor even though it needs some improvements and the liquid tags offer richer content.
1. Posting on DEV when integrated with Stackbit means that it will rebuild my own site with my latest posts, but also, the Stackbit integration generates the same markup for liquid tags on my own site.

## So what are the drawbacks, if any?

1. I've changed my personalized site look for a theme template. This does not bother me that much though. I plan throughout the year to perhaps bring back the look I had once I understand all the moving parts in regards to the Gatsby/Stackbit integration.
1. Currently, Stackbit does not copy over images, it references the same image that is hosted by DEV. This is not a deal-breaker right now, but it would be nice to have all the assets hosted by my site.
1. Stackbit redeploys your site when draft posts are saved.


I ran into some a11y issues which may have been related to the template I chose, but if you look at my commits, you can see where I fixed some things. As well, there were a bunch of Gatsby plugins that I added back from my old site that I required, e.g. sitemap, Google Analytics.

## Verdict?

I'm going to continue dogfooding the Stackbit/DEV integration because I know it will only get better. @remotesynth, I would love to do anything I can to help improve it. My DMs are open on DEV and Twitter.

I definitely recommend you give it a try, especially if you currently do not have a personal site.

That's all peeps!
