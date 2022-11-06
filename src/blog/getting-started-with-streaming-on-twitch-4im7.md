---json
{
  "title": "Getting Started with Streaming on Twitch",
  "excerpt": "Last Friday, I gave a brownbag talk for my Virtual Coffee community on getting started with streaming...",
  "date": "2021-07-28T03:22:00.000Z",
  "tags": [
    "twitch",
    "beginners",
    "streaming"
  ],
  "cover_image": "https://www.iamdeveloper.com/images/posts/_practicaldev_image_fetch_s--xrj9uU0f--_c_imagga_scale,f_auto,fl_progressive,h_420,q_auto,w_1000_https:__dev-to-uploads.s3.amazonaws.com_uploads_articles_fm42fqy3ziu3r1zyahel.png",
  "canonicalUrl": "https://www.iamdeveloper.com/posts/getting-started-with-streaming-on-twitch-4im7/",
  "reading_time_minutes": 5,
  "template": "post"
}
---

Last Friday, I gave a brownbag talk for my Virtual Coffee community on getting started with streaming on Twitch.

{% embed "https://www.youtube.com/watch?v=aDofyI6E2t4" %}

[accompanying slide deck](https://iamdeveloper.com/stream2021)

This is a work in progress post. I'm just putting out what I had in my slide deck here, but in a more readable format than the bullet points in the slide deck. Feedback is welcome. 

## Open Broadcaster Software (OBS)

The first thing to do is install [OBS](https://obsproject.com). It is the standard when it comes to streaming. There are tools built on top of it, but typically I recommend using bare-bones OBS or [Streamlabs OBS](https://streamlabs.com) (SLOBS) which is OBS with some plugins from Streamlabs.

The main reason to use OBS or SLOBS is more flexibility when streaming, and as far as I know, OBS is the only one that allows you to stream closed captioning.

For the remainder of the post, I will refer to just OBS instead of OBS/SLOBS.

I won't do a deep dive into all the things you can do with OBS, but know that you can [create scenes with many sources](https://ryanharris.dev/2019-12-11-obs-scenes/). A scene can be for example a starting soon page, and when you're ready to start talking you transition to another scene, perhaps called chatting or coding view.

There are many sources you can add to a scene:
- images
- browser sources, e.g. a web page used for an overlay in your stream
- display capture, e.g. an external monitor
- video capture device, e.g. a webcam
- etc.

## Streaming Checklist

It's important to go over your setup before going live on a stream. You want to make sure audio is good, video etc. Here is a sample checklist that I created for the purpose of this post. It's a reduced version of my own checklist.

- Turn off notifications for any software on laptop
- Ensure closed captioning is working with OBS
- Check audio is not muted and is working for you and your guests
- Have Twitch chat open in a browser or the entire stream (make sure stream is muted!)
- Ensure you’re on the right scene to start

## Going Live

Here's some typical steps to take when going live on a stream.

- Go over checklist
- Tweet out that you are going live on your stream with a link to your stream. SLOBS has this built-in
- Start Stream
- Check the stream to make sure you’re streaming
- You should be good to go at this point

## Streaming Tips

Here are some streaming tips that I've found useful

- Interact with the Twitch chat
- It’s not going to be perfect, that’s OK
- Have fun, really!
- If you’re live coding, talk through what you’re doing
- Tweet midway through your stream that you’re still streaming about topic X or live coding

{% twitter "1405219963045036033" %}

- Post your streams to Polywork, LinkedIn and Twitter. Here are some examples at [timeline.iamdeveloper.com](https://timeline.iamdeveloper.com/nickytonline/highlights/cdfcb228-92a7-4678-86f0-6de6f0a432fe), [my LinkedIn](https://www.linkedin.com/in/nickytonline/detail/featured-list/urn:li:fsd_profile:ACoAAABbWMMBK1FLcaTloEjdod1_1cHxB9hL1xU/), and Twitter

{% twitter "1384980393770815488" %}

- Have a consistent schedule
- Don’t worry  if no one or few people are watching your stream when you get started out
- Zoom in your editor and browser to help folks see things better
- If you use [Visual Studio Code](https://code.visualstudio.com), @john_papa created an amazing extension for hiding environment files called [Cloak](https://marketplace.visualstudio.com/items?itemName=johnpapa.vscode-cloak)

{% twitter "1421683536952709120" %}

- If you plan on uploading your streams to YouTube or want to create clips later, ensure that you have Store past broadcasts on in your [stream settings](https://dashboard.twitch.tv/u/nickytonline/settings/stream)

![Store past broadcast setting in Twitch stream VOD settings](https://www.iamdeveloper.com/images/posts/_uploads_articles_qxhxkf7zpa0cvxuyup2c.png) 

## Having Guests on Your Stream

There is no native way for guests to join a stream in OBS, so a third party application is required. These are the common ones that are out there:

- [Zoom](https://zoom.us)
- [Discord](https://discord.com)
- [VDO.Ninja](https://vdo.ninja/) (previously called OBS.Ninja)

### For Discussions

You should have one or more topics to discuss, but they do not need to be scripted. It should feel natural. I also tend to go on tangents sometimes. Maybe this is good, maybe it's bad. 🙃

## Extras

Here's some not necessarily crucial stuff for your stream, but some nice additions to spice up your stream.

![David Rose from Schitt's Creek saying he hasn't bedazzled anything since he was 22](https://media.giphy.com/media/l0JMiAGCP9IdtdVwk/giphy.gif)

- Add interactivity to your stream. A browser source in a scene that loads a page using [ComfyJS](https://github.com/instafluff/ComfyJS) is a great for this.
- Automate things as much as possible
  - Scheduled tweet that you’re going live
  - Use a stream deck if it’s in your budget. I bought one about a year into streaming.
- Use service like StreamLabs or [StreamElements](https://streamelements.com/) for moderation bots, interactivity, like when someone follows your stream.

## Additional software

Below is a list of additional software that can help you out during a stream or post-stream.

- [Loopback](https://rogueamoeba.com/loopback/), for merging audio or creating other virtual audio devices
- [descript](https://www.descript.com), for subtitles, removing filler words, and video editing if you plan on publishing your streams to YouTube
- [krisp](https://krisp.ai/), noise-cancelling software

## Hardware

Although not required when starting out with streaming, these are things you can add to your stream over time.

- Light ring
- An external microphone
- Better Web Cam or Camera
- Streaming Deck

{% twitter "1420685669479985152" %}

## Additional Resources

- [Web Captioner](https://webcaptioner.com/)
  - [Add live captions in OBS Studio](https://webcaptioner.com/help/integrations/obs)
- [Steve Seguin’s YouTube channel](https://www.youtube.com/c/SteveSeguin82) (creator of VDO.ninja)
- [The Invisible Zoom Streaming method](https://dev.to/chaelcodes/the-invisible-zoom-streaming-method-37ii) by [Rachael Wright-Munn](https://twitter.com/ChaelCodes)
- Pair Programming with Jhey (shows how to use ComfyJS)

{% youtube "DDJB8KSh-Sw" %}

- [livecoding.ca](https://livecoding.ca)’s [interactions using ComfyJS](https://github.com/nickytonline/dotca-bot)
- [My Uses Page](https://iamdeveloper.com/uses) (software and hardware I use)

And last but not least, some shameless plugs!

- [DEV Twitch Stream](https://www.twitch.tv/thepracticaldev)
- [DEV's YouTube](https://www.youtube.com/ThePracticalDevTeam)
- [My Stream](https://livecoding.ca)
- [My YouTube](https://youtube.iamdeveloper.com)

Until next time folks!
