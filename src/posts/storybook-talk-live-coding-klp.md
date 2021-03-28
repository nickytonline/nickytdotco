---
stackbit_url_path: posts/storybook-talk-live-coding-klp
title: Storybook Talk / Live Coding
date: '2021-03-16T03:43:46.574Z'
excerpt: >-
  Last week, I gave a talk on Storybook at a The Collab Lab
  meetup.                                   N...
thumb_img_path: >-
  https://res.cloudinary.com/practicaldev/image/fetch/s--nDJchRza--/c_imagga_scale,f_auto,fl_progressive,h_420,q_auto,w_1000/https://dev-to-uploads.s3.amazonaws.com/uploads/articles/436wuamj05szgisfdtrm.jpeg
comments_count: 0
positive_reactions_count: 23
tags:
  - javascript
  - react
  - storybook
  - ux
canonical_url: 'https://www.iamdeveloper.com/posts/storybook-talk-live-coding-klp'
template: post
---
Last week, I gave a talk on [Storybook](https://storybook.js.org/) at a [The Collab Lab meetup](https://www.meetup.com/tech-talks-by-the-collab-lab/).


<iframe class="liquidTag" src="https://dev.to/embed/twitter?args=1370056928383090689" style="border: 0; width: 100%;"></iframe>


## What is Storybook?

Think of it as a workbench for building out components that your application consumes without the burden of running your application. It is also living interactive documentation for your entire team/consumers of components.

![Describing building components in Storybook vs. your applciation](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/6x3jsi7yoj9id3xyhgg3.png)
 
By building out your components in isolation, it forces you (in a good way) to really think about how you are building your component. Building things in Storybook will potentially (hopefully) help you avoid tightly coupling things together. 

For example, at Forem, we use [Elastic Search](https://www.elastic.co/) for search results including the list of users returned in the mention autocomplete component below.

![The Forem mention autocomplete component in action in Forem's Storybook](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/3s1qbca47opj18adanwh.png)
 
This component knows nothing about Elastic Search. All it knows is that it gets a list of users from a function [prop](https://reactjs.org/docs/components-and-props.html) called 
`fetchSuggestions`
 and renders them. In Storybook, we mock that prop by creating a function that returns some mocked data.

A Storybook story is view of a component in a certain state. A component can have many stories. Here we show a button component with different variants.

![Different views of a button component in different states in Storybook](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/mw0e2cmaf72ybu2t78e4.png)

Storybook was originally built for React only but has since evolved to support most of today’s popular frameworks like Vue, Angular, and Svelte etc.

There's more, including some live coding and incorporating Storybook into a The Collab Lab project, so check out the full talk and [slide deck](https://iamdeveloper.com/storybook2021).


<iframe class="liquidTag" src="https://dev.to/embed/youtube?args=ypsD-9qQzYg" style="border: 0; width: 100%;"></iframe>


If you aren't already, give The Collab Lab a follow on DEV!


<iframe class="liquidTag" src="https://dev.to/embed/organization?args=the-collab-lab" style="border: 0; width: 100%;"></iframe>




*[This post is also available on DEV.](https://dev.to/nickytonline/storybook-talk-live-coding-klp)*


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
