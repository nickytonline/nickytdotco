---
title: 'What plugins, CMS etc. are using for your Gatsby powered blog?'
date: '2019-01-08T14:57:51.953Z'
excerpt: >-
  Photo by Damian Zaleski on Unsplash  I'm really impressed with Gatsby's plugin
  architecture. Here's m...
thumb_img_path: >-
  https://res.cloudinary.com/practicaldev/image/fetch/s--K1c7Tgjm--/c_imagga_scale,f_auto,fl_progressive,h_420,q_auto,w_1000/https://thepracticaldev.s3.amazonaws.com/i/f5pq8in32y3sbid6lm4k.jpg
comments_count: 7
positive_reactions_count: 57
tags:
  - discuss
  - gatsby
  - react
  - blogging
canonical_url: >-
  https://www.iamdeveloper.com/posts/what-plugins-cms-etc-are-using-for-your-gatsby-powered-blog-2cdd/
template: post
---


Photo by [Damian Zaleski](https://unsplash.com/photos/RYyr-k3Ysqg?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/search/photos/blog?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)

I'm really impressed with [Gatsby's plugin architecture](https://www.gatsbyjs.org/docs/plugin-authoring/). Here's my current list of plugins

- [gatsby-plugin-feed](https://www.gatsbyjs.org/packages/gatsby-plugin-feed/)
- [gatsby-plugin-google-analytics](https://www.gatsbyjs.org/packages/gatsby-plugin-google-analytics/)
- [gatsby-plugin-manifest](https://www.gatsbyjs.org/docs/add-a-manifest-file/)
- [gatsby-plugin-netlify](https://www.gatsbyjs.org/packages/gatsby-plugin-netlify/)
- [gatsby-plugin-netlify-cms](https://www.gatsbyjs.org/packages/gatsby-plugin-netlify-cms/)
- [gatsby-plugin-offline](https://www.gatsbyjs.org/packages/gatsby-plugin-offline/)
- [gatsby-plugin-purgecss](https://www.gatsbyjs.org/packages/gatsby-plugin-purgecss/)
- [gatsby-plugin-react-helmet](https://www.gatsbyjs.org/packages/gatsby-plugin-react-helmet/)
- [gatsby-plugin-sass](https://www.gatsbyjs.org/packages/gatsby-plugin-sass/)
- [gatsby-plugin-sharp](https://www.gatsbyjs.org/packages/gatsby-plugin-sharp/)
- [gatsby-plugin-sitemap](https://github.com/gatsbyjs/gatsby/tree/master/packages/gatsby-plugin-sitemap)
- [gatsby-plugin-twitter](https://www.gatsbyjs.org/packages/gatsby-plugin-twitter/)
- [gatsby-plugin-web-font-loader](https://github.com/escaladesports/gatsby-plugin-web-font-loader)
- [gatsby-remark-copy-linked-files](https://www.gatsbyjs.org/packages/gatsby-remark-copy-linked-files/)
- [gatsby-remark-images](https://www.gatsbyjs.org/packages/gatsby-remark-images/)
- [gatsby-remark-relative-images](https://github.com/danielmahon/gatsby-remark-relative-images)
- [gatsby-source-filesystem](https://www.gatsbyjs.org/packages/gatsby-source-filesystem/)
- [gatsby-transformer-remark](https://github.com/gatsbyjs/gatsby/tree/master/packages/gatsby-transformer-remark)
- [gatsby-transformer-sharp](https://www.gatsbyjs.org/packages/gatsby-transformer-sharp/)

What Gatsby plugins do you have installed?

I've been using Gatsby since fall 2017, but only recently switched it to [Netlify CMS](https://www.netlifycms.org), which is amazing by the way. The Workflow feature is not enabled by default in the CMS starter, but it's pretty easy to enable. In your config.yaml simply add the following line


```publish_mode: editorial_workflow```


For more information about additional config, see [their docs](https://www.netlifycms.org/docs/configuration-options).

As soon as this is enabled you have drafts (new branch), ready for publish (PR of your new branch), Review (someone who has access to your CMS to review the blog post or page (PR review) and Publish (merge to master). It's really powerful. I'm thoroughly impressed with the workflow.

!["Netlify CMS workflow in action"](https://thepracticaldev.s3.amazonaws.com/i/ufk1fs7f3fq3l8oclm4t.png)

If you have a CMS enabled, what are you using?

*[This post is also available on DEV.](https://dev.to/nickytonline/what-plugins-cms-etc-are-using-for-your-gatsby-powered-blog-2cdd)*


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
