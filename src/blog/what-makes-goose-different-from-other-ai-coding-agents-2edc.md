---json
{
  "title": "What Makes Goose Different From Other AI Coding Agents",
  "excerpt": "I just finished Goose's Advent of AI. Everything from CI automation to hand-gesture controlled apps...",
  "date": "2025-12-29T05:43:03Z",
  "tags": [
    "goose",
    "ai",
    "agents",
    "cli"
  ],
  "cover_image": "https://www.nickyt.co/images/posts/_dynamic_image_width=1000,height=420,fit=cover,gravity=auto,format=auto_https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2F6yvhgeh5smo5its2ryjl.png",
  "canonical_url": "https://www.nickyt.co/blog/what-makes-goose-different-from-other-ai-coding-agents-2edc/",
  "reading_time_minutes": 12,
  "template": "post"
}
---

I just finished Goose's [Advent of AI](https://adventofai.dev/). Everything from CI automation to hand-gesture controlled apps to model context protocol (MCP) servers with UI.

![Me testing out my hand gesture project](https://www.nickyt.co/images/posts/_uploads_articles_mpc0zvsraivv3qvkf4xu.png)

I built almost all of these challenges in Goose - mostly in the GUI at first, shifting to the CLI as I learned more. Occasionally I'd jump to Claude to finish something, but Goose was my primary development environment. My workflow: convert the challenge to a PRD (sometimes with an evaluation rubric for complex projects), then implement it.

After building with it daily for over two weeks, I can tell you what makes Goose different. But first, the baseline.

## The Table Stakes Stuff

Goose does all the things you expect an AI agent to do. A GUI with a chat UI, a CLI, and like some other agents, it's model-agnostic (works with any LLM provider including local models).

![Goose chat UI](https://www.nickyt.co/images/posts/_uploads_articles_2j67b1zxr39c1f4gdcci.png)

![Model modal](https://www.nickyt.co/images/posts/_uploads_articles_8jqapgv6kvetjuoxix4s.png)

It also has first class support for MCPs, chat history, named sessions, [subagents for parallel task execution](https://block.github.io/goose/docs/guides/subagents/), [skills for custom context](https://block.github.io/goose/docs/guides/context-engineering/using-skills/), and like a lot of great software, it's open source.

{% embed "https://github.com/block/goose" %}

Most of these features aren't unique. OpenCode (also open source), Cursor, Copilot, Claude Code, and Windsurf all have most of these capabilities too.

If that's all Goose offered, this wouldn't be worth writing about.

## What Actually Makes Goose Different

Goose isn't competing with Cursor's autocomplete or Copilot's inline suggestions. It's a different category. Think build system for agent behavior, not better IDE integration.

After all that daily use, three things stand out.

### Recipes: Reusable AI Workflows

Most AI tools give you saved prompts or templates. Goose recipes are structured workflow definitions with actual capabilities.

For [day 9](https://dev.to/nickytonline/advent-of-ai-2025-day-9-building-a-gift-tag-generator-with-goose-recipes-3i73) and [day 15](https://dev.to/nickytonline/advent-of-ai-2025-day-15-goose-sub-recipes-3mnd) of Advent of AI, I built projects that used [recipes](https://block.github.io/goose/docs/guides/recipes/) and [sub-recipes](https://block.github.io/goose/docs/guides/recipes/subrecipes/).

Here's what recipes actually give you:

- Parameter passing between workflow stages - Define `{{event_name}}` once, use it everywhere
- Sub-recipe composition - Call instagram-post.yaml, twitter-thread.yaml, facebook-event.yaml from one parent recipe
- Environment extensions - Recipes automatically get access to globally configured MCP servers and built-in extensions
- Explicit extension specification - Pin specific MCP servers/tools for a recipe (supported in only YAML at the moment)
- Structured inputs - Define parameters with types, requirements, descriptions

Here's what this looks like. A social media campaign recipe ([Advent of AI day 15](https://www.nickyt.co/blog/advent-of-ai-2025-day-15-goose-sub-recipes-3mnd/)) that orchestrates three platform-specific sub-recipes:

![Recipe UI showing parameters](https://www.nickyt.co/images/posts/_uploads_articles_8jqapgv6kvetjuoxix4s.png)

The full YAML structure:

```yaml
{% raw %}
version: 1.0.0
title: Social Media Campaign Generator
description: Generate complete cross-platform social media campaign using sub-recipes
instructions: |
  You are a social media campaign coordinator creating a comprehensive multi-platform campaign.

  Generate a complete social media campaign for the following event:
  - event_name: {{event_name}}
  - event_date: {{event_date}}
  - event_description: {{event_description}}
  - target_audience: {{target_audience}}
  - call_to_action: {{call_to_action}}

  Campaign Strategy:
  Execute the following sub-recipes to create platform-specific content:

  1. Instagram Content: Run the instagram-post.yaml recipe
  2. Twitter/X Thread: Run the twitter-thread.yaml recipe
  3. Facebook Event: Run the facebook-event.yaml recipe

  [Format and present complete campaign organized by platform]

prompt: Generate complete social media campaign for {{event_name}}

sub_recipes:
  - name: "instagram_content"
    path: "./instagram-post.yaml"
    values:
      event_name: "{{event_name}}"
      event_date: "{{event_date}}"
      event_description: "{{event_description}}"
      target_audience: "{{target_audience}}"
      call_to_action: "{{call_to_action}}"
  - name: "twitter_content"
    path: "./twitter-thread.yaml"
    values:
      event_name: "{{event_name}}"
      event_date: "{{event_date}}"
      event_description: "{{event_description}}"
      target_audience: "{{target_audience}}"
      call_to_action: "{{call_to_action}}"
  - name: "facebook_content"
    path: "./facebook-event.yaml"
    values:
      event_name: "{{event_name}}"
      event_date: "{{event_date}}"
      event_description: "{{event_description}}"
      target_audience: "{{target_audience}}"
      call_to_action: "{{call_to_action}}"

parameters:
  - key: event_name
    input_type: string
    requirement: required
    description: Name of the festival event
  - key: event_date
    input_type: string
    requirement: required
    description: When the event is happening
  - key: event_description
    input_type: string
    requirement: required
    description: What the event is about
  - key: target_audience
    input_type: string
    requirement: required
    description: Who should attend
  - key: call_to_action
    input_type: string
    requirement: required
    description: What you want people to do
{% endraw %}
```

When you run this recipe, Goose executes each sub-recipe with the same parameters. Each sub-recipe handles its platform's specifics. The parent recipe just coordinates.

You can also pin which MCP extensions a recipe should use. This is currently only available in YAML (not the UI), but it's powerful for reproducible workflows. This guarantees the recipe runs with specific tools, regardless of what's in your global config.

Here's a more typical engineering workflow. Generating weekly status updates by querying Linear, GitHub, and Notion:

```yaml
{% raw %}
version: '1'
title: Weekly Status Update
description: Generate a weekly engineering status update
instructions: |
  You are an expert at generating concise and informative weekly status updates for software engineers based on their actual work activity.
  Generate a weekly status update for Nick Taylor covering work from last week and plans for next week.

  **Time Windows (Eastern Time):**
  - Last week: Previous Monday-Friday relative to today (Thursday)
  - Next week: Coming Friday + following Monday-Friday

  **Required Data Sources:**

  - **Linear**: Search issues created/updated by Nick in the time window
  - **GitHub**: Search PRs, commits, issues by Nick in the time window
  - **Notion** (if available): Search pages created/updated by Nick

  **Critical Requirements:**

  1. Each "What I did last week" bullet MUST reference a specific artifact (PR, issue, commit, page)
  2. If no tool data available, state: [No MCP tool available]
  3. If tool returns nothing, state: [No activity found]
  4. Include direct links to all artifacts

  **Output Format:**

  - What I did last week
    - [Specific accomplishment with link]

  - What it impacted
    - [Concrete outcome]

  - What I plan to do next week
    - [Specific planned work]

  - Where I need support
    - [Blockers or dependencies, or "None"]

  **Rules:**
  - No clarifying questions
  - No preambles or commentary
  - Only show Nick's work (individual or collaborative)
  - Be concrete and specific
  - Light weeks are okay - don't pad content
prompt: |
  get my weekly status update
extensions:
- type: streamable_http
  name: linear
  description: Linear issue tracking
  uri: https://mcp.linear.app/mcp
  envs: {}
  env_keys: []
  headers: {}
  timeout: 60
  bundled: null
  available_tools: []
- type: streamable_http
  name: notion
  description: Notion workspace
  uri: https://mcp.notion.com/mcp
  envs: {}
  env_keys: []
  headers: {}
  timeout: 60
  bundled: null
  available_tools: []
- type: streamable_http
  name: github
  description: GitHub mcp
  uri: https://api.githubcopilot.com/mcp/
  envs: {}
  env_keys: []
  headers: {}
  timeout: 60
  bundled: null
  available_tools: []
activities: []
parameters: []
{% endraw %}
```

You can also make a recipe a slash command.

![Configuring a recipe as a slash command](https://www.nickyt.co/images/posts/_uploads_articles_jb8c6k5dc8f8czc5z640.png)

With that set up, if I want to get my weekly status update, all I need to do is run `/weekly-status` in the GUI or REPL and get a formatted report with links to the issues, pull requests etc.

#### Recipes + Subagents: Parallel Workflows

[Subagents](https://block.github.io/goose/docs/guides/subagents/) are table stakes (other tools have them), but recipes give you infrastructure to orchestrate them effectively. Here's a video processing recipe that spawns 4 parallel subagents:

```yaml
{% raw %}
version: 1.0.0
title: Video Tools
description: A set of tools for processing videos
instructions: |
  You are a video processing assistant
  
  Process {{video_file}} with real-time progress updates.
  
  STEP 1 - Immediate acknowledgment:
  Run: echo "🎬 Processing video: {{video_file}}" | tee /dev/tty
  STEP 2 - Check dependencies (ffmpeg, ffprobe)
  STEP 3 - Analyze video (duration, resolution, codec, audio presence)
  STEP 4 - Launch parallel subagents:
  
  === SUBAGENT 1: Smart Compression ===
  - Analyze video type (screencast vs camera footage)
  - Choose optimal CRF value (18-28 range) based on content
  - Adjust resolution if beneficial (4K→1080p for screencasts)
  - Compress with ffmpeg: -c:v libx264 -crf [chosen] -preset medium
  - Output: {{video_file}}_compressed.mp4
  - Report before/after sizes and compression ratio
  
  === SUBAGENT 2: Intelligent Thumbnails ===
  - Detect video content type
  - For screencasts: extract at 20%, 40%, 60%, 80%, 100% intervals
  - For camera footage: use ffmpeg scene detection for key frames
  - Generate 5 thumbnails at 320px width
  - Output: {{video_file}}_thumb_1.jpg through _thumb_5.jpg
  
  === SUBAGENT 3: Audio Extraction (ONLY IF AUDIO DETECTED) ===
  - Extract audio using ffmpeg: -c:a libmp3lame -q:a 2
  - Output: {{video_file}}_audio.mp3
  - Report audio file size and bitrate
  
  === SUBAGENT 4: Transcription & Analysis (ONLY IF AUDIO DETECTED) ===
  - Run: uv run --with openai-whisper whisper {{video_file}} --model base
  - Output: .txt, .srt, .vtt, .tsv, .json caption files
  - Analyze transcript: word count, speaking pace, content type
  - Brief content summary
  
  STEP 5 - Monitor subagents and report completions immediately
  STEP 6 - Final summary with all generated files

prompt: process {{video_file}}

parameters:
  - key: video_file
    input_type: string
    requirement: required
    description: The video file to optimize
{% endraw %}
```

Each subagent runs independently with progress updates via `echo | tee /dev/tty`. The recipe coordinates them, handles failures gracefully (if compression fails, you still get thumbnails), and provides a unified summary.

Without recipes, you'd have a saved prompt where you manually edit the filename each time: "Process my-video.mp4 by spawning 4 subagents..." Want to process a different video? Find and replace the filename, hope you didn't miss one. Want to share this workflow with a teammate? Send them your entire conversation.

With recipes: `/video-tools any-file.mp4` and share it with a URL: `goose://recipe?config=...`

Recipes are parameterized, versionable (if you want), and shareable as standalone workflows.

Why this matters architecturally:

Without recipes, you'd copy-paste prompts and manually pass values between steps. With recipes:
- Version control - YAML in git means you can diff changes, revert mistakes
- Team sharing - Your team uses the exact same workflow, not "here's a prompt I used once"
- Composition - Build complex workflows from simple, tested building blocks
- Debugging - Each sub-recipe runs independently, so you can test in isolation

This is different from "I saved a good prompt." This is workflow infrastructure.

How this differs from .cursor/rules or custom instructions:

Most AI coding tools support rules in some form - Cursor has `.cursor/rules`, Cline has `.clinerules`, and there's the `AGENTS.md` standard that works across tools. These are project-specific prompting guidelines. They improve how the agent understands your codebase and preferences, but they're not reusable workflows.

The difference: Rules files tell the agent "when you write code in this project, follow these patterns." Recipes say "execute these specific steps in this order with these parameters." One is better prompting. The other is workflow orchestration.

Put simply: Rules change how the agent behaves. Recipes change what the agent does.

You can't compose rules files together, pass parameters between them, or run them as isolated workflows. They're context for better prompting, not executable infrastructure.

Compare this to slash commands in other tools. Those are saved prompts with placeholders. They can't orchestrate multi-stage workflows, adjust parameters between stages, or compose with other workflows.

### MCP-UI Rendering Support

Most MCP client implementations render tool responses as text. Goose's GUI can also render [MCP-UI](https://mcpui.dev/) components as actual interactive widgets.

On Day 17 of Advent of AI, I [built a wishlist MCP server](https://www.nickyt.co/blog/advent-of-ai-2025-day-17-building-a-wishlist-app-with-goose-and-mcp-ui-330l/) that returns UI components.

In Goose, it showed up as an interactive widget. In other MCP clients without UI support, it would just be text.

![Wishing to hang with Snoop and Martha](https://www.nickyt.co/images/posts/_uploads_articles_n8x9515ndgfeqb85jbos.png)

The [auto-visualizer extension](https://block.github.io/goose/docs/mcp/autovisualiser-mcp/) leverages this too. Instead of text dumps of data, you get rendered visualizations you can interact with.

![auto-visualizer extension in action](https://www.nickyt.co/images/posts/_uploads_articles_dxlv6tt4cy6o7th4q8g5.png)

Right now, only three clients support MCP-UI properly: Goose, ChatGPT (via their Apps SDK), and LibreChat. Everyone else does text-based responses. Having a client that can also render UI components instead of just text is a better experience.

### Terminal Integration Architecture

Goose has two modes: the full REPL (chat back and forth) like other CLIs, and terminal integration (`@goose "do this"`).

[Terminal integration](https://block.github.io/goose/docs/guides/terminal-integration/) is ambient assistance. You're working in your normal terminal. You invoke Goose for a specific task. It executes. You're back to your normal workflow.

Example from Day 13:
```bash
{% raw %}
❯ @goose "continue with the PRD, we were at data organization"
{% endraw %}
```

Goose reads the PRD, checks what's already done in the project, tells you the next step. All from one command. No session management.

This architecture lets you hand off tasks the agent can't do:

```bash
{% raw %}
❯ @goose "install this package globally"
# Goose: "You need to run: sudo npm install -g whatever"
❯ sudo npm install -g whatever  # You run it with your privileges
❯ @goose "okay continue"  # Goose sees you ran it, continues
{% endraw %}
```

No need to open a separate terminal to do the thing the agent can't do and then come back to where you left off in your REPL session. Stay in your flow in your current terminal session.

There's also named sessions which persist across terminal closes:

```bash
{% raw %}
eval "$(goose term init zsh --session my-project)"
{% endraw %}
```

Close your terminal, come back tomorrow, run the same command, you're back in the conversation.

This is infrastructure for integrating AI assistance into your existing workflow, not replacing it.

## When to Use What

If you want the best inline autocomplete go with Cursor or GitHub Copilot in VS Code (their multi-line suggestions and context awareness are excellent)

If you need tight VS Code integration go with GitHub Copilot (native extension with deep editor hooks)

If you want a polished terminal interface, Claude Code or OpenCode are excellent choices

If you want infrastructure for repeatable workflows, Goose has your back.

![Geese infra](https://www.nickyt.co/images/posts/_uploads_articles_7h5envbtewzeublll2v9.png)

Goose makes sense if you:
- Build the same type of project repeatedly (recipes save you from re-prompting)
- Want AI assistance without leaving your terminal (ambient mode)
- Work with teams that need reproducible workflows (YAML in git)
- Build tools that need interactive UIs (MCP-UI rendering)

## When It Works (And When It Doesn't)

Terminal integration confused me at first. I expected a chat session. It's not that. It's one-shot execution that can reference session history, but once I had the aha moment, this is a great flow.

The GUI is better for longer back-and-forth or even the CLI in REPL mode. Terminal integration is better for quick tasks or continuing work.

Like other AI coding agents, Goose supports subagents for parallel task execution. Each subagent runs in its own isolated session. If one fails, you only get results from successful ones.

The subagent infrastructure is solid. Whether it works depends on if your model understands how to use it. GPT-4.1 didn't spawn subagents when I tried it. Claude Sonnet 4 did.

Recipe YAML validation could be better. When I asked the model to generate recipes during Day 9, it got the format wrong multiple times. I'd included https://block.github.io/goose/llms.txt as reference, so I'm not sure why the model struggled with it. Once I understood the structure myself, writing recipes manually was fine.

## What I Still Use Claude.ai For

If I'm being honest, I still write my blog posts in Claude.ai, not Goose. Not because Goose is bad at it, but because I already have Claude Projects set up with my DevRel system prompts, evaluation rubrics, and content templates. I'm just used to that workflow.

Maybe that'll change as I use Goose more. Right now, Goose is where I automate things like weekly status updates. Claude.ai is where I write about them. Different tools for different jobs.

## Why Infrastructure Matters for Teams

Recipes aren't just about personal productivity. They're definitely great for that, but they're also about making agent workflows institutional knowledge instead of undocumented knowledge.

Auditability: If your workflows live in git, you can see what changed, when, and why. Also, each session can be exported as JSON with full metadata: token usage, model config, working directory, timestamps. You know exactly what a workflow cost and how it executed.

Here's what a session export looks like:

```json
{% raw %}
{
  "id": "20251228_72",
  "working_dir": "/Users/nicktaylor/dev/oss/wishlist-mcp",
  "name": "Nike Sales Bar Chart",
  "created_at": "2025-12-28T19:53:24Z",
  "total_tokens": 10297,
  "input_tokens": 10034,
  "output_tokens": 263,
  "provider_name": "anthropic",
  "model_config": {
    "model_name": "claude-opus-4-5-20251101",
    "context_limit": 200000
  },
  "conversation": [...]
}
{% endraw %}
```

Compare this to "export all your data" bulk downloads that most cloud models offer. With per-session exports, you can track workflow costs, analyze token usage patterns, and reproduce exact execution environments.

Prompts are individual knowledge. Recipes can be institutional knowledge.

## So why Goose?

Goose isn't trying to be the best at autocomplete. It's infrastructure for repeatable workflows.

If you want better code completion, use whatever. Cursor, Copilot, Claude Code are all good.

If you want infrastructure for building repeatable workflows, Goose provides:
1. Recipe system for composable, versioned workflow definitions
2. MCP-UI rendering for interactive components
3. Terminal integration for ambient assistance

These are infrastructure capabilities, not model capabilities. The model executes the workflow. Goose provides the execution environment.

## Getting Started

You can bring your existing AI subscriptions to Goose - GitHub Copilot, Cursor, OpenAI, Anthropic, or any OpenAI-compatible provider. Goose is model-agnostic.

If you don't have any subscriptions, start with [Ollama and local models](https://block.github.io/goose/blog/2025/03/14/goose-ollama/). Free, private, and runs entirely on your machine.

## Try It Yourself

The fastest way to understand Goose is the [Advent of AI challenges](https://adventofai.dev). Even though it's over for this year, it's a great way to wrap your head around what Goose has to offer.

Don't start by migrating your current workflow. Start by automating one repetitive task as a recipe. Later on, consider migrating your current workflow.

Check out my [Advent of AI 2025 repo](https://github.com/nickytonline/advent-of-ai-2025) to see what I built.

Further reading:
- [RPI pattern](https://block.github.io/goose/docs/tutorials/rpi/) (Research → Plan → Implement)
- [Security detection workflow](https://block.github.io/goose/blog/2025/07/28/streamlining-detection-development-with-goose-recipes/) (real team usage)
- [Code Execution mode](https://block.github.io/goose/blog/2025/12/15/code-mode-mcp/) (experimental, more efficient MCP)
- [Steve Yegge on agent orchestration](https://open.spotify.com/episode/20iTChEyuXaXryZOVAJoSi) (where this is all heading)

{% embed "https://open.spotify.com/episode/20iTChEyuXaXryZOVAJoSi" %}

If you want to stay in touch, all my socials are on [nickyt.online](https://nickyt.online).

Until the next one!

Photo by <a href="https://unsplash.com/@paolo_gregotti?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Paolo Gregotti</a> on <a href="https://unsplash.com/photos/a-white-goose-standing-in-front-of-a-blue-wall-JR83i95gTqg?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
