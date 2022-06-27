---json
{
  "title": "Storybook Talk / Live Coding",
  "excerpt": "Last week, I gave a talk on Storybook at a The Collab Lab meetup.                                  ...",
  "date": "2021-03-16T03:43:46.574Z",
  "tags": [
    "javascript",
    "react",
    "storybook",
    "ux"
  ],
  "cover_image": "https://www.iamdeveloper.com/images/posts/_practicaldev_image_fetch_s--nDJchRza--_c_imagga_scale,f_auto,fl_progressive,h_420,q_auto,w_1000_https:__dev-to-uploads.s3.amazonaws.com_uploads_articles_436wuamj05szgisfdtrm.jpeg",
  "canonicalUrl": "https://www.iamdeveloper.com/posts/storybook-talk-live-coding-klp/",
  "reading_time_minutes": 2,
  "template": "post"
}
---

Last week, I gave a talk on [Storybook](https://storybook.js.org/) at a [The Collab Lab meetup](https://www.meetup.com/tech-talks-by-the-collab-lab/).

{% twitter "1370056928383090689" %}

## What is Storybook?

Think of it as a workbench for building out components that your application consumes without the burden of running your application. It is also living interactive documentation for your entire team/consumers of components.

![Describing building components in Storybook vs. your applciation](https://www.iamdeveloper.com/images/posts/_uploads_articles_6x3jsi7yoj9id3xyhgg3.png)
 
By building out your components in isolation, it forces you (in a good way) to really think about how you are building your component. Building things in Storybook will potentially (hopefully) help you avoid tightly coupling things together. 

For example, at Forem, we use [Elastic Search](https://www.elastic.co/) for search results including the list of users returned in the mention autocomplete component below.

![The Forem mention autocomplete component in action in Forem's Storybook](https://www.iamdeveloper.com/images/posts/_uploads_articles_3s1qbca47opj18adanwh.png)
 
This component knows nothing about Elastic Search. All it knows is that it gets a list of users from a function [prop](https://reactjs.org/docs/components-and-props.html) called `fetchSuggestions` and renders them. In Storybook, we mock that prop by creating a function that returns some mocked data.

A Storybook story is view of a component in a certain state. A component can have many stories. Here we show a button component with different variants.

![Different views of a button component in different states in Storybook](https://www.iamdeveloper.com/images/posts/_uploads_articles_mw0e2cmaf72ybu2t78e4.png)

Storybook was originally built for React only but has since evolved to support most of today’s popular frameworks like Vue, Angular, and Svelte etc.

There's more, including some live coding and incorporating Storybook into a The Collab Lab project, so check out the full talk and [slide deck](https://iamdeveloper.com/storybook2021).

{% youtube "ypsD-9qQzYg" %}

If you aren't already, give [The Collab Lab](https://dev.to/the-collab-lab) a follow on DEV!
