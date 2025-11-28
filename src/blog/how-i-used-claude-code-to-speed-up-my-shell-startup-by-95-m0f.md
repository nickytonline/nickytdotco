---json
{
  "title": "How I Used Claude Code to Speed Up My Shell Startup by 95%",
  "excerpt": "My terminal was sluggish. Every time I opened a new tab, there was this annoying delay before I could...",
  "date": "2025-11-27T21:22:59.161Z",
  "tags": [
    "ai",
    "zsh",
    "bash",
    "productivity"
  ],
  "cover_image": "https://www.nickyt.co/images/posts/_dynamic_image_width=1000,height=420,fit=cover,gravity=auto,format=auto_https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Fqix8wncv76im46bvrhxp.jpg",
  "canonical_url": "https://www.nickyt.co/blog/how-i-used-claude-code-to-speed-up-my-shell-startup-by-95-m0f/",
  "reading_time_minutes": 4,
  "template": "post"
}
---

My terminal was sluggish. Every time I opened a new tab, there was this annoying delay before I could start typing. I decided to dig into it, and with Claude Code's help, I went from a **770ms startup time to just 40ms**. That's a 19x improvement.

## The Problem

It wasn't that I accumulated too much tooling. Most things I have in my .zshrc, I needed, but each thing I tacked on added to my shell startup time. I honestly hadn't looked into this and just lived with it. Then, John Lindquist posted this the other day so I figured, let Claude Code speed it up for me.

{% embed "https://x.com/johnlindquist/status/1993037322984866168" %}

## Measuring the Baseline

First thing I needed to know how bad it actually was:

```bash
{% raw %}
for i in 1 2 3 4 5; do /usr/bin/time zsh -i -c exit 2>&1; done
{% endraw %}
```

Yikes:

```bash
{% raw %}
0.94 real
0.71 real
0.74 real
0.73 real
0.72 real
{% endraw %}
```

**Average: ~770ms per shell startup.** Almost a full second just to open a terminal. Not good.

## What Was Slowing Things Down

Claude Code helped me identify the main culprits:

| Tool | Impact | Why It Sucks |
|------|--------|--------------|
| nvm | ~300-500ms | Loads the entire Node.js environment every time |
| pyenv init | ~100-200ms | Python version management initialization |
| security command | ~50-100ms | Fetching API key from macOS Keychain |
| brew shellenv | ~30-50ms | Runs a subshell to get Homebrew paths |
| gcloud completion | ~20-30ms | Google Cloud completions |

## The Big Unlock: Lazy Loading

Most of the tools don't need to be loaded until I actually use them. So defer the expensive stuff until the first time I run a command.

### Self-Destructing Wrappers to the Rescue

This is the clever part. Thanks Claude Code. The wrapper functions remove themselves after first use:

1. **First call**: Wrapper runs, does the slow initialization, then deletes itself
2. **After that**: Direct execution, zero overhead

You only pay the cost once per session.

### nvm Lazy Loading

Instead of this slow startup code:

```bash
{% raw %}
# Before: runs every shell startup (~400ms)
[ -s "/opt/homebrew/opt/nvm/nvm.sh" ] && \. "/opt/homebrew/opt/nvm/nvm.sh"
nvm use default --silent
{% endraw %}
```

now, I use wrapper functions:

```bash
{% raw %}
# After: only runs when you actually need node/npm/npx
nvm() {
  unset -f nvm node npm npx
  [ -s "/opt/homebrew/opt/nvm/nvm.sh" ] && \. "/opt/homebrew/opt/nvm/nvm.sh"
  [ -s "/opt/homebrew/opt/nvm/etc/bash_completion.d/nvm" ] && \. "/opt/homebrew/opt/nvm/etc/bash_completion.d/nvm"
  nvm "$@"
}
node() { nvm use default --silent; unfunction node npm npx; node "$@"; }
npm() { nvm use default --silent; unfunction node npm npx; npm "$@"; }
npx() { nvm use default --silent; unfunction node npm npx; npx "$@"; }
{% endraw %}
```

The `unset -f` and `unfunction` commands remove the wrapper after first use. After that, it's like the tools were loaded normally.

### pyenv Gets the Same Treatment

```bash
{% raw %}
# Before
eval "$(pyenv init -)"

# After
pyenv() {
  unset -f pyenv
  eval "$(command pyenv init -)"
  pyenv "$@"
}
{% endraw %}
```

