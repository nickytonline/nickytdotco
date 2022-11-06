---json
{
  "title": "Converting a Preact Component to use hooks with Sophia Li",
  "excerpt": "A few weeks ago, I wrote a post asking DEV community members if they wanted to potentially pair...",
  "date": "2020-07-27T04:01:08.932Z",
  "tags": [
    "learninpublic",
    "pairprogramming",
    "javascript",
    "react"
  ],
  "cover_image": null,
  "canonicalUrl": "https://www.iamdeveloper.com/posts/live-coding-pairing-converting-a-preact-component-to-use-hooks-75e/",
  "reading_time_minutes": 1,
  "template": "post"
}
---

A few weeks ago, I wrote a post asking DEV community members if they wanted to potentially pair program with me during a live coding session.

{% link "https://dev.to/devteam/let-s-pair-during-a-live-coding-session-8he" %}

A lot of interest was generated and so we did our first live coding pairing session that was streamed on [doingdevfordev.com](https://doingdevfordev.com). It was with DEV community member [Sophia Li](https://twitter.com/sophia_wyl).

She worked on the `<ImageUploader />` Preact component in the DEV/forem codebase. It was originally a class component that she converted to a function component using the [useState](https://reactjs.org/docs/hooks-reference.html#usestate) hook.

For the full recording of the pairing session check out the YouTube video below. Also, feel free to subscribe to [my channel](https://m.youtube.com/channel/UCBLlEq0co24VFJIMEHNcPOQ). 😉

{% youtube "gy2LyxQtlSQ" %}

Near the end of the pairing session we discussed the possibility of using the [useReducer](https://reactjs.org/docs/hooks-reference.html#usereducer) hook instead. After the pairing session, Sophia continued working on the PR she created and implemented the necessary changes to use the `useReducer` hook.

For those interested, here is the merged PR.

{% github "https://github.com/forem/forem/pull/9369" %}

It was awesome pairing with Sophia and by the way, she’s looking for her next role!

{% twitter "1273775174718943232" %}

Looking forward to the next pairing session!
