---json
{
  "title": "Contributing to Open Source and how Open Sauced can help",
  "excerpt": "Last week I got to hang with Brian Douglas on my Twitch stream. We discussed contributing to open...",
  "date": "2022-08-02T19:41:00.000Z",
  "tags": [
    "opensource",
    "beginners"
  ],
  "cover_image": "https://www.iamdeveloper.com/images/posts/_practicaldev_image_fetch_s--pRLxa_Fm--_c_imagga_scale,f_auto,fl_progressive,h_420,q_auto,w_1000_https:__dev-to-uploads.s3.amazonaws.com_uploads_articles_lmjxhciohzyiwthkn986.png",
  "canonicalUrl": "https://www.iamdeveloper.com/posts/contributing-to-open-source-and-how-open-sauced-can-help-5d97/",
  "reading_time_minutes": 58,
  "template": "post"
}
---

Last week I got to hang with [Brian Douglas](https://dev.to/bdougieyo) on my [Twitch stream](https://livecoding.ca). We discussed contributing to open source, and how [Open Sauced](https://opensauced.pizza/) can help people get involved with open source.

{% embed "https://www.youtube.com/watch?v=DeBAuW5Kf8c" %}

> And like there's a whole, like knowing where to start is always the challenge, which is why I'm building things like Open Sauced to make it easier, to find that introduction. What I'm doing so far, what's what's out there at Open Sauced is like just the first step. – Brian Douglas

Thanks again for hanging bdougie!

Check out the video but if you'd prefer to read or have your browser dictate it to you or some other assistive technology, I've also included the transcript below.

## Transcript

**Nick Taylor:** Hey folks, we are back at livecoding.ca. I'm your host, Nick Taylor. And today I'm hanging out with Brian Douglas, a.k.a. BDougie. I personally, I can't call you Brian. I feel like I, sound like I'd be like a parent of yours or something. So like, and I don't feel cool saying Brian, so I, gotta stick with BDougie.

So just letting that out right now. 

**Brian Douglas:** Excellent. 

**Nick Taylor:** Cool, cool. I think a lot of people probably know who you are, but for folks that might not know, you just kind of give us the TLDR of who BDougie is and feel free to shamelessly plug anything at the same time. Yeah. Yeah. 

**Brian Douglas:** So yeah, Brian Douglas is my given name, but yeah, I go by BDougie because there's a lot of Bryans that were born in the eighties, at least in the us for sure.

So much easier default to that. I've been doing a lot of stuff in the last couple years, most recently worked at GitHub leading, developer advocacy there. Getting people to use GitHub Actions, GitHub pages like all the GitHub features. I did actually spend some time at your current employer, at Netlify and did some, developer experience there as well.

But today I'm working on this little project called Open Sauced, opensauced.pizza is the URL, and, just trying to get people to contribute to open source, but also get more insights on what's happening just in the space in general. 

**Nick Taylor:** Oh, cool. Cool. Yeah, you've been working a lot in the open source space.

We'll definitely get to, to Open Sauced in a bit. The project itself is, is trying to help with part of an issue that I think you've noticed in open source. And I've noticed this too. I remember when I first started out in open source, I was 100% intimidated and I'd already been doing development for quite a while at this point.

But like, I was not proficient in git. I was working in Microsoft technologies at the time. So , my previous source control experience was visual source safe, which is garbage Subversion, which is pretty decent. And then Team Foundation Server, which, I think Microsoft might still be using, but I, I know a lot of the projects are on git now.

So like, honestly, just the whole git aspect alone was already intimidating for me. And then, you know, the, the usual putting yourself out there, you know, it's like the first time I was kind of publicly putting code that I'd be sharing with like the air quotes, the world .

**Brian Douglas:** Yeah. 

**Nick Taylor:** So kind of all that together made it pretty intimidating for me. Is that kind of how you felt when you contributed or what you've seen with folks?

**Brian Douglas:** I mean, yeah, it's, it's a common, like the imposter syndrome. I was just chatting with Anthony Mays, who, who does a lot of good work at, down there in Compton teaching, underrepresented folks, how to interview, get jobs at Google.

We had this conversation about imposter syndrome and sometimes you have to lead into it and you have to like, 

**Nick Taylor:** mm-hmm 

**Brian Douglas:** you got a program scared. My introduction to open source was one. Yes. I use open source technology source forge back in the day to copy and paste, to run random servers.

My first contribution happened was by accident actually was trying to build a server to auto invite people to Slack, cuz back in the day, Slack, you couldn't, it was all teams based. So you had to like have someone's email to then invite them to Slack. I mean great technology. It just like was a little, it was limiting, especially what people try to use Slack for, which is broader communities use Discord.

Discord's a better place for this today. So I had a node server that was running that people would submit on a type form, their email. They go to Typeform. Like why do you wanna join the group? Send our their email. And then we would auto invite them at the end of the Typeform into Slack. And to run that I had to run a node server in the background and it, it had this open source package, which was called Slack invite.

And, some guy had, he had created it for, I think it was actually for, it was, it was built on top of socket.io and it was built as like a prototype for the socket.io community, as like an example. So it was like a one and done, someone wrote a bunch of just like maybe 10 lines of Node code and like this left it on GitHub and I found it and I was like, oh, this solved my problem.

Okay. But yeah, the challenge back in 2015, 2014, no, this is 2013. There was like a split in the Node.js community where it was like io.js.

**Nick Taylor:** Oh yeah.

**Brian Douglas:** And then had Node.js. 

**Nick Taylor:** I remember that.

**Brian Douglas:** Kind of very similar to what's happening, like Deno, not a very similar split, but people just had different direction of where , Node.js was going so.

Long story short, I reached out, I was like, Hey, I don't know how to use this because I don't know what io.js is. I don't know how to run Node on the server. I was more of a jQuery person and, went on their GitHub profile on the package that was on GitHub, went on their profiles, found their email, emailed them, was like, Hey, I don't know what to do.

And then responded back to me and I got unblocked. And that was like, sort of an eye-opening experience where these people who were writing all this code on the internet were leveraging like almost every company leverages open source. You could reach out to them directly. And, it just unlocked a whole level of my career that I didn't know was possible.

**Nick Taylor:** Yeah, for sure. I 100% agree with that. I there's a couple things. Kind of supercharged my career. I made a shift to, I was always a big fan of JavaScript. So I made a conscious effort in 2016 to focus on front end. But I mean, that still means you're doing Node and stuff too. And open source, was huge for me too.

You know, I started off shaky. I'll drop a link to my first PR for folks if they wanna laugh at me a bit. It might be obvious, but like, you were saying, stuff runs on open source, like the entire front end tool chain for building anything is pretty much, I would say it's entirely open source.

I can't think of anything proprietary in there. Like you think a Babel, even TypeScript, rust is a open source. Well, it's a language, but I mean, like all that code's available to you, you know, there's and like pretty much, I mean, all the front end frameworks are open source and it's like, I don't know.

It's it's just like. You literally have access to all the code. I remember when talking to folks sometimes, you know, it's like, if you run into a bug, like people sometimes just go like, oh, that's node modules, but it's like, you can actually go in node modules. You can debug that. You can look at the code, you could tweak it if you wanted to like add a console log or something.

I had an issue with Webpack at one point, cuz I always seem to be the person that gets to do the Webpack configuration on every place I work at. I was like, okay, something's messed up. And, I stepped through the code in the node module and , I figured out the issue was something in the config I had set incorrectly.

But just the, after reading the documentation, I was still confused. So like, by being able to just go into that code, I was able to fix my problem. So I think that's pretty powerful because, at least, for front end code, you know, like all Node or JavaScript, it's textual. It's not like it's some binary format that you're trying to decompile.

I, I love that. Open source as well. I think like you're saying too, just people reaching out to you, you know, like you asked for help and they, they responded, you know, like that's, that's pretty huge. 

**Brian Douglas:** Yeah. 

**Nick Taylor:** You know, and that's happened to me a few times as well. When I worked at dev.to, which I wouldn't have gotten that job, had I not been contributing into open source, which is another thing, but we used Preact over there and I just Tweeted out something like, I wasn't asking for help.

I just said, Hey, I'm I was just saying, I'm stuck on this thing. And I dropped a link to like my PR and Jason Miller, who's the creator of Preact he actually responded in my PR is like, oh, try this, try that. You know? And I mean, since then we, we follow each other, I, you know, good old Canadian connection, I guess.

But, but I was just like, that's pretty awesome. Like, he was super busy at Google he's building Preact and he took time out of his day just to say like, Hey, you know, Try this, you know, and I found that super powerful.

**Brian Douglas:** What's wild about, cause I remember when Preact first came out and like I reached out to Jason about like some Netlify stuff and 

**Nick Taylor:** Yeah. 

**Brian Douglas:** The thing that like, what's really crazy about this and like there's two different paths you could take as well.

There's are quite a few different paths you could take as an engineer. But one path is like, go apply to a bunch of jobs. Like build up your resume, work at Google work at places that you can have like a not turn in your belt. There's like another path that a lot of people just don't go down, which is imagine if like you wanted to join the NBA and before joining the NBA.

**Nick Taylor:** Yeah. 

**Brian Douglas:** Like the summer before, or maybe before draft day, it's like, Hey, LeBron's doing pickup games at the, the basketball court down here, down the street. You have a chance to go play pickup games with LeBron. Like, are you gonna do it? Yeah, of course. You're gonna do it. 

**Nick Taylor:** Yeah. Yeah, for sure. 

**Brian Douglas:** And, but with like open source people, it's the same thing.

Like Jason Miller has an open source project. He has multiple ones. He has tons of stuff. A lot of micro frameworks, a lot of small libraries that just need some extra touching and clean up. And, you can literally go spar with Jason, open up a PR and get him to review your code. And now you're getting from a Google engineer.

You're getting code reviewed by a Google engineer. If it gets merged, that's a not turn your belt that you can go put on your cover letter, your resume, but it's like a path taken less often. And it's definitely a privilege path because like a lot of open source happens on weekends and, at nights, but like the past four years, the past six years, all my open sources been done during the day.

And I've made a point. To like carve out that time at work, which I know is another privileged place to be in that I've been at jobs that allow this, but mm-hmm, like we, if you're choosing to go interview for Google or, or, or Meta or Facebook, like you could also choose to say, you know what, Friday afternoons I'm doing open source, everything else done, let me do open source.

Cause like you could have that opportunity to like go do the PRs at places that you can gain that skill. And like there's a whole, like knowing where to start is always the challenge, which is why I'm building

**Nick Taylor:** yeah.

**Brian Douglas:** Things like Open Sauced to make it easier, to find that introduction. What I'm doing so far, what's what's out there at Open Sauced is like just the first step.

It's like the beach head. We wanna do so much more to make it easier to make contributions to open source and make it easier for companies to get involved in open source and, and hire from open source. That's the roadmap for, Open Sauced? There's a lot of stuff I can't get into yet, but some exciting stuff for the next couple months.

**Nick Taylor:** Okay. That's cool. Yeah. I was gonna kind of ask what the scope of Open Sauced is, cuz , like I was telling you before the stream briefly. I've been mainly a lurker in the Discord. I've been meaning to contribute, but I have been busy. I just like what you're doing with the project, you know, I like when I worked at dev.to and even at Netlify now, I really like interacting with the developer community and you know, I'm working on open source now, too.

It's just this great space to just help people and, contribute to what I think sounds like a pretty meaningful project, you know? I can switch this over to pairing view and I can just give everybody a sneak peek of Open Sauced here.

I don't know if you wanna maybe just talk through the site a bit, you know, like just, I I've been on it a bit, like I guess when you come here, what should folks be looking for? Or, what's the best? I mean, I guess the start now button is probably the best place to go, but 

**Brian Douglas:** Yeah, the start now button's like the, that's the introduction to what the flagship product of Open Sauced is.

It's the product I've been working for the past six years. It's essentially a CRM tool for contributing to open source. You can go to the onboarding, we authorize with GitHub. And what we do in the background is we actually generate a repo for you on GitHub.

We've been doing all the work on our new product. And we're gonna actually go back and, polish this product. So it all makes sense. But for now this is what I've built through the past six years. 

**Nick Taylor:** Okay.

**Brian Douglas:** What this is doing in the background, it's connecting to your GitHub. We're only asking to create one repo and this repo is gonna be your database and the database for you to track repositories, to contribute to.

And that's always been, the goal for Open Sauced is find projects. We'll give you notifications on, if you wanna contribute to Next.js, which is gonna be a heavy lift than a smaller project, but if some people wanna start there, and then from there you can essentially connect the Next.js, look at good first issues filter down.

So that's the plan there. We do have a whole nother project. You don't have to finish the office onboarding, but if you go to explore projects, we had this project called hot.opensauced.Pizza. 

**Nick Taylor:** Okay.

**Brian Douglas:** This is like the discovery engine for, I don't know where to start it.

It became like a little side project while I was building, Open Sauced and, the side project being, I, I just wanna recommend projects for people to go work on and,

**Nick Taylor:** Okay. 

**Brian Douglas:** That's what we're doing here. And we're embedding this into the place that you were just in. I got down this, this path in December.

We built this project using Astro in two weeks. I basically got, this scoped out at the time, had the API, cuz we've been working with GitHub data and stuff like that for quite a few years. So we had the API, we have an idea of how to recommend projects. So I pitched it to the community and said, Hey, let's build this thing.

I got on the plane to go to Florida for Christmas. Cuz that's where my family's from. By the time I touched down, we had like the, beginnings of the UI ready to go.

**Nick Taylor:** Okay. 

**Brian Douglas:** And so this project became bigger than what it was really meant to be, which is more of like a test. Now it's, it's, it's hung around.

I think it's probably cuz of name, hot.opensauced.pizza. It's too good. 

**Nick Taylor:** Yeah, yeah, yeah. No, it is. It's pretty good. 

**Brian Douglas:** And then this is like the place and the once you signed in, in the bottom, right. You could actually submit repos. So at the plan here is like what I've been coining Product Hunt for open source.

You could hunt projects. So there is some UI that we're actually, if you jump into the GitHub repository, so all this is open source. So if you scroll to the bottom 

**Nick Taylor:** yep. 

**Brian Douglas:** There's a actually in, you're in the repos there. It should be hot. Yep. 

**Nick Taylor:** Okay. 

**Brian Douglas:** And, what's cool about this. We're using Netlify.

So you could actually go into the PRs and check out the deploy previews.

**Nick Taylor:** Okay. I hear Netlify is not too bad. 

**Brian Douglas:** Yeah, not too bad. So like in the, this little draft PR this click on that deploy preview, it's obviously a draft, so still work in progress.

**Nick Taylor:** Yep. 

**Brian Douglas:** And then you'll see that we're gonna be starting to organize it a little bit differently. So if you scroll down again, still work in progress. So like the color and the UI is not there yet. But we'll start recommending repos based on week. So the hope is that we'll start sending out a weekly newsletter of some of the hot repos for people to check out.

That's where we're heading towards. Still have a bit of work in there. Okay. We've got milestones and issues open for people to contribute to no pressure. Like we do have folks who have been regular contributors who are still working on this. All you ever do is to sign up and like, we'll send you a ping when we're ready to start taking submissions.

**Nick Taylor:** Yeah, no, this is cool. I've been on GitHub. There's the GitHub Explorer page. I've talked about this before, I gave a talk about open source a few years ago for Hacktoberfest and it's curated in the sense, like you can say like, go find it by language and I think popular, but this is more curated, which, I kind of like, you know, and it's, like, yeah.

Oh, you like JavaScript. Here's some like recommended repos. We think you you'd enjoy and stuff. So I think that's pretty cool. 

**Brian Douglas:** Yeah. It's so as a GitHub employee, former get home employee at this point. Actually I guess, I guess I should speak it as, I'm, still a GitHub employee.

Cause I'm on sabbatical, but what I'm getting at is that the explore page is something that, it is definitely a lot of more automation, a lot more machine learning that happens over there. It's a project that I think will probably get some love hopefully in the near future. But in the time being , I think the human element of if you like a project, if you star a project and I star project the way that 

**Nick Taylor:** yeah.

**Brian Douglas:** Like there's no secret, the secret sauce algorithm is like literally laid out in the issue. So anybody can go in the issue. 

**Nick Taylor:** Yeah. Yeah. 

**Brian Douglas:** You can see how it works. But if we both like the same repo contribute to same repo, it gets bumped up to the top. Okay. So between user submissions and what folks have been starring and liking, we can now recommend.

Projects to contribute to projects that are up and coming projects have good onboarding experiences. Like all that stuff we can recommend because not every open source project is like welcoming contributors, which is fine. I don't think you need to open source your code and take in contribution. So like Angular is a popular project that does take contribution, but like the majority of it is from Google employees.

I wouldn't recommend you go contribute there, but perhaps there's another library in that ecosystem you can contribute to. And that's what we wanna help surface, grow open source contributions in place that need contributions and not just trying to put a notch, like as much as I would love everybody to contribute, to React, React, doesn't need more contribution.

They've got a fulltime team, they've got consistent contributers. What I would love to do is, build a platform where people can scale up into contribute to React. So you start with like maybe React Query or React Tables or some other React library, and that you get some sort of context of like, where are the missing parts in the React ecosystem?

And then now if you need to go contribute to React itself, you've got so much more context and more at bats. 

**Nick Taylor:** Yeah, for sure. And, I know like in the earlier days for React, it was a lot easier to contribute to as well. I know things are a little more complex now with like concurrency and all that.

**Brian Douglas:** I actually have a contribution to React Native, just gonna mention that.

**Nick Taylor:** Kind of getting back to contributing, people always think code code code, but it's not always code. I was working at this FinTech startup in 2016 and , we were using Electron for these FinTech apps and I was trying to do something in Electron and I was reading through the documentation and then I realized, I figured out what the problem was and it was the documentation was right. So I made a small contribution to Electron and, you know, some people might say, oh yeah, whatever, that's not code, but I'm pretty sure I unblocked several other people that probably would've ran into the same issue.

So, and I, I almost think, I mean, obviously you need code for a project to exist, but great documentation is I think a huge distinguisher and I can't say it guarantees a project will succeed, but if you have really great docs, I think there's definitely higher chances. You'll get contributors and it will gain traction.

**Brian Douglas:** And like, I I'll even like give you one up your, your even opportunity to your documentation, which I think one of the best first contributions is like a blog post and actually was talking to Ben from form about this couple years ago where like, 

**Nick Taylor:** Okay. 

**Brian Douglas:** One thing that we wanna build inside of the platform is like being able to submit contributions that are outside of GitHub.

So imagine like you decided I wanna use Preact, but I wanna use Preact with Vite maybe, and maybe that's like a unsolved solution. Maybe someone's never even tried this. How can we create a blog post or an onboarding path to show people how to use through a library? And then eventually what happens is that maintainer now can bring the docs in from existing articles and then even like, bring on those, those folks to help write the docs.

And so, like, you don't actually have to make a contribution on GitHub. Like there's a, there's a whole focus. And then the homepage of Open Sauced is like, We wanna be more than the green squares. We don't need to open issues and make PRs. But if you just became a spokesperson of the project by just like talking about it publicly or showing how you unblocked yourself, a lot of times people are just like, they go through cuz engineers, like we gotta solve a problem quickly.

We gotta sprint to sort of get through. If you're running through all state management libraries and JavaScript and you try six of 'em in one week, and then you're like, oh, you know what? This one sucked. I'm never gonna touch it ever again. Cause I had bad experience. What would be great is , put a pin in that, like, let's go open up issue and say how much it sucked and then, or maybe it'll be a little more positive than say how much it sucked .

Basically unblock the next person as you mentioned with the documentation, like someone's gonna get in that same sort of path and be like, oh man, I tried using it for this. I spent probably two days trying to make it work, decided to finally punt and leave. One of the biggest thing I do is like, I open the issue saying how it didn't work for me and explain it.

**Nick Taylor:** Okay. 

**Brian Douglas:** And then just walk away, like , I'm not really in the position to be able to contribute to that problem or, improve that problem, but at least I can contribute by opening the issue. 

**Nick Taylor:** Yeah, no, no, no. For sure. For sure. I'm just dropping a blog post I wrote a while ago about another project where the documentation needed fixing and, same thing, cuz, I was going through the thing over and over. And then like after 30 minutes, I figured out what the issue was like TLDR. They had published this npm package and then at some point they changed the package to a scoped package. So like the @ whatever, and the documentation hadn't been updated. So like, I didn't clue in until I finally, I dunno something triggered that I go, oh yeah, that's called that now.

So that's why

**Brian Douglas:** Yeah. And it's something that's like obvious to the person who wrote the code. It's like, oh yeah, look, if you went to npm, you'd figure this out. But, there's so many other folks who probably got to that point and we're just like, I don't get why this is working. Let me go to the next package.

**Nick Taylor:** Yeah, no, for sure. And I like what you're saying too about kind of championing projects. The clearest example I can think of at the moment is someone we both know, Anthony Campolo. I can't remember how he started contributing to Redwood. I think he was just doing a demos of it or, he was writing articles.

I can't remember what he was doing, but he's on the core team now. And he's just been like, he's a big fan of it and he's been championing it and you know. He initially wasn't actually contributing to the project. So it's like you were saying, just getting back to your other point.

**Brian Douglas:** His contribution was legitimately talking about a project that was, the maintainers were too busy working on the code to even come up for air, to write blog, post and Tweet and talk about it.

And then he filled in a need. And now he has some of the heaviest hitters in the industry supporting his career and promoting him yeah. In spaces that they couldn't. Literally the guy who created Redwood originally was the guy who co-founded GitHub and, 

**Nick Taylor:** Yeah, exactly. Yeah.

**Brian Douglas:** When I talk about like being able to pick up games with LeBron, like that's the level of access and privilege, you can get with open source, but the challenge is like not, everybody's like up to speed to go like, go toe to toe with LeBron. So like mm-hmm, take a step lower go, like do pick up games at you local college, like, 

**Nick Taylor:** yeah. 

**Brian Douglas:** Hopefully the analogy's not lost anybody who doesn't fall basketball, but what I'm getting at is like, there's so much opportunity and a lot of it is like free mentorship.

So like in, in Open Sauced, we had poked it at the, repo, but like we just merged in two PRs before this call. What we have is a lot of automation and actually MTFoley who you've paired with, previously they contributed to Open Sauced. He helped build an idea I had, which is like every time Hacktoberfest comes up, I want to be able to have compliance on PRs that get open.

So if someone opens up a PR with no issue attached, I wanna basically like gently nudge them and say, Hey, thanks for the PR, but this one's outta scope. Could you open an issue? And then we could discuss if we need this and if this is even in the right direction, cause a lot of times people contribute and they introduce like new libraries or new dark patterns into the app.

And then they disappear and like, I, I can't find them. I couldn't even get them 

**Nick Taylor:** yeah. 

**Brian Douglas:** On Twitter or anything. So my whole thing is like, if you haven't read the contributing guide, if you haven't really shown up in our Discord, if we don't know who you are. 

**Nick Taylor:** Yeah. 

**Brian Douglas:** Chances are we can't really merge this thing cuz like there's, there's no context for this work, so thanks.

But no thanks. But we need, I wanted to be nice about it. So rather this close it being. Yeah. Please get out of here instead. It's like, Hey. The GitHub action that runs compliance on all PRs said that she didn't do a thing. Did you wanna address that? If it sits for like a couple weeks, we'll just go ahead and close it silently.

If they address it, they're like, oh, cool. Join, join the fold. Join our community. 

**Nick Taylor:** I love that. And that's one of the well, automating things is, is super powerful for sure. Like, I love GitHub actions. But this is something that's really great about your particular project, because you know, it's one thing for somebody to say.

You know, like, Hey, I fixed a button or I, you know, I did some of the layout changes, but there's also the opportunity to be like, I can work on the continuous integration, continuous deployment pipeline. I can start automating. There's all facets of, you know, software development that you can kind of dip your toes in.

And that's, you know, and especially if you're starting off in the industry, you know, it's one thing to say, I created a portfolio project, but if you can say, yeah, I created it, but I also deployed it and I automated this, you know, like that, that already is game changing in my eyes at least. 

**Brian Douglas:** It's amazing how people just don't take that next step, which I, I get it, like, you're, you're doing a tutorial.

You went and explored like, oh, I'm gonna build out this whole dashboard for, you know, managing Tweets or whatever it is, like their side project. But a lot of folks like the bare minimum that I usually, when I mentor bootcamp, students is like open PRs on your own projects. Cause if you're just shipping directly to main, it just shows me that it cool.

You're doing a little cool side project, but you're not taking it seriously enough. And if you're not taking it seriously enough, can I take you on board to the work here? Chances are like, yes, you'll probably need the whole white board and everything like that. Figure out they great engineer.

But if I'm looking at somebody who scoped that entire project has a build system deploying this to AWS or whatever, versus somebody who just like spins up a bunch of side projects like, oh, you know what, actually, I wanna talk to this, this build system person and get more context on that. Cuz like that's the person is gonna go take their lunch break or not even a lunch break.

Just take a couple hours at the end of the day to go and improve our build system or improve the developer experience for the rest of the team. 

**Nick Taylor:** Yeah, I know for sure. And automating things is so huge. Like you're saying what Matt Foley did there with the compliance for Hacktoberfest, that's huge, and these are like, some of these are such easy wins, like creating issue templates, PR templates, you know, cuz then, you remove that human aspect of awkwardness where you're like, Hey, by the way, you forgot to do this.

You know, if it's all automated and there's like a checklist, then you can just kind of say, oh, can you just fill out the full PR template or the full issue template? And then we can look at it. Cuz I know I I've seen it in the past before to like, you know, people put a ton of time into a PR, but there's no issue.

And then you're kind of like, uh, I can't really do this. 

**Brian Douglas:** Yeah. But even even worse. So like there's no description. Like actually I was looking at a title in Open Sauced. Sometimes Todd will be like remove move lines of code mm-hmm . And , my, my question to them is like, what lines of code?

What is deleted? Why is this? Or improved feature. Yeah. And, and I get English is as a second is not as first language for a lot of folks. So like I'm patient and I can like walk through. Okay. Hey, I added your title for you. Just wanted to let you know. This one's a little more descriptive in the future, you know, just consider 

**Nick Taylor:** yeah.

**Brian Douglas:** Describing what you did in more detail, or leverage to the description box to provide more context. And one thing about issue templates, the PR template we have, we actually stole from early Forem, the Forem repo. 

**Nick Taylor:** Okay. Yeah. 

**Brian Douglas:** There's a lot of like cool nuance in the form repo about like, identifying description and like what feature you're touching and screenshots.

So that template actually, I stole from that project a long time ago. It's, it's molded into what we have today, but 

**Nick Taylor:** No that's cool. 

**Brian Douglas:** Open source for the win. 

**Nick Taylor:** Yeah, no for sure. And speaking of the Forem template, so for, if you don't know what that is, if you've ever been at dev dot two, it's running off of open source software called Forem.

My old coworker from there, Vaidehi Joshi, she's over at Vimeo now I think. But, she made what I thought was a really amazing contribution to the PR template. So we'd have the usual stuff, like here's a description, you know, what's this fixing, whatever closes this issue. And then we always, we had a section like, you know, tests and you'd just say like NA or just you would merge it.

And then, yeah, just small changes to wording made people pause when they were gonna go merge or, put up a PR without tests. So like there was three check boxes. There was yes. Which was pretty self-explanatory, there was, because cuz a lot of people contribute to the project outside of the core team.

There was , I need help, which was a, a great addition cuz I don't know how to do these tests maybe. And then 

**Brian Douglas:** yeah, 

**Nick Taylor:** I love the, no one because the, no it said no and this is why and you had to put a reason why you weren't writing tests. So like if, if it was just like, yeah, I just wanna merge this and then you, at least for me, whenever I got to that question, I was like, yeah, you know what?

I'm gonna put some tests in you know? 

**Brian Douglas:** Yeah. Yeah. And that's, that's the part we did steal that part too as well. We had the same three checkboxes. 

**Nick Taylor:** They're they're really great. So, I know Vaidehi doesn't listen to Twitch, but , anyways shout out to Vaidehi. Yeah, yeah, exactly.

Getting back to Open Sauced, you're building out a team right now is so there's, I'm assuming there's some kind of core team right now, which you're leading. I can make some guesses to some of the folks that are probably on the core team, just cuz I see them in a Discord pretty active like, like Ted and maybe Matt too, but like, like how big is the team right now?

**Brian Douglas:** Yeah, so we, the open source, we've got an open source side and we've got like a commercial side. We're working on a commercial product at the moment. So currently Chad Stewart, who's been helping out, he runs tech hiring on Twitter. He came on board and helped us out pretty early part-time and just recently is coming on full time.

Ted is also gonna be helping us out full time hopefully soon. We're still sort of, figuring out this sort of bandwidth and, skill there. He's been helping out a ton in like the things like the API and also the developer experience. So all our automation, for, release built, like release deploys and stuff like that.

That's all mostly Ted. Actually probably at this point, it's all Ted cuz all my stuff has been removed by his work. And then we do have, a designer as well. 

**Nick Taylor:** Okay.

**Brian Douglas:** Who's working on helping out with the commercial product. So Eric's been in the hot open source. Repo folks have seen him. He's just mainly working in Figma.

And then you'd mentioned Matt. Matt's, he took a full time job in January, so he's been mostly doing that. Okay. So he hasn't done as much contribution, which is totally fine. 

**Nick Taylor:** Yeah. 

**Brian Douglas:** But he is, he is on part of our commit squad. So, we have like a, a level in the open source side, we have a level of involvement.

So obviously Discord, you can jump in, say hello, we have a triage team. And these are folks who can review PRs and open issues, close issues, label stuff. We have a handful of, folks from the all in open source program who are helping us this summer as part of the triage. So shout the both Chris's and Joseph, and then we have a few other triage team members as well.

And the evolution is like, as part of triage, we can evolve you into starting to make, write some code. Cause I think with open source, it's a little daunting when you first need to, like you wanna make a contribution, but you're like, I don't know how to write code in this project. So instead of trying to write code, why not watch people write code, review their code and then get the comfort up.

To like, oh, you know, I've seen this problem multiple times. I've reviewed this problem multiple times. Maybe next time I go jump in and write the code. 

**Nick Taylor:** I was trying to, switching screens there because I'm trying to find the Discord. I thought there was the link on the Twitter, but, I'm gonna ask, Ted in the chat, if you can drop it.

**Brian Douglas:** It's in the, the, the footer of all the sites. 

**Nick Taylor:** Cool. So there dropped that, folks wanna join that Discord? I mean, totally 100%. Okay. Being a lurker first, if you wanna be, I think I've, I've been located there forever. 

**Brian Douglas:** We have the cool GitHub projects, which is, sort of the precursor, the hot Open Sauced dot pizza, where we just share projects that are cool and get up or trending.

And then we also have, like, you could share your content. So I know you've shared some of your streams, links there. Yeah. And encourage for folks to just do, like share your blog posts and stuff like that. Celebrate the stuff that you've been winning on. Cuz like what we wanna do is just everyone who wants to be involved in open source broadly just to come in and hang out.

No pressure on trying to contribute or anything like that. We do have a separate contributor channel to talk about contributing to the project, but all the other channels are just hanging out and sometimes we do discussion actually. We'll do it this Friday, but every Friday we be, before I go live on stream, we do a Discord chat.

**Nick Taylor:** Okay.

**Brian Douglas:** And talk about open. It's awesome. 

**Nick Taylor:** Okay. 

**Brian Douglas:** And hang out. 

**Nick Taylor:** Nice. Nice. I, I gotta get on some of those. I definitely wanna contribute to the project at some point. I just been a, I, I only started working at Netlify April 4th, so I I've been kind of a little busy, but, it's definitely on my to-do list to, to get something in there.

**Brian Douglas:** Yeah, no pressure. We're trying to, do a better job now I'm working on this full time is scope, the work that way, things are approachable for anybody to jump in and jump out. 

**Nick Taylor:** Okay. And I know we talked about this briefly before, and I don't know how much you want to go into it right now, cuz we're talking about people getting into open source.

You have a lot of really great first issues. I think you were mentioning. 

**Brian Douglas:** We could comb through those. I would love to promote those. If anybody wants to jump on them. They're kind of like, it it's, they're basically like hot pizza slices. Like they do go pretty fast. 

**Nick Taylor:** Okay.

**Brian Douglas:** So I did open up in preparation for this chat, open up some good first issues, for folks to take a look at.

**Nick Taylor:** Gonna drop a link to the good first issues just in the chat there.

**Brian Douglas:** Appreciate that. There's a lot of, small UI bugs and the hot Open Sauced dot pizza that's currently, our focus right now is hot, Open Sauced, dot pizza.

It's where a lot of the sort of traction and interest of like finding open source projects we'll start. But then there's like an issue where we need to link it back to app that Open Sauced dot pizza. So that's a good first issue. It's just add a link to the H one. And like I come with the I'm of the opinion that good first issue should have a solution in it.

I try not to label good first issues unless the solution is like written out, like just laid out plainly for folks. Cause like the goal for like adding a link to H one is something I could have did this morning. I could have did, like, while we were talking, I could have just did that.

The challenge is like, people need the breadcrumbs. So if I see something that's like trivial to do, I'll also have a good first issue tag on it. And then it entices people to come through and say, you know what, I wanna try this. So like George, who just grabbed the, it looks like the, actually the one, I just mentioned the link, he just assign himself to that.

So we actually, we have a mechanism in the GitHub action that basically assign yourself to issues. Cuz one of the limitations in GitHub is if you're not part of the org, you can't assign yourself to an issue unless you're on a team.

The action itself will assign you. If you just write the word dot take and, 

**Nick Taylor:** oh, nice. 

**Brian Douglas:** It's it's been a per a beautiful, like a perfect Easter egg for people who say, Hey, I wanna work on this. When you say, read the contributing guidelines and then it'll tell you how to assign yourself.

So we force people to go read the contribution guidelines, to go find that one part that says dot take in it. And then now I could confirm, you actually went to the docs and now you know how to contribute, but also you've assigned yourself. I don't know if you've you've chatted with Rizèl before she works at GitHub as well.

We've been working on that one GitHub action. It's been our sort of example, action to talk about. 

**Nick Taylor:** Okay, cool.

**Brian Douglas:** I wanna be able to run a script to basically unassign people after a month if they're assigned to an issue, but there's no movement and it's more of like, if it's up for grabs, I wanna make sure, somebody else can grab it. If somebody gets busy, people get busy. There's another contributor we had earlier this year who helped a lot on the project he was interviewing for jobs. The benefit of that is his contributions are live in production. Okay. On a product that has currently 300 active users per week.

So not crazy numbers, but it's a decent number to put on your resume. Anybody looking for a job, I'm happy to hit me up in the DMs. I can coach you on how to contribute. Like I'll probably push you to Discord eventually, in a public channel. 

**Nick Taylor:** Okay. 

**Brian Douglas:** But like, I truly believe that open source could be the, the decision maker for some people trying to get their first job.

Second job. If you can show that you can work with a team, you can work in a framework, you can work in a system. It's a better showing of than I have a bunch of, I dunno, calculator apps that I built, when I was in boot camp. . 

**Nick Taylor:** Yeah, no for sure. And we, you touched on it, but like the whole collaboration aspect of it, you know, like you're working asynchronously.

I mean, you, even if you're chatting in Discord, but, in the issues and in the, pull requests, that's where you have the conversations, you try and give as much context as possible. And people like, it's all publicly available. I'm saying the obvious, but like people can see this and go like, oh, I really loved the way, you know, Brian did that particular PR description and there was some screenshot and then, oh, there's a loom video, like, wow.

You know, and like, or, filled out the issue really well. And, and just seeing how you interact with other people, because, there is also like, a sometimes shitty side in open source where there's just people who just feel privileged, like your project sucks. It doesn't do what I wanna do or whatever, you know, and, and those are, and I honestly, I'm still kind of like, it blows my mind, like how, how are you even writing this it's public, if you're a dev developer?

If I see that I like, I would never wanna work with you, you know? Like, 

**Brian Douglas:** Yeah. 

**Nick Taylor:** Just, just that alone, you know? So it's, it's pretty mind boggling sometimes.

**Brian Douglas:** Open Sauced is not immune to any of that, because when I first opened up Open Sauced to have users and like invite people to also use the thing I've been using for like, at that point 3 years prior.

I had a bunch of people. I'm not sure where they came from. I think I got it mentioned somewhere and a bunch of people are like, Hey, cool idea. I wanna use. And then the went to use it. Like we had a very huge problem where when you authenticate with, GitHub on the Open Sauced. 

**Nick Taylor:** Okay. 

**Brian Douglas:** We asked for all orgs, all repositories, all data around GitHub.

To be honest, that was the only way you could do GitHub OAuth apps back in 2017. We now have switched to a GitHub app where we can only ask for only the one repo we create for you, but 

**Nick Taylor:** Okay. 

**Brian Douglas:** We had like probably three people come through and one person who I distinctly remember who opened the issue and complained on how bad that sucked.

And why would you make this product? I'm never using this thing, you should change this. And I'm like, oh, cool. We actually have it open PR. We're actually trying to solve this problem right now. There's a whole discussion. You're more than welcome to help contribute to that conversation there.

Obviously they didn't. But I did have some other folks who were way more helpful, including GitHub employees who got us unblocked on that, to be able to make this thing that it wasn't asking for all your GitHub data. 

**Nick Taylor:** Yeah, no, it makes me think of like, you know, I'm always pretty polite in, in responding to people cuz you know, it's just a good thing to do.

I just can't picture myself saying, Hey you asshole, why do you, you know, like it's not, so it's just not something I would do like in that context, at least, you know, but like, I remember whenever people complain about things, it's like, okay, well looking forward to your pull request and then like dead silence, always, you know?

Just kind of makes me chuckle, you know, anyways, just little funny side note. 

**Brian Douglas:** Honestly, the feedback is welcomed. There's definitely an approach. You can, you can provide feedback in a way that's actually heard. 

**Nick Taylor:** Oh yeah. 

**Brian Douglas:** I listen to all of it. I've got tough skin, you know, being underrepresented in the industry.

Like I've definitely seen stuff, so I I'm happy to like, you know, take the harsh feedback, take the critical feedback in a DM and public, whatever. But also I realize that is deterrent for a lot of folks. So like if you open a PR and you get some harsh, critical feedback, it might actually rub you the wrong way and be like, you know what?

This is not for me. Let me retire from open source for good. And that's what we don't want. So I usually try to like, if there is some sort of feedback, that's a little harsh or critical, I do like mention that in the DM. We've definitely had that in Open Sauced. The goal is really, we wanna make it easier for more people to have a pathway into like the next contribution.

A lot of times it is gonna be messy, but as we learn, we'll have frameworks that will hopefully engage folks and get them onboarded. So like the compliance action or the release pipeline that we have built. The other thing is like when you're first contribution, if you have an issue or whatnot, we have a welcome join us in Discord automation, welcome message.

And like all that stuff is built in so that we can just funnel people into a place and then funnel 'em back into open source. The goal is not to keep you contribute to Open Sauced forever. The goal is to go get you to other projects so we can set up a good system in situation for you to learn.

At least you'll have more confidence in going to another project and knowing, you know, what I've saw, how Open Sauced can do with templates. I'm gonna introduce their template in this project. Doesn't doesn't have one existing. 

**Nick Taylor:** I love that idea of the, the welcome, as soon as you open up an issue or whatever, it's, you know, and even when people know these things are automated, it's still nice, you know, like a triage message, thanks for submitting your issue.

I know at Forem, we used to say like, we'll get back to you in like three days or whatever, and it, you know, it's a nice little touch I find, and the more you can automate the better for sure. We haven't really talked about it, but I, I know a bit about it, but what, what's the tech stack for Open Sauced at the moment?

**Brian Douglas:** Yeah, so the, the repo that we're in right now, this is a react and Vite app. So I did mention, we used Astro earlier, this year. As we scoped out the product, we were just moving faster than Astro development and we had to make a decision that either we contribute upstream or we just use the same framework we use in the other app.

So React and Vite was an opportunity that we switched into. We do are, are using Tailwind as well as a lot of CSS. And that was intentional. 

**Nick Taylor:** Okay. 

**Brian Douglas:** This might change in a year or two, but at the moment, Tailwind is a sort of centralized framework around CSS decisions that as we take contributions from other places, we don't have to rewrite CSS libraries and, functions and stuff like that.

So Tailwind just makes it, it makes it less that we don't have to just have discussions about CSS over and over again. Cause the challenge of doing an open source project has a front end co associated to it. Everyone, has an opinion. So we, we just wanted to get that opinion outta the way. So yeah, React, Vite , TypeScript is another decision we've made in the project.

And it's been helpful. It can be challenging for folks who have not touched TypeScript, but what I've seen so far is that just a little bit of nudge to documentation. People are actually leveraging this to learn TypeScript as well, which has been fun to see as well. 

**Nick Taylor:** I'm a big fan of TypeScript.

I've been doing it for a while now. The things that gives you out of the box are great. Like, especially if like you start building out a team, if you have stuff in place, it just makes it a lot easier to discover things. And like, I assume most of the people that are working on the project are probably in VS Code.

So that's got TypeScript baked in. So which always kind makes me chuckle. Cuz anytime somebody tells me they don't like TypeScript I'm like, well actually all that Intellisense and refactoring you got in VS Code that's that's TypeScript. 

**Brian Douglas:** It's interesting how VS Code has a handle on the developer market. It's fascinating. And I'm all for it because I've also jumped in the TypeScript as well and also jumped in the VS Code in the last couple years. I was a VIM user. 

**Nick Taylor:** Okay. 

**Brian Douglas:** I did not create a start, a new machine without changing, like converting my dot files over to, to run VIM. I'm surprised on how much VIM I don't do now, which is kind of crazy. 

**Nick Taylor:** Yeah. I never really got into VIM. I mean, I, I know the basics, even though people always joke about exiting, it's really not that complicated, but I know the basics, like moving around, up and down, deleting a line and stuff, but I know there's like, I worked with people that are like super proficient in it and, and they're more productive that way.

Maybe one day I'll pick it up if I need to. For now I've been pretty happy with like my shortcuts and VS Code and I mean, that's pretty much what I'm in most of the time.

**Brian Douglas:** Yeah. VIM is my, go-to for merge conflicts. I, I could do I'm a lot faster in deleting lines and changing things and doing some hot swapping and stuff like that.

So I haven't quite got there in VS Code as of yet. 

**Nick Taylor:** So yeah, so you got those good first issues going on. You've got Discord going on. The other thing that I wanted to mention, cuz like, I've been a fan of this cuz you've got a YouTube channel. You've been interviewing people in the space and , I think there's only three episodes that dropped so far. 

**Brian Douglas:** We've got five at this point. 

**Nick Taylor:** I must have missed one or two. First off. It's just like, you definitely have a really good setup. So the production quality it's it's really great.

But it's the interviews I saw were with Fred Schott from Astro. You had, what's his name from fig?

**Brian Douglas:** The CTO? Yeah.

**Nick Taylor:** And, the last one was with, the readme.so, her name's escaping me. 

**Brian Douglas:** Katherine. 

**Nick Taylor:** Oh yeah. Katherine. Who's working at, GitHub now.

I definitely encourage folks to check out the channel. I mean, one cuz uh, you know, just subscribe, but the interviews are really great. You know, they're all, I'm assuming they're all gonna revolve around open source, the interviews? 

**Brian Douglas:** Coming from DevRel, there's a, there's a plan.

It all makes sense. We want to, first have conversations about open source and, getting insights from open source and how to maintain projects. We we've sort of taken a scale back on trying to onboard people into open source, cuz the, the challenge is if you don't have any place to put people, then you're just bringing people in open source with just a bunch of chaos.

So we've been partnering with companies to companies that represent some of these interviews as well. To showcase our new product and our new product that we're gonna hopefully ship in the next couple months. It's an insights platform. Where you can get insights on all open source projects.

So this will eventually embed itself into our existing products. 

**Nick Taylor:** Okay. 

**Brian Douglas:** But what we wanna do is like, be able to say, okay, if I go into Next.js, who's contributing are these Next.js, are these Vercel employees? Are these outside contributors? How do I know if I even have stand the chance?

And then if that's the case, how do we recommend other places for folks to go contribute to? And by having insights on what were contributions that happening, we can make those recommendations through, currently just sort of manual labor and, and data mining, but eventually machine learning will make recommendations.

And then now when you go to a company like a Vercel, or if you go to Netlify, you can now say, how good are we doing an open source? Are we actually mm-hmm driving engagement or let's say you're a staff engineer there. You're like, Hey, we should actually hire more people to work alongside of me. Where do we go?

Let's go to the open source repos. One of our authentication libraries that we're leveraging is GoTrue, which has been maintained by Netlify for years. Like if someone wants to come join Netlify to work on that, the first place, you're gonna go is like, go to GoTrue. Find out who's been contributing.

Who's been consistent. There's so much we we're gonna be doing just around that one. That one idea. But we have a whole roadmap, I'm looking forward to sharing, hopefully in the next like month or so. 

**Nick Taylor:** That's really cool. Cause I wasn't really sure what the, I don't wanna say master plan is, but like, like obviously, like one of the big things is obviously, like you said, getting people in an open source, but, it's cool that you're productizing something.

I can't remember if that's a word or not, but I just used it.

**Brian Douglas:** I think it works. 

**Nick Taylor:** I'm curious cuz there's some similar tools in that space, but I, I feel like you're, you're slightly different than some of those tools potentially. I know when I worked at Forem, my old colleague, Christina Gordon, she was running community and then eventually DevRel there she was using, I think orbit model is that it? is it orbit or orbit, orbit.love or whatever.

**Brian Douglas:** Orbit.love. Yeah. 

**Nick Taylor:** So is it similar, like what? And I'm not saying this to throw anybody under the bus. I'm just genuinely curious. 

**Brian Douglas:** No, it's a good question. I think orbit has a great product. So like if you manage a DevRel team or a community, definitely take a look at orbit because you can now understand who's Tweeting.

Orbit has like the orbit model is like a basically circles on like how close people are to like your core influencer group your core, basically your core MVP, of users. Okay. So orbit does have a GitHub integration and orbit's GitHub integration does focus on things like stars and, comments and et cetera.

I don't know if it's been announced, but it's been in beta for discussions as well. Which is a great product. We're actually currently just focusing on code. Uh, so like we wanna see where contributions in code, are happening. And the reason for that is no one's doing that well. Like there's a lot of productivity, tooling apps, that are not like orbit that are like, we don't have to name 'em, but basically the productivity tooling they're really focused on big brother and trying to tell you like, Hey, how many PRs did you ship this week?

Why did you only ship three outta five? You could have been mentoring a junior engineer for the whole week and only shipped one PR. 

**Nick Taylor:** Okay. 

**Brian Douglas:** But that doesn't really, when you're just looking at just numbers for the sake of numbers, it looks, yeah, it looks awful. Especially in the, the world that we live in with layoffs.

If you spent your entire time mentoring juniors, does a junior get laid off or do you get laid off because you spent way more time working with them? So what we wanna do is what I believe is open source is more community focused, where everybody gets a piece of the pie. Yes. There are gonna be some heavy hitters and people who know most of the code, but like you could identify who has most of the information and how you could spread that well, so. 

Identify things like bus factor. If somebody does all the work in the last release, that person probably should have wrote some documentation or talked to somebody else. Cause otherwise you're gonna be always relying that same engineer every time a release happens. And so yeah, if that time over time release have to release, we're gonna be able to identify those different points of failure, which is the opposite of what most tools work.

If this person doing all 10 PRs every week, that's encouraged in these other tools. So we wanna do the opposite. Encourage spreading the wealth. 

**Nick Taylor:** Okay. Yeah. Gotcha. You definitely you definitely don't wanna silo knowledge that's for sure. You know, like when whoever's been doing their releases, there's always that horrible example of gets hit by a bus, but like, you know yeah.

You, you know, so, okay. So that's no, that's, that's interesting to know. So if anything, well, one, this tool can stand on its own and if anything, it might compliment or, you know, I guess it depends what the metrics you're looking for too, like you were saying. That's, that's super exciting though and you're saying you're hoping or release that. What was it in a couple months you said, or a month or? 

**Brian Douglas:** Yeah, in a couple weeks. So I've been actually reaching out some DMs. What we're calling is the Open Sauced insiders program. Like there's no public announcement or anything like that, but I'm just reaching out to friends to say, Hey, we're gonna have a product that's gonna ship.

As an alpha would love to get people to use it. Give us feedback before we go broader launch in September. 

**Nick Taylor:** Yeah. 

**Brian Douglas:** So if anybody's interested, hit me up with a DM. If you work at open source, if you have a project at your company, yeah. Just let me know and then I can, get you eyes into it. And then we can get some feedback.

I feel like it's a very ambitious product, and something that no one's ever done yet. Like maybe GitHub's got close, but I think that, based on my purview, I think we're gonna change the way people look into open source moving forward. 

**Nick Taylor:** That's super cool. I'll definitely talk to some folks at work about it.

And, I know like, I mean, cuz Netlify is a big fan of open source and, I can even think of like, Ryan Carniato who built SolidJS. I feel like that is probably a really good candidate too.

**Brian Douglas:** He'd be a perfect candidate. Happy to take an intro. I could probably list a whole bunch of people that you work with that I'd be like, hey intro, please.

**Nick Taylor:** In terms of Open Sauced, is there other stuff in the community, that stuff's going on or it's, it's, it's pretty much like everything's going on in the Discord. You got the YouTube for some of the interviews and stuff.

**Brian Douglas:** We've also been doing Twitter spaces. Doing a ton, but yeah. Chad and I, Chad is the other engineer who's been helping out. We've been doing Twitter spaces. This is about scaling engineering teams and it's like this week, we're gonna have a Twitter space on mentorship.

We haven't done a great job of promoting these upfront. So if you see the live it's there, but currently on the YouTube channel, if you scroll the youtube.com/OpenSauced and scrolled to the bottom, you could see our last conversation, which was a Twitter space. We talked about, how FAANG is ruining open source.

We don't really have a title for these conversations, but, yeah, if you scroll all the way to the bottom, 

**Nick Taylor:** I must be logged in as my work account, cuz it says I'm not subscribed, awkward. 

**Brian Douglas:** Yeah. So that first one on the left, we had a conversation around how, it was an interesting conversation.

It was based on a newsletter that Gergely he's like a former Uber manager. It's like actually I think you jumped in there. You might be on the recording. it's a shout out. YouTube famous.

**Nick Taylor:** Yeah, yeah, yeah, yeah, exactly. Yeah. It's kind of funny cuz like speaking of community and stuff, like I've known Chad for a few years, actually I met him through my Virtual Coffee.

It's a big world, but it's a small world at the same time. Cuz like, and that's another thing like, uh, speaking of just open source. I would never have met Chad if I hadn't joined a community, like he's in Jamaica, I'm in Montreal. Definitely the pandemic has accelerated a lot of stuff in terms of people just, you know, just wanting to meet other people too online.

But, I think that's one of the things that are huge. When I worked at dev two, well, even at Netlify there's people all over the planet that I work with. I think that's super cool. You know, and, and this, this goes out to the reach, like you were saying too, you know, it gives you that superpower too, where like, you, you could work on some amazing project that, if you're just in your own town, you would never be working on this, you know?

I think that's another thing that's kind of big for me in terms of open source and it really does open a lot of doors. And like I say this as a white guy in tech, so I know I have a lot of privilege, so, I definitely gotta say that, but, you know, if you can do it, like you said, cause I know everybody's situation's different, but if you can contribute, it's like 100% game changer.

And I didn't realize that Chad was actually working with Open Sauced now, I've listened to some of the Twitter spaces, but I thought it was just, both of you just kind of boosting the tech is hiring. So, that's cool to know that he's actually part of the project now, too.

**Brian Douglas:** That definitely still is the goal. Like we definitely boost at that tech is hiring and what Chad's doing. We didn't really know what this was gonna be. So we actually did a couple of them that we didn't record. Like they just left Twitter spaces recently. But the idea is sort of like we figured it out as we go along, like I've always wanted to do like live stream Twitter spaces, to like YouTube and to other platforms.

So what we're using right now is we're using ping, to capture Chad's video. And then I basically use OBS to do, some, when he grabbed the picture of my phone to basically have the Twitter space. 

**Nick Taylor:** Oh, okay. Okay. 

**Brian Douglas:** It's like light editing. It's live to tape. Well, not even live to tape, it's recorded to tape and then we upload to YouTube.

But eventually we'll get to the point where we could stream that up on YouTube as well. And it's like my DevRel wheels always turning of like, how can I reuse this content? Or how can I reuse this platform for sharing about open source? The gimmick that we have in those spaces is that we're gonna talk about scaling engineering and like growing as a junior engineer and stuff like that with the eventual context at open source is go try contributing somewhere else and learn stuff outside the job, to then eventually bring that back to the job. 

**Nick Taylor:** Yeah. And that's such a great point because like, I can't remember if I said it during the stream or before we got on the stream, but most of my career was in the .NET ecosystem.

I was doing C# ASP.NET, and then I made a, a full pivot to all things JavaScript. Cause I was a big fan of it. I was working in C# and .NET and I was doing some JavaScript, but it was like full stacky. React was fairly new at the time.

And I was like, I wanna learn react. So I started doing this in open source on my own time. So I started off with, this was like, early late 2015, early 2016. So for folks who might not know what Redux is, Redux is a state management library. It was created by Dan Abramov. And, I think as well by, Andrew, what's his last name? It's escaping me.

The point is, uh, there was these free egghead videos for Redux from Dan. I watched that whole thing learned Redux and I had started contributing to these are less popular these days, but there used to be React boiler plates.

**Brian Douglas:** Yeah. 

**Nick Taylor:** I think you've mentioned in one of your Twitter spaces, but like Max Stoiber had the React boiler plate, which was like the defacto.

And I ended up contributing to another one. It was a Redux React one by Cory House. It was called React Slingshot and. That's how I started learning React. And eventually I became a maintainer as well because he, after I think I had like 13 PRs at that point. And one, one thing if you do end up doing a project is if you wanna not burn out is just ask people that are contributing or seem to at least enjoy your project.

Just throw the bone out there and say, Hey, would you wanna become a maintainer? And it doesn't mean you gotta be doing it 24 7, but there was like three of us at that point. And that helped the project scale, you know, in terms of triaging issues and stuff too. And I learnt React and all those things led to me being able to get a job in React because I did it on my own time, but you know, it was like real world projects.

So that, that was huge.

**Brian Douglas:** I think one person had, I think it was, Anthony had dropped in the chat, like create T3 app or something like that. It's a, 

**Nick Taylor:** oh yeah. From, what's his name?

**Brian Douglas:** Why am I blanking his name? The ping founder. Theo.

They're still coming out like that. Everybody's having like grow, like, I think what's beautiful about open source and like, even these tools is that people have their opinions, they share their opinions, people go hop onto those and it helps unblock so much more work, which is why we do Tailwind.

That's something that I don't wanna have a discussion about every single time we open a PR is like how to do CSS. 

**Nick Taylor:** Yeah. 

**Brian Douglas:** To be quite Frank, I was never a fan of Tailwind, but the popularity forced me into a position where, I don't wanna build my own CSS framework.

Let's use Tailwind. 

**Nick Taylor:** Yeah, exactly. And, and like building out a whole design system and component library, it's a huge endeavor as well. So like leverage what you got there. Are you using Tailwind with a particular component library? Like, Chakra UI or something or? 

**Brian Douglas:** So we're currently building our own component library.

We have leveraged. So in hot open source we do have headless UI, which I think did come out of the Tailwind group. We also use Radix, cuz it's unstyled components on the web. But we have it really like we're building everything, at least building the, the different Interac, like components themselves from the, the ground up.

**Nick Taylor:** Yeah. 

**Brian Douglas:** Currently our, our new design system's not really public yet cuz we're working on this one product, this insights product, privately for now. But we're hopefully, you know, open everything up in the next couple months. And then everyone will have eyes into the design system, the new product and everything like that.

So, we're, we're getting there. It's just, I've had like one of the, probably since joining Netlify, I've had the ability to start new decisions and a new framework and with the new team. Cuz I, I don't know if I mentioned I was employee number three at Netlify. So I was the first person to write JavaScript, Matt wrote JavaScript, but I was the first person to do it full time.

So converted the Angular app into a React app. So all the dashboard app that Netlify.com. Initially, it was all me. We did three more people after that. But it's like a fun time to also be right now for Open Sauced. Cuz we intentionally built, we started with a new repo cuz I made a lot of decisions in the last five years, five, six years that we don't have to bring along for the ride.

So we're the starting from fresh and we'll introduce all the new stuff, as we make all decisions around the framework and everything like that. 

**Nick Taylor:** Okay. Okay. Yeah. Yeah. And I was gonna say as a good choice, picking Radix. There's like, Radix, I know when I was at Forem, we started using some components from ReachUI, which is from the folks that do Remix run and just for folks in the crowd, it's a good idea to grab something like Radix or ReachUI because they have all the accessibility built in, or at least pretty much 

**Brian Douglas:** Yeah. 

**Nick Taylor:** The main things that you don't have to worry about. And that's huge. Cuz if you're building out components, this is not something you wanna have to worry about all the time.

I mean, you still gotta, there's still a accessibility testing aspect of things for sure. But it's nice having all that accessibility, goodness, baked into those things. So. Definitely a good choice. 

**Brian Douglas:** Yeah. I, I've definitely been to a place early React days, like 2015 and having no accessibility like inferred or anything in the components.

And it's like one of those things that everybody was just kind of like, ah, whatever. And then there was a huge push for accessibility to be first and foremost, and like the stuff we're building to not have to make those decisions or figure out like, you know, if I hit tab on my dropdown, is that gonna work?

Like a lot of stuff. I love this picking off the shelf for, and the beauty of that, I know we chose it because it was so minimal. It was a light framework, that we're not introducing a bunch of hefty stuff. I actually, one of my first, coworkers, when I, my first dev job he had built. 

**Nick Taylor:** Yeah. 

**Brian Douglas:** He had rebuilt like, he called it, X Select or something like that.

Anyway, he built like this library and originally jQuery, that had like every single front end library, he would rebuild it, like and react in angular. Okay. To do dropdowns because dropdowns were a real challenge for front end. Yeah. For front end depths. And, the reason he did that, cuz his mom was blind. So his mom was blind for his entire life.

And he saw firsthand, his mom tried to use screen readers on the web and he would always test with the screen reader, like if you could use the site. So it became like his mission to like, like when I worked on him, he was like 19 years old. He was running accessibility at visa for visa check art, but like 21, cause he just made it his thing and it was all on the back of open source.

He made it his thing to always make sure that dropdowns were accessible. 

**Nick Taylor:** And to your point too, what you're saying, working on accessibility now is popular. And that's a good thing. And like, that's also just another space.

Like if you're looking to get in the front end space, if you put some focus on that, that'll help you stand out too, because you know, building out things is one thing. But if you're making accessible stuff and these are things that you'll be asked about in, more senior roles for sure.

But even in the starter roles, they won't grind you as much, but they'll definitely be asking about stuff. Like, are you using semantic markup? Why are you using a label? You know, stuff like that.

And, you're obviously making your, your application or your site available to more people too, which is a good thing. Even if you, for some reason you hated accessibility, if you've got an e-commerce site, it just means you're getting more customers, even if you don't like that.

**Brian Douglas:** So, yeah, this is true. I think if you take anything away from, from this conversation, like getting into open source, it could be challenging and daunting, and even with scaling your engineering career. But I think if you niche down, like you're always out of a bootcamp, you're always given sort of the general.

Approached like, yeah, learn everything and then just be good at everything. When you interview, you can answer questions, but pretty quickly, if you wanna get to a senior level, you gotta niche down and like focus on accessibility or CSS or animations or whatever it is, like niche down into something you can be an expert at.

And then once you've been an expert at that move to the next thing, so then move to the next thing. 

**Nick Taylor:** Yeah. 

**Brian Douglas:** And eventually you start really gaining skills. And like, going back to my original mention is like, and when contribute to open source, like bring in those skills are, come without the skills and say, you know what?

Open source has like no animations when, when you click on this thing, like, it'd be great. Just tell that story. Let me introduce an animation. On whatever this random thing, and it'd be cool. You could be the animation guru within the project.

The same way Matt was our actions guru for quite a bit of time, which is funny, cuz I was the actions guru cuz I, I worked at GitHub. 

**Nick Taylor:** Yeah. 

**Brian Douglas:** And I could do all the actions, but then I was just like, got to the point where I couldn't build another action. Cuz then that was more open source to contribute or to maintain 

**Nick Taylor:** mm-hmm 

**Brian Douglas:** and at the time Matt was looking to break in the industry, get a dev job.

Yeah. And I was like, Hey, solve this problem for me. I'll provide this thing like to like crazy. And I was able to promote his action on stage at get up universe and then shortly after that's awesome. He was able to start to interviewing at jobs. 

**Nick Taylor:** No, that's super cool. And this is a tangent, but I remember I've heard you talk about this before.

I think you talked about it on the Shop Talk podcast with Rizèl but you you've mentioned it elsewhere too. Like. It's not so much to do with open source, but like you work in DevRel you know, in terms of people building in public or putting out content there, you saw there was a hole where like GitHub actions was something new from GitHub.

Nobody was really talking about it so much or writing content for it. And you just kind of grabbed that bull by the horns and, and you just were like GitHub actions, everything. And, basically you became the GitHub actions person, at least from the outside, I would say, you know, so that's a little side note for folks. Like if you're, if you plan on doing any kind of content creation. 

We're, we're getting close to time. I just had a couple, I guess this is kind of more, a open ended question. It's still early days for Open Sauced. So like you said, there's, there's still a lot of room for folks to make an impact. Like you said, if somebody just wants to come in and I wanna be this person. 

What are, holes isn't the word. What's some stuff you wanna do that you haven't had a chance to maybe like, yes, you're gonna be productizing it. But like, you know, just like I said, it's, open-ended like, what's some stuff you wanna do, but you just haven't had time to yet maybe, or we don't, there's not enough folks on the team yet.

**Brian Douglas:** Yeah. I mean, there's one thing that it was a discussion last year, maybe a year or two years ago. What I always wanted do is like, make a, a streamline approach to like opening discussions in the product. 

**Nick Taylor:** Okay. 

**Brian Douglas:** You know how like Intercom yeah. In the bottom, right? Of most apps you can like chat with a, a live person.

I've always wanted to open source a tool to basically. You chat on the site and be like, I don't know how to use this product. That question goes into a discussion that response or a Discord channel, that response ends up going into, back to the, the UI, because once you type in Discord or a discussion, it goes back.

That's something that I would love to solve that problem. It's really outta scope of what we're working on right now. But if anybody's ever seen a solution like that or wants to like pair on that for like, you know, a day, I would just love to just have a chat about that problem.

Other stuff that's maybe on the roadmap for Open Sauced. We honestly just need feedback, a lot of folks log in Open Sauced, they get underwhelmed with the fact this there's not a lot of features there. 

**Nick Taylor:** Mm-hmm. 

**Brian Douglas:** I think opening up discussions to say, you know, what'd be cool. Is this feature or, you know, it'd be cool. Is that feature. So I'll probably end up probably trying to source that feedback pretty heavily from folks, everybody I run into. We do have like an infrastructure thing that we're gonna be building out. We currently have the API to open sauced dot pizza, that is almost live.

But at this point we're gonna be like, well, the way we're doing this, the hot Open Sauced of pizzas, we actually index a bunch of repos using GitHub actions. That index gets put into a relational database. And then that relation database is gonna recommend repos for people to contribute to and stuff like that.

**Nick Taylor:** Okay. 

**Brian Douglas:** So as we index repo's like, now it's that point at infrastructure problem. And my skillset and infrastructure stops where vortex or Ted who's in the chat where he begins. But we're always, always happy to like, to learn from other folks who have solved problems, similar problems and stuff like that.

The majority of what we're doing is open source. Pretty soon everything will be open sourced. Happy to just have a conversation chat. I, I have like a very open calendar that people would just drop time on. So ask me, and I'll give you my calendar link and, always happy to chat with folks who are interested in talking about this stuff.

**Nick Taylor:** Cool. Cool, cool. No, that's awesome. Well the project looks amazing and like I said, I've been a lurker. I'm gonna go through the whole onboarding cuz I've never done it. I'll try and, uh, provide some constructive feedback there.

I'm just gonna add it to my to-do that I need to contribute to the project. So if I put it somewhere, I'll do it.

**Brian Douglas:** And after this, I can give you a demo of our, our future product for the, that we're making for the insiders. So if you wanna, 

**Nick Taylor:** Okay. 

**Brian Douglas:** Anybody here you're open, hit me up.

You wanna join the iron insiders? Always we ask is this respond to of my message of like feedback that would be super helpful. And then we're basically build the future of Open Sauced. We'll unveil it pretty soon. 

**Nick Taylor:** Okay, cool. 

**Brian Douglas:** Everything will make sense soon.

**Nick Taylor:** Yeah, no, for sure. Yeah, that would be awesome. I'm gonna drop some links to all the places that folks can find you at. So definitely if you're not given BDougie a follow on Twitter yet, do that hit 'em up on Twitch too, YouTube. And, I haven't checked out your own site yet, but I dropped that too.

**Brian Douglas:** I redirect it to the Polywork now, cuz that's where I just drop all information. 

**Nick Taylor:** I still blog, but I I've been dropping, I always post like, like whenever I do my streams, I do a highlight over there and stuff.

It's a great way to just put all your work out there. I find with, anyways, that's a little tangent shout out to Polywork. I'm actually wearing their t-shirt at the moment.

**Brian Douglas:** Could I mention real quick? We're like four stars away from a hundred stars on hot.opensauced.pizza.

So if anybody okay. Wants to star that repo, we'll hit three digits pretty soon. 

**Nick Taylor:** Okay, cool. Cool. I'm definitely down to see that insiders if you want, whether that's after this or another day I'm I'm game for whenever. Thanks again for hopping on, I know you got a lot going on, but the project looks super exciting.

Good luck on the productization launch. Aside from that, next week folks, I'm gonna be hanging out with my coworker, Brittany Postma she's gonna be teaching me some spelt. I haven't done any of that. And speaking of Rizèl, I'm gonna be hanging out with her in a couple weeks, and I think we're doing something with GitHub actions, Copilot and Twitter, some kind of mashup.

I can't remember exactly what we're doing yet, but, I'm pretty stoked for that too. Cool. All right, well, we'll see you all next week folks. And thanks again. BDougie. 

**Brian Douglas:** Yeah, pleasure.
