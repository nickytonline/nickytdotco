---json
{
  "title": "What is Deno?",
  "excerpt": "I got to hang with Deno core team member Luca Casonato a couple of weeks ago to discuss a framework...",
  "date": "2022-07-14T03:41:52.051Z",
  "tags": [
    "deno",
    "typescript",
    "webdev",
    "rust"
  ],
  "cover_image": "https://www.iamdeveloper.com/images/posts/_practicaldev_image_fetch_s--vO_muh2a--_c_imagga_scale,f_auto,fl_progressive,h_420,q_auto,w_1000_https:__dev-to-uploads.s3.amazonaws.com_uploads_articles_s4rykg32xnqkbo8155be.png",
  "canonicalUrl": "https://dev.to/nickytonline/what-is-deno-13he",
  "reading_time_minutes": 58,
  "template": "post"
}
---

I got to hang with Deno core team member Luca Casonato a couple of weeks ago to discuss a framework he created called Fresh! You can check [Fresh: a new full stack web framework for Deno with guest Luca Casonato](https://www.youtube.com/watch?v=nBrcmlrekV4) on my YouTube channel.

Fresh runs on [Deno](https://deno.land/), modern runtime for JavaScript and TypeScript. Luca gives a great explainer about what Deno is. Check out the video but if you'd prefer to read or have your browser dictate it to you or some other assistive technology, I've also included the transcript below.

{% embed "https://www.youtube.com/watch?v=7digrkx1YZ0" %}

## Transcript of Fresh: a new full stack web framework for Deno with guest Luca Casonato

[00:00:00] **Nick Taylor:** Hey folks, we are back on live coding.ca. I am hanging out with Luca who is just fixing his microphone. I think, um, we are here today to hang out with Luca. Uh, you're the creator of Fresh. Is that right? Okay, cool. Cool. 

[00:00:31] **Luca Casonato:** That's right.

[00:00:31] **Nick Taylor:** Yeah. So, yeah, so yeah, just go ahead, let us know a little bit about yourself and then we'll just kind of dive into it.

[00:00:37] **Luca Casonato:** Yeah. So I'm Luca. I work on the Deno project. Um, full time. I work at the Deno company and we build, um, the Deno CLI and, uh, a, uh, hosting product called Deloy, which a couple other companies also build on. And you can use yourself. It's like an Edge runtime. Um, and I also build Fresh, which is a full stack web framework for Deno, um, which tries to be modern.

[00:01:00] **Luca Casonato:** And I don't know, I'm sure we'll get more into exactly what it is in a minute. 

[00:01:04] **Nick Taylor:** Yeah. Yeah, for sure. For sure. Cool. Cool. Yeah, no, thanks for coming on. I'm sure you got a lot on the go. Um, yeah. Speaking of Deno. Yeah, we act, I work in Netlify and we use it for our Edge offering. So, uh, if folks are kind of wondering if it's production ready, I would definitely say yes.

[00:01:21] **Nick Taylor:** Um, so, uh, we're definitely gonna talk about Fresh, which is a new web framework, but I kind of want to touch on Deno a bit first because I'm, I'm somewhat familiar with it, but I know Deno might be something that's new to a lot of folks. So I guess, I guess high level, like what is Deno? 

[00:01:40] **Luca Casonato:** Yeah. So Deno's original pitch is that Ryan, the person who originally created Node, um, went like 10 years later or eight years later.

[00:01:49] **Luca Casonato:** So look back at Node and tried to reflect on everything that went wrong with Node and tried to fix everything that was wrong with Node. What came outta that is Deno and Deno tries to be like a JavaScript runtime, but also a TypeScript runtime, because that's very popular at this point, have TypeScript built in, it's much more fully integrated, like batteries included like other modern languages, like Rust and Go where they have like formatters and linters and testing frameworks, benchmarking, dependency management, all that built in, into the mm-hmm like as one integrated system.

[00:02:19] **Luca Casonato:** And we try to be really modern with the JavaScript that we use. Um, so we try to really make full use of ES6 and all of the cool stuff we've gotten from that Promises, async iterators, web APIs like readable stream writeable stream. And we try to just stick really closely to the browser.

[00:02:35] **Luca Casonato:** So like have fetch for HTTP server rather than having custom APIs. And, we have module resolution works the same way that it does in the browser. So we like import stuff from URLs and you can use import maps, just like in browsers to, to re map specifiers stuff like that. Okay. 

[00:02:50] **Nick Taylor:** Cool. Cool. Yeah. Yeah, no, it's, uh, it, I find the project pretty interesting, cuz like, uh, I, I dropped a link to that.

[00:02:58] **Nick Taylor:** Talk about, uh, 10 things I regret about Node.js and I, I can't remember when Ryan started working on it, I think it was like three, maybe four years ago. Uh, I'm not positive, but 

[00:03:07] **Luca Casonato:** I think may 20 on May 23rd. It was four years ago. So it's been like four and a bit years now. 

[00:03:13] **Luca Casonato:** Okay. Yeah. Quite a while.

[00:03:14] **Nick Taylor:** Yeah. No and yeah, no, I remember, uh, I found the talk really interesting cuz like he was critical of a lot of things of Node, but I think he, if anybody is allowed to be critical about, it's probably the creator of it. Um, yeah. And um, yeah, no. I I'm a big fan of TypeScript. So I found it interesting that he decided to go with TypeScript.

[00:03:37] **Nick Taylor:** And I know just, just from what I had read, like a few years ago, it was initially, uh, coded in Go, I believe. And then, I'm not sure when, but there was a, a pivot to go to Rust, I believe, but I, I don't know what I mean I know Rust is a very great language. So do you know what the reason for the pivot was?

[00:03:56] **Luca Casonato:** Yeah. I do. Go is a garbage collected, memory managed language like JavaScript or C# where the runtime itself can do things like garbage collection. It can do cycle detection, it can do, reference handling of, of objects. You don't need to manually manage memory pointers, stuff like that.

[00:04:15] **Luca Casonato:** And if you're trying to build a like V8 JavaScript, is also very, very, memory managed language, right. And V8 the engine that we use to run JavaScript, the same one that's used in Chrome, has a very advanced garbage collector and Go has a very advanced garbage collector. And if you have two of these very advanced garbage collectors in the same binary, and they're trying to like in the same process in the same thread, and they're continuously fighting with each other, when they're trying to garbage collect, they have like two separate heap pools.

[00:04:42] **Luca Casonato:** It becomes like a nightmare pretty quickly. So what you, you really don't want to have your host language for your JavaScript, runtime, be garbage, collected language, and Rust at that point. And I think it still is, is by far the best, manually memory managing like the, the best language to manually where you can do manual manual memory management.

[00:05:02] **Luca Casonato:** Like it's safe. Yeah , it's really fast. 

[00:05:04] **Nick Taylor:** Okay. Yeah, no, there's a lot of stuff. Uh, I'm still pretty new to Rust, but I, I I'd been learning a bit of it last. Uh, last year, last fall. And, uh, I definitely there's some con well, I definitely love the pattern matching in it, but I, I definitely there's some concepts like, you know, borrowing and all that.

[00:05:22] **Nick Taylor:** It's, it's an interesting, it's it takes a second to get your head wrapped around it, but it's kinda neat how only one thing can ever own the data, which in theory, and I imagine in practice too means you can never have any kind of, uh, data collisions or issues with concurrency or at least that's, that's like the big thing, isn't it?

[00:05:43] **Luca Casonato:** Yeah. So the, the core principle of Rust is that you can never have two references. To the same bit of mutable data or, sorry. No, you can never have two mutable reference to the same bit of data. Like you can have multiple references to the same data, if you all can only read from the data, that's fine. But yeah, if you want to modify the data, you have to be, you have to have like single ownership over that data at that point in time when you're trying to mutate it, which allows you to make sure that when you're mutating this data, other like threads, for example, can't be in the middle of reading that data.

[00:06:16] **Luca Casonato:** It can't break them because you're outta sync from them. So that's, and the entire borrow checker and rests memory ownership model is built around the concept that you can only ever have a single mutable reference, to some bit of data. And it like takes a while to wrap your head around.

[00:06:30] **Luca Casonato:** But like once you do, it's, it's very empowering because it allows you to. To, to build like really fast software, and really safe software, with very little effort. Well I say very little effort, very little effort compared to something like C++, right. Where you have to continuously keep your mind in this space

[00:06:47] **Luca Casonato:** like, is this safe? Um, where do like, do I need to move this point or, like crazy stuff that you don't need to deal with and rest, cause the compiler will just error, if you do something wrong. 

[00:06:57] **Nick Taylor:** Yeah, I know for sure. And, and I know even like the, the Chrome team has started to build out parts of the V8 engine with it, because, because of like, as far as I know, the majority of it's written in C++, and there's like, mm-hmm,

[00:07:10] **Nick Taylor:** I don't know how many bugs, but there's definitely bugs related to memory management. And they've been slowly plugging in Rust there as well to, uh, to help, um, uh, kind of squash some of those bugs. Um, and it definitely makes sense what you're saying about the garbage collection, because, I used to do C# quite a bit, and it, and it's nice when you don't have to worry about, you know, allocating and deallocating memory, but I can definitely, there is a hit to having the garbage collector, you know, at some point, you know, not that your program seizes up, but there's, there's at one point, you know, like somebody's gotta take out the trash, you know, and, and I, and it definitely makes sense what you're saying.

[00:07:47] **Nick Taylor:** If the two languages are garbage collected, then I could see that being an issue. Yeah. 

[00:07:53] **Luca Casonato:** Like they're, they're continually fighting with each other, like they're not coordinating on when. Gonna do these pauses to do garbage collection. So like they might happen half a second apart from each other, which that's probably fine, but like, they might also just happen right after each other.

[00:08:05] **Luca Casonato:** Then you have like a lockup of 200 milliseconds in your program where they're both doing garbage collection. 

[00:08:09] **Nick Taylor:** And I guess, I guess another reason I could think of why, the move to Rust might have happened too, is a web assembly. I imagine as well? Cuz like, uh, like I know web assembly started off with Rust.

[00:08:21] **Nick Taylor:** I mean, you can do other things now. Like there's like .NET projects, like Blazor where you can write C# to compile, to, to WASM and stuff. But, but all the stuff I saw initially, and, and it has been a lot of stuff has just been in Rust for WASM. So I imagine that pair is nicely given that Deno's a JavaScript runtime, serving stuff on the Edge and you know, so it seems like it would pair well.

[00:08:45] **Luca Casonato:** I think we like originally when the switch was made, this was not really something we considered at all, but over time, this is really like proven to be insanely useful. Like a lot of our internal infrastructure that's built it's for native code in, in the binary, in the CLI binary. We also have WASM builds for it that you can just run on the Edge.

[00:09:05] **Luca Casonato:** Okay. Um, in WASM containers. 

[00:09:07] **Nick Taylor:** That's pretty cool. Yeah. Yeah. Okay. Nice. And then, uh, so, and then, yeah, we we'll definitely get to Fresh, uh, shortly, but, uh, and obviously. Uh, TypeScript's seem to make sense because, well, one it's definitely a rising in popularity. It's it's, uh, people might not realize this, but TypeScript's been around since 2012, like cuz I, I started using TypeScript.

[00:09:28] **Nick Taylor:** I used to work in a Microsoft shop, so, uh, I was using it back in 2015 when it it's definitely changed a lot. It's definitely way better now. But, but um, you know, I guess if you've never worked with a typed language, it, it, I, I know it, it trips people up sometimes cuz you know, like when you're writing stuff in JavaScript, you can coerce things or you can just be like, yeah.

[00:09:49] **Nick Taylor:** Okay. I know it's not exactly the same thing, but I can add this property later or whatever, but uh, it's kind of nice that it adds that to the language natively. Uh, I find cuz cuz you do get those, those type checkings in place, but uh, but you can also write plain JavaScript as well. Right? In, in Deno.

[00:10:09] **Luca Casonato:** Yeah. 

[00:10:09] **Luca Casonato:** TypeScript's completely opt in. Um, we do recommend you use it because it's just, it's a much better experience really. Um, like the learning curve from switching from JavaScript to TypeScript is much lower than, I don't know, switching from JavaScript to rest, for example, right?

[00:10:23] **Nick Taylor:** Yeah. Yeah. For sure. 

[00:10:24] **Luca Casonato:** And the amount of benefit it provides, like even if it didn't do type checking, even just for like editor completions is just so phenomenal.

[00:10:30] **Luca Casonato:** It's just worth it. Just alone for editor completions. 

[00:10:34] **Nick Taylor:** yeah, no for sure. And, uh, yeah, no, I I've. Digging into Deno a bit lately one, because we're gonna be talking about Fresh, but also just at work where, like I said, we were, we use it for our Edge offering and, and I know right now it integrates pretty, I don't know about other editors, but it integrates pretty well with VS Code there's, uh, a Deno land extension.

[00:10:54] **Nick Taylor:** So then you can, uh, you can set up some, uh, settings so that you get like the Lin or the formatting. And, uh, and also, I guess it, it takes over from where the normal TypeScript language server runs. Because I, I remember when I didn't have those Deno settings enabled, it's like you would all of a sudden get all these type errors because it couldn't find the URL imports, I think.

[00:11:16] **Nick Taylor:** It, it seems like, uh, a lot of thoughts gone into a lot of things. I know it's, it's, it's definitely a, a, a big endeavor, I would say to create a new runtime. So it's, it's pretty cool to see it, like. Be production ready at this point. 

[00:11:29] **Luca Casonato:** And it's like the, the, the big thing is, is that it's not just, uh, it's not just a runtime, right?

[00:11:34] **Luca Casonato:** Like it's a whole battery included tool chain. And part of that is this like language server, which powers the extension and the formatter and things. So like, um, you can sort of compare this to Node as like, oh, it's a competitor to Node, but no, it's not really, it's a competitor to Node plus Prettier plus plus like the built in TSC support in, in, in VS Code plus, eslint plus esbuild plus like X other things, right?

[00:11:58] **Luca Casonato:** Like we're essentially consolidating the entire JavaScript. Uh, ecosystem into a single binary, like a bunch of tooling at least. 

[00:12:05] **Nick Taylor:** Yeah, no, I, I, personally that doesn't bother me. Like, I know people have opinions about, you know, like I, I wanna format my things this way and it's like, I'm more of the opinion, like, like even Prettier when it formats, sometimes I don't like the way it looks, but honestly I have, I have so many other things to care about than that, you know?

[00:12:25] **Nick Taylor:** Yeah. And, and so it's like, you know, It's opinionated, but it's already set up. So I'm just like, I'm cool with that. I can just actually work now and I can just know it's gonna format or lint or whatever. So, yeah. Yeah. No, it it's interesting. A lot of tools have been going in that direction. I think too.

[00:12:42] **Luca Casonato:** Yeah. I, I think it's something that Go originally proved how well it works. Like the, the, the idea where you like, opinionate everything and you provide very little customizability and you provide like one proper way of doing everything rather than like three half baked waves of doing stuff.

[00:12:57] **Luca Casonato:** And it, but configuration to tweak it to how you like it. Like, if, if there's a single good wave of doing it, even if it's not the perfect wave of doing it. It's just so much easier to use than gen than like every project you go in and you have to like configure everything yourself to, to your liking.

[00:13:11] **Luca Casonato:** It's just not worth it . 

[00:13:12] **Nick Taylor:** Yeah. And, uh, yeah, no, and I was, uh, we'll just wrap up a little bit on some of the Deno here, but, uh, like you said, it's not just to serve webpages on, on the Edge or anything. Uh it's you can build CLIs with it. I think I was, I ran Deno compile couple days ago, so you can actually just generate a single binary, which is kind of nice too.

[00:13:34] **Nick Taylor:** If you wanna have a tool, so that's cool too. And, and I, I think that's compelling too, because like, these are web technologies, you know what I mean? Like people are. Probably at this point, probably at least familiar with TypeScript, but if not, you know, JavaScript still and stuff. So, uh, I think that's cool too.

[00:13:50] **Nick Taylor:** I did have some questions, like, so I, I didn't realize this initially until I, I had read a bit more about Deno, but Deno under the hood is actually running off of the V8 isolate, it's actually running JavaScript at the end of the day and I was kind of curious, you know, so like there's the TypeScript layer.

[00:14:10] **Nick Taylor:** And for folks who've been doing TypeScript for a while, or any kind of modern front end web development, you typically have a bundle step, you know, and that's usually transpile or compile. However you wanna call it the TypeScript to the JavaScript and. I'm curious, cuz I know Deno has some really great performance.

[00:14:27] **Nick Taylor:** So I'm, I'm curious how that compares to like just raw JavaScript if they both end up running in V8 at the end of the day, like, like how do, how do they get that performance boost by even adding this extra layer of not necessarily complexity, but like a potential build step, I guess I don't 

[00:14:44] **Nick Taylor:** know the best way to say it.

[00:14:45] **Luca Casonato:** Yeah. Yeah. I get the question. So the, so do you know, under the hood at the end of the day, runs JavaScript using V8 and V8 runs that JavaScript by compiling it to byte code and then that byte code gets turned into machine code and that like runs on your CPU or CPU instructions. So it's like just essentially your, your runtime is always just a layer, like a, a bunch of layers glued together, which like transpile your source code down to lower and lower layers until at some point the CPU can understand it.

[00:15:14] **Luca Casonato:** Right. And yeah. Deno adds like one extra layer on top of V8, which is our, I don't know what we call it. We call it well, we internally we call it Deno emit. It's like, what, emitts your TypeScript to JavaScript. And what we do is just in time, just before we run the TypeScript, or just before we run the source, your source code, we'll strip out all the types and we'll cache that emit output onto disk.

[00:15:38] **Luca Casonato:** So then if you execute it next time, we won't even have to do the transpiling. This is just an optimization. And also we do not transpile TypeScript using the TypeScript compiler, but we have SWC. It's a, transpiler written in Rust, which can do the transpilation in Rust.

[00:15:55] **Luca Casonato:** And it's like orders of magnitude, like two, three orders of magnitude, faster than TSC at com at transpiling TypeScript. At the cost of not being able to do type checking. So we cannot do type checking at this stage. We, we have to do type, we do type checking separately. So there's a Deno check command that you can run and that'll do type checking.

[00:16:12] **Luca Casonato:** But when you're just executing, we'll essentially just strip out all the types and. Pipe the source code into V8. 

[00:16:18] **Nick Taylor:** Okay. Gotcha. And I, I guess that's, I, I would think that's an okay trade off to not do the type checking, because typically if you're building an app or, you know, your code base, you're, you're probably gonna have type checking in your editor when you're working and you probably have either a pre-commit or like a, you know, once a pull request who's, you know, gonna get, you know, you know, handle it there.

[00:16:42] **Nick Taylor:** And at, at that point, honestly, if type checking fails after the type checking passed there, then something is probably wrong. But so I think that makes complete sense to, to completely bypass and just strip the types at that point. 

[00:16:57] **Luca Casonato:** And, and we, what we do support is like, so that's essentially what we, we, what we expect people to do is, um, use the type checking that's built into the editor, or actually it's not built into the provided to the editor using Deno LSP , our language server, through like the Deno extension and do type checking in during development that way.

[00:17:14] **Luca Casonato:** And then if they don't use an editor which supports this, or they don't like this sort of thing, they can do Deno check dash dash watch, and then it'll just like continually type check as files change, They'll get diagnostics that way. 

[00:17:28] **Nick Taylor:** Okay, cool. So, so you're, you're, you're skipping the type checking, but I'm still curious how the, the transpilation to JS still performs better than just plain JS or, or is there just that minimal hit that first time and it's negligible enough or, 

[00:17:49] **Luca Casonato:** yeah, it, it doesn't perform better.

[00:17:51] **Luca Casonato:** Because if you do more work then like that the CPU cycles you spend. Right. Um, yeah, but it performs. It does not perform noticeably worse, it performs so quickly that it is like, especially with this caching, that it is like imperceptible, that it's TypeScript transpiling.

[00:18:08] **Nick Taylor:** All right. 

[00:18:09] **Luca Casonato:** Yeah. And for there's optimized other optimizations we do, for example, if you're running your code, for production, what you can do is beforehand you can call Deno cache on your source code, or just execute it once and it'll do all the transpiling and it'll cache, all the transpiled source code.

[00:18:25] **Luca Casonato:** And then after that, it won't have to retranspile it. But like the, the difference here is like, we're speaking around the order of like, Milliseconds like, like hundreds of, of nanoseconds kind of thing. It's like, it's really nothing, to be concerned about. Yeah. Okay. 

[00:18:39] **Nick Taylor:** Gotcha. Superman or the Flash might recognize it, but us mere mortals, probably not.

[00:18:45] **Nick Taylor:** Okay. Cool. Okay. So that, that's great. So that's kind of sets up the stage for, for Fresh now. So, so Fresh is a new web framework that you created and I I've seen since then, obviously other folks have contributed to it cuz it's open source. Um, i, I guess what you know, for, for the people that'll probably groan and say not another JS web framework, uh, personally I'm excited, but , you know, I guess what, what were the reasons for creating Fresh instead of trying to have something else work on Deno?

[00:19:18] **Luca Casonato:** Yeah. So originally it was, we were. Trying to figure out, what like good development flows that dev that Deno developers like good flows for Deno developers to do the stuff they want to do, mainly write websites. And they started out as sort of like a research project where we're trying to figure out like how simple can we make it to write projects in Deno?

[00:19:38] **Luca Casonato:** And like, how can we use all this tooling? That's built into Deno to write like a framework, which, is very little overhead. And is not very complicated itself. Like Fresh itself is actually really simple. You can read through the source code pretty easily, you have some understanding of TypeScript's of understanding web servers and yeah, it's really not that complicated because complicated things like file or, dependency graphs, stuff like this is all something you don't have to care about at all, because it's just all built into Deno.

[00:20:04] **Luca Casonato:** It's something that like, usually. Like in Node, Vite would handle something like this. And all of this is just built into Deno. So it's, it's not something you need to deal with yourself. Then at some point we realized that actually this research project was really cool and it was very nice to use.

[00:20:18] **Luca Casonato:** And we started using it for some of our internal, project or some of our internal, sites like deno.com or deno.land, which both run out Fresh now. Sort of over time that morphed into, okay, so this is actually really cool. How can we make this? How can we get this to a stage where it's like usable by anyone?

[00:20:35] **Luca Casonato:** Like easy to set up. And that's the current incarnation of Fresh. 

[00:20:39] **Nick Taylor:** Okay, cool. Cool. And in terms of production apps using Fresh right now. Like I know there was the Fresh 1.0 release pretty recently. I think, is it the dock site on Deno land or the whole Deno land site that's running on Fresh or 

[00:20:54] **Luca Casonato:** The entire thing.

[00:20:55] **Luca Casonato:** Yeah. So deno.land is entirely run on, on Fresh. What else deno.com is run on Fresh lint.deno.com runs on Fresh, examples.deno.com or deno.land runs on Fresh. There's a bunch of them. My personal website runs on Fresh there's some other ones outside of Deno that also run on Fresh, like it, Fresh serves millions of requests every day, successfully.

[00:21:16] **Nick Taylor:** Okay. That's cool. Cool, cool. We'll we'll definitely, we'll, we'll definitely take a peek at some code soon. But I guess, before we do that, like, what are some of the. I guess, like what's kind of high level, what's the architecture of Fresh or, or like what, what were some decisions you took and, and maybe why, if you wanna speak to that.

[00:21:36] **Luca Casonato:** Yeah. So, after it, after we realized that this research project is actually gonna be successful, is pretty useful. We tried to figure out like, what is like originally we had approached this from the angle. Let's just take one of the existing frameworks and just try to clone as much of the functionality that it has.

[00:21:52] **Luca Casonato:** And not tried to not think too much about architect and stuff like that. And when we started doing that, we realized that actually a bunch of this architecture that's currently out there in, in frameworks, like React and, and, or, sorry, not React and Next.js and Remix and frameworks like that.

[00:22:06] **Nick Taylor:** Okay.

[00:22:07] **Luca Casonato:** Is really not that great. Um, it like. Is very bloated in some, in, in, in some sense that like, when you have a blog, for example, that you want to, like, you have a blog, you need to, to serve your blog, you need to render like your markdown files into HTML. You need to ship that HTML to the client. And most of these frameworks support some form for server side rendering, which is great.

[00:22:32] **Luca Casonato:** Like it makes for yeah, for nice fast loading speed, but, they also then after the client has loaded this, send the entire rendering infrastructure for this page to the client as well. Like they'll, they'll send the mark they'll, they'll not just send the HTML. They'll also send the markdown and all the JavaScript that's required to render that HTML okay.

[00:22:52] **Luca Casonato:** To the client. So it can re-render it there, which is like, yeah. Is that really necessary? Right? Like what benefit does this provide? It opts you into a bunch of sending a bunch of JavaScript to the client that you probably don't really want to be sending. So Deno tries reverse or, or Fresh sorry tries, reverse this by sending no JavaScript to the client by default.

[00:23:10] **Luca Casonato:** And you have to explicitly opt in, if you want certain components to be rendered on the client, which allows us to send a bunch of. A bunch of less JavaScript, which is great for performance and your user is battery life and stuff like that. 

[00:23:24] **Nick Taylor:** Yeah. And then, and what you're referring to there is I'm familiar with this, cuz I've used this where it used to work.

[00:23:29] **Nick Taylor:** That's uh, Jason Miller's, doc, article about Islands architecture. I think this makes sense and it's kind of funny cuz I mean, I've been doing web dev for a while now and it's like web dev started off with server side, rendering everything and then it's like 2005, AJAX came on the scene, which makes no sense now cuz we don't ship XML, but JSON over the pipe. But, but it was, it was funny how like we're like, okay, the page is slow and I, I think a lot of it tied into maybe even broadband speeds. Weren't that great at the time. There's a, I think a few things, but, but it's kinda. You know, progressively, ironically, cuz that's a term, a web term, but like things seem to get heavier and heavier and we ended up with like a fat client and then you, we ended up with the SPA and then you're slowly seeing things kind of coming full circle to server side rendering is great again or, or, or in a lot of context that can be great.

[00:24:24] **Nick Taylor:** You know, there, there's definitely reasons for different kinds of architectures. Like, like a SPA can make sense in certain scenarios still mm-hmm but so it is kind of interesting how, uh, you know, it's like server side rendering isn't new, but it it's kind of almost, I feel like it's almost being kind of, you know, 

[00:24:42] **Luca Casonato:** feels like a Renaissance 

[00:24:43] **Nick Taylor:** case that it's it's new, it's new.

[00:24:45] **Nick Taylor:** There's this thing as a server 

[00:24:48] **Luca Casonato:** yeah, I think there's some, some like, arch, like some innovations, in the industry that have really made this. Work, one of them being Edge, infrastructure, like being able to server-side render close to your users is something 10 years ago. Like you could do it if you were Google, but like, 

[00:25:05] **Luca Casonato:** if you're not Google, then it's like a, quite the pain to do, you know? Like you have your one thing hosted out of, out of, well, I don't know, 20 years ago, probably your data center. Somewhere on the us, east coast. And then like if you're in Asia then, well, good luck to you, right? 

[00:25:20] **Nick Taylor:** Yeah. Yeah, exactly. 

[00:25:21] **Luca Casonato:** And I, I think that the thing is really, we went from this like one extreme where there's no sta no client side, anything at all, like purely server side rendered to the other extreme where there's like, we send an empty HTML page to the client and render everything on the client. That's like the SPA thing.

[00:25:37] **Luca Casonato:** And we're now sort. Like you can sort of think of it as like a, what you call them, a, pendulum like it.

[00:25:43] **Nick Taylor:** Yeah.

[00:25:43] **Luca Casonato:** It goes from one side to the other and we're sort of swinging back now and it's gonna like stabilize somewhere across the middle at some point where we'll have like the, the perfect, balance of server side rendering and client side rendering.

[00:25:55] **Nick Taylor:** Yeah. No, totally.

[00:25:55] **Luca Casonato:** And I think this balance really like also depends on what you're building, like some projects it's yeah, for sure. Much different balance. 

[00:26:03] **Nick Taylor:** Yeah. Cuz like I, I worked in FinTech at one point and I mean, there's no way you're gonna server side render every split second, like that's something that's coming with websockets through the pipe and there was like observables and it it's clearly client heavy because of the nature of what it does.

[00:26:19] **Nick Taylor:** But, but that's really more like an application, you know? And like, but yeah, if you're doing. If you're doing stuff like, cuz like the funny thing is at the end of the day, webpages are really just forms. You're you're submitting stuff like regardless of what you say, this is my new app, you're at some point there's a form something's gonna be submitted, you know, and data's gonna be transmitted.

[00:26:39] **Nick Taylor:** So it's like, yeah, no there's it definitely depends what you're doing for sure. But a lot of cases, 

[00:26:44] **Luca Casonato:** your Figma and like you, you build like a, like a Photoshop in the browser or illustrator in the browser, you don't have like, that's completely fine to client said render. Right? Like that makes complete sense.

[00:26:55] **Luca Casonato:** But if your blog does not need to be client said rendered like 

[00:26:58] **Nick Taylor:** yeah, exactly. And then like, and then yeah, there's that middle ground too. Or like instead of having the empty index.html that you hydrate with your full component tree, you know, it probably, it probably makes sense whether they're already pre-statically generated or you server render the first time and then it's cached, but then, then you do those pockets of interactivity, the, the Islands architecture, which, I referenced there. And, 

[00:27:21] **Luca Casonato:** yeah. 

[00:27:21] **Nick Taylor:** I, I think it makes sense because most pages, your, your whole page, isn't truly interactive, you know, like you're, you're gonna click on a button that might, you know, perform some validation, you know, like the rest of the page, it, the markup probably isn't gonna alter really that much.

[00:27:37] **Nick Taylor:** So, uh. 

[00:27:38] **Luca Casonato:** Yeah. 

[00:27:39] **Nick Taylor:** Yeah. Cool. Cool. Cool. All right. So I, I think we set the stage pretty well for taking a peek at Fresh. So I'm just gonna switch this to coding view here, so, oh, you can still see my screen over there. So just one sec. And my, of course, cuz we're doing it live my shortcuts, not working, but that's all good.

[00:27:59] **Nick Taylor:** Yeah, so. We're gonna just take a peek in VS Code. And I guess like the first question I'd have is like, you know, how do we get started with Fresh, uh, aside from the, I'll say the obvious, make sure you have Deno installed. I'll drop a link to Deno again. So you definitely need the latest, I can't remember when I, when I tried it out the other day, cuz I had Deno installed previously and it said I need, I forget what version it said Fresh needed?

[00:28:24] **Luca Casonato:** 1.23.0, I think you need.

[00:28:27] **Nick Taylor:** Okay. So, so 

[00:28:27] **Luca Casonato:** that's two weeks ago.

[00:28:29] **Nick Taylor:** So I guess if we were gonna get started, what's the first thing we do. So I've got Deno installed now I'm at my terminal. What's the next steps 

[00:28:36] **Luca Casonato:** I think next step is actually counterintuitively to leave the terminal and go to your extensions pain on your editor a nd install the Deno extension. Cause I think this is actually a thing that a lot of people, miss, and then they get confused why they're, why everything's broken. 

[00:28:50] **Nick Taylor:** I'll drop a link to it again. I think I dropped it before, but, um, yeah, so, okay.

[00:28:54] **Nick Taylor:** So we, and, and so for folks who might not have used the extension, what does the extension provide you?

[00:28:59] **Luca Casonato:** The extension provides you an integration of Deno, like the CLI tool into your editor. It provides things like type checking, right? While you're writing code, formatting, linting, testing, all this kind of stuff built right into the editor.

[00:29:13] **Luca Casonato:** And, like you can interact with Deno through the editor view of your code rather than having to manually invoke things in the CLI. 

[00:29:21] **Nick Taylor:** Okay, cool. Yeah. I just got the, the command palette open here and just looking at all there, so, okay. 

[00:29:27] **Luca Casonato:** So for most projects, what you'd do next is you would open the command pallet and type in this Deno initialized workspace configuration, and it'll then set up a folder in your current directory to, do this. But for Fresh, because many people forget about this, it'll actually do that automatically when you're trying to initialize, a Fresh project. So the next thing you do now is you go to the Fresh home page and copy the, init command. So the homepage that's fresh.deno.dev. 

[00:29:53] **Nick Taylor:** Okay. Let me just try that over here. Okay. There we go. Okay. fresh.deno.dev. Okay. I, I love this, this page, the dinosaur uh, I want,

[00:30:09] **Luca Casonato:** we have this really awesome, um, like animator and graphic design in person hashrock on our team.

[00:30:16] **Luca Casonato:** He's he does this it's magic. 

[00:30:20] **Nick Taylor:** cool. Cool. So I guess I'm gonna grab this here, cuz I, the assumption is I have Deno installed at this point. Yep. Okay. All right. So let's come here. Let's run that. I'll just is make this a bit bigger. So folks can see what's going on. So. I see it pulling down a lot of TypeScript files.

[00:30:38] **Nick Taylor:** And then now it's , I must have had another project there. Hold on. Okay. Let's try that again. 

[00:30:44] **Luca Casonato:** So hope there's nothing important in there. 

[00:30:46] **Nick Taylor:** Yeah, yeah, yeah. It's uh, thank, thank you. Well, I'll, I'll tell you in a couple hours. Okay. So, so it's, it's pulling down all this TypeScript. 

[00:30:56] **Nick Taylor:** Now it's asking me, do I want to install Twind, which I'm new to this, but it's Tailwind, but it's like it compiles on the fly. Is that right? 

[00:31:04] **Luca Casonato:** Yeah, pretty much it's Tailwind without the, without the like extra compiled step. It's like server side rendering for Tailwind essentially. 

[00:31:11] **Nick Taylor:** Okay. Gotcha. So should I, I should just say yes for now, I guess, or 

[00:31:14] **Luca Casonato:** yeah, let's just, let's do it. Can be nice to make it look good. 

[00:31:17] **Luca Casonato:** And there you get the question &quot;Do you use VS Code?&quot; 

[00:31:20] **Nick Taylor:** Yes. Okay. Okay, cool. So that's created that. I'm just gonna open it up now. What's called my project. All right. So, okay, so we've got it all open here now. So it's scaffolded us a project here. So I guess the first thing I see is the, the VS Code folder for the settings.

[00:31:40] **Nick Taylor:** I guess, the, the super important part to make sure the Deno integration works well with the extension. 

[00:31:45] **Luca Casonato:** We're actually gonna, at some point in the future here, let you not have that. And if, if there's a de adjacent file in the root of your repository, you'll just enable the extension automatically, but haven't gotten to it yet.

[00:31:55] **Luca Casonato:** Have to specify this for now. Yeah. 

[00:31:57] **Nick Taylor:** Okay. And then extensions, just the Deno land, which I already have stuff. Okay. Um, what, what files should we take a peek at now? Or do you want to talk about the folder structure or. 

[00:32:07] **Luca Casonato:** Maybe we can start, let's start with just actually running the project, like starting, starting the local server, and then we can run through what it's doing.

[00:32:16] **Nick Taylor:** So I need to run Deno task start 

[00:32:19] **Luca Casonato:** and deno task is like a built in task runner for Deno, which is sort of similar to npm's, scripts, syntax. You define it in your deno.json file. It's completely opt-in like, if you don't have a deno.json file, that's fine.

[00:32:32] **Luca Casonato:** You don't need it. For Fresh projects you do, but for . If you're doing other things 

[00:32:36] **Nick Taylor:** And, and yeah. So we'll start this and I, and I see there's the import map, which you were talking about before too. And this is even though I'm still kind of new to it. I know the import map is cuz there's no Node modules.

[00:32:48] **Nick Taylor:** So these are actually URLs to the actual packages or not packages, but code that you would 

[00:32:54] **Luca Casonato:** exactly. It's like the import map essentially allows you to, uh, specify shorthand. It's like a URL redirect, like local URL, redirect service, essentially, that allows you to, expand short URLs into longer URLs.

[00:33:11] **Nick Taylor:** And this kind of reminds me of like, cuz I I've, I've had to configure Webpack quite a bit in a lot of projects over time and I know other bundlers do this too, but this kind of reminds me of aliases that you can use in like Webpack or whatever , and I imagine this is actually nice too, because if ever you like say Fresh gets upgraded to 1.0 0.2, I just need to come in here and I never even have to touch my code .

[00:33:31] **Luca Casonato:** The most important thing to understand is that ultimately these are just redirects. So like in the code anywhere where you would see like dollar sign Fresh slash , you can just replace that with like the https Deno land X Fresh at 1.1.

[00:33:43] **Luca Casonato:** It'll work the exact same way. These are just like redirects to make it easier to type.

[00:33:48] **Nick Taylor:** Gotcha. Okay. So let's go take a peek in the browser here. All right. So localhost, you said so, okay. So let me zoom this in a bit, just for folks. Okay. So, uh, don't worry about the styling for now, but so we've, we've got the famous lemon logo, which I love.

[00:34:08] **Nick Taylor:** It looks like we have a counter here kind of like a, a typical thing that you'll see in a lot of demos when they're starting off with like a, a new framework. So I imagine, 

[00:34:17] **Luca Casonato:** yeah,

[00:34:17] **Nick Taylor:** I can just go plus plus minus minus. Okay, cool. Yeah. All right. So that loaded up and it, this is coming from the route slash index dot tsx, like says 

[00:34:28] **Luca Casonato:** Exactly. The way Fresh works is that it server side renders all of your HTML or so you, so what Fresh really is, is the templating and routing framework. This is what it is internally. Like you, it has a way for you to very expressively specify what routes map to, what things you want to render on the client.

[00:34:48] **Luca Casonato:** Essentially there's an involved way of saying you create a file with a given name and whatever's in that file will be executed for that request. 

[00:34:55] **Nick Taylor:** Gotcha. 

[00:34:55] **Luca Casonato:** The client will be served that, in this case have this routes folder. And the routes folder is like the folder structure that configures the router.

[00:35:04] **Luca Casonato:** And the file names map to the, the path that you have to, put into your browser to, to execute that file. So indes.tsx is like your index page, right? Index is like a special name. If you don't specify anything, it'll use the index one, like the index thing and, and like there's an API folder in there.

[00:35:22] **Luca Casonato:** So request that start with slash API will, go into the API folder. And if it happens to be slash API slash joke, it'll use the joke.ts file. And this name one, that's the dynamic route. So anything that doesn't match like anything, if you do path slash or if you do sorry. Uh, localhost 80, 80 slash Fu um, that'll be matched by this like dynamic matcher.

[00:35:44] **Nick Taylor:** So it says, hello, Foo. Yeah. Yeah. And this is, uh, I I've definitely, this is in Next.js. I think Remix does this too now. 

[00:35:51] **Luca Casonato:** It's all pretty similar to like how, how Remix next do it. 

[00:35:54] **Nick Taylor:** And like you said, uh, just for fun here, we'll just go to slash API slash joke, I guess Google knows what I'm doing.

[00:36:02] **Nick Taylor:** So if I refresh, it's just loading a random element from the array. I think that's a pretty straightforward routing story. Okay. So that makes sense. I'm curious about this islands folder and that's, that's the counter component that we were talking about.

[00:36:19] **Nick Taylor:** You were saying in terms of Fresh, so it's out of the box or, or maybe you said this, or maybe I read it, but, out of the box, it ships no JS. So I'm guessing just based on the name of that islands folder, that, that means whatever's in here will get served up in an interactive way somehow.

[00:36:39] **Luca Casonato:** Yes, exactly. So by default, everything, a service I'd rendered and only components that are in the islands folder get hydrated on the client. If you like open the page source view for this, you'll see that everything is server side rendered . 

[00:36:55] **Nick Taylor:** View page source for folks who might not use that anymore, it still exists. We've got the like somewhat compressed markup. 

[00:37:05] **Luca Casonato:** Not very readable because, uh, there's no line breaks, but this is the static HTML render of the page. And there's this little bit of JavaScript at the bottom that configures the page to, hydrate the counter.

[00:37:19] **Luca Casonato:** So this like client element that you put in the islands folder, that's hydrated on the client using, using this little bit of script. 

[00:37:25] **Nick Taylor:** It's nice to see here. So you're not even bothering with old ways. You're just sticking to new browser imports here right away. 

[00:37:32] **Luca Casonato:** IE11 is dead now. Right. Everything coming through modules. 

[00:37:35] **Nick Taylor:** And the revive, like you said, so that's the hydration, and so I'm kind of curious what the hydration story is. You're passing the name of the component here, the counter.

[00:37:44] **Nick Taylor:** And then you're saying revive a counter. So does it just look for all instances of counter? Cause I don't see like a CSS selector for like an ID or a data attribute or something. Yeah. 

[00:37:54] **Luca Casonato:** So actually maybe what's easiest if you copy the source code and just paste it into an HDL phone, the editor, um, you can like format it and then we can inspect the output a little 

[00:38:03] **Nick Taylor:** I'm just gonna paste this in here and I'll just save it. HTML, just save the to desktop so it doesn't mess up our structure here. Okay. And I think that formatted.

[00:38:14] **Luca Casonato:** Ah, there we go. Fantastic. 

[00:38:15] **Nick Taylor:** So this is the important part here and I'll just wrap it. 

[00:38:18] **Luca Casonato:** So there, there's a little bit of JS at the bottom and the important thing here are these

[00:38:23] **Luca Casonato:** HTML comments in the source code that you see online 119 or 319 and 324. They essentially tell Fresh that there's a component in between these comments that it needs to hydrate. So what the revise function does, it walks through the dorm tree, looks through these comments, um, and then maps the name and the comment to the component, that you passed, like through this options bag and revive.

[00:38:45] **Luca Casonato:** And this is all handled internally in the framework. Like this is not something you need to deal with yourself. 

[00:38:49] **Nick Taylor:** So this is all auto generated, so, okay. 

[00:38:51] **Luca Casonato:** Yeah, exactly. 

[00:38:52] **Nick Taylor:** Okay. 

[00:38:53] **Luca Casonato:** What you can actually also see is that there's that like zero at the end of the counter component? This means it's the first, like we start counting at zero, right?

[00:39:01] **Luca Casonato:** So it's the first island. And we have this, other script tag on line 326, which are the props that you had originally passed to that island. 

[00:39:11] **Nick Taylor:** Oh, nice.

[00:39:12] **Luca Casonato:** So the first one of those is if you go back to the source code, you'll see that we pass a start equals three in the index route.

[00:39:20] **Nick Taylor:** Yeah. Okay. down here. Yeah. 

[00:39:21] **Luca Casonato:** So you pass, start equals three and we take those props and store them in this script tag so we can revive them on the clients as well. So you have this like continuity between server and client. 

[00:39:33] **Nick Taylor:** Okay. And yeah, no, this is, this, this kind of reminds me for anybody that's done Redux you'll you'll have like this little Redux kind of snippet of, of state that gets passed in kind of reminds me of that.

[00:39:45] **Nick Taylor:** It's not the exact same thing, but okay. So, so that's good. So that gives that's our initial prop for that. And then we've got the code that runs and then counter counter. And so, like you said, like if I put two counters in here, the next, commented one would be counter one. So I would get two islands of Fresh island props then?

[00:40:06] **Luca Casonato:** So the, the Fresh island props would, it's an array, right. There would be two elements in that array.

[00:40:10] **Nick Taylor:** Oh yeah, yeah. So that's, that's pretty straightforward and, this is also kind of nice because like, I know like hydration is definitely a popular topic right now.

[00:40:20] **Nick Taylor:** I know there's some issues in some cases, like I I've seen this and it it's not to knock a framework or anything, but like I know there's an issue right now with like, React server components. When you do the hydration. Say you have, I don't know, like browser extensions that modify the markup.

[00:40:36] **Nick Taylor:** You'll get the proper server side rendered markup coming in. But then before React, does the hydration, extensions will modify it and then you'll get this like, oops, no, I'm not right. So this kind of pattern completely removes any kind of issue like that? 

[00:40:52] **Luca Casonato:** Yeah, exactly. This is the first code on the page that runs essentially.

[00:40:56] **Luca Casonato:** The only way this would break is if you would have some sort of extension, which like strips out HTML comments from the HTML as it's being sent on the client, which is it just, it don't like, quote me on this, but I'm like 98% sure that extension does not exist. 

[00:41:11] **Nick Taylor:** Gotcha. 

[00:41:11] **Luca Casonato:** So there's very little reason for this to break. 

[00:41:13] **Nick Taylor:** Yeah. Okay. This completely makes sense. I mean, obviously this is a fairly unique ID. I mean, it's, it's very unlikely. Somebody's gonna create a, a script. Well, well, I, the only time I see IDs on scripts are when people are manipulating them, otherwise you're just typically just loading them.

[00:41:31] **Nick Taylor:** No, that's cool. And so I guess the revive itself, it's probably not doing too much, right? Like it's, it's saying revive the counter, it checks the island props. 

[00:41:41] **Nick Taylor:** It's actually really simple. If you wanna just look at the source code for it. It's pretty easy to understand. I think, if you go to the Fresh repo. github.com/denoland/fresh.

[00:41:52] **Nick Taylor:** I'll just go here and then go to GitHub visit. 

[00:41:54] **Luca Casonato:** Yeah, that works too. 

[00:41:56] **Nick Taylor:** I'm been lazy. 

[00:41:57] **Luca Casonato:** And then you wanna go to src/runtime/main.ts, I think 

[00:42:01] **Luca Casonato:** is what it's called. 

[00:42:03] **Nick Taylor:** Oh, we Fresh, main. 

[00:42:05] **Luca Casonato:** Maybe it's not called not, yes. I think it's called. Let me check real quick.

[00:42:09] **Nick Taylor:** okay. Cool. Cool, cool. Uh, yeah.

[00:42:14] **Luca Casonato:** Fresh. Okay. Source runtime. main.ts. 

[00:42:20] **Nick Taylor:** Oh yeah. I see it got popped up. I don't know why it didn't. Oh, there it is. Okay, cool. Let me just zoom that in a bit. Yeah.

[00:42:27] **Luca Casonato:** So this, this has a revive function in here somewhere. 

[00:42:29] **Nick Taylor:** Here it is okay. 

[00:42:30] **Luca Casonato:** it has this walk function. What exactly this does, it's not important that we understand exactly what the code does, but essentially what it does is it walks through all the DOM nodes, like it, the DOM's of recursive data or a data structure that starts at the top, like is recursive.

[00:42:43] **Luca Casonato:** We walk through the entire DOM node or all the DOM nodes. And we like, look for comments that match like a RegEx where it starts with Fresh.

[00:42:51] **Nick Taylor:** That's the nodeType 8. 

[00:42:52] **Luca Casonato:** That's a comment. 

[00:42:54] **Luca Casonato:** It's a comment. So we look for comments that look like that. We then go look for the end node. We collect all the nodes that are in between the start and the end comment.

[00:43:03] **Luca Casonato:** And then we just call Preact's render method to render.

[00:43:07] **Nick Taylor:** And that's a, that's something we didn't talk about yet. It's using Preact instead of React. I'm a big fan of Preact. I used it where I used to work. I'm gonna guess a couple reasons why you're probably using. It one it's definitely, it's smaller than React for one thing.

[00:43:19] **Nick Taylor:** As far as I know, cause like I, I I've seen cause , I follow Jason Miller on Twitter and I think he, I think he tweeted out at one point, like you can fit all a Preact in like one screenshot and I don't think there's any dependencies. Is that right? 

[00:43:33] **Luca Casonato:** That's right. 

[00:43:33] **Nick Taylor:** And so I guess that makes it because just getting back to Deno.

[00:43:38] **Nick Taylor:** So like right now there's some, like there's definitely stuff being served as ES modules like via, Skypack or esm.sh or other CDNs that are able to convert them to, URL based imports. But there's still a lot of Node stuff that. At least right now you can't cuz people haven't ported things. So there's stuff that you might not be able to use in a Deno environment yet.

[00:44:01] **Nick Taylor:** Is that correct? 

[00:44:02] **Luca Casonato:** Yeah. So with Deno, you need to use ES modules, you cannot use require, and a bunch of Node source code is still and using require. So anything that use require needs some sort of transpilation step to run, you know, and like this esm.sh for example, does a really great job of being able to do this transpilation, but the transpilation comes at the cost of A, complexity.

[00:44:21] **Luca Casonato:** Right. And B it might change the source code in such a way that it becomes larger or that it doesn't work exactly. Like it doesn't execute in exactly the same order that the require code would. So there. Like, ideally you want to use ESM first modules and Preact is ESM first, which is great.

[00:44:40] **Nick Taylor:** I was a big fan of it to, well, I, I used to work at dev.to, uh, which, uh, programming community and like, we're very, when I was working there, it's like performance was a big thing. So like the, the site is, it's a Rails app, but it's like heavily cached server side. And then this is, you know, it that's where the islands of interactivity come in.

[00:45:00] **Nick Taylor:** You know, it, we weren't using a framework. It was really more bespoke . So it's really just like, you know, Just kind of classical, you know, like go find an element via selector or like a, maybe a data attribute and then just bootstrap Preact render there and then just let it take over from there. 

[00:45:16] **Luca Casonato:** Preact has been able to, to have like multiple roots on the same page for like forever, like React only recently introduced as, I don't know if it's like React 17 or React 18 where you can have multiple roots on the, on the same page so that's really nice. And, and the other thing that Preact does it provides a lot more customizability into like how it functions. It gives you a bunch of hooks where you can like hook into the rendering pipeline.

[00:45:41] **Luca Casonato:** To do things like one thing we need to do for example, is during the server side, render, we need to figure out what components you're actually like, what island components you're actually using. So we can extract like the props out of them to be able to serve them and to like even just serve the right code to every page.

[00:45:56] **Luca Casonato:** To figure out what to hydrate. 

[00:45:57] **Nick Taylor:** Cool. Cool. 

[00:45:58] **Luca Casonato:** We, we can use that using these like hooks that, that Preact provides. 

[00:46:02] **Nick Taylor:** Yeah. No, and it's, it's nice too, cuz like, uh, obviously the React ecosystem has a lot of components out there and like Preact has the Preact compat. So we were able to leverage to that too.

[00:46:12] **Nick Taylor:** And it's, it's pretty small, small layer for that. I'm curious to I, I can't remember cuz I never really used Preact for server side rendering cuz it was primarily a Rails app and I, I was, I was doing what I call fake server hydration. So I would basically whatever the Rails app generated, I would make sure that it was, you know, cuz cuz you can end up a problem with the VDOM diff and like I remember for, for folks who've ever done this, like what happens is like if the markup is slightly different, that that comes from the server side or the component you end up with two components, like where it goes to mount cuz it goes, ah, I try, I, I was.

[00:46:48] **Nick Taylor:** I try to do as good a job at VDOM diffing. And it looks like it's not really, so you're gonna get both . It was, it was quick to fix, but it, it was the first time you see it. You're like what's going on there. 

[00:46:57] **Luca Casonato:** But it's really nice. You're using like the same component system on both client and serve.

[00:47:01] **Luca Casonato:** You don't need to deal with stuff like this cuz it's just like automatically in sync, right? 

[00:47:05] **Nick Taylor:** Yeah, exactly. And, and the thing I was gonna ask, cuz cuz I haven't used it for server side rendering is, does Preact just offer the toString right now or do they have a, a streaming API for that? I can't remember.

[00:47:18] **Luca Casonato:** So I'm actually not sure either we use the like Fresh uses the toString because the streaming one, like if you're not using Suspense, the overhead is, is there's much more overhead with the streaming one. Like if you're doing synchronous, rendering, rendering takes like milliseconds, right?

[00:47:34] **Luca Casonato:** There's no point in streaming out like a hundred kilobytes of HTML versus buffering it into a string and then sending it all at once. 

[00:47:42] **Nick Taylor:** Yeah. And most of the stuff's gonna get cached anyways. It's like non interactive parts, so. I don't know if you want to touch on Twind at all?

[00:47:49] **Nick Taylor:** Like I, the reason why I'm talking about it is cuz like mm-hmm I, I know you hit the 1.0, but the. Like the styling story isn't completely defined yet. Like I know I've been checking out the repo a bit and I mean, I don't think this is a bad thing. It's just like, it's still early days. Right. You know, you're still exploring a bit, I think, but like, yeah.

[00:48:09] **Nick Taylor:** Twind makes sense because a lot of folks are using Tailwind, but, can you like right now, can I somehow include just a plain CSS tag? You know, like adding a, a link href okay. So 

[00:48:21] **Luca Casonato:** So Fresh has a static folder that you can just put anything you want into .

[00:48:25] **Luca Casonato:** And it'll serve that. And then you can have like a head tag anywhere in your tree with like a link in it , and you can import that CSS. So that works, but it's like. It's not quite as nice as I want it to be yet. If you open the main.ts file right now, for example in the project, there's a lot of boilerplate in there to set up Twind, like that's 20 lines of boilerplate set up. I don't want to have 20 lines of boilerplate in there. There's a bunch of like this tail, this, like, it asks you if you want to use Tailwind, during the thing, because there were so many people who like asked me to before the, the launch how to do styling and this is like the quick hacky way of doing it.

[00:49:01] **Luca Casonato:** Right. Because we couldn't quite get styling in for 1.0, so we're gonna have a nice way of doing this in, in 1.1 or 1.2. 

[00:49:08] **Nick Taylor:** Okay, cool. And I'm sure the community's gonna find some interesting solutions too, or, or like, you know, riff on existing stuff. I mean, Tailwind is, is super popular, but I'm thinking about other stuff too, cuz like, like one of the things that the framework touts is there's no bundle step, which I think is great.

[00:49:27] **Nick Taylor:** For somebody who's been working on other web dev projects, they're probably used to the bundling step with whether it's Vite, Webpack or, or whatever they're using. Even if it's hidden from them. For other tooling, like, so like like Twind, for example, it's it's the runtime version of Tailwind because Tailwind itself needs to use postCSS, do a bundle step, check, you know, like, do I need to purge things?

[00:49:49] **Nick Taylor:** And so on. So, so I totally get why you're going with the Twind, but I wonder if, if like you maybe see, like the framework's still just being bundle free, but like there's nothing stopping me from committing a bundle step, which generates the CSS that I'll serve or something maybe. 

[00:50:07] **Luca Casonato:** Yeah. Yeah. 

[00:50:09] **Luca Casonato:** That's totally something which, which, I I'd be open to. I think there's a bunch of ways to do CSS, right? Like you could use. There's people who've asked about using SASS, and the SASS compiler, which is a, like, that's a build step, but like you could, for example, consider checking in your output file from the SASS compiler.

[00:50:27] **Luca Casonato:** It's like, it's just CSS, and then you don't need build step anymore unless you're actually changing the file, which, most people will probably not be changing the file, but they'll be changing logic. Right. So yeah, there's a bunch of different starting frameworks that I want to investigate, but it's just, I haven't had time to like dig through all of them yet.

[00:50:45] **Nick Taylor:** For sure. And I, I definitely no pressure it's uh, I think it's just great to get something out there. It it's it's, you know, it's, it's definitely great seeing it. Ryan's asking in the chat, we talked about this at the beginning, but can you just kind of touch on, like you talked about it at the beginning, but like how does the client JavaScript get served if they're serving, if we're writing code in TypeScript?

[00:51:06] **Nick Taylor:** Ryan's just wondering. 

[00:51:07] **Luca Casonato:** We touched upon this right in the beginning, is that we can use like really fast transpilers to strip out the types from the TypeScript. So essentially browsers don't understand TypeScript, but they understand JavaScript and TypeScript.

[00:51:19] **Nick Taylor:** Yeah.

[00:51:20] **Luca Casonato:** And Deno only supports the superset of TypeScript, which is purely type strippable. So it does has no type directed emits. Don't worry about this. If you don't understand what it means, for people who are watching or it it's like essentially it means TypeScript is a superset of JavaScript where if you just go through the source code and like select all the types and strip them out, the source code will work exactly the same way.

[00:51:43] **Luca Casonato:** So that's essentially what we do on the fly when the user requests the thing. And then we do the same thing that Deno does, which is cache the output. And this is actually very similar to what you would do, for example, with, let's say like images, right? Where you have your, your source images might be like WebP images, but for older browsers on the fly you'll transpile them to JPEGs or to PNGs, or to, okay. I don't know, whatever other format the browser does support. Yeah. And this also gives there's an open PR on the Fresh reer, which allows us to use the same infrastructure where we can transpile stuff on the fly, into, like to dynamically serve different bun or not different bundles, different code to different browsers.

[00:52:26] **Luca Casonato:** So browsers, which support more modern features can have those modern features and the ones that don't support them, they'll be a transpiled version of them. 

[00:52:34] **Nick Taylor:** Okay. Yeah. Um, there's a, I'll just answer one other thing. So they're talking about JSX and so if you, if you've never used TypeScript, TypeScript can transform JSX on the fly too, you can choose, like, whether it's the React or Preact version, like using h for VDOM or whatever.

[00:52:51] **Nick Taylor:** So just like the TypeScript being transpiled to JS, the same thing would happen with the JSX. Right? Okay. And there was a question from hdodov. How does Deno handle peer dependencies? 

[00:53:06] **Luca Casonato:** That's a very complicated question. So it handles the, the, the easy way of getting myself out of answering this question is by saying handled peer dependencies the same way there at the browser does, which is if there's two URLs, which are the same URL, it'll not execute that URL multiple times.

[00:53:23] **Luca Casonato:** The complicated answer to this is that, this really depends on your project, how you'd set up your peer dependencies. One thing you can do is use import maps to remap a bunch of different specifiers to all point to the same module. So if you import Preact and a bunch of different places from a bunch of different URLs, you can all map them to map down back to the same Preact version, for example, which means there'll only be a single version of Preact.

[00:53:47] **Luca Casonato:** But there's no like automatic de-duplication of dependencies or anything like that, because Deno is not aware of the concept of packages or versions of modules. Modules for Deno are a URL, and whatever's behind that URL is what Deno sees, and that's how it duplicates.

[00:54:02] **Luca Casonato:** Like there's no de-duplication based on package, name, or version or anything like that. Yeah. 

[00:54:07] **Nick Taylor:** If we go back to the import map, you could always just say, like, everything's just gonna use this particular version and map it in the import map. I guess you might not be able to do that if, well, I guess it depends if it's all the code you own, you can do that. But if it's like, you're importing somebody else's, you might not be able to do that. 

[00:54:23] **Luca Casonato:** Yeah, I dunno how deep we wanna go into this, but I there's, there's another project that we're working on right now. I don't know if we're working on it right now, but we're which we are planning to work on soon, at least, which we'll do this de-duplication automatically. It'll like go through your module graph and figure out like parse out the URLs and see if they're like the same package at different versions.

[00:54:44] **Luca Casonato:** And it'll generate an import map, which does this de-duplication. 

[00:54:48] **Nick Taylor:** Is there a project folks can look at, or is this just kind of like internal? 

[00:54:51] **Luca Casonato:** There's like a very work in progress thing. Let me post it and chat here. I hope it's open source. If not, you're gonna see a dead link here in a second.

[00:54:59] **Nick Taylor:** You might see the Obi-Wan Kenobi. 

[00:55:02] **Luca Casonato:** I'm not signed into Twitch. Uh, it's github.com/kitsonk/pin. Let me actually sign it to Twitch. One second. 

[00:55:10] **Nick Taylor:** Yeah. Yeah. Cool. No worries. Cool. Cool. 

[00:55:14] **Luca Casonato:** Feel free to continue asking the question while I'm signing in. 

[00:55:16] **Nick Taylor:** Yeah, I'm just seeing if there's, uh, some other questions that I missed in the chat here.

[00:55:20] **Nick Taylor:** Some folks are talking about there's there's some folks that might, I think I'm pretty sure it's my coworker, ryansolid. He's the creator of solidJS. So mm-hmm and people are asking about potentially integrating solidJS. I imagine it would be doable, but I, I don't know the effort. The hydration stories, it already has its own hydration story.

[00:55:38] **Nick Taylor:** So I don't know how that play with, uh, so I, 

[00:55:41] **Luca Casonato:** We should answer for that chat. Ryan, if you're listening, we should. Yeah. Yeah. I can definitely, I've gotten this question a lot and I think, yes, it's definitely possible. There's some hooks, that's all that needs to provide to be able to do this properly.

[00:55:54] **Luca Casonato:** But I think we can totally work that out. There's it's yeah, there's some questions. I'm sure we can figure out if people want it. 

[00:56:00] **Nick Taylor:** Cool. Cool. He says, cool. All right. That's dope. All right. Bringing people together here. That's what we do. Um, awesome. OSS for the win.

[00:56:09] **Nick Taylor:** So I guess, we, we kind of touched a lot of the stuff here and I'm really glad we dug into some of the Deno stuff. Okay. Yeah, there it is. kitsink/pin I'll. Uh, I'll open that for a sec, just to, 

[00:56:21] **Luca Casonato:** It's like very bare bones . I don't even know now, but... 

[00:56:24] **Nick Taylor:** I'll get, I'll give it start a follow up.

[00:56:27] **Luca Casonato:** Cool. 

[00:56:29] **Nick Taylor:** I can see this becoming super important long term. So it's, it's, it's definitely great that you're already looking into this. And I'm assuming Kitson is one of your coworkers or? 

[00:56:38] **Luca Casonato:** Yeah, he is. He, works on a bunch of awesome stuff. 

[00:56:42] **Nick Taylor:** Okay. Speaking of the team, I'm kind of curious, like how large is the, the Deno team?

[00:56:46] **Nick Taylor:** I mean, I know it's OSS, so there's, there's obviously folks contributing from all around the world, but the, the core team itself, is it, uh, is it a pretty lean team or? 

[00:56:56] **Luca Casonato:** Yeah, so engineering wise, we have like, oh boy, I wanna say, I don't wanna forget anyone. I think we're like 15 or so right now. 

[00:57:05] **Nick Taylor:** Okay.

[00:57:05] **Luca Casonato:** Engineering wise working on Deno. But that's not just Deno. That's also the, the, product. Okay. So it's, it's about like, you could probably, it's probably like seven or eight full time on the CLI. 

[00:57:18] **Nick Taylor:** Okay, cool. Cool. Yeah. All right. I'm wondering, is there, is there anything we missed in here?

[00:57:24] **Nick Taylor:** I mean, we've touched on the islands so we know. So like clearly, oh, I know there's one thing I wanted to look at. I noticed in the fresh.gen.ts here, if you wanna speak about this for a few minutes. So I noticed this cuz I, I, I created a sample app quickly yesterday or a couple days ago and I noticed, so like, I'm just gonna do it here now live.

[00:57:45] **Nick Taylor:** So people see, so I'm gonna just say like about.tsx and then whatever I'll just do

[00:57:53] **Luca Casonato:** close the file 

[00:57:55] **Nick Taylor:** yeah, yeah. Oh yeah. I don't even need to say 

[00:57:57] **Luca Casonato:** oh, right. Oh, you switched. So yeah. Right, right. 

[00:57:59] **Luca Casonato:** Yes.

[00:58:00] **Nick Taylor:** So if I come back to, uh, fresh.gen.ts, all of a sudden I've got this new entry here that got auto generated. 

[00:58:08] **Nick Taylor:** So I, I, so I guess my, I guess my understanding here is because there's no build step when it comes to shipping the code, it it's kind of like we're, we're, we're, we're kind of flipping things a little bit. We're, we're committing build artifacts to some degree to the code base to avoid that.

[00:58:25] **Luca Casonato:** Stretching the definition of a build step. So what this is, is it's working around a limitation of. Deno deploy actually, where in Deno deploy, you cannot dynamically import files. And because you cannot dynamically import files, this is essentially a manifest, which like does static mapping.

[00:58:41] **Luca Casonato:** It's like it's the, the, the like poor man's dynamic import, instead of dynamic import, you go to the manifest and pull the stuff outta there. This is automatically created by this dev.ts file, which, is like what you use during client development. This is something which is like very terrible and I will get rid of it, but there's just a tad bit more work we need to do in, in Deno deploy to be able to support dynamic imports. 

[00:59:07] **Nick Taylor:** Okay. 

[00:59:07] **Luca Casonato:** So yeah, soon it'll be gone. 

[00:59:10] **Nick Taylor:** I guess, like is the reason why dynamic imports aren't supported at the moment for security issues?

[00:59:17] **Nick Taylor:** Like just importing rogue code or is it something else? 

[00:59:20] **Luca Casonato:** Well, it's, it's a multitude of factors. One of them is security, but security is fixable. Like security. We can deal with that, The main issue is that when you dynamically import something, how do we know that the dynamic, like, so you dynamically import something we don't want to have to pull down your dependency, like remote dependencies for that dynamic import.

[00:59:38] **Luca Casonato:** At the Edge every time your dynamic can pull, right. So what we need to do

[00:59:41] **Nick Taylor:** yeah. 

[00:59:41] **Luca Casonato:** Is we need to pull down all of your dependencies up front when you're deploying to be able to like provide the fast experience everywhere. To be able to do that, we need to know what dependencies we actually need to pull down.

[00:59:51] **Luca Casonato:** So how do we do that? That's, that's the question. We essentially need to find a way to pull down all the right remote dependencies, at deploy time. There's ways we can do it, but it's, it's just slightly involved and has taken longer than we had expected, but it'll happen.

[01:00:06] **Nick Taylor:** Okay. Yeah. Yeah. I get you, you, you kind of wanna, you want to cache it, grab it once and cache it somehow. Yeah. That makes complete sense. And I mean, the, I mean, the fact that you have that fresh.gen.ts a showstopper at some, I, I think it's like.

[01:00:22] **Nick Taylor:** good. No, I was just gonna say, it's not a showstopper, like yeah. Disappear at some point. So 

[01:00:27] **Luca Casonato:** yeah. It's like a, it's a little bit of an inconvenience, but yeah, there's worse. Yeah. It's like the thing is it only actually regenerates when you change the file system. So it, it's not like a build step where like every time you make a code change, it creates some build artifacts.

[01:00:41] **Luca Casonato:** It only creates this build artifact. Build artifact, like very quotation mark build artifact, when like you change the fault system. 

[01:00:49] **Nick Taylor:** Okay. Yeah. Gotcha. Gotcha. No, that's cool. Uh, I guess, we're, we're getting close to time here, but is there, is there anything we might have? Uh, well not, no, I mean, I could chat forever.

[01:01:01] **Nick Taylor:** It's not that. 

[01:01:02] **Luca Casonato:** Yeah. Yeah. I'm so surprised. I thought it was like, 

[01:01:04] **Nick Taylor:** Yeah, no, no. When it's a good conversation. Yeah. You, you don't realize what time it is, but, is there, is there parts of Fresh that we, like, I think we covered most of it or is there something else that like maybe, we forgot to chat about, about Fresh or, 

[01:01:21] **Luca Casonato:** I mean, there might not be, but so that's, that's all, it's all cool.

[01:01:23] **Nick Taylor:** No pressure. 

[01:01:25] **Luca Casonato:** I don't know. I'm thinking right now. I think we've covered most of it. There's there's yeah. There's some like routing things we didn't cover. Fresh support middlewares is one. 

[01:01:32] **Nick Taylor:** Okay. 

[01:01:32] **Luca Casonato:** Which allows you to like, oh, actually, I guess we didn't cover route handlers at all.

[01:01:36] **Luca Casonato:** Like how to do data fetching and stuff like that. So these routes, they can do templating, right. There's also. They're not just JSX templates, but like they can also just process requests and return responses, like raw responses, which is what happens with this API route, for example.

[01:01:54] **Luca Casonato:** But there's docs on all of this. If you wanna learn more about it. 

[01:01:57] **Nick Taylor:** Yeah. I'm gonna drop a link to the docs there. I've just got the page up here for fetching data . Okay. So just gonna look at this quickly here, but okay. So you've got a handler and is this kind of like, okay, wait that's, that's the handler and then we're getting the props.

[01:02:13] **Nick Taylor:** So is this kind of like getStaticProps injecting into a page here, like in Next.js? Is that what's going on? 

[01:02:18] **Luca Casonato:** Yeah, it's something like that. It's, it's not quite getStaticProps because it executes on every request rather than once. I don't remember how getStaticProps work, but yeah, it, so it's essentially, it takes in a request object and returns response object.

[01:02:32] **Luca Casonato:** And you happen to be able to call this context, do render function, which will then render your template, which is in the same file. And you can pass data to that. And that data will be passed as a prop to the page. 

[01:02:43] **Nick Taylor:** Okay. And so this is what allows you to, to do the render. Okay. Yeah. Gotcha. Yeah. Okay.

[01:02:49] **Nick Taylor:** Yeah, no, that's cool. And, uh, yeah, so there's, async get here. Uh, it's not in the doc here, but I imagine you can do an async POST as well? 

[01:02:57] **Luca Casonato:** Yeah. I think in the next, the, the next page is form submissions. 

[01:03:03] **Nick Taylor:** Oh yeah. Cool. Yeah. Yeah. We don't need to dive in too much, but, uh, I'll definitely. Drop a link to just the fetching data into the chat here.

[01:03:12] **Nick Taylor:** Folks, check that out. Um, of course my copy paste is not working. What's going on. All right. I'll have to go old school and write click. I don't know what's going on. My, maybe my keyboard died at the end of the stream. Who knows? 

[01:03:23] **Luca Casonato:** Oh, no. 

[01:03:24] **Nick Taylor:** Yeah. It's all good. Um, yeah, no, this is, this is really cool. I'm definitely going to mess around with it a bit more.

[01:03:30] **Nick Taylor:** Because we use Deno for Edge functions at Netlify. I got it working in the Edge functions locally. I tried to deploy there's, there's some things that I, I need to talk to some folks about, but it's, it's pretty nice, you know, and. This isn't so much a Fresh thing, but for, for folks that like, if you wanna end up debugging these things server side, because it's still using V8, you can still use the same debugging tool.

[01:03:54] **Nick Taylor:** So like, if you wanna open up the Node debugger in like, uh, Chromium based browser or your favorite editor, like, VS Code. Yeah. Or whatever that supports it. So, uh, it's pretty neat. And it, from what I saw, it supports pretty much the same things. Like the dash dash inspect and dash dash inspect dash brk, which, which, you know, it's kind of nice to keep it, uh, similar.

[01:04:15] **Luca Casonato:** Yeah, like for, for things where, like, there was obvious Node equivalent on CLI flag. We just kept them the same because people already familiar with what's the point of reinventing the wheel there. 

[01:04:24] **Nick Taylor:** I guess aside from that, is there, you know, like the 1.0's gone out, so you're definitely working on styling, solutions at some point.

[01:04:33] **Nick Taylor:** Any other big kind of things you you're looking into right now in regards to Fresh or? 

[01:04:38] **Luca Casonato:** Yeah. So one other thing that we're working on is making it easy to, do data fetching from islands client side. Like be able to talk to the server from the client in islands, cuz right now you need to like create a separate API route, stuff like that. There's gonna be a much nicer way of doing that, which is like gonna support streaming and all that kind of cool stuff. It's not quite ready though, but. Keep an eye on the, Deno blog. 

[01:05:00] **Nick Taylor:** Honestly this is just a lot of cool stuff. I, I, I know some folks get like JavaScript framework fatigue, but uh, I'm pretty excited about this, it's, it's nice seeing frameworks learn from other frameworks or, you know, get inspired by other frameworks, you know?

[01:05:14] **Luca Casonato:** Yeah. 

[01:05:15] **Nick Taylor:** It's, I guess it's a competition to some degree, but I, I just like how people are riffing off of other people and it's, it's really cool to see this. And I dunno, I'm pretty excited about Deno too. I'm gonna dig more into that now. Um, so yeah. Before we wrap things up, uh, I'm gonna drop a link to your Twitter, and I think your website's on there too.

[01:05:36] **Nick Taylor:** And yeah, if folks just want to check out the Deno site again and I'll drop also the Fresh site. Any, anything else you wanna say before we say bye to all our lovely folks in the chat? 

[01:05:48] **Luca Casonato:** Nope. If you have any other, well, actually yes. If you have any other questions then, hop onto our discord. https://discord.gg/deno.

[01:05:55] **Nick Taylor:** Cool. Awesome. 

[01:05:56] **Luca Casonato:** Yeah. Well this thanks for me.

[01:05:57] **Nick Taylor:** This is been awesome. Uh, yeah. Yeah, no, thanks. Thanks for coming on. I really appreciate it. This was a lot of fun. So, um, take care folks next week, gonna be messing around with some Vue with my buddy Drew. That didn't rhyme on purpose. It just happened that way.

[01:06:10] **Nick Taylor:** Um, so yeah, check that out next week. And we got a bunch of other exciting folks, uh, in July and August. So with that, I'll see you all next week.
