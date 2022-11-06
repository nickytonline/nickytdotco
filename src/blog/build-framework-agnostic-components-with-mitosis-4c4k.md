---json
{
  "title": "Build framework-agnostic components with Mitosis",
  "excerpt": "Sami Jaber, Software Engineer @ Builder.io joined me recently to discuss Mitosis, a tool for building...",
  "date": "2022-10-18T00:35:07.253Z",
  "tags": [
    "react",
    "javascript",
    "svelte",
    "vue"
  ],
  "cover_image": "https://www.iamdeveloper.com/images/posts/_practicaldev_image_fetch_s--iLw4lL5a--_c_imagga_scale,f_auto,fl_progressive,h_420,q_auto,w_1000_https:__dev-to-uploads.s3.amazonaws.com_uploads_articles_lg2kt0vfm90g2a3ljlbm.jpg",
  "canonicalUrl": "https://www.iamdeveloper.com/posts/build-framework-agnostic-components-with-mitosis-4c4k",
  "reading_time_minutes": 4,
  "template": "post"
}
---

[Sami Jaber](https://twitter.com/samijaber_), Software Engineer @ [Builder.io](https://Builder.io) joined me recently to discuss Mitosis, a tool for building framework-agnostic components.

{% embed "https://github.com/builderio/mitosis" %}

Here's the transcript from a highlight from the Twitch stream that I think sums up what Mitosis is really well. If you want to check out the full video, I've added it to the end of this post.

{% embed "https://www.twitch.tv/videos/1626946940" %}

## Transcript

Nick Taylor:

> So we're gonna talk about Mitosis and like the tagline on the stream here is building framework agnostic components with Mitosis. So can you kind of maybe unwrap that for everybody, uh, who might not be familiar with the project?

Sami Jaber:

> For sure. So, We have web frameworks, right? We have a lot of them today. The vast majority of people know React. That's why I was like going over my background. That's what I started with. Most people today be like what frameworks do you know, you know, React, but there's like a dozen or something and there's the numbers keep, keeps on growing. For good reason. Every framework is like coming up with its own trade offs and solutions to different complicated problems.
>
> But one thing that keeps on coming up over and over is for certain people the need to be able to make the right the same frame component for every single framework. And that's not everybody's use case. If you are, like, when I worked for four years at On Splash, we just had like one web application and that's, a lot of people just have one web application and so in that case it. I don't need to have a component work in multiple frameworks. I'm just building the one app.
>
> But for a lot of other people, other frontend engineers, they're building UI design libraries. They're like at part
of like a big company. That company has 10, 20, 30 web apps brand by different teams. And those teams shows different web frameworks, but then they're like, hey, we wanna have a unified design. Which makes total sense. And so now there's like a team or some number of people you're like, This is what our button's gonna look like everywhere. Well, like, how do you make that happen?
>
> And so the number one suggestion that most people would give after hearing this would be like, use Web Components. That's kind of like the de facto. Like, that's kind of like the, the communities like, standard solution or like, that's what we're trying to do is like, that's like the standard way of trying to solve this problem of interoperable Web Components. But Web Components is not really, it's, it's not a framework. It's more of like a combination of technologies that are built on top of browsers.
>
> And so, I mean, we're already like trying to like dive deep, but for reasons that can like, I dunno if you wanna dive into those reasons, like now or later, but essentially we tried that at Builder. We tried to solve our need for multiple, like framework agnostic components using, Web Components and that didn't quite cut it for our needs. Especially because we wanted, out of the box support for SSR (server-side rendering) for every single output. We wanted it to feel as close, like not feel as close as well, to feel like a native component in that framework every time.
>
> So we have a React user using a React SDK we want that, that SDK to feel literally like a React component, like no other additional steps. No other like, stuff to finagle and
like set up instructions like, Hey, you know, to set it up, you're gonna have to do this and this and that. And we also had things like our SDKs really needed to be very capable and be able to use all of the features of those frameworks.
>
> So I kind of like skipped that part. That's one of the main reasons we use Mitosis is to build our SDKs, which we have like, one, one for React. That was written by hand, but then we're like, Okay, that's like not gonna, we're not gonna be able to do that over and over. So how are we gonna do the Vue SDK, the Vue  SDK, the SolidJS SDK, the Svelte SDK, the Qwik SDK. I don't know if there's another one that I forgot to list, but that's already a lot of them. So, yeah, so Web Components was not really an approach that we were able to use, given that we wanted our components to be able to call our users' components and vice versa, just like a lot of very intricate functionality was needed.
>
> And so we started playing with this idea of, well, could you, write a component once and have it be a Vue component, like a real dot Vue component, and then a React dot JSX component, and then a dot Svelte component.Like could you actually achieve that somehow?
>
> And we think we have, and that's what Mitosis is.

Full video

{% embed "https://www.youtube.com/watch?v=bVJymLTPFsA" %}

## Links

- [Sami's Website](https://sami.website)
- [Sami on Twitter](https://twitter.com/samijaber_)
- [Mitosis Fiddle](https://mitosis.builder.io)
- [Sveltosis](https://try.sveltosis.dev)

Photo by <a href="https://unsplash.com/@nci?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">National Cancer Institute</a> on <a href="https://unsplash.com/s/photos/mitosis?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
