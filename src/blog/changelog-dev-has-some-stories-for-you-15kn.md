---json
{
  "title": "Changelog: DEV has Some Stories for You",
  "excerpt": "My first PR to the DEV repository was when I added Storybook to the project. In fact, this was in...",
  "date": "2020-05-22T13:46:37.866Z",
  "tags": [
    "html",
    "css",
    "javascript",
    "storybook"
  ],
  "cover_image": "https://www.iamdeveloper.com/images/posts/_practicaldev_image_fetch_s--QXgm3mdo--_c_imagga_scale,f_auto,fl_progressive,h_420,q_auto,w_1000_https:__dev-to-uploads.s3.amazonaws.com_i_ln7awag96agh8pxsjsui.jpg",
  "canonicalUrl": "https://www.iamdeveloper.com/posts/changelog-dev-has-some-stories-for-you-15kn/",
  "reading_time_minutes": 2,
  "template": "post"
}
---

My first PR to the DEV repository was when I added Storybook to the project. In fact, this was in March of 2018, when the repository was private (which means that I can't even link you to the PR where I added it!)

<center>

![Screenshot of my first commits to the DEV codebase](https://www.iamdeveloper.com/images/posts/_i_x23u4dfcyplsubjkouzp.png)

</center>

If you're interested, here is the [commit](https://github.com/thepracticaldev/dev.to/commit/6a8df8c8ddec739280325c0000d6d32593f70ed0).

If you are new to Storybook I recommend giving this post I wrote a while back a read as well as checking out the [Storybook documentation](https://storybook.js.org/docs/basics/introduction/).

{% link "https://dev.to/nickytonline/getting-started-with-react-storybook-9jh" %}

The TLDR is, Storybook allows you to build out components in isolation and test them visually based on the different states they could be in. Each story you write is the component in a different state.

I added some stories for some [Preact](https://preactjs.com/) components, but after that, Storybook never really got used. Fast forward to January 2020. I started working at DEV and I had some discussions with my awesome product designer Pawel, @pp, about the design system. I mentioned that Storybook was already in the project, but needed to be resuscitated. Once I got it back up and running, we started collaborating, building out design system components and some application components. 

Storybook could be run locally if you had the DEV codebase but it was not deploying as part of our CI/CD pipeline. After doing some pairing with @andy this week, we got it deploying to [Netlify](https://www.netlify.com/) (awesome service!) whenever JavaScript files changed on master.

### **All that to say, you can view our very work in progress Storybook at [storybook.dev.to](https://storybook.dev.to).**

Photo by [Robyn Budlender](https://unsplash.com/@robzy_m?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/s/photos/stories?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)
