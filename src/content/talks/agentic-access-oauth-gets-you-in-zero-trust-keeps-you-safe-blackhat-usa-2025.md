---
title: "Agentic Access: OAuth Gets You In, Zero Trust Keeps You Safe"
date: 2025-08-06T17:50:00.000Z
venue:
  name: "BlackHat USA 2025"
  url: "https://www.blackhat.com/us-25/"
video: { "url": "https://youtu.be/V33Go0nIufs", "type": "youtube" }
tags: ["mcp", "agentic ai", "zero trust", "ai", "oauth", "security"]
---

AI agents are no longer speculative—they're querying APIs, rewriting records, and chaining tools via protocols like MCP (Model Context Protocol). The latest MCP spec requires OAuth 2.1 and Resource Indicators (RFC 8707), strengthening identity security while leaving authorization up to the implementer. But OAuth alone can't enforce what an agent does after login—or whether it should act at all.

This talk explores the limits of OAuth in agentic systems and shows how Zero Trust fills the gap. We'll demo an AI agent interacting with an MCP server behind Pomerium, enforcing per-request policies based on identity, route, and context—not just token validity.

You'll see:

- How OAuth-compliant agents can overreach in loosely scoped systems
- How Zero Trust policies prevent intent misuse and lateral movement
- A real-world example of securing MCP access with Pomerium

Even with strong authentication, the risk isn't just who gets in—it's what they do next. And when agents act faster than users, authorization has to evolve too.
