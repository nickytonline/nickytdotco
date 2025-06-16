---json
{
  "title": "Getting McFly Working on Ubuntu Server",
  "excerpt": "McFly is a slick, Rust-powered shell history tool that supercharges your reverse search (Ctrl+R) with...",
  "date": "2025-05-26T10:00:00.000Z",
  "tags": [
    "linux",
    "ubuntu",
    "productivity",
    "tooling"
  ],
  "cover_image": "https://www.nickyt.co/images/posts/_dynamic_image_width=1000,height=420,fit=cover,gravity=auto,format=auto_https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2F5qa0p4uopclslrbfopki.jpg",
  "canonical_url": "https://www.nickyt.co/blog/getting-mcfly-working-on-ubuntu-server-without-losing-your-mind-2k5e/",
  "reading_time_minutes": 4,
  "template": "post"
}
---

[McFly](https://github.com/cantino/mcfly) is a slick, Rust-powered shell history tool that supercharges your reverse search (`Ctrl+R`) with fuzzy matching, ranking, and a modern UI. I've been using it for almost 4 years now. I wrote about it's benefits in [this tip on OneTipAWeek.com](https://one-tip-a-week.beehiiv.com/p/one-tip-a-week-what-s-up-mcfly) a while back.

I recently got a mini PC and decided to install some of the tools I normally use, like McFly. It's super easy to install McFly on an OS for a laptop/desktop, but on minimal environments like **Ubuntu Server**, it can silently fail even when it *looks* like it’s working. Ngl, I struggled lol. I thought it was just permissions, but it was a little more involved.

With that said, here's what you need to know to get it working on minimal environments like Ubuntu Server. I'm using Zsh, but if you're using a different shell, adjust accordingly.

## What Works Out of the Box

- McFly’s binary installs cleanly via `cargo install`
- The fuzzy search UI launches when you run `mcfly search`
- Zsh shell integration *can* be added with `source <(mcfly init zsh)`

## What Doesn’t Work (at First)

- McFly **doesn’t actually save your history** unless Zsh is correctly configured
- If you configure debugging for Mcfly, you might see messages like `mcfly.zsh: Run mcfly add --exit 0` and assume it’s working. It's not.

## Root Cause

McFly doesn’t log every command live. Instead, it hooks into your shell via `precmd_functions`, flushes your shell history with `fc -W`. If you're curious what that command is, `fc` is the "fix command" built-in traditionally used to edit and re-run commands from your shell history.

It then ingests your shell’s history file (`~/.zsh_history` by default since I'm using Zsh). 

If that file is empty or not being written to, McFly has nothing to work with.

This is *especially common* on minimal server setups like Ubuntu Server, where Zsh history settings aren’t configured at all.

## The Fix: Cargo and some Config

### Install Rust & McFly

McFly is written in Rust, so you’ll need Rust first. This is perfectly safe:

```
{% raw %}
curl https://sh.rustup.rs -sSf | sh
source "$HOME/.cargo/env"
{% endraw %}
```

Then install McFly via Cargo:

```
{% raw %}
cargo install mcfly --force
{% endraw %}
```

> 💡 **Avoid the McFly `install.sh` script**. While it might work fine on macOS or Ubuntu Desktop, it can silently fail on servers — skipping shell integration or writing files where your user doesn’t have permission. Cargo is predictable and reliable.

### Configure Zsh Properly

In your `~/.zshrc`, add the following:

```
{% raw %}
# Rust (if installed via rustup)
source "$HOME/.cargo/env"
export PATH="$HOME/.cargo/bin:$PATH"

# Zsh history settings (critical!)
export HISTFILE=~/.zsh_history
export HISTSIZE=10000
export SAVEHIST=10000
setopt INC_APPEND_HISTORY
setopt SHARE_HISTORY
setopt APPEND_HISTORY
setopt HIST_IGNORE_SPACE
setopt HIST_REDUCE_BLANKS

# McFly shell integration
source <(mcfly init zsh)

# Starship prompt (if used) — must come after McFly
eval "$(starship init zsh)"
{% endraw %}
```

If you're using [Starship](https://starship.rs/), why does its init script go after McFly's? Both Starship and McFly register Zsh hooks (precmd_functions). If Starship runs first, it can override McFly’s hooks unless you manually re-register them. By initializing Starship after McFly, both tools play nicely together.

### Verify It Works

1. Restart your shell:

    ```
{% raw %}
    exec zsh
    ```

1. Run a test command:

    ```
    echo "hello mcfly"
    fc -W
    ```

1. Then check:

    ```
    tail ~/.zsh_history
    ```

    You should see `echo "hello mcfly"`.

1. Finally, search via:

    ```
    mcfly search 
    ```
    
    or <kbd>CTRL</kbd> + <kbd>R</kbd>


    Start typing `hello` and you should see some results appear.


## Debug Mode

If you want to confirm McFly is running correctly, add this to your `~/.zshrc`:

{% endraw %}
```
export MCFLY_DEBUG=1
```
{% raw %}

You’ll start seeing lines like this in your terminal:

{% endraw %}
```
mcfly.zsh: Run mcfly add --exit 0
```

Note: this message **only means the hook was triggered**. It doesn’t guarantee the history file was written to or that the command was saved. Always confirm by checking that something was written to `~/.zsh_history`.

## Wrapping Up

Here’s a quick checklist to make sure McFly actually works:

- **Install with Cargo**  
  Reliable and builds from source

- **Configure Zsh history**  
  Without it, McFly has nothing to save

- **Use `source <(mcfly init zsh)`**  
  Hooks McFly into your shell prompt lifecycle

- **Put Starship *after* McFly**  (if you're using it)
  Avoids overwriting McFly’s hooks

- **Check `~/.zsh_history`**  
  It must contain your recent commands for McFly to pick anything up

- **Debug with `MCFLY_DEBUG=1`**  
  Helps you confirm if the hook is firing

Once it’s configured, McFly is the GOAT, even on a minimal Ubuntu Server. The key is making sure your shell is actually saving history before McFly tries to index it.

Want to connect? 
All my socials are at [nickyt.online](https://nickyt.online)

Photo by <a href="https://unsplash.com/@6heinz3r?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Gabriel Heinzer</a> on <a href="https://unsplash.com/photos/green-and-black-digital-device-xbEVM6oJ1Fs?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>
