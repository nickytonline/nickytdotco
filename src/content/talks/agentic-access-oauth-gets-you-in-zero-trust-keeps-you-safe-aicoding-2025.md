---
title: "Agentic Access: OAuth Gets You In, Zero Trust Keeps You Safe"
date: 2025-10-23T00:00:00.000Z
venue:
  name: "AI Coding Summit 2025"
  url: "https://aicodingsummit.com/"
tags:
  [
    "mcp",
    "agentic ai",
    "zero trust",
    "ai",
    "oauth",
    "security",
    "aicoding-summit",
  ]
video:
  {
    "url": "https://gitnation.com/contents/agentic-access-oauth-gets-you-in-zero-trust-keeps-you-safe",
    "type": "custom",
    "image":
      {
        "url": "/assets/talks/agentic-access-oauth-gets-you-in-zero-trust-keeps-you-safe.png",
        "width": 1920,
        "height": 1080,
      },
  }
slideDeck: https://docs.google.com/presentation/d/e/2PACX-1vS9MVMw2s-XWquo-yu_NOHvYMd9oQcL6HFDS04vfbwTVEtHNxpH0B1bVCyjZvury40Xhd1DPttqa6G9/pub?start=false&loop=false&delayms=5000
---

AI agents are no longer experimental. Developers are already using them to query APIs, modify content, and chain services using emerging protocols like MCP (Model Context Protocol). The latest MCP specification introduces modern OAuth 2.1 authentication and support for Resource Indicators (RFC 8707), strengthening identity in agent-based systems.

But authentication alone does not guarantee control. Once an agent is logged in, how do you govern what it is allowed to do? Without proper authorization controls, agents can access far more resources than they need, creating significant security risks.

This talk explores how to apply Zero Trust principles to agent workflows by combining open identity protocols with policy-aware infrastructure. You will see a demo of an MCP client interacting with a secured MCP server behind Pomerium, an open source identity-aware proxy that brings fine-grained access control to agent interactions. Beyond basic authentication, Pomerium evaluates per-request policies based on identity, route, and context, and can audit and block specific tool calls within the MCP protocol. It can even manage OAuth flows to upstream tools like Notion or Reddit, so agents never handle raw access tokens.

What you will learn:

- Why OAuth is necessary but not sufficient for agent security
- How to apply Zero Trust to developer tools and AI workflows
- A practical example of securing MCP servers with open source infrastructure

As AI agents become part of real-world developer workflows, open standards and secure defaults are key to building trust without adding friction. These security patterns apply beyond just AI systems to any automated tooling that needs controlled access to APIs and services.

_*This talk has been presented at AI Coding Summit, check out the latest edition of this [Tech Conference](https://aicodingsummit.com/).*_
