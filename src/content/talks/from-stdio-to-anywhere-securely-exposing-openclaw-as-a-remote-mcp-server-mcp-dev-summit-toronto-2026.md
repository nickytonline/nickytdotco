---
title: "From stdio to Anywhere: Securely Exposing OpenClaw as a Remote MCP Server"
date: 2026-10-05T15:50:00-04:00
endDate: 2026-10-05T16:15:00-04:00
upcoming: true
cover_image: /assets/talks/openclaw-remote-mcp-mcp-dev-summit-toronto-2026.png
cover_image_large: /assets/talks/openclaw-remote-mcp-mcp-dev-summit-toronto-2026.png
venue:
  name: "MCP Dev Summit Toronto"
  url: "https://events.linuxfoundation.org/mcp-dev-summit-toronto/"
  location: "Giovanni, The Conference Centre at the University of Toronto, Toronto, ON"
sessionUrl: "https://events.linuxfoundation.org/mcp-dev-summit-toronto/program/schedule/?id=1287268"
tags: ["mcp", "openclaw", "security", "identity", "trust", "oauth", "pomerium"]
---

OpenClaw’s first-party MCP bridge only supports stdio, so hosted clients such as ChatGPT and Claude cannot connect to it. Making it available over Streamable HTTP solves the transport problem, but raises a harder question: how do you preserve authenticated user identity all the way into OpenClaw?

This talk shows how OpenClaw’s trusted-proxy authentication mode, [a Gateway feature I implemented upstream](https://docs.openclaw.ai/gateway/trusted-proxy-auth), can bridge that gap. An identity-aware proxy handles the MCP OAuth flow, evaluates access policy, and rejects unauthorized requests before they reach the bridge. The bridge then carries the authenticated identity into OpenClaw through trusted-proxy auth mode, instead of bypassing authentication or falling back to a shared token.

I will live-demo the full flow using Pomerium, an open core identity-aware proxy: a hosted MCP client, OAuth and policy enforcement, a Streamable HTTP bridge, and an unmodified OpenClaw Gateway. Attendees will leave with an open source blueprint for securely exposing a self-hosted assistant as a remote MCP server.
