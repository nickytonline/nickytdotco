---
title: Converting a Preact Component to use hooks with Sophia Li
date: '2020-07-27T04:01:08.932Z'
excerpt: >-
  A few weeks ago, I wrote a post asking DEV community members if they wanted to
  potentially pair progr...
thumb_img_path: null
comments_count: 2
positive_reactions_count: 36
tags:
  - devstream
  - pairprogramming
  - javascript
canonical_url: >-
  https://dev.to/devteam/live-coding-pairing-converting-a-preact-component-to-use-hooks-75e
template: post
---

A few weeks ago, I wrote a post asking DEV community members if they wanted to potentially pair program with me during a live coding session.

<iframe class="liquidTag" src="https://dev.to/embed/link?args=https%3A%2F%2Fdev.to%2Fdevteam%2Flet-s-pair-during-a-live-coding-session-8he" style="border: 0; width: 100%;"></iframe>

A lot of interest was generated and so we did our first live coding pairing session that was streamed on [doingdevfordev.com](https://doingdevfordev.com). It was with DEV community member Sophia Li.

<iframe class="liquidTag" src="https://dev.to/embed/user?args=sophia_wyl" style="border: 0; width: 100%;"></iframe>

She worked on the
`<ImageUploader />`
Preact component in the DEV/forem codebase. It was originally a class component that she converted to a function component using the [useState](https://reactjs.org/docs/hooks-reference.html# usestate) hook.

For the full recording of the pairing session check out the YouTube video below. Also, feel free to subscribe to [my channel](https://m.youtube.com/channel/UCBLlEq0co24VFJIMEHNcPOQ). 😉

<iframe class="liquidTag" src="https://dev.to/embed/youtube?args=gy2LyxQtlSQ" style="border: 0; width: 100%;"></iframe>

Near the end of the pairing session we discussed the possibility of using the [useReducer](https://reactjs.org/docs/hooks-reference.html# usereducer) hook instead. After the pairing session, Sophia continued working on the PR she created and implemented the necessary changes to use the
`useReducer`
hook.

For those interested, here is the merged PR.

<iframe class="liquidTag" src="https://dev.to/embed/github?args=https%3A%2F%2Fgithub.com%2Fforem%2Fforem%2Fpull%2F9369" style="border: 0; width: 100%;"></iframe>

It was awesome pairing with Sophia and by the way, she’s looking for her next role!

<iframe class="liquidTag" src="https://dev.to/embed/twitter?args=1273775174718943232" style="border: 0; width: 100%;"></iframe>

Looking forward to the next pairing session!

**Update August 6th, 2020: Check out Sophia’s post!**

<iframe class="liquidTag" src="https://dev.to/embed/link?args=https%3A%2F%2Fdev.to%2Fsophia_wyl%2Flearnings-from-1st-live-pairing-session-1st-pull-request-to-forem-2lh0" style="border: 0; width: 100%;"></iframe>

_[This post is also available on DEV.](https://dev.to/devteam/live-coding-pairing-converting-a-preact-component-to-use-hooks-75e)_

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
