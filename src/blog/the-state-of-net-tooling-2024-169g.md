---json
{
  "title": "The State of .NET Tooling in 2024",
  "excerpt": "This is a transcript from a great conversation I had with Brandon Minnick recently. We discuss the...",
  "date": "2024-05-14T18:44:54.647Z",
  "tags": [
    "dotnet",
    "dotnetmaui"
  ],
  "cover_image": "https://www.nickyt.co/images/posts/_cdn-cgi_image_width=1000,height=420,fit=cover,gravity=auto,format=auto_https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Fbgnxmxal9v9vcdu9m9cf.png",
  "canonical_url": "https://dev.to/nickytonline/the-state-of-net-tooling-2024-169g",
  "reading_time_minutes": 5,
  "template": "post"
}
---

_This is a transcript from a great conversation I had with Brandon Minnick recently. We discuss the state of .NET tooling in 2024._

## Preamble

This whole discussion came about because of a [Tweet from Jeff Fritz](https://twitter.com/csharpfritz/status/1789349982446711040) that I saw on my timeline.

A bit of background for this conversation. I haven't done any .NET since 2016 and Brandon used to be on the Xamarin team/Microsoft.

## Just give me the video!

If you'd prefer to watch the video instead, here you go!

{% embed "https://www.youtube.com/watch?v=38JpnFhMJhs" %}

## Transcription

**Nick Taylor:** I just know him as CSharpFritz...

**Brandon Minnick:** Jeff, Jeff Fritz.

**Nick Taylor:** 
Thank you. He was part of the thing that got brought up was like, we were talking, he's talking about the ecosystem is, is pretty vast, even though people don't realize it and there's a lot of FUD and one of the things people were talking about was like tooling.

So like, I remember. Like Visual Studio or [Visual Studio .NET](https://visualstudio.microsoft.com/). They both used to be super expensive, but at one point there was a community edition. I know and like there's also [Visual Studio Code](https://code.visualstudio.com/download) but like I guess my question is like if I were to start like i'm just like I want to go build a Xamarin app right now like Is is there a cost to tooling if I were to build it like I know riders JetBrains so that you would pay for obviously JetBrains is, you know, they make money. But say you weren't using Rider. Could I have a good tooling set up to build something in .NET MAUI right now without dropping a dime? And I don't mean that because I'm cheap. I'm happy to pay for tools. But this is like a common question that I saw in that whole thread when people were saying, Yeah, but the tooling, you know, and stuff.

And just curious about your thoughts on that. 

**Brandon Minnick:** There are a couple of layers to this. So we'll start, we'll start zoomed in, zoomed way in, then we'll kind of, bring it back out a little bit. So, short answer. Absolutely. Yes. if you download Visual Studio, as you install it, you'll see a prompt comes up and it's like, Hey, what are you working on?

And this is where you can select the additional. net workloads. So .NET's also broken apart. Like the core. NET, like if you're just building a hello world console app, is you don't have to install as much. If you want to install additional workloads like Maui or blazer, you'll get this little prompt that says little check boxes.

You'll say, check the .NET MAUI box. And then. And then yeah, Visual Studio, it's called the Community Edition. It's totally free. The only kind of guardrails Microsoft puts in place, and if I'm being honest, it's mostly on the honor system, but you should honor the honor system is once you have a company that's, I forget the exact parameters.

I think it's either five employees or annual revenue of a million dollars. Then you're required to pay for the business license. But 

**Nick Taylor:** okay. 

**Brandon Minnick:** Again, for me, you and me, like I make 0 off my mobile apps in the app store. So 

**Nick Taylor:** I can 

**Brandon Minnick:** Use a community edition. No problem. But that's on Windows. Now, if we shift over to the Mac because I'm on a Mac, I've been using Mac to write my C# apps for gosh, almost a decade now.

There was Visual Studio for Mac, which fun fact came from us at Xamarin. We had our own IDE called Xamarin Studio. Yeah, which is built on mono develop. So more through lines back to the mono days. When Microsoft acquired Xamarin, like, Oh cool, you can write C# code in an IDE on the Mac.

Why don't we just rename that from Xamarin Studio to Visual Studio for Mac? And all of us were like, no, don't do that because. It's literally only made for Xamarin. Like, yes, Xamarin C#, but like, if you try to make an ASP. NET core app using Xamarin studio, you're going to have a bad time. Did the marketing team listen?

Of course. Yeah. RIP right. Violated sign. Absolutely. So no, they didn't listen to us, and they rebranded it as Visual Studio for Mac. And then again, everybody who never heard of Xamarin studio, all of a sudden, was like, oh shoot, Microsoft's got an IDE for the Mac. Sweet. I'm going to try it out. And then everybody hated it because you couldn't do, it wasn't one-to-one with Visual Studio on the PC.

So you couldn't do like your Azure stuff at first. You couldn't do, ASP. NET core stuff at first. And so slowly over time, they added more and more functionality to it. But the Visual Studio on the PC was always like the crown jewel. Whereas Visual redheaded stepchild was like, are we ever going to get that feature from Visual Studio that you just announced and celebrated to the world, Microsoft?

Microsoft announced that they're getting rid of it. They're deprecating it later this year. And what really sucks is they don't have another tool for us to use. So they're working on Visual Studio Code support.

Which, yeah, you can totally make your Xamarin app or your .NET MAUI apps, in Visual Studio Code. There's a little, Visuals, I think it's called the C# Dev Kit, and there's a .NET MAUI C# Dev Kit, Visual Studio Code extension you can add. If I'm being honest, the experience isn't there yet.

It's not what, you know, We would expect to C# developers just become in like, I know, like, here's my build button. Here's my debug button. Here's how my breakpoints work, you know, VS Code puts stuff in different places. A lot of stuff gets hidden. And again, the one-to-one functionality is not there.

So that's why I use [JetBrains Rider](https://www.jetbrains.com/rider/) on the Mac now because RIP Visual Studio for Mac, JetBrains does require a license. But it is awesome. I mean, I'm paying for this. I pay for JetBrains out of my pocket, I think 150 bucks a year. That's what I use to make the NET MAUI course. So for me, it's totally worth it.

Cause it's so good. Like it's way better than Visual Studio for Mac ever was, but I wish they also had a free community edition, so I could save a little bit of money, but also if you're on a Mac, you can do what I do. And. Let's see if this works in the screen share, but I have, Parallels installed. I was going to say, you might as well just go VM and so like here's Windows 11 running on my Mac and you can even see like, yeah, there's, here's my C# code and here's Visual Studio installed and this works great too. So, if you want to go a more freemium route, spin up a virtual machine on your Mac, install Windows, then you can get Visual Studio and everything just, everything just works.

So lots of free routes, but certainly easier if you're on Windows.

---

Until the next one!