First `pyenv` call takes ~150ms to initialize, then it's direct execution forever.

### Google Cloud SDK

```bash
{% raw %}
gcloud() {
  unset -f gcloud gsutil bq
  [ -f '/Users/yolo/.local/google-cloud-sdk/path.zsh.inc' ] && \
    . '/Users/yolo/.local/google-cloud-sdk/path.zsh.inc'
  [ -f '/Users/yolo/.local/google-cloud-sdk/completion.zsh.inc' ] && \
    . '/Users/yolo/.local/google-cloud-sdk/completion.zsh.inc'
  gcloud "$@"
}
gsutil() { gcloud; gsutil "$@"; }
bq() { gcloud; bq "$@"; }
{% endraw %}
```

### Homebrew Caching

Homebrew's environment doesn't change often, so just cache it:

```bash
{% raw %}
# Before: subshell every time
eval "$(/opt/homebrew/bin/brew shellenv)"

# After: cache to file, only regenerate if brew changes
if [[ ! -f ~/.zsh_brew_cache || ~/.zsh_brew_cache -ot /opt/homebrew/bin/brew ]]; then
  /opt/homebrew/bin/brew shellenv > ~/.zsh_brew_cache
fi
source ~/.zsh_brew_cache
{% endraw %}
```

### API Key Laziness

I was hitting the macOS Keychain on every shell startup:

```bash
{% raw %}
# Before: slow keychain lookup every time
export OPENAI_API_KEY=$(security find-generic-password -a $USER -s openai_api_key -w)
{% endraw %}
```

Since I only need this for npm stuff, I moved it into the npm wrapper:

```bash
{% raw %}
npm() {
  nvm use default --silent
  unfunction node npm npx
  [ -z "$OPENAI_API_KEY" ] && \
    export OPENAI_API_KEY=$(security find-generic-password -a $USER -s openai_api_key -w)
  npm "$@"
}
{% endraw %}
```

More on the [macOS Keychain tip in my newsletter](https://one-tip-a-week.beehiiv.com/p/one-tip-a-week-securely-load-secrets-from-your-keychain).

## Other Quick Wins

I also cleaned up some basic stuff:
- Combined 7 different PATH modifications into one line
- Removed duplicate `GPG_TTY` exports
- Fixed ordering so `STARSHIP_CONFIG` gets set before `starship init`

## The Results

After all the changes:

```bash
{% raw %}
for i in 1 2 3 4 5; do /usr/bin/time zsh -i -c exit 2>&1; done
{% endraw %}
```

```bash
{% raw %}
0.06 real
0.04 real
0.04 real
0.03 real
0.04 real
{% endraw %}
```

**Average: ~40ms**

| Before | After | Improvement |
|--------|-------|-------------|
| 770ms | 40ms | **95% faster** |

## The "Trade-off", Not Really

Yeah, there's a one-time cost when you first use each tool:
- First `node`/`npm`/`npx`: +400ms
- First `pyenv`: +150ms  
- First `gcloud`: +50ms

But it's once per terminal session and honestly barely noticeable compared to what the commands actually do.

## Try It

If your shell is slow, first measure the total startup time:
```bash
{% raw %}
time zsh -i -c exit
{% endraw %}
```

If it's over 200ms, you've got room to improve. To see exactly what's slow, profile your .zshrc or whatever shell you're using:

```bash
{% raw %}
# Add to top of .zshrc
zmodload zsh/zprof

# Add to bottom
zprof
{% endraw %}
```

This breaks down which specific commands are eating up your startup time.

## Wrapping Up

Dev tooling adds up fast and it's easy to not notice the death by a thousand paper cuts. This lazy loading pattern fixes it without any real downsides.

Big ups to John L. and Claude Code for helping me figure out the bottlenecks and solutions.

Note: The performance impact numbers and comparison table were generated with Claude Code's help. Mileage may vary depending on your specific setup. 😅

If you want to stay in touch, all my socials are on [nickyt.online](https://nickyt.online).

Until the next one!

Photo by <a href="https://unsplash.com/@marcsm?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Marc Sendra Martorell</a> on <a href="https://unsplash.com/photos/time-lapsed-of-street-lights--Vqn2WrfxTQ?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
