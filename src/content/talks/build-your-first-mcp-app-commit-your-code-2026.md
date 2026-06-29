---
title: "Build your First MCP App"
date: 2026-09-03T12:00:00.000Z
endDate: 2026-09-04T12:00:00.000Z
upcoming: true
cover_image: /assets/talks/commit-your-code-2026-thumb.jpg
cover_image_large: /assets/talks/commit-your-code-2026-cover.jpg
venue:
  name: "Commit Your Code 2026"
  url: "https://www.commityourcode.com/"
  location: "Capital One Campus, Plano, TX"
registrationUrl: "https://www.commityourcode.com/"
tags: ["mcp", "agentic ai", "pomerium", "zero trust", "security", "ai"]
---

Remote Model Context Protocol (MCP) servers expose tools, but did you know those tools can return UI, not just text?

Using the [MCP Apps extension](https://github.com/modelcontextprotocol/ext-apps) to the MCP protocol, an MCP app can deliver interactive experiences directly inside MCP hosts like Claude.ai and ChatGPT.

We'll break down what makes an MCP app, how it all comes together, then live code one from scratch using the [chatgpt-app-typescript-template](https://github.com/pomerium/chatgpt-app-typescript-template) as a starting point.

We'll tunnel it to a public URL, register it in both Claude.ai and ChatGPT, then lock down tool calling with Pomerium, an open source (Apache 2.0) MCP gateway that handles authentication, authorization, and fine-grained tool access control so you control who gets to use your MCP app and its tools.
