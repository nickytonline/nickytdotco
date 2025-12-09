---json
{
  "title": "Advent of AI 2025 - Day 1: Getting Goose to Generate Daily Fortunes in CI",
  "excerpt": "I've edited this post, but AI helped. These are meant to be quick posts related to the Advent of AI....",
  "date": "2025-12-02T06:52:43.724Z",
  "tags": [
    "goose",
    "cli",
    "githubactions",
    "adventofai"
  ],
  "cover_image": "https://www.nickyt.co/images/posts/_dynamic_image_width=1000,height=420,fit=cover,gravity=auto,format=auto_https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2F3ucfgm92swzgfrlj2zr5.jpg",
  "canonical_url": "https://www.nickyt.co/blog/advent-of-ai-2025-day-1-getting-goose-to-generate-daily-fortunes-in-ci-3alp/",
  "reading_time_minutes": 3,
  "template": "post"
}
---

I've edited this post, but AI helped. These are meant to be quick posts related to the Advent of AI. I don't have time if I'm doing one of these each day to spend a couple hours on a post. 😅

The [advent of AI](https://adventofai.dev) series leverages Goose, and open source AI agent. If you've never heard of it, check it out!

{% embed "https://github.com/block/goose" %}

For [Day 1 of the Advent of AI challenge](https://adventofai.dev/challenges/1), I built a GitHub Action that uses the [Goose](https://github.com/block/goose) CLI to generate a daily fortune with ASCII art. I hadn't run Goose in CI before, so I got to level up there.

## What I Built

A scheduled workflow that:
- Runs daily at 6am ET
- Uses Goose with Claude Sonnet 4 (via OpenRouter) to generate creative random daily fortunes
- Creates ASCII art featuring a sassy goose
- Automatically commits updates to the README

Check out the repo to see today's daily fortune!

{% embed "https://github.com/nickytonline/advent-of-ai-2025" %}

## Getting Goose and CI to Play Nice

The goose installation script is great for local dev, but in CI? Not so much. It tries to run an interactive configuration step, which obviously doesn't work in GitHub Actions.

### Key Learnings

1. Instead of using the install script, I manually downloaded and extracted the binary:

    ```bash
    curl -fsSL https://github.com/block/goose/releases/download/stable/goose-x86_64-unknown-linux-gnu.tar.bz2 -o goose.tar.bz2
    tar -xjf goose.tar.bz2
    mkdir -p ~/.local/bin
    mv goose ~/.local/bin/
    ```

1. I created a `config.yaml` with environment variables at the root level:

    ```yaml
    GOOSE_PROVIDER: "openrouter"
    GOOSE_MODEL: "anthropic/claude-sonnet-4"
    keyring: false
    
    extensions:
      developer:
        bundled: true
        enabled: true
        name: developer
        timeout: 300
        type: builtin
    ```

    The `keyring: false` is critical for CI environments. [According to the documentation](https://block.github.io/goose/docs/tutorials/cicd/), when keyring is disabled, secrets should be stored in ~/.config/goose/secrets.yaml instead of your OS' keyring/keychain.

1. Complex prompts with nested quotes in bash wasn't working so I wrote the prompt to a temp file instead and use the `-i` (instruction) flag:

    ```bash
    cat > /tmp/prompt.txt << 'PROMPT_EOF'
    Create a Python script called generate_fortune.py...
    PROMPT_EOF
    
    goose run --no-session -i /tmp/prompt.txt
    ```

1. Goose is chatty. Redirecting output keeps the logs clean:

    ```bash
    goose run --no-session -i /tmp/prompt.txt > /dev/null 2>&1
    ```


## The Final Setup

The workflow now:

1. Installs Goose manually
2. Configures it for OpenRouter
3. Picks a random mood (sarcastic, wise, introspective, grumpy, or poetic)
4. Asks Goose to create/run a Python script that generates the fortune
5. Commits and pushes the updated README

## What's Next

This could probably be improved to create and commit the script only once and then the script could receive the mood and a prompt, but I was moving pretty fast. 😅

Also, my ASCII art is definitely not the Mona Lisa! 🤣 PRs welcome.

Not sure how far I'll get in the Advent of AI 2025, but so far it's fun and hopefully I can find a pocket of time each day to do it.

Even if you missed day one, still participate! Head on over to [AdventOfAI.dev](https://AdventOfAI.dev).

You can follow along with my [Advent of AI challenge](https://github.com/nickytonline/advent-of-ai-2025) or if you want to stay in touch, all my socials are on [nickyt.online](https://nickyt.online).

Until the next one!

Photo by <a href="https://unsplash.com/@jordynstjohn?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Jordyn St. John</a> on <a href="https://unsplash.com/photos/a-snow-globe-sitting-on-top-of-a-wooden-stand-2FgjreqKz4E?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
