---json
{
  "title": "What is Deno?",
  "excerpt": "I got to hang with Deno core team member Luca Casonato a couple of weeks ago to discuss a framework...",
  "date": "2022-07-14T03:41:00.000Z",
  "tags": [
    "deno",
    "typescript",
    "rust",
    "javascript"
  ],
  "cover_image": "https://www.iamdeveloper.com/images/posts/_practicaldev_image_fetch_s--vO_muh2a--_c_imagga_scale,f_auto,fl_progressive,h_420,q_auto,w_1000_https:__dev-to-uploads.s3.amazonaws.com_uploads_articles_s4rykg32xnqkbo8155be.png",
  "canonicalUrl": "https://www.iamdeveloper.com/posts/what-is-deno-13he/",
  "reading_time_minutes": 8,
  "template": "post"
}
---

I got to hang with Deno core team member Luca Casonato a couple of weeks ago to discuss a framework he created called Fresh! You can check out [Fresh: a new full stack web framework for Deno with Luca Casonato](https://www.youtube.com/watch?v=nBrcmlrekV4) on [my YouTube channel](https://www.youtube.com/NickTaylorYolo).

Fresh runs on [Deno](https://deno.land/), a modern runtime for JavaScript and TypeScript. Luca gives a great explainer about what Deno is. Check out the video but if you'd prefer to read or have your browser dictate it to you or some other assistive technology, I've also included the transcript below.

{% embed "https://www.youtube.com/watch?v=7digrkx1YZ0" %}

## Transcript of What is Deno?

**Nick Taylor:** Speaking of Deno. Yeah, we act, I work in Netlify and we use it for our Edge offering. So, uh, if folks are kind of wondering if it's production ready, I would definitely say yes.

Um, so, uh, we're definitely gonna talk about Fresh, which is a new web framework, but I kind of want to touch on Deno a bit first because I'm, I'm somewhat familiar with it, but I know Deno might be something that's new to a lot of folks. So I guess, I guess high level, like what is Deno? 

**Luca Casonato:** Yeah. So Deno's original pitch is that Ryan, the person who originally created Node, um, went like 10 years later or eight years later.

So look back at Node and tried to reflect on everything that went wrong with Node and tried to fix everything that was wrong with Node. What came outta that is Deno and Deno tries to be like a JavaScript runtime, but also a TypeScript runtime, because that's very popular at this point, have TypeScript built in, it's much more fully integrated, like batteries included like other modern languages, like Rust and Go where they have like formatters and linters and testing frameworks, benchmarking, dependency management, all that built in, into the mm-hmm like as one integrated system.

And we try to be really modern with the JavaScript that we use. Um, so we try to really make full use of ES6 and all of the cool stuff we've gotten from that Promises, async iterators, web APIs like readable stream writeable stream. And we try to just stick really closely to the browser.

So like have fetch for HTTP server rather than having custom APIs. And, we have module resolution works the same way that it does in the browser. So we like import stuff from URLs and you can use import maps, just like in browsers to, to re map specifiers stuff like that. Okay. 

**Nick Taylor:** Cool. Cool. Yeah. Yeah, no, it's, uh, it, I find the project pretty interesting, cuz like, uh, I, I dropped a link to that.

Talk about, uh, 10 things I regret about Node.js and I, I can't remember when Ryan started working on it, I think it was like three, maybe four years ago. Uh, I'm not positive, but 

**Luca Casonato:** I think may 20 on May 23rd. It was four years ago. So it's been like four and a bit years now. 

Okay. Yeah. Quite a while.

**Nick Taylor:** Yeah. No and yeah, no, I remember, uh, I found the talk really interesting cuz like he was critical of a lot of things of Node, but I think he, if anybody is allowed to be critical about, it's probably the creator of it. Um, yeah. And um, yeah, no. I I'm a big fan of TypeScript. So I found it interesting that he decided to go with TypeScript.

And I know just, just from what I had read, like a few years ago, it was initially, uh, coded in Go, I believe. And then, I'm not sure when, but there was a, a pivot to go to Rust, I believe, but I, I don't know what I mean I know Rust is a very great language. So do you know what the reason for the pivot was?

**Luca Casonato:** Yeah. I do. Go is a garbage collected, memory managed language like JavaScript or C# where the runtime itself can do things like garbage collection. It can do cycle detection, it can do, reference handling of, of objects. You don't need to manually manage memory pointers, stuff like that.

And if you're trying to build a like V8 JavaScript, is also very, very, memory managed language, right. And V8 the engine that we use to run JavaScript, the same one that's used in Chrome, has a very advanced garbage collector and Go has a very advanced garbage collector. And if you have two of these very advanced garbage collectors in the same binary, and they're trying to like in the same process in the same thread, and they're continuously fighting with each other, when they're trying to garbage collect, they have like two separate heap pools.

It becomes like a nightmare pretty quickly. So what you, you really don't want to have your host language for your JavaScript, runtime, be garbage, collected language, and Rust at that point. And I think it still is, is by far the best, manually memory managing like the, the best language to manually where you can do manual manual memory management.

Like it's safe. Yeah , it's really fast. 

**Nick Taylor:** Okay. Yeah, no, there's a lot of stuff. Uh, I'm still pretty new to Rust, but I, I I'd been learning a bit of it last. Uh, last year, last fall. And, uh, I definitely there's some con well, I definitely love the pattern matching in it, but I, I definitely there's some concepts like, you know, borrowing and all that.

It's, it's an interesting, it's it takes a second to get your head wrapped around it, but it's kinda neat how only one thing can ever own the data, which in theory, and I imagine in practice too means you can never have any kind of, uh, data collisions or issues with concurrency or at least that's, that's like the big thing, isn't it?

**Luca Casonato:** Yeah. So the, the core principle of Rust is that you can never have two references. To the same bit of mutable data or, sorry. No, you can never have two mutable reference to the same bit of data. Like you can have multiple references to the same data, if you all can only read from the data, that's fine. But yeah, if you want to modify the data, you have to be, you have to have like single ownership over that data at that point in time when you're trying to mutate it, which allows you to make sure that when you're mutating this data, other like threads, for example, can't be in the middle of reading that data.

It can't break them because you're outta sync from them. So that's, and the entire borrow checker and rests memory ownership model is built around the concept that you can only ever have a single mutable reference, to some bit of data. And it like takes a while to wrap your head around.

But like once you do, it's, it's very empowering because it allows you to. To, to build like really fast software, and really safe software, with very little effort. Well I say very little effort, very little effort compared to something like C++, right. Where you have to continuously keep your mind in this space

like, is this safe? Um, where do like, do I need to move this point or, like crazy stuff that you don't need to deal with and rest, cause the compiler will just error, if you do something wrong. 

**Nick Taylor:** Yeah, I know for sure. And, and I know even like the, the Chrome team has started to build out parts of the V8 engine with it, because, because of like, as far as I know, the majority of it's written in C++, and there's like, mm-hmm,

I don't know how many bugs, but there's definitely bugs related to memory management. And they've been slowly plugging in Rust there as well to, uh, to help, um, uh, kind of squash some of those bugs. Um, and it definitely makes sense what you're saying about the garbage collection, because, I used to do C# quite a bit, and it, and it's nice when you don't have to worry about, you know, allocating and deallocating memory, but I can definitely, there is a hit to having the garbage collector, you know, at some point, you know, not that your program seizes up, but there's, there's at one point, you know, like somebody's gotta take out the trash, you know, and, and I, and it definitely makes sense what you're saying.

If the two languages are garbage collected, then I could see that being an issue. Yeah. 

**Luca Casonato:** Like they're, they're continually fighting with each other, like they're not coordinating on when. Gonna do these pauses to do garbage collection. So like they might happen half a second apart from each other, which that's probably fine, but like, they might also just happen right after each other.

Then you have like a lockup of 200 milliseconds in your program where they're both doing garbage collection. 

**Nick Taylor:** And I guess, I guess another reason I could think of why, the move to Rust might have happened too, is a web assembly. I imagine as well? Cuz like, uh, like I know web assembly started off with Rust.

I mean, you can do other things now. Like there's like .NET projects, like Blazor where you can write C# to compile, to, to WASM and stuff. But, but all the stuff I saw initially, and, and it has been a lot of stuff has just been in Rust for WASM. So I imagine that pair is nicely given that Deno's a JavaScript runtime, serving stuff on the Edge and you know, so it seems like it would pair well.

**Luca Casonato:** I think we like originally when the switch was made, this was not really something we considered at all, but over time, this is really like proven to be insanely useful. Like a lot of our internal infrastructure that's built it's for native code in, in the binary, in the CLI binary. We also have WASM builds for it that you can just run on the Edge.

Okay. Um, in WASM containers. 

**Nick Taylor:** That's pretty cool. Yeah. Yeah. Okay. Nice. And then, uh, so, and then, yeah, we we'll definitely get to Fresh, uh, shortly, but, uh, and obviously. Uh, TypeScript's seem to make sense because, well, one it's definitely a rising in popularity. It's it's, uh, people might not realize this, but TypeScript's been around since 2012, like cuz I, I started using TypeScript.

I used to work in a Microsoft shop, so, uh, I was using it back in 2015 when it it's definitely changed a lot. It's definitely way better now. But, but um, you know, I guess if you've never worked with a typed language, it, it, I, I know it, it trips people up sometimes cuz you know, like when you're writing stuff in JavaScript, you can coerce things or you can just be like, yeah.

Okay. I know it's not exactly the same thing, but I can add this property later or whatever, but uh, it's kind of nice that it adds that to the language natively. Uh, I find cuz cuz you do get those, those type checkings in place, but uh, but you can also write plain JavaScript as well. Right? In, in Deno.

**Luca Casonato:** Yeah. 

TypeScript's completely opt in. Um, we do recommend you use it because it's just, it's a much better experience really. Um, like the learning curve from switching from JavaScript to TypeScript is much lower than, I don't know, switching from JavaScript to rest, for example, right?

**Nick Taylor:** Yeah. Yeah. For sure. 

**Luca Casonato:** And the amount of benefit it provides, like even if it didn't do type checking, even just for like editor completions is just so phenomenal.

It's just worth it. Just alone for editor completions.
