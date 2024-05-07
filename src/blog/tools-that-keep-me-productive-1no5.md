---json
{
  "title": "Tools that keep me productive",
  "excerpt": "This page details mostly all I use as a developer. I use a Mac, so a bunch of tools are...",
  "date": "2024-05-06T05:00:00.000Z",
  "tags": [
    "productivity",
    "webdev",
    "vscode"
  ],
  "cover_image": "https://www.nickyt.co/images/posts/_cdn-cgi_image_width=1000,height=420,fit=cover,gravity=auto,format=auto_https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Ffp8ih049mqfs4032ior5.png",
  "canonical_url": "https://www.nickyt.co/blog/tools-that-keep-me-productive-1no5/",
  "reading_time_minutes": 7,
  "template": "post"
}
---

This page details mostly all I use as a developer. I use a Mac, so a bunch of tools are macOS-specific, but there are some OS-agnostic ones in the list.

One thing to mention before we get started is that these are the tools that make me productive. Maybe they won't make you productive like the way they do for me. I always say, <em>use the tools that make you the most productive</em>.

Some of these tools are free but some are paid. I personally think the paid ones are worth it, but I leave that up to you and your wallet.

_Note: I've put some referral links in here. Just want to be upfront about that is all._

## Editor

It all starts with the editor. [Visual Studio Code](https://code.visualstudio.com/) (VS Code) is my go-to editor. I was using the [Insider’s Edition](https://code.visualstudio.com/insiders/) for the longest time, but some extensions would try to log in and redirect to VS Code regular edition, so I decided to go back to it. That said, VS Code Insider's is very stable.

I was a big fan of the Dank Mono for the longest time, but GitHub released a bunch of monospaced fonts this year and I've been loving [Monaspace Krypton](https://monaspace.githubnext.com/).

For the theme, it varies. I've been on the default light modern recently as I find it's better for [my live streaming](https://nickyt.live), but I'm also a fan of the [Houston](https://marketplace.visualstudio.com/items?itemName=astro-build.houston) and [Fortnite](https://marketplace.visualstudio.com/items?itemName=sdras.fortnite-vscode-theme) themes.


[![Me when I tell them I use a dark theme in my editor.](https://www.nickyt.co/images/posts/_uploads_articles_52lbfjxugvqsj017c5e5.png)](https://x.com/nickytonline/status/1787621116636221727)

Although I have [iTerm](https://iterm2.com/) installed, a great terminal for macOS, I honestly live in the VS Code terminal 99.999% of the time.

### Editor Settings

If you're interested in my editor settings, [here's my current settings](https://gist.github.com/nickytonline/e6ceb17a1fb7b6438c3f09ff800748da).

One of the more fun ones is you can change the title bar, so I've added some emojis to mine.

```json
{% raw %}
  "window.title": "🦙⚡🫡 – ${activeEditorShort}${separator}${rootName} – 🫡⚡🦙",
{% endraw %}
```

![An alpaca floating through a rainbow](https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbzQ1NzBodWZuam84b2FlYmV1a3o5cHRhYzZqcGp6bHVoYWNra2ZsZSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/tZB5MG7OOPuZIAcPZZ/giphy.gif)

Another setting that I find super handy is `terminal.integrated.autoReplies`. I never want to source my .env file and this handles it perfectly.

```json
{% raw %}
  "terminal.integrated.autoReplies": {
    "dotenv: found '.env' file. Source it? ([Y]es/[n]o/[a]lways/n[e]ver)": "e\r"
  },
{% endraw %}
```

### Maybe Zed Soon?

I do want to give a shout out to the [Zed](https://zed.dev/) editor. I use it occasionally and it’s super fast, but it hasn’t become my main editor yet. I think once the extension ecosystem blows up a little more is when I move to this. Maybe in the next year. We’ll see. 😎

## Browser Extensions

I don't use all of these everyday, but these are my go-to browser extensions.

- [Refined GitHub](https://chrome.google.com/webstore/detail/refined-github/hlepfoohegkhhmjieoechaddaejaokhf) - GitHub on steroids
- [VisBug](https://chrome.google.com/webstore/detail/visbug/cdockenadnadldjbbgcallicgledbeoc?hl=en) - A fantastic tool for frontend (this one’s new for me) (only for Chromium-based browsers)
- [React DevTools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en) - Because React
- [Preact DevTools](https://preactjs.github.io/preact-devtools/) - Because Preact
- [Axe](https://chrome.google.com/webstore/detail/axe-web-accessibility-tes/lhdoppojpmngadmnindnejefpokejbdd) - For web accessibility testing
- [WAVE](https://wave.webaim.org/extension/) - For web accessibility testing
- [HTTPS Everywhere](https://www.eff.org/https-everywhere)
- [uBlock](https://ublock.org/)
- [LanguageTool](https://languagetool.org) - A grammar and spell checking tool
- [Pocket](https://getpocket.com/) - For bookmarking stuff to read
- [JSONView](https://chrome.google.com/webstore/detail/jsonview/chklaanhfefbnpoihckbnefhakgolnmc) - A prettified view of JSON payloads
- [Tweak New Twitter](https://github.com/insin/tweak-new-twitter/) - Gets rid of a lot of noise in the Twitter UI
- [a11y Twitter](https://github.com/nickytonline/a11y-twitter) - Small changes to how you use Twitter to promote Tweeting in an accessible manner.

## Desktop Apps

These are most of the desktop apps that I use every day. Let's get started with some general ones.


### General Tools for Common Things I do Everyday

[Arc Browser](https://arc.net/gift/93e342bc) is a Chromium-based browser that, in my opinion, has nailed a tonne of the user experience (UX) issues I've encountered with any other browsers. Vertical tabs, command palette, and auto-picture in picture video to name a few.

I used [Vanilla](https://matthewpalmer.net/vanilla/) for the longest time for my top menu bar icons, but once I got a MacBook Pro with the notch, it just didn't work well. I've since moved on to [Bartender](https://www.macbartender.com) for managing my menu bar.

The emoji picker on macOS isn't that great, but [Rocket](https://matthewpalmer.net/rocket/) makes it so easy to add emojis. I can't tell you how many times a day I use this.

[Raycast](https://raycast.com) is my go-to replacement for macOS' spotlight. It's like Spotlight on steroids. I previously used [Alfred](https://www.alfredapp.com/), another outstanding Spotlight alternative, but for some reason Raycast grew on me. I also use it for window management.

For those evenings where I'm in front of the computer, [f.lux](https://justgetflux.com/) is a must. Like some wise person said, "Be kind to your eyeballs". macOS's [Nightshift](https://support.apple.com/en-ca/102191) kind of works, but f.lux destroys it.

For managing meetings, [Dato](https://sindresorhus.com/dato) is a better date app for macOS. It's great for having multiple time zones in the address bar. I have my local time as well as UTC. I also use it for upcoming meetings and events. Previously I was using [Meeter](https://trymeeter.com) which is great for this, but it's one less app I need now.

I take screenshots or short video recordings almost daily, and [Cleanshot X](https://cleanshot.com/) is so great for this.

### Tools for Git

I do most of my "git"ing on the command line, but sometimes I need a graphical user interface (GUI) to really understand what's going on. When I need that, I reach for [Fork](https://git-fork.com/).

![Cassidy demonstrating squash, rebase and merge](https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExd3hscnE3bjlucm93aDJ2YjF1cjNkemQzNWcwc28yY2g4eG8yZjA1eCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/zQOmyYc8TXzSBfrTFb/giphy.gif)

Shoutout to Cassidy (@cassidoo) for the awesome GIF!

If you're using Git, which I imagine most of you are, [signing your commits](https://docs.github.com/en/authentication/managing-commit-signature-verification/signing-commits) is super important. [GPG Suite](https://gpgtools.org/) makes this easy to set up.

### Frontend Tooling

I do a lot of work building user interfaces (UIs) and these are some indispensable tools for that kind of work.

[xScope](https://xscope.app) is a fantastic tool set for frontend development. Rulers, guides etc.

[Figma](https://www.figma.com/) is where I live when I need to coordinate with our designer, look at designs, or pull some assets.

I had heard about [Polypane](https://polypane.app/) before and I think I may have tried it a few years ago, but nowadays, It's a must for frontend. It helps you build out responsive, accessible apps with all kinds of goodies. Curious about it? I hung out with the creator of Polypane, Kilian Valkhof (@kilianvalkhof), on a live stream earlier this year.

{% embed "https://www.youtube.com/watch?v=fsIhghVlHJE" %}

For color contrast issues, TPGi's [Color Contrast Analyzer](https://www.tpgi.com/color-contrast-checker/) is top tier. I can't recommend it enough. Thanks to Todd Libby (@colabottles) for recommending this to me last year.


### Other Desktop Apps I Use

- [Cloudflare Warp](https://blog.cloudflare.com/1111-warp-better-vpn/) - Faster Internet and some VPN goodness
- [Plash](https://apps.apple.com/us/app/plash/id1494023538) - An interactive desktop background (one or more web pages) for your Mac
- [CleanMyMac X](https://macpaw.com/cleanmymac) - A suite of utilities for keeping your Mac in tip-top shape.
- [Starship](https://starship.rs/) - A cross shell prompt

## Live Streaming Software

I'm sure there are streamers with bigger audiences that have a better setup, but this is how I roll.

[Restream.io](https://restream.io/join/zZ8Wr) is what I use to stream to multiple platforms, currently Twitch, YouTube, X/Twitter, and LinkedIn.

[OBS](https://obsproject.com/download) is used by many including myself. It's a great piece of open source software. I use it for streaming instead of Restream Studio or similar tools like Streamyard because I have custom overlays and some other customizations.

{% embed "https://github.com/obsproject/obs-studio" %}

[Krisp](https://krisp.ai/) is outstanding for filtering out unwanted noise on calls and streams. Say goodbye to fire engines in the background while you stream. 🤣

I use [Loopback](https://rogueamoeba.com/loopback/) for virtual audio sources. This is super helpful because I create an audio source, which is my microphone and the guest's (guests') audio, and treat it as one input source. I use this audio source as the audio source for live captioning.

I don't have a fancy camera for streaming. I used to use my Logitech webcam, which was fine, but when I finally got a decent iPhone, I was like the camera on this is amazing! So I decided to use that for live streaming. [Camo](https://reincubate.com/camo/) makes it possible to do that, and it has plenty of niceties like zooming, watermarks, filters, etc.

### Tools for Live Streaming Guests

For the longest time, I couldn't figure out how people brought guests on to livestreams. In my early days of streaming, I used to bring in the full Discord screen and share that on my live stream. Although that worked, it was not ideal. I also tried Zoom similarly, and then I also started cropping parts of Zoom on my screen, but again, not ideal.

Eventually, I discovered [vdo.ninja](https://vdo.ninja/). The TLDR is, it uses peer-to-peer technology to bring remote cameras into OBS or other studio software.

{% embed "https://github.com/steveseguin/vdo.ninja" %}

It's a fantastic project and I highly recommend it. If your guest has a Twitch account, another similar piece of software is Twitch's [Stream Together](https://help.twitch.tv/s/article/stream-together-host-guide?language=en_US). I use this as well, depending on the guest.

## Command Line Interface (CLI) Tools

I don't have many CLI tools, but here are some of my go-to ones:

- [Homebrew](https://brew.sh) - The Missing Package Manager for macOS (or Linux)
- [GitHub CLI](https://github.com/cli/cli) - GitHub on the command line. Great for creating PRs, etc.

{% embed "https://dev.to/opensauced/boost-productivity-with-the-github-cli-2mne" %}

- [nvm](https://github.com/nvm-sh/nvm) - Node version manager
- [cloudflared](https://github.com/cloudflare/cloudflared) - Exposes local servers to the public internet over secure tunnels

If you're curious about the reset of my setup like hardware and office setup or what I bring when I'm on the go, feel free to check out [my uses page](https://nickyt.co/uses).

Until the next one!
