---
stackbit_url_path: posts/not-captain-obvious-1boj
title: Not Captain Obvious
date: '2020-08-03T03:37:54.196Z'
excerpt: >-
  I've been reading @swyx 's book "The Career Coding Handbook". It launched on
  July 1st. Although I am...
thumb_img_path: >-
  https://res.cloudinary.com/practicaldev/image/fetch/s--aM9IE2Yl--/c_imagga_scale,f_auto,fl_progressive,h_420,q_auto,w_1000/https://dev-to-uploads.s3.amazonaws.com/i/g6zipfc343b56kfou7pw.png
comments_count: 6
positive_reactions_count: 30
tags:
  - career
  - writing
  - learninpublic
canonical_url: 'https://www.iamdeveloper.com/posts/not-captain-obvious-1boj/'
template: post
---
I've been reading @swyx's book "The Career Coding Handbook". It launched on July 1st. Although I am not finished the book, I have thoroughly been enjoying it so far.


<iframe class="liquidTag" src="https://dev.to/embed/link?args=https%3A%2F%2Fdev.to%2Fswyx%2Flaunching-the-coding-career-handbook-3f43" style="border: 0; width: 100%;"></iframe>


I'm at a point in the book where the focus is about writing. One of the references is to the chapter [Obvious to you. Amazing to others.](https://sivers.org/obvious) from Derek Sivers book "[Hell yeah or no](https://sivers.org/n)".

I related to this, because like many, I debate whether I should write about something that is probably obvious, or that I think is obvious.

So of course I Tweeted that out.


<iframe class="liquidTag" src="https://dev.to/embed/twitter?args=1289915958430072832" style="border: 0; width: 100%;"></iframe>


Hint, it may be obvious to a subset of people, but not everyone, so there is definitely an audience.

This sense that things are obvious is so prevalent, that hotels.com created the character Captain Obvious, a hilarious character in their commercials. Also, it helped me make a great title for this post. 😎


<iframe class="liquidTag" src="https://dev.to/embed/youtube?args=EsURuI8n9s8" style="border: 0; width: 100%;"></iframe>


@ben has posted about this before as well.


<iframe class="liquidTag" src="https://dev.to/embed/link?args=https%3A%2F%2Fdev.to%2Fben%2Fnothing-in-software-development-is-obvious--5hmm" style="border: 0; width: 100%;"></iframe>


With so many concepts, patterns, tech stacks and new stuff popping out all the time as well as all the tech and business jargon out there, everything is not obvious and that's OK. We just need to learn from each other and keep spreading the knowledge.

For example, did you know that in JavaScript you can get an array with unique entries by using a [Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set)?


```javascript
const arrayWithDuplicateValues = [1, 2, 3, 3, 1, 5];
const uniqueArray = Array.from(new Set(arrayWithDuplicateValues);
```


or


```javascript
const arrayWithDuplicateValues = [1, 2, 3, 3, 1, 5];
const uniqueArray = [...new Set(arrayWithDuplicateValues)];
```


Side note, check out [Have a Handy JS Snippet You Want to Share?](https://dev.to/nickytonline/handy-js-snippets-352f).

As a fun exercise, I thought it would be cool if people commented with stuff they think is obvious. It can be anything. A trick/tip in a programming language, something about a tech stack, a concept, jargon or whatever comes to mind.

Who knows? Maybe what you post in the comments could be your next blog post?

<em>Go!</em>

*[This post is also available on DEV.](https://dev.to/nickytonline/not-captain-obvious-1boj)*


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
