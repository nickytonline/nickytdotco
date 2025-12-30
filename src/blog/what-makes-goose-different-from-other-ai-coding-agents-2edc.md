---json
{
  "title": "What Makes Goose Different From Other AI Coding Agents",
  "excerpt": "I just finished Goose’s Advent of AI. Everything from CI automation to hand-gesture controlled apps...",
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

I just finished Goose’s [Advent of AI](https://adventofai.dev/). Everything from CI automation to hand-gesture controlled apps to model context protocol (MCP) servers with UI.

[![Me testing out my hand gesture project](https://www.nickyt.co/images/posts/_uploads_articles_mpc0zvsraivv3qvkf4xu.png)](https://flightboard.nickyt.co/)

I built almost all of these challenges in Goose. Mostly in the GUI at first, shifting to the CLI as I learned more. Occasionally I’d jump to Claude to finish something, but Goose was my primary development environment. My workflow: convert the challenge to a [product requirements document](https://en.wikipedia.org/wiki/Product_requirements_document) (PRD) and sometimes I’d compliment it with an evaluation rubric if the project was more complex, then implement it.

After building with it daily for over two weeks, I can tell you what makes Goose different. But first, the baseline.

## The Table Stakes Stuff

Goose does all the things you expect an AI agent to do. A GUI with a chat UI, a CLI, and like some other agents, it’s model-agnostic (works with any LLM provider including local models).

![Goose chat UI](https://www.nickyt.co/images/posts/_uploads_articles_2j67b1zxr39c1f4gdcci.png)

![Model modal](https://www.nickyt.co/images/posts/_uploads_articles_8jqapgv6kvetjuoxix4s.png)

It also has first class support for MCPs, chat history, named sessions, [subagents for parallel task execution](https://block.github.io/goose/docs/guides/subagents/), [skills for custom context](https://block.github.io/goose/docs/guides/context-engineering/using-skills/), and like a lot of great software, it’s open source.

{% embed "https://github.com/block/goose" %}

Most of these features aren’t unique. OpenCode (also open source), Cursor, Copilot, Claude Code, and Windsurf all have most of these capabilities too.

If that’s all Goose offered, this wouldn’t be worth writing about.

## What Actually Makes Goose Different

Goose isn’t competing with Cursor’s autocomplete or Copilot’s inline suggestions. It’s a different category. Think build system for agent behavior, not better IDE integration.

After all that daily use, three things stand out. (And apparently I’m not alone: according to Block, 60% of their workforce uses Goose weekly with reported 50-75% development time savings.)

### Recipes: Reusable AI Workflows

Most AI tools give you saved prompts or templates. Goose recipes are structured workflow definitions with actual capabilities.

For [day 9](https://dev.to/nickytonline/advent-of-ai-2025-day-9-building-a-gift-tag-generator-with-goose-recipes-3i73) and [day 15](https://dev.to/nickytonline/advent-of-ai-2025-day-15-goose-sub-recipes-3mnd) of Advent of AI, I built projects that used [recipes](https://block.github.io/goose/docs/guides/recipes/) and [sub-recipes](https://block.github.io/goose/docs/guides/recipes/subrecipes/).

Here’s what recipes actually give you:

- Parameter passing between workflow stages - Define `{{event_name}}` once, use it everywhere
- Sub-recipe composition - Call sub-recipes from one parent recipe
- Environment extensions - Recipes automatically get access to globally configured MCP servers and built-in extensions
- Explicit extension specification - Pin specific MCP servers/tools for a recipe (supported in only YAML at the moment)
- Structured inputs - Define parameters with types, requirements, descriptions

Here’s what this looks like using the social media campaign recipe ([Advent of AI day 15](https://www.nickyt.co/blog/advent-of-ai-2025-day-15-goose-sub-recipes-3mnd/)) that orchestrates three platform-specific sub-recipes:

![Recipe UI showing parameters](https://www.nickyt.co/images/posts/_uploads_articles_gxi94yjbasoply9i5i00.png)

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

When you run this recipe, Goose executes each sub-recipe with the same parameters. Each sub-recipe handles its platform’s specifics. The parent recipe just coordinates.

You can also pin which MCP extensions a recipe should use. This is currently only available in YAML (not the UI), but it’s powerful for reproducible workflows. This guarantees the recipe runs with specific tools, regardless of what’s in your global config.

A more typical engineering workflow would be generating weekly status updates by querying Linear, GitHub, and Notion. Check out this [gist for the recipe](https://gist.github.com/nickytonline/9e6702893ed2ca6ad9a62e2337583ba9).

You can also make a recipe a slash command.

![Configuring a recipe as a slash command](https://www.nickyt.co/images/posts/_uploads_articles_jb8c6k5dc8f8czc5z640.png)

With that set up, if I want to get my weekly status update, all I need to do is run `/weekly-status` in the GUI or REPL and get a formatted report with links to the issues, pull requests etc.

**Why this matters architecturally:**

Without recipes, you’d copy-paste prompts and manually pass values between steps. With recipes you get version control (YAML in git means you can diff changes, revert mistakes), team sharing (your team uses the exact same workflow, not “here’s a prompt I used once”), composition (build complex workflows from simple, tested building blocks), and debugging (each sub-recipe runs independently, so you can test in isolation).

This is different from “I saved a good prompt.” This is workflow infrastructure.

**How this differs from .cursor/rules or custom instructions:**

Most AI coding tools support rules in some form. Cursor has `.cursor/rules`, Cline has `.clinerules`, and there’s the `AGENTS.md` standard that works across tools. These are project-specific prompting guidelines. They improve how the agent understands your codebase and preferences, but they’re not reusable workflows.

The difference: Rules files tell the agent “when you write code in this project, follow these patterns.” Recipes say “execute these specific steps in this order with these parameters.” One is better prompting. The other is workflow orchestration.

Put simply: Rules change how the agent behaves. Recipes change what the agent does.

You can’t compose rules files together, pass parameters between them, or run them as isolated workflows. They’re context for better prompting, not executable infrastructure.

Compare this to slash commands in other tools. Those are saved prompts with placeholders. They can’t orchestrate multi-stage workflows, adjust parameters between stages, or compose with other workflows.

#### Recipes + Subagents: Parallel Workflows

With [Subagents](https://block.github.io/goose/docs/guides/subagents/), recipes give you infrastructure to orchestrate them effectively. Here’s a video processing recipe that spawns 4 parallel subagents:

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

Want to try this directly in Goose? Click on the [recipe share link](goose://recipe?config=eyJ2ZXJzaW9uIjoiMS4wLjAiLCJ0aXRsZSI6IlZpZGVvIFRvb2xzIiwiZGVzY3JpcHRpb24iOiJBIHNldCBvZiB0b29scyBmb3IgcHJvY2Vzc2luZyB2aWRlb3MiLCJpbnN0cnVjdGlvbnMiOiJZb3UgYXJlYSB2aWRlbyBwcm9jZXNzaW5nIGFzc2l0YW50XG5cblByb2Nlc3Mge3t2aWRlb19maWxlfX0gd2l0aCByZWFsLXRpbWUgcHJvZ3Jlc3MgdXBkYXRlcy5cblxuU1RFUCAxIC0gSW1tZWRpYXRlIGFja25vd2xlZGdtZW50OlxuUnVuIHRoaXMgYmFzaCBjb21tYW5kIGZpcnN0OlxuYGBgYmFzaFxuZWNobyBcIvCfjqwgUHJvY2Vzc2luZyB2aWRlbzoge3t2aWRlb19maWxlfX1cIiB8IHRlZSAvZGV2L3R0eVxuYGBgXG5cblNURVAgMiAtIENoZWNrIGRlcGVuZGVuY2llczpcbmBgYGJhc2hcbmVjaG8gXCLwn5SNIENoZWNraW5nIGRlcGVuZGVuY2llcy4uLlwiIHwgdGVlIC9kZXYvdHR5XG53aGljaCBmZm1wZWcgZmZwcm9iZSB8fCB3aGljaCAvb3B0L2hvbWVicmV3L2Jpbi9mZm1wZWcgL29wdC9ob21lYnJldy9iaW4vZmZwcm9iZVxuZWNobyBcIuKckyBEZXBlbmRlbmNpZXMgdmVyaWZpZWRcIiB8IHRlZSAvZGV2L3R0eVxuYGBgXG5cblNURVAgMyAtIEFuYWx5emUgdmlkZW86XG5gYGBiYXNoXG5lY2hvIFwi8J-TiiBBbmFseXppbmcgdmlkZW8gZmlsZS4uLlwiIHwgdGVlIC9kZXYvdHR5XG5gYGBcblxuRXhwYW5kIHt7dmlkZW9fZmlsZX19IHBhdGggKHJlcGxhY2UgfiB3aXRoICRIT01FIGlmIHByZXNlbnQpLlxuXG5Vc2UgZmZwcm9iZSAoY2hlY2sgc3RhbmRhcmQgUEFUSCBhbmQgL29wdC9ob21lYnJldy9iaW4pIHRvIGRldGVjdDpcbi0gRHVyYXRpb24sIHJlc29sdXRpb24sIGNvZGVjLCBmcHMsIGJpdHJhdGVcbi0gQXVkaW8gc3RyZWFtIHByZXNlbmNlXG4tIEZpbGUgc2l6ZVxuLSBWaWRlbyB0eXBlIGluZGljYXRvcnMgKGhpZ2ggZnBzL3Jlc29sdXRpb24gPSBzY3JlZW5jYXN0KVxuXG5BZnRlciBhbmFseXNpcywgcmVwb3J0IHRvIHVzZXI6XG4tIFZpZGVvIHNwZWNpZmljYXRpb25zXG4tIFdoZXRoZXIgYXVkaW8gd2FzIGRldGVjdGVkXG4tIFlvdXIgaW50ZWxsaWdlbnQgcmVjb21tZW5kYXRpb25zIGZvciBjb21wcmVzc2lvblxuXG5UaGVuIHJ1bjpcbmBgYGJhc2hcbmVjaG8gXCLwn5qAIExhdW5jaGluZyBwYXJhbGxlbCBzdWJhZ2VudHMuLi5cIiB8IHRlZSAvZGV2L3R0eVxuYGBgXG5cblNURVAgNCAtIExhdW5jaCBwYXJhbGxlbCBzdWJhZ2VudHM6XG5cblNwYXduIHRoZXNlIHN1YmFnZW50cyB0byBydW4gc2ltdWx0YW5lb3VzbHkuIEVhY2ggc3ViYWdlbnQgc2hvdWxkIHVzZSBiYXNoIGVjaG8gc3RhdGVtZW50cyBmb3IgcHJvZ3Jlc3M6XG5cbj09PSBTVUJBR0VOVCAxOiBTbWFydCBDb21wcmVzc2lvbiA9PT1cbllvdSBhcmUgdGhlIGNvbXByZXNzaW9uIHNwZWNpYWxpc3QuIFlvdXIgam9iOlxuXG5TdGFydCB3aXRoOlxuYGBgYmFzaFxuZWNobyBcIvCfk6YgW0NPTVBSRVNTSU9OXSBTdGFydGluZyBpbnRlbGxpZ2VudCBjb21wcmVzc2lvbi4uLlwiIHwgdGVlIC9kZXYvdHR5XG5gYGBcblxuMS4gQW5hbHl6ZSB2aWRlbyB0eXBlIChzY3JlZW5jYXN0IHZzIGNhbWVyYSBmb290YWdlIGJhc2VkIG9uIHJlc29sdXRpb24vZnBzKVxuMi4gQ2hvb3NlIG9wdGltYWwgQ1JGIHZhbHVlICgxOC0yOCByYW5nZSkgYmFzZWQgb24gY29udGVudFxuMy4gRGVjaWRlIG9uIHJlc29sdXRpb24gZG93bnNhbXBsaW5nIGlmIGJlbmVmaWNpYWwgKDRL4oaSMTA4MHAgZm9yIHNjcmVlbmNhc3RzKVxuNC4gQWRqdXN0IGZyYW1lIHJhdGUgaWYgbmVlZGVkICg2MGZwc-KGkjMwZnBzIGZvciBzY3JlZW5jYXN0cylcblxuUmVwb3J0IHlvdXIgY2hvc2VuIHNldHRpbmdzOlxuYGBgYmFzaFxuZWNobyBcIvCfk6YgW0NPTVBSRVNTSU9OXSBVc2luZyBDUkYgWFggZm9yIFtzY3JlZW5jYXN0L2NhbWVyYV0gY29udGVudFwiIHwgdGVlIC9kZXYvdHR5XG5gYGBcblxuUnVuIGNvbXByZXNzaW9uIHdpdGggZmZtcGVnIChvciAvb3B0L2hvbWVicmV3L2Jpbi9mZm1wZWcpOlxuLSBVc2UgLWM6diBsaWJ4MjY0IC1jcmYgW2Nob3Nlbl0gLXByZXNldCBtZWRpdW1cbi0gSWYgYXVkaW8gcHJlc2VudDogLWM6YSBhYWMgLWI6YSAxMjhrXG4tIElmIG5vIGF1ZGlvOiAtYW4gZmxhZ1xuLSBPdXRwdXQgdG86IHt7dmlkZW9fZmlsZX19X2NvbXByZXNzZWQubXA0XG5cbkFmdGVyIGNvbXBsZXRpb246XG5gYGBiYXNoXG5lY2hvIFwi4pyFIFtDT01QUkVTU0lPTl0gQ29tcGxldGUgLSAkKGR1IC1oIHt7dmlkZW9fZmlsZX19X2NvbXByZXNzZWQubXA0IHwgY3V0IC1mMSlcIiB8IHRlZSAvZGV2L3R0eVxuYGBgXG5cblJlcG9ydCBiZWZvcmUvYWZ0ZXIgc2l6ZXMgYW5kIGNvbXByZXNzaW9uIHJhdGlvIHRvIHVzZXIuXG5cbj09PSBTVUJBR0VOVCAyOiBJbnRlbGxpZ2VudCBUaHVtYm5haWxzID09PVxuWW91IGFyZSB0aGUgdGh1bWJuYWlsIHNwZWNpYWxpc3QuIFlvdXIgam9iOlxuXG5TdGFydCB3aXRoOlxuYGBgYmFzaFxuZWNobyBcIvCflrzvuI8gIFtUSFVNQk5BSUxTXSBFeHRyYWN0aW5nIGludGVsbGlnZW50IHRodW1ibmFpbHMuLi5cIiB8IHRlZSAvZGV2L3R0eVxuYGBgXG5cbjEuIERldGVjdCB2aWRlbyBjb250ZW50IHR5cGUgKHNhbWUgdmlkZW8gYmVpbmcgcHJvY2Vzc2VkKVxuMi4gRm9yIHNjcmVlbmNhc3RzOiBleHRyYWN0IGF0IDIwJSwgNDAlLCA2MCUsIDgwJSwgMTAwJSBpbnRlcnZhbHNcbjMuIEZvciBjYW1lcmEgZm9vdGFnZTogdXNlIGZmbXBlZyBzY2VuZSBkZXRlY3Rpb24gZm9yIGtleSBmcmFtZXNcbjQuIEdlbmVyYXRlIDUgdGh1bWJuYWlscyBhdCAzMjBweCB3aWR0aFxuNS4gTmFtZSB0aGVtOiB7e3ZpZGVvX2ZpbGV9fV90aHVtYl8xLmpwZyB0aHJvdWdoIF90aHVtYl81LmpwZ1xuXG5Gb3IgZWFjaCB0aHVtYm5haWw6XG5gYGBiYXNoXG5lY2hvIFwi8J-WvO-4jyAgW1RIVU1CTkFJTFNdIEV4dHJhY3RpbmcgdGh1bWJuYWlsIE4vNS4uLlwiIHwgdGVlIC9kZXYvdHR5XG5gYGBcblxuVXNlIGZmbXBlZyAob3IgL29wdC9ob21lYnJldy9iaW4vZmZtcGVnKSB3aXRoIC12ZiBzY2FsZT0zMjA6LTFcblxuQWZ0ZXIgY29tcGxldGlvbjpcbmBgYGJhc2hcbmVjaG8gXCLinIUgW1RIVU1CTkFJTFNdIENvbXBsZXRlIC0gNSB0aHVtYm5haWxzIGdlbmVyYXRlZFwiIHwgdGVlIC9kZXYvdHR5XG5gYGBcblxuTGlzdCBhbGwgZ2VuZXJhdGVkIHRodW1ibmFpbCBmaWxlcyB0byB1c2VyLlxuXG49PT0gU1VCQUdFTlQgMzogQXVkaW8gRXh0cmFjdGlvbiAoT05MWSBJRiBBVURJTyBERVRFQ1RFRCkgPT09XG5Zb3UgYXJlIHRoZSBhdWRpbyBleHRyYWN0aW9uIHNwZWNpYWxpc3QuIFlvdXIgam9iOlxuXG5TdGFydCB3aXRoOlxuYGBgYmFzaFxuZWNobyBcIvCflIogW0FVRElPXSBFeHRyYWN0aW5nIGF1ZGlvIGZyb20gdmlkZW8uLi5cIiB8IHRlZSAvZGV2L3R0eVxuYGBgXG5cbkV4dHJhY3QgYXVkaW8gdXNpbmcgZmZtcGVnIChvciAvb3B0L2hvbWVicmV3L2Jpbi9mZm1wZWcpOlxuLSBFeHRyYWN0IHRvIE1QMyBmb3JtYXQgd2l0aCBnb29kIHF1YWxpdHk6IC1jOmEgbGlibXAzbGFtZSAtcTphIDJcbi0gT3V0cHV0IHRvOiB7e3ZpZGVvX2ZpbGV9fV9hdWRpby5tcDNcblxuQ29tbWFuZCBleGFtcGxlOlxuYGBgYmFzaFxuZmZtcGVnIC1pIHt7dmlkZW9fZmlsZX19IC12biAtYzphIGxpYm1wM2xhbWUgLXE6YSAyIHt7dmlkZW9fZmlsZX19X2F1ZGlvLm1wMyB8IHRlZSAvZGV2L3R0eVxuYGBgXG5cbkFmdGVyIGNvbXBsZXRpb246XG5gYGBiYXNoXG5lY2hvIFwi4pyFIFtBVURJT10gQ29tcGxldGUgLSAkKGR1IC1oIHt7dmlkZW9fZmlsZX19X2F1ZGlvLm1wMyB8IGN1dCAtZjEpXCIgfCB0ZWUgL2Rldi90dHlcbmBgYFxuXG5SZXBvcnQgYXVkaW8gZmlsZSBzaXplIGFuZCBiaXRyYXRlIHRvIHVzZXIuXG5cbj09PSBTVUJBR0VOVCA0OiBUcmFuc2NyaXB0aW9uICYgQW5hbHlzaXMgKE9OTFkgSUYgQVVESU8gREVURUNURUQpID09PVxuWW91IGFyZSB0aGUgdHJhbnNjcmlwdGlvbiBzcGVjaWFsaXN0LiBZb3VyIGpvYjpcblxuU3RhcnQgd2l0aDpcbmBgYGJhc2hcbmVjaG8gXCLwn46kIFtUUkFOU0NSSVBUSU9OXSBSdW5uaW5nIFdoaXNwZXIgdHJhbnNjcmlwdGlvbiAodGhpcyBtYXkgdGFrZSBzZXZlcmFsIG1pbnV0ZXMpLi4uXCIgfCB0ZWUgL2Rldi90dHlcbmBgYFxuXG4xLiBSdW46IGB1diBydW4gLS13aXRoIG9wZW5haS13aGlzcGVyIHdoaXNwZXIge3t2aWRlb19maWxlfX0gLS1tb2RlbCBiYXNlIC0tb3V0cHV0X2Zvcm1hdCBhbGxgXG4yLiBPdXRwdXQgd2lsbCBiZToge3t2aWRlb19maWxlfX0udHh0LCB7e3ZpZGVvX2ZpbGV9fS5zcnQsIHt7dmlkZW9fZmlsZX19LnZ0dCwge3t2aWRlb19maWxlfX0udHN2LCB7e3ZpZGVvX2ZpbGV9fS5qc29uIFxuXG5XaGlsZSBydW5uaW5nOlxuYGBgYmFzaFxuZWNobyBcIvCfjqQgW1RSQU5TQ1JJUFRJT05dIFByb2Nlc3NpbmcgYXVkaW8gd2l0aCBXaGlzcGVyIGJhc2UgbW9kZWwuLi5cIiB8IHRlZSAvZGV2L3R0eVxuYGBgXG5cbkFmdGVyIGNvbXBsZXRpb24sIGFuYWx5emUgdGhlIHRyYW5zY3JpcHQ6XG4tIENvdW50IHRvdGFsIHdvcmRzXG4tIENhbGN1bGF0ZSBzcGVha2luZyBwYWNlICh3b3JkcyBwZXIgbWludXRlKVxuLSBJZGVudGlmeSBjb250ZW50IHR5cGUgKG1vbm9sb2d1ZS9kaWFsb2d1ZS9tb3N0bHkgc2lsZW5jZSlcbi0gRGV0ZWN0IGxvbmcgcGF1c2VzXG4tIEJyaWVmIGNvbnRlbnQgc3VtbWFyeVxuXG5gYGBiYXNoXG5lY2hvIFwi4pyFIFtUUkFOU0NSSVBUSU9OXSBDb21wbGV0ZSAtIFhYWFggd29yZHMgdHJhbnNjcmliZWRcIiB8IHRlZSAvZGV2L3R0eVxuYGBgXG5cbkxpc3QgYWxsIGdlbmVyYXRlZCBjYXB0aW9uIGZpbGVzIHRvIHVzZXIuXG5SZXBvcnQgYW5hbHlzaXMgZmluZGluZ3MgdG8gdXNlci5cblxuPT09XG5cblNURVAgNSAtIE1vbml0b3Igc3ViYWdlbnRzOlxuQXMgZWFjaCBzdWJhZ2VudCBjb21wbGV0ZXMsIHlvdSB3aWxsIHNlZSBpdHMgZmluYWwgZWNobyBzdGF0ZW1lbnQuIFJlcG9ydCB0byB1c2VyIGltbWVkaWF0ZWx5IHdoZW4gZWFjaCBmaW5pc2hlcyAtIGRvbid0IHdhaXQgZm9yIGFsbCB0byBjb21wbGV0ZS5cblxuU1RFUCA2IC0gRmluYWwgc3VtbWFyeTpcbkFmdGVyIEFMTCBzdWJhZ2VudHMgY29tcGxldGUsIHJ1bjpcbmBgYGJhc2hcbmVjaG8gXCLwn5OKIEdlbmVyYXRpbmcgZmluYWwgc3VtbWFyeS4uLlwiIHwgdGVlIC9kZXYvdHR5XG5gYGBcblxuVGhlbiBwcm92aWRlIGNvbXByZWhlbnNpdmUgc3VtbWFyeTpcbi0gTGlzdCBhbGwgZ2VuZXJhdGVkIGZpbGVzIHdpdGggc2l6ZXMgKGNvbXByZXNzZWQgdmlkZW8sIHRodW1ibmFpbHMsIGF1ZGlvIGZpbGUsIHRyYW5zY3JpcHRpb24sIGNhcHRpb25zKVxuLSBUb3RhbCBjb21wcmVzc2lvbiBzYXZpbmdzIHBlcmNlbnRhZ2Vcbi0gVmlkZW8gcXVhbGl0eSBhc3Nlc3NtZW50XG4tIEF1ZGlvIGV4dHJhY3Rpb24gZGV0YWlscyAoZm9ybWF0LCBiaXRyYXRlLCBzaXplKVxuLSBSZWNvbW1lbmRhdGlvbnMgZm9yIGZ1dHVyZSByZWNvcmRpbmdzIGJhc2VkIG9uIGFuYWx5c2lzXG4tIENvbnRlbnQgaW5zaWdodHMgaWYgdHJhbnNjcmlwdGlvbiBhdmFpbGFibGUiLCJwcm9tcHQiOiJwcm9jZXNzIHt7dmlkZW9fZmlsZX19IiwiZXh0ZW5zaW9ucyI6W10sImFjdGl2aXRpZXMiOlsicHJvY2VzcyB7e3ZpZGVvX2ZpbGV9fSJdLCJwYXJhbWV0ZXJzIjpbeyJrZXkiOiJ2aWRlb19maWxlIiwiaW5wdXRfdHlwZSI6InN0cmluZyIsInJlcXVpcmVtZW50IjoicmVxdWlyZWQiLCJkZXNjcmlwdGlvbiI6IlRoZSB2aWRlbyBmaWxlIHRvIG9wdGltaXplIn1dfQ) to import this recipe into Goose!

Each subagent runs independently with progress updates via `echo | tee /dev/tty`. The recipe coordinates them, handles failures gracefully (if compression fails, you still get thumbnails), and provides a unified summary.

Without recipes, you’d have a saved prompt where you manually edit the filename each time: “Process my-video.mp4 by spawning 4 subagents…” Want to process a different video? Find and replace the filename, hope you didn’t miss one. Want to share this workflow with a teammate? Send them your entire conversation.

With recipes, I can process a video in one line `/video-tools any-file.mp4`. I can also [share it as a URL](goose://recipe?config=eyJ2ZXJzaW9uIjoiMS4wLjAiLCJ0aXRsZSI6IlZpZGVvIFRvb2xzIiwiZGVzY3JpcHRpb24iOiJBIHNldCBvZiB0b29scyBmb3IgcHJvY2Vzc2luZyB2aWRlb3MiLCJpbnN0cnVjdGlvbnMiOiJZb3UgYXJlYSB2aWRlbyBwcm9jZXNzaW5nIGFzc2l0YW50XG5cblByb2Nlc3Mge3t2aWRlb19maWxlfX0gd2l0aCByZWFsLXRpbWUgcHJvZ3Jlc3MgdXBkYXRlcy5cblxuU1RFUCAxIC0gSW1tZWRpYXRlIGFja25vd2xlZGdtZW50OlxuUnVuIHRoaXMgYmFzaCBjb21tYW5kIGZpcnN0OlxuYGBgYmFzaFxuZWNobyBcIvCfjqwgUHJvY2Vzc2luZyB2aWRlbzoge3t2aWRlb19maWxlfX1cIiB8IHRlZSAvZGV2L3R0eVxuYGBgXG5cblNURVAgMiAtIENoZWNrIGRlcGVuZGVuY2llczpcbmBgYGJhc2hcbmVjaG8gXCLwn5SNIENoZWNraW5nIGRlcGVuZGVuY2llcy4uLlwiIHwgdGVlIC9kZXYvdHR5XG53aGljaCBmZm1wZWcgZmZwcm9iZSB8fCB3aGljaCAvb3B0L2hvbWVicmV3L2Jpbi9mZm1wZWcgL29wdC9ob21lYnJldy9iaW4vZmZwcm9iZVxuZWNobyBcIuKckyBEZXBlbmRlbmNpZXMgdmVyaWZpZWRcIiB8IHRlZSAvZGV2L3R0eVxuYGBgXG5cblNURVAgMyAtIEFuYWx5emUgdmlkZW86XG5gYGBiYXNoXG5lY2hvIFwi8J-TiiBBbmFseXppbmcgdmlkZW8gZmlsZS4uLlwiIHwgdGVlIC9kZXYvdHR5XG5gYGBcblxuRXhwYW5kIHt7dmlkZW9fZmlsZX19IHBhdGggKHJlcGxhY2UgfiB3aXRoICRIT01FIGlmIHByZXNlbnQpLlxuXG5Vc2UgZmZwcm9iZSAoY2hlY2sgc3RhbmRhcmQgUEFUSCBhbmQgL29wdC9ob21lYnJldy9iaW4pIHRvIGRldGVjdDpcbi0gRHVyYXRpb24sIHJlc29sdXRpb24sIGNvZGVjLCBmcHMsIGJpdHJhdGVcbi0gQXVkaW8gc3RyZWFtIHByZXNlbmNlXG4tIEZpbGUgc2l6ZVxuLSBWaWRlbyB0eXBlIGluZGljYXRvcnMgKGhpZ2ggZnBzL3Jlc29sdXRpb24gPSBzY3JlZW5jYXN0KVxuXG5BZnRlciBhbmFseXNpcywgcmVwb3J0IHRvIHVzZXI6XG4tIFZpZGVvIHNwZWNpZmljYXRpb25zXG4tIFdoZXRoZXIgYXVkaW8gd2FzIGRldGVjdGVkXG4tIFlvdXIgaW50ZWxsaWdlbnQgcmVjb21tZW5kYXRpb25zIGZvciBjb21wcmVzc2lvblxuXG5UaGVuIHJ1bjpcbmBgYGJhc2hcbmVjaG8gXCLwn5qAIExhdW5jaGluZyBwYXJhbGxlbCBzdWJhZ2VudHMuLi5cIiB8IHRlZSAvZGV2L3R0eVxuYGBgXG5cblNURVAgNCAtIExhdW5jaCBwYXJhbGxlbCBzdWJhZ2VudHM6XG5cblNwYXduIHRoZXNlIHN1YmFnZW50cyB0byBydW4gc2ltdWx0YW5lb3VzbHkuIEVhY2ggc3ViYWdlbnQgc2hvdWxkIHVzZSBiYXNoIGVjaG8gc3RhdGVtZW50cyBmb3IgcHJvZ3Jlc3M6XG5cbj09PSBTVUJBR0VOVCAxOiBTbWFydCBDb21wcmVzc2lvbiA9PT1cbllvdSBhcmUgdGhlIGNvbXByZXNzaW9uIHNwZWNpYWxpc3QuIFlvdXIgam9iOlxuXG5TdGFydCB3aXRoOlxuYGBgYmFzaFxuZWNobyBcIvCfk6YgW0NPTVBSRVNTSU9OXSBTdGFydGluZyBpbnRlbGxpZ2VudCBjb21wcmVzc2lvbi4uLlwiIHwgdGVlIC9kZXYvdHR5XG5gYGBcblxuMS4gQW5hbHl6ZSB2aWRlbyB0eXBlIChzY3JlZW5jYXN0IHZzIGNhbWVyYSBmb290YWdlIGJhc2VkIG9uIHJlc29sdXRpb24vZnBzKVxuMi4gQ2hvb3NlIG9wdGltYWwgQ1JGIHZhbHVlICgxOC0yOCByYW5nZSkgYmFzZWQgb24gY29udGVudFxuMy4gRGVjaWRlIG9uIHJlc29sdXRpb24gZG93bnNhbXBsaW5nIGlmIGJlbmVmaWNpYWwgKDRL4oaSMTA4MHAgZm9yIHNjcmVlbmNhc3RzKVxuNC4gQWRqdXN0IGZyYW1lIHJhdGUgaWYgbmVlZGVkICg2MGZwc-KGkjMwZnBzIGZvciBzY3JlZW5jYXN0cylcblxuUmVwb3J0IHlvdXIgY2hvc2VuIHNldHRpbmdzOlxuYGBgYmFzaFxuZWNobyBcIvCfk6YgW0NPTVBSRVNTSU9OXSBVc2luZyBDUkYgWFggZm9yIFtzY3JlZW5jYXN0L2NhbWVyYV0gY29udGVudFwiIHwgdGVlIC9kZXYvdHR5XG5gYGBcblxuUnVuIGNvbXByZXNzaW9uIHdpdGggZmZtcGVnIChvciAvb3B0L2hvbWVicmV3L2Jpbi9mZm1wZWcpOlxuLSBVc2UgLWM6diBsaWJ4MjY0IC1jcmYgW2Nob3Nlbl0gLXByZXNldCBtZWRpdW1cbi0gSWYgYXVkaW8gcHJlc2VudDogLWM6YSBhYWMgLWI6YSAxMjhrXG4tIElmIG5vIGF1ZGlvOiAtYW4gZmxhZ1xuLSBPdXRwdXQgdG86IHt7dmlkZW9fZmlsZX19X2NvbXByZXNzZWQubXA0XG5cbkFmdGVyIGNvbXBsZXRpb246XG5gYGBiYXNoXG5lY2hvIFwi4pyFIFtDT01QUkVTU0lPTl0gQ29tcGxldGUgLSAkKGR1IC1oIHt7dmlkZW9fZmlsZX19X2NvbXByZXNzZWQubXA0IHwgY3V0IC1mMSlcIiB8IHRlZSAvZGV2L3R0eVxuYGBgXG5cblJlcG9ydCBiZWZvcmUvYWZ0ZXIgc2l6ZXMgYW5kIGNvbXByZXNzaW9uIHJhdGlvIHRvIHVzZXIuXG5cbj09PSBTVUJBR0VOVCAyOiBJbnRlbGxpZ2VudCBUaHVtYm5haWxzID09PVxuWW91IGFyZSB0aGUgdGh1bWJuYWlsIHNwZWNpYWxpc3QuIFlvdXIgam9iOlxuXG5TdGFydCB3aXRoOlxuYGBgYmFzaFxuZWNobyBcIvCflrzvuI8gIFtUSFVNQk5BSUxTXSBFeHRyYWN0aW5nIGludGVsbGlnZW50IHRodW1ibmFpbHMuLi5cIiB8IHRlZSAvZGV2L3R0eVxuYGBgXG5cbjEuIERldGVjdCB2aWRlbyBjb250ZW50IHR5cGUgKHNhbWUgdmlkZW8gYmVpbmcgcHJvY2Vzc2VkKVxuMi4gRm9yIHNjcmVlbmNhc3RzOiBleHRyYWN0IGF0IDIwJSwgNDAlLCA2MCUsIDgwJSwgMTAwJSBpbnRlcnZhbHNcbjMuIEZvciBjYW1lcmEgZm9vdGFnZTogdXNlIGZmbXBlZyBzY2VuZSBkZXRlY3Rpb24gZm9yIGtleSBmcmFtZXNcbjQuIEdlbmVyYXRlIDUgdGh1bWJuYWlscyBhdCAzMjBweCB3aWR0aFxuNS4gTmFtZSB0aGVtOiB7e3ZpZGVvX2ZpbGV9fV90aHVtYl8xLmpwZyB0aHJvdWdoIF90aHVtYl81LmpwZ1xuXG5Gb3IgZWFjaCB0aHVtYm5haWw6XG5gYGBiYXNoXG5lY2hvIFwi8J-WvO-4jyAgW1RIVU1CTkFJTFNdIEV4dHJhY3RpbmcgdGh1bWJuYWlsIE4vNS4uLlwiIHwgdGVlIC9kZXYvdHR5XG5gYGBcblxuVXNlIGZmbXBlZyAob3IgL29wdC9ob21lYnJldy9iaW4vZmZtcGVnKSB3aXRoIC12ZiBzY2FsZT0zMjA6LTFcblxuQWZ0ZXIgY29tcGxldGlvbjpcbmBgYGJhc2hcbmVjaG8gXCLinIUgW1RIVU1CTkFJTFNdIENvbXBsZXRlIC0gNSB0aHVtYm5haWxzIGdlbmVyYXRlZFwiIHwgdGVlIC9kZXYvdHR5XG5gYGBcblxuTGlzdCBhbGwgZ2VuZXJhdGVkIHRodW1ibmFpbCBmaWxlcyB0byB1c2VyLlxuXG49PT0gU1VCQUdFTlQgMzogQXVkaW8gRXh0cmFjdGlvbiAoT05MWSBJRiBBVURJTyBERVRFQ1RFRCkgPT09XG5Zb3UgYXJlIHRoZSBhdWRpbyBleHRyYWN0aW9uIHNwZWNpYWxpc3QuIFlvdXIgam9iOlxuXG5TdGFydCB3aXRoOlxuYGBgYmFzaFxuZWNobyBcIvCflIogW0FVRElPXSBFeHRyYWN0aW5nIGF1ZGlvIGZyb20gdmlkZW8uLi5cIiB8IHRlZSAvZGV2L3R0eVxuYGBgXG5cbkV4dHJhY3QgYXVkaW8gdXNpbmcgZmZtcGVnIChvciAvb3B0L2hvbWVicmV3L2Jpbi9mZm1wZWcpOlxuLSBFeHRyYWN0IHRvIE1QMyBmb3JtYXQgd2l0aCBnb29kIHF1YWxpdHk6IC1jOmEgbGlibXAzbGFtZSAtcTphIDJcbi0gT3V0cHV0IHRvOiB7e3ZpZGVvX2ZpbGV9fV9hdWRpby5tcDNcblxuQ29tbWFuZCBleGFtcGxlOlxuYGBgYmFzaFxuZmZtcGVnIC1pIHt7dmlkZW9fZmlsZX19IC12biAtYzphIGxpYm1wM2xhbWUgLXE6YSAyIHt7dmlkZW9fZmlsZX19X2F1ZGlvLm1wMyB8IHRlZSAvZGV2L3R0eVxuYGBgXG5cbkFmdGVyIGNvbXBsZXRpb246XG5gYGBiYXNoXG5lY2hvIFwi4pyFIFtBVURJT10gQ29tcGxldGUgLSAkKGR1IC1oIHt7dmlkZW9fZmlsZX19X2F1ZGlvLm1wMyB8IGN1dCAtZjEpXCIgfCB0ZWUgL2Rldi90dHlcbmBgYFxuXG5SZXBvcnQgYXVkaW8gZmlsZSBzaXplIGFuZCBiaXRyYXRlIHRvIHVzZXIuXG5cbj09PSBTVUJBR0VOVCA0OiBUcmFuc2NyaXB0aW9uICYgQW5hbHlzaXMgKE9OTFkgSUYgQVVESU8gREVURUNURUQpID09PVxuWW91IGFyZSB0aGUgdHJhbnNjcmlwdGlvbiBzcGVjaWFsaXN0LiBZb3VyIGpvYjpcblxuU3RhcnQgd2l0aDpcbmBgYGJhc2hcbmVjaG8gXCLwn46kIFtUUkFOU0NSSVBUSU9OXSBSdW5uaW5nIFdoaXNwZXIgdHJhbnNjcmlwdGlvbiAodGhpcyBtYXkgdGFrZSBzZXZlcmFsIG1pbnV0ZXMpLi4uXCIgfCB0ZWUgL2Rldi90dHlcbmBgYFxuXG4xLiBSdW46IGB1diBydW4gLS13aXRoIG9wZW5haS13aGlzcGVyIHdoaXNwZXIge3t2aWRlb19maWxlfX0gLS1tb2RlbCBiYXNlIC0tb3V0cHV0X2Zvcm1hdCBhbGxgXG4yLiBPdXRwdXQgd2lsbCBiZToge3t2aWRlb19maWxlfX0udHh0LCB7e3ZpZGVvX2ZpbGV9fS5zcnQsIHt7dmlkZW9fZmlsZX19LnZ0dCwge3t2aWRlb19maWxlfX0udHN2LCB7e3ZpZGVvX2ZpbGV9fS5qc29uIFxuXG5XaGlsZSBydW5uaW5nOlxuYGBgYmFzaFxuZWNobyBcIvCfjqQgW1RSQU5TQ1JJUFRJT05dIFByb2Nlc3NpbmcgYXVkaW8gd2l0aCBXaGlzcGVyIGJhc2UgbW9kZWwuLi5cIiB8IHRlZSAvZGV2L3R0eVxuYGBgXG5cbkFmdGVyIGNvbXBsZXRpb24sIGFuYWx5emUgdGhlIHRyYW5zY3JpcHQ6XG4tIENvdW50IHRvdGFsIHdvcmRzXG4tIENhbGN1bGF0ZSBzcGVha2luZyBwYWNlICh3b3JkcyBwZXIgbWludXRlKVxuLSBJZGVudGlmeSBjb250ZW50IHR5cGUgKG1vbm9sb2d1ZS9kaWFsb2d1ZS9tb3N0bHkgc2lsZW5jZSlcbi0gRGV0ZWN0IGxvbmcgcGF1c2VzXG4tIEJyaWVmIGNvbnRlbnQgc3VtbWFyeVxuXG5gYGBiYXNoXG5lY2hvIFwi4pyFIFtUUkFOU0NSSVBUSU9OXSBDb21wbGV0ZSAtIFhYWFggd29yZHMgdHJhbnNjcmliZWRcIiB8IHRlZSAvZGV2L3R0eVxuYGBgXG5cbkxpc3QgYWxsIGdlbmVyYXRlZCBjYXB0aW9uIGZpbGVzIHRvIHVzZXIuXG5SZXBvcnQgYW5hbHlzaXMgZmluZGluZ3MgdG8gdXNlci5cblxuPT09XG5cblNURVAgNSAtIE1vbml0b3Igc3ViYWdlbnRzOlxuQXMgZWFjaCBzdWJhZ2VudCBjb21wbGV0ZXMsIHlvdSB3aWxsIHNlZSBpdHMgZmluYWwgZWNobyBzdGF0ZW1lbnQuIFJlcG9ydCB0byB1c2VyIGltbWVkaWF0ZWx5IHdoZW4gZWFjaCBmaW5pc2hlcyAtIGRvbid0IHdhaXQgZm9yIGFsbCB0byBjb21wbGV0ZS5cblxuU1RFUCA2IC0gRmluYWwgc3VtbWFyeTpcbkFmdGVyIEFMTCBzdWJhZ2VudHMgY29tcGxldGUsIHJ1bjpcbmBgYGJhc2hcbmVjaG8gXCLwn5OKIEdlbmVyYXRpbmcgZmluYWwgc3VtbWFyeS4uLlwiIHwgdGVlIC9kZXYvdHR5XG5gYGBcblxuVGhlbiBwcm92aWRlIGNvbXByZWhlbnNpdmUgc3VtbWFyeTpcbi0gTGlzdCBhbGwgZ2VuZXJhdGVkIGZpbGVzIHdpdGggc2l6ZXMgKGNvbXByZXNzZWQgdmlkZW8sIHRodW1ibmFpbHMsIGF1ZGlvIGZpbGUsIHRyYW5zY3JpcHRpb24sIGNhcHRpb25zKVxuLSBUb3RhbCBjb21wcmVzc2lvbiBzYXZpbmdzIHBlcmNlbnRhZ2Vcbi0gVmlkZW8gcXVhbGl0eSBhc3Nlc3NtZW50XG4tIEF1ZGlvIGV4dHJhY3Rpb24gZGV0YWlscyAoZm9ybWF0LCBiaXRyYXRlLCBzaXplKVxuLSBSZWNvbW1lbmRhdGlvbnMgZm9yIGZ1dHVyZSByZWNvcmRpbmdzIGJhc2VkIG9uIGFuYWx5c2lzXG4tIENvbnRlbnQgaW5zaWdodHMgaWYgdHJhbnNjcmlwdGlvbiBhdmFpbGFibGUiLCJwcm9tcHQiOiJwcm9jZXNzIHt7dmlkZW9fZmlsZX19IiwiZXh0ZW5zaW9ucyI6W10sImFjdGl2aXRpZXMiOlsicHJvY2VzcyB7e3ZpZGVvX2ZpbGV9fSJdLCJwYXJhbWV0ZXJzIjpbeyJrZXkiOiJ2aWRlb19maWxlIiwiaW5wdXRfdHlwZSI6InN0cmluZyIsInJlcXVpcmVtZW50IjoicmVxdWlyZWQiLCJkZXNjcmlwdGlvbiI6IlRoZSB2aWRlbyBmaWxlIHRvIG9wdGltaXplIn1dfQ) that will deep link into Goose to add the recipe when someone clicks on it.

Recipes are parameterized, versionable (if you want), and shareable as standalone workflows.

**Why infrastructure matters for teams:**

Recipes aren’t just about personal productivity. They’re definitely great for that, but they’re also about making agent workflows institutional knowledge instead of undocumented knowledge.

Auditability: Goose sessions can be exported as JSON with full metadata: token usage, model config, working directory, timestamps. You know exactly what a workflow cost and how it executed as well as the conversation history.

Here’s what a session export looks like:

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

Compare this to “export all your data” bulk downloads that most cloud models offer. With per-session exports, you can track workflow costs, analyze token usage patterns, and reproduce exact execution environments.

Onboarding: New team members can run `/onboarding` instead of hunting down the 17-step checklist your senior engineer keeps in a Google Doc.

Consistency: When everyone runs the same recipe with the same pinned extensions, you get fewer “works on my machine” agent outcomes.

Separation of concerns: Recipe authors encode expertise once. Anyone on the team can execute workflows without needing to understand every implementation detail.

Standards-based: Goose is an early contributor to the Linux Foundation’s [AI Agent Interoperability Foundation](https://block.xyz/inside/block-anthropic-and-openai-launch-the-agentic-ai-foundation) (AAIF), alongside Anthropic and OpenAI. Recipes and MCP integration position you for the emerging standard, not a proprietary lock-in.

Prompts are individual knowledge. Recipes can be institutional knowledge.

### MCP-UI Rendering Support

Most MCP client implementations render tool responses as text. Goose’s GUI can also render [MCP-UI](https://mcpui.dev/) components as actual interactive widgets.

On Day 17 of Advent of AI, I [built a wishlist MCP server](https://www.nickyt.co/blog/advent-of-ai-2025-day-17-building-a-wishlist-app-with-goose-and-mcp-ui-330l/) that returns UI components.

In Goose, it showed up as an interactive widget. In other MCP clients without UI support, it would just be text.

![Wishing to hang with Snoop and Martha](https://www.nickyt.co/images/posts/_uploads_articles_n8x9515ndgfeqb85jbos.png)

The [auto-visualizer extension](https://block.github.io/goose/docs/mcp/autovisualiser-mcp/) leverages this too. Instead of text dumps of data, you get rendered visualizations you can interact with.

![auto-visualizer extension in action](https://www.nickyt.co/images/posts/_uploads_articles_dxlv6tt4cy6o7th4q8g5.png)

Right now, only three clients support MCP-UI properly: Goose, ChatGPT (via their Apps SDK), and LibreChat. Everyone else does text-based responses. Having a client that can also render UI components instead of just text is a better experience.

### Terminal Integration Architecture

Goose has two modes: the full REPL (chat back and forth) like other CLIs, and terminal integration (`@goose "do this"`).

[Terminal integration](https://block.github.io/goose/docs/guides/terminal-integration/) is ambient assistance. You’re working in your normal terminal. You invoke Goose for a specific task. It executes. You’re back to your normal workflow.

Example from Day 13:

```bash
{% raw %}
❯ @goose "continue with the PRD, we were at data organization"
{% endraw %}
```

Goose reads the PRD, checks what’s already done in the project, tells you the next step. All from one command. No session management.

This architecture lets you hand off tasks the agent can’t do:

```bash
{% raw %}
❯ @goose "install this package globally"
# Goose: "You need to run: sudo npm install -g whatever"
❯ sudo npm install -g whatever  # You run it with your privileges
❯ @goose "okay continue"  # Goose sees you ran it, continues
{% endraw %}
```

No need to open a separate terminal to do the thing the agent can’t do and then come back to where you left off in your REPL session. Stay in your flow in your current terminal session.

Terminal integration confused me initially, but once but once I had the aha moment thanks to a similar issue I run into with `sudo` all the time with AI, I realized this is a great flow.

There’s also named sessions which persist across terminal closes:

```bash
{% raw %}
eval "$(goose term init zsh --session my-project)"
{% endraw %}
```

Close your terminal, come back tomorrow, run the same command, you’re back in the conversation.

This is infrastructure for integrating AI assistance into your existing workflow, not replacing it.

## When It Works (And When It Doesn’t)

The GUI is better for longer back-and-forth or even the CLI in REPL mode. Terminal integration is better for quick tasks or continuing work.

As mentioned, Goose supports subagents for parallel task execution. Each subagent runs in its own isolated session. If one fails, you only get results from successful ones.

The subagent infrastructure is solid. The only thing I ran into was with GPT-4.1 (switched to it when my tokens were low). Goose wasn't able to spawn subagents with GPT-4.1. Not sure why. Anthropic's Sonnet 4.x and Opus models worked perfectly with subagents.

Recipe YAML validation could be better. When I asked the model to generate recipes during Day 9, it got the format wrong multiple times. I’d included https://block.github.io/goose/llms.txt as reference, so I’m not sure why the model struggled with it. Not necessarily a direct Goose issue, but I'm surprised with access to Goose's llms.txt, the model couldn't generate a valid Goose recipe YAML file.

## What I Still Use Claude.ai For

If I’m being honest, I still write my blog posts on Claude.ai, not Goose. Not because Goose is bad at it, but because I already have Claude Projects set up with my DevRel system prompts, evaluation rubrics, and content templates. I’m just used to that workflow.

Maybe that’ll change as I use Goose more. Right now, Goose is where I automate things like weekly status updates. Claude.ai is where I write about them. Different tools for different jobs.

## Pick the Right Tool for the Job

Different tools solve different problems.

If you want the best inline autocomplete, go with Cursor or GitHub Copilot in VS Code (their multi-line suggestions and context awareness are excellent).

If you need tight VS Code integration, go with GitHub Copilot (native extension with deep editor hooks).

If you want a polished terminal interface, Claude Code or OpenCode are excellent choices.

If you want infrastructure for repeatable workflows, go with Goose.

Goose makes sense if you:

- Build the same type of project repeatedly (recipes save you from re-prompting)
- Want AI assistance without leaving your terminal (ambient mode)
- Work with teams that need reproducible workflows (YAML in git)
- Build tools that need interactive UIs (MCP-UI rendering)

![Geese infra](https://www.nickyt.co/images/posts/_uploads_articles_7h5envbtewzeublll2v9.png)

And of course it has all the table stakes features you expect in an AI agent which also makes Goose a solid choice.

## Getting Started

You can bring your existing AI subscriptions to Goose: GitHub Copilot, Cursor, OpenAI, Anthropic, or any OpenAI-compatible provider. Goose is model-agnostic.

If you don’t have any subscriptions, start with [Ollama and local models](https://block.github.io/goose/blog/2025/03/14/goose-ollama/). Free, private, and runs entirely on your machine.

## Try It Yourself

The fastest way to understand Goose is the [Advent of AI challenges](https://adventofai.dev). Even though it’s over for this year, it’s a great way to wrap your head around what Goose has to offer.

Don’t start by migrating your current workflow. Start by automating one repetitive task as a recipe. Later on, consider migrating your current workflow.

Check out my [Advent of AI 2025 repo](https://github.com/nickytonline/advent-of-ai-2025) to see what I built.

Further reading:

- [RPI pattern](https://block.github.io/goose/docs/tutorials/rpi/) (Research → Plan → Implement)
- [Security detection workflow](https://block.github.io/goose/blog/2025/07/28/streamlining-detection-development-with-goose-recipes/) (real team usage)
- [Code Execution mode](https://block.github.io/goose/blog/2025/12/15/code-mode-mcp/) (experimental, more efficient MCP)
- [Steve Yegge on the Latent Space podcast](https://open.spotify.com/episode/20iTChEyuXaXryZOVAJoSi) discussing vibe coding and agent orchestration (where this is all heading)

If you want to stay in touch, all my socials are on [nickyt.online](https://nickyt.online).

Until the next one!

Photo by <a href="https://unsplash.com/@paolo_gregotti?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Paolo Gregotti</a> on <a href="https://unsplash.com/photos/a-white-goose-standing-in-front-of-a-blue-wall-JR83i95gTqg?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
