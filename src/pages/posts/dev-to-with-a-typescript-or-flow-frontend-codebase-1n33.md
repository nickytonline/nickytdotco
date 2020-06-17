---
title: dev.to with a TypeScript or Flow frontend codebase?
date: '2019-04-07T03:37:54.000Z'
excerpt: Consider moving dev.to frontend codebase to TypeScript or Flow?
thumb_img_path: >-
  https://res.cloudinary.com/practicaldev/image/fetch/s--_QFrjKLr--/c_imagga_scale,f_auto,fl_progressive,h_420,q_auto,w_1000/https://thepracticaldev.s3.amazonaws.com/i/8d2nn4w6f0smjm9ca4yf.gif
comments_count: 10
positive_reactions_count: 20
tags:
  - meta
  - javascript
  - typescript
  - flow
canonical_url: >-
  https://dev.to/nickytonline/dev-to-with-a-typescript-or-flow-frontend-codebase-1n33
template: post
---


Shout out to @rhymes for giving this post a review. 👏

Before the dev.to codebase was opensourced, I was working on it in the private repository and created an issue in there that has since been copied to the public repository (thanks @maestromac!).


<iframe class="liquidTag" src="https://dev.to/embed/github?args=https%3A%2F%2Fgithub.com%2Fthepracticaldev%2Fdev.to%2Fissues%2F383%23%20issue-351630725" style="border: 0; width: 100%;"></iframe>


For those new to types, here's a post from Preethi Kasireddy about types.


<iframe class="liquidTag" src="https://dev.to/embed/link?args=https%3A%2F%2Fdev.to%2Fiampeekay%2Fwhy-use-static-types-in-javascript-part-1" style="border: 0; width: 100%;"></iframe>


Also, here's a fairly recent episode from the [Script and Style](https://scriptandstyle.com) podcast about types in JavaScript, [Static Typing for JavaScript](https://scriptandstyle.com/4d5e9839).

## TypeScript

I'm partial to [TypeScript](https://www.typescriptlang.org) myself. I've written about it here before.


<iframe class="liquidTag" src="https://dev.to/embed/link?args=https%3A%2F%2Fdev.to%2Fnickytonline%2Fwhy-you-might-want-to-consider-using-typescript-6j3" style="border: 0; width: 100%;"></iframe>


There appears to be a shift towards TypeScript for those that are interested in types. I wrote a bit about it here


<iframe class="liquidTag" src="https://dev.to/embed/link?args=https%3A%2F%2Fdev.to%2Fnickytonline%2Fis-2019-the-year-of-typescript-18p2" style="border: 0; width: 100%;"></iframe>


There is also a great episode on the React Podcast that talks about TypeScript with Jared Palmer.


<iframe class="liquidTag" src="https://dev.to/embed/twitter?args=1111321292966264832" style="border: 0; width: 100%;"></iframe>


Also check out the TypeScript tag


<iframe class="liquidTag" src="https://dev.to/embed/tag?args=typescript" style="border: 0; width: 100%;"></iframe>


Take TypeScript for a spin in one of the playgrounds:

* Unofficial Playground


<iframe class="liquidTag" src="https://dev.to/embed/link?args=https%3A%2F%2Fdev.to%2Fnickytonline%2Fan-enhanced-typescript-playground-49j6" style="border: 0; width: 100%;"></iframe>


* [Official TypeScript Playground](https://www.typescriptlang.org/play/)

## Flow

[Flow](https://flow.org/) is another option in the frontend in regards to types, although I've never used it myself. 

Here are some links if you want to read up on Flow.

* [Writing Better JavaScript with Flow](https://www.sitepoint.com/writing-better-javascript-with-flow)
* [An Introduction to Flow](https://pusher.com/sessions/meetup/js-monthly-london/flow)
* [Flow: A Static Type Checker for JavaScript](https://dzone.com/articles/flow-a-static-type-checker-for-javascript)
* I honestly did not really find many posts on dev.to about Flow, but feel free to check out these tags.


<iframe class="liquidTag" src="https://dev.to/embed/tag?args=flow" style="border: 0; width: 100%;"></iframe>



<iframe class="liquidTag" src="https://dev.to/embed/tag?args=flowtype" style="border: 0; width: 100%;"></iframe>


Take Flow for a spin in the [Flow REPL](https://flow.org/try/)

# Other Options
I've narrowed it down to TypeScript and Flow as they are the most popular, but feel free to bring others to the table to discuss, e.g. Elm, Reason. (Thanks for chiming in on Twitter @magellol!)


<iframe class="liquidTag" src="https://dev.to/embed/twitter?args=1115243007928877057" style="border: 0; width: 100%;"></iframe>


## Vanilla JS🍦

If you really don't want to see the codebase converted to use types, that's OK too. 

![same old stuff gif from giphy.com](https://media.giphy.com/media/xT5LMOwBto9xvEC3nO/giphy.gif)

Are static types something that would interest people in the dev.to community who are contributing to or are thinking about contributing to the frontend codebase? Feel free to discuss in the comments here and/or jump on over to the [GitHub issue](https://github.com/thepracticaldev/dev.to/issues/383) and comment there.

<center>
![Debate animated gif from giphy.com](https://media.giphy.com/media/Wv493An4dA0xi/giphy.gif)
</center>

*[This post is also available on DEV.](https://dev.to/nickytonline/dev-to-with-a-typescript-or-flow-frontend-codebase-1n33)*


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
