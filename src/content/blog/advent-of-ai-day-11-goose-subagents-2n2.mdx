---json
{
  "title": "Advent of AI - Day 11: Goose Subagents",
  "excerpt": "I've edited this post, but AI helped. These are meant to be quick posts for the Advent of AI. If I'm...",
  "date": "2025-12-17T05:15:32Z",
  "tags": [
    "adventofai",
    "goose",
    "subagents"
  ],
  "cover_image": "https://www.nickyt.co/images/posts/_dynamic_image_width=1000,height=420,fit=cover,gravity=auto,format=auto_https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Fwatye6fj0j4oy9l75cmb.jpg",
  "canonical_url": "https://www.nickyt.co/blog/advent-of-ai-day-11-goose-subagents-2n2/",
  "reading_time_minutes": 5,
  "template": "post",
  "series": {
    "name": "Advent of AI 2025",
    "collection_id": 34295
  }
}
---

I've edited this post, but AI helped. These are meant to be quick posts for the Advent of AI. If I'm doing one of these each day, I don't have time to spend a couple hours on each post.

The [advent of AI](https://adventofai.dev) series leverages Goose, an open source AI agent. If you've never heard of it, check it out!

{% embed "https://github.com/block/goose" %}

For [Day 11 of Advent of AI](https://adventofai.dev/challenges/11), the challenge was building a social media photo booth app. Here's [my submission](https://github.com/block/goose/discussions/6120#discussioncomment-15269927). Getting the filters working wasn't really the goal for me though. I wanted to dig into how Goose subagents actually work under the hood.

I got the app running and took some pictures, but couldn't quite get the filters working. That's fine. The real learning was understanding subagents. The docs explain what they do, but I was curious about the technical implementation. Are subagents separate goose CLI instances? Or are they threads in the core Rust code?

## Goose Architecture Overview

Before we dive into subagents, here's how goose is structured at a high level.

![Goose Architecture Overview](https://www.nickyt.co/images/posts/_uploads_articles_8i8za4rts66gxvqyexqz.png)

Goose has a modular architecture with a core Rust codebase that handles all the agent logic. This includes the `Agent` class, extension management, tool execution, and communication with LLM providers. Both the CLI and desktop GUI are just interfaces built on top of this shared core.

The desktop app uses Electron with a React frontend that talks to the Rust backend through an API. The CLI is a more direct interface to the same core functionality. Because they share the same underlying agent code, features like subagents work identically whether you're using the terminal or the desktop app.

## What Are Subagents?

Subagents are independent goose instances that execute tasks while keeping your main conversation clean. Think of them as temporary assistants that handle specific jobs without cluttering your chat with tool execution details.

Beyond parallelization, subagents solve a massive context management problem. Without them, all that verbose tool output, intermediate reasoning, and debugging details would bloat your main session's context. With subagents, only the task results make it back while all the noisy details stay quarantined in separate sessions.

You can spin them up with natural language. Something like "Use 2 subagents to create hello.html and goodbye.html in parallel" and goose handles the rest.

## The Technical Implementation

After digging through the docs and GitHub discussions, here's what I found.

**Subagents Are Agent Class Instances**

The docs say "Internal subagents spawn goose instances" but after digging through GitHub discussions, it's clearer what's actually happening.

Subagents are instantiations of the `Agent` class in the Rust codebase. Both the CLI and desktop GUI use the same core Rust agent code. When you create a subagent, the system calls `Agent::new()` to create a new agent instance with its own isolated execution context.

There's one exception: subrecipes. Some subrecipe implementations spawn the CLI with `goose run --recipe ...`, but the team is working to unify these execution paths (see [GitHub discussion #4389](https://github.com/block/goose/discussions/4389)).

**How They're Spawned**

The main agent uses tools like `platform__create_task` and `platform__execute_tasks`. When you ask for subagents, goose creates task definitions, stores them in a TasksManager, spawns separate goose instances for execution (each in its own isolated session), and aggregates results back to the parent.

**Process Isolation**

Each subagent gets its own ExtensionManager, ToolMonitor, communication channels, and isolated context. No shared state means no conflicts between parallel subagents.

## What Happens to Chat History?

This was my main question. When subagents do work, what gets included in your main chat history?

Subagents run in completely separate sessions. The subagent has its own full conversation history with all the tool calls, reasoning, and intermediate steps. Your main session doesn't get any of that. Instead, you get task execution summary (success/failure status, execution time), task results (the actual output), and optional detailed output depending on your "return mode."

Here's what the tool output looks like:

```json
{% raw %}
{  
  "execution_summary": {  
    "total_tasks": 2,  
    "successful_tasks": 2,  
    "failed_tasks": 0,  
    "execution_time_seconds": 16.2  
  },  
  "task_results": [  
    {  
      "task_id": "create_hello_html",  
      "status": "success",  
      "result": "Successfully created hello.html with Hello World content"  
    },  
    {  
      "task_id": "create_goodbye_html",   
      "status": "success",  
      "result": "Successfully created goodbye.html with Goodbye World content"  
    }  
  ]  
}
{% endraw %}
```

You can control how much information comes back using natural language. "Create a subagent to debug this issue, I want to see the full investigation process" gives you everything. "Use a subagent to research this topic and summarize the key findings" keeps your conversation clean with just the final result.

## Security and Performance

Subagents run with restricted tool access. They can use tools from extensions inherited from the parent session, read and list resources from enabled extensions, and search for available extensions. They cannot create additional subagents (prevents infinite recursion), modify extensions, or create scheduled tasks.

Performance limits: max 10 concurrent subagents (hard-coded), 5 minute default timeout, and 25 max turns by default (override with `GOOSE_SUBAGENT_MAX_TURNS`). If a subagent fails or times out, you get no output from it. For parallel execution, if any fail, you only get results from the successful ones.

## Day 11 Challenge Experience

I used Claude Sonnet 4 through Goose, and it handled the subagent workflow really well. It understood when to delegate tasks, spawned subagents appropriately, and managed the parallel execution smoothly.

I also tried GPT-4.1, and it couldn't execute the subagents properly. Instead of spawning subagents and delegating work, it just output the project contents as a response. This shows that subagent orchestration isn't just about the infrastructure. The model needs to understand how to use the capability.

I also enabled prompt injection detection in Goose for the first time:

```
{% raw %}
🔒 Security Alert: This tool call has been flagged as potentially dangerous. 
Confidence: 95.0% 
Explanation: Detected 1 security threat: 
1. Recursive file deletion with rm -rf (Risk: Critical) 
   - Found: 'rm -rf dist && rm -rf node_modules/' 
Finding ID: SEC-4e366562751c40989b553e4f5f5df5e3
{% endraw %}
```

I allowed it since I knew it was just cleaning build artifacts. But it's good to see the security layer working.

## Practical Takeaways

**Context Management Might Be More Important Than Parallelization**

Preventing context bloat is the real killer feature. Without subagents, all that verbose tool output would pile up in your main session's context. With subagents, only the final results make it back.

**They Work for Both CLI and Desktop**

Subagents are instantiations of the core `Agent` class in Rust. Both interfaces use the same underlying code, so subagents work the same way regardless.

**Your Main Session Stays Clean**

The subagent's full conversation history stays in its separate session. Your main session only gets what matters: task results and execution summaries.

**Complete Process Isolation**

Each subagent gets its own ExtensionManager, ToolMonitor, and communication channels. No conflicts when running multiple subagents in parallel.

**Security and Performance Limits**

Subagents can't spawn more subagents, can't modify extensions, and max out at 10 concurrent instances. Default timeout is 5 minutes with 25 turns max.

If you want to learn more, check out the [official subagents documentation](https://block.github.io/goose/docs/guides/subagents/).

If you want to stay in touch, all my socials are on [nickyt.online](https://nickyt.online).

Until the next one!

Photo by <a href="https://unsplash.com/@frantic?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Alex Kotliarskyi</a> on <a href="https://unsplash.com/photos/people-doing-office-works-QBpZGqEMsKg?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
