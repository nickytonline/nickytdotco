---json
{
  "title": "I've Started to Live Code on Twitch for DEV",
  "excerpt": "Yesterday, I did my first official live coding on Twitch. If you're interested in following me on Twi...",
  "date": "2020-04-01T12:54:42.333Z",
  "tags": [
    "twitch",
    "streaming",
    "livecoding"
  ],
  "cover_image": "https://www.iamdeveloper.com/images/posts/_practicaldev_image_fetch_s--L53rXEkz--_c_imagga_scale,f_auto,fl_progressive,h_420,q_auto,w_1000_https:__dev-to-uploads.s3.amazonaws.com_i_4or5dqsjdsqzf3jfsr7t.png",
  "canonicalUrl": "https://www.iamdeveloper.com/posts/i-ve-started-to-live-code-on-twitch-for-dev-13cn/",
  "reading_time_minutes": 2,
  "template": "post"
}
---

Yesterday, I did my first official live coding on Twitch. If you're interested in following me on Twitch, I'm [nickytonline](https://www.twitch.tv/nickytonline) there as well.

It felt very natural live-coding. I talked to my audience pretty much the whole time. Thank you to the 12 people that watched. 👏🏻 My colleague @maestromac was kind enough to jump in on the chat to say hi.

We're in the second week of our development cycle at DEV, so I was working on building out some Preact components to build out our new comment subscription component.

I haven't decided on the frequency of live-coding yet, but I'm hoping to do it at least twice a week.

The rest of this article will assume you are on macOS, but I imagine the process is pretty much the same.

If you are new to streaming like me, the defacto tool appears to be [OBS Studio](https://obsproject.com).

Before installing OBS, ensure that Twitch is set up correctly. Assuming you've created your Twitch account, navigate to your channel settings, e.g. https://dashboard.twitch.tv/u/nickytonline/settings/channel

![Twitch Channel Settings](https://www.iamdeveloper.com/images/posts/_i_d82fvqzkqo6jda6jwste.png)

Two things to note here. One, you will need to copy the Primary Stream Key. This is required for OBS so that it can stream to Twitch. The other thing to note is that *Store past broadcasts* should be enabled (assuming you want to save your broadcasts). I forgot to do this initially. Since most will have a free account, broadcasts are stored for up to 14 days and then scrapped.

Once OBS is installed, go to the OBS preferences and add your Twitch Primary Stream Key.

![Adding Twitch API key to OBS stream preferences](https://www.iamdeveloper.com/images/posts/_i_qwdarbwg14rfv2grm3x9.png)

When you load up OBS you are presented with a blank scene. The scene is what you will use to place your webcam in the stream as well as your display output. You can add a lot more to it, but let's keep things simple.

If you are going to stream, you absolutely need a second monitor. I run OBS on my laptop screen and the display capture is my external monitor. If you're interested in my setup, check out my [uses](https://www.iamdeveloper.com/uses/) page.

I got everything set up but noticed my display source in the scene was completely black. I was Googling to see if it was a macOS version, a hardware issue, etc.

![OBS display source showing a black screen](https://www.iamdeveloper.com/images/posts/_i_tlh0xcnanhfbpfpljx97.png)

It turns out it was just a setting in the Security & Privacy system preferences. Ensure that OBS has access to Screen Recording.

![Grant access to Screen Recording under Security & Privacy for OBS](https://www.iamdeveloper.com/images/posts/_i_fd59j6ejad2gpywybjna.png)

![OBS display source working](https://www.iamdeveloper.com/images/posts/_i_buqf8e5u5gt4oqixxsed.png)

From there as soon as you are ready to stream on Twitch, simply click the *Start Streaming* button in the Controls section at the bottom right of the OBS window.

Happy streaming!

UPDATE APR 3, 2020:

{% twitter "1246102255620829184" %}
