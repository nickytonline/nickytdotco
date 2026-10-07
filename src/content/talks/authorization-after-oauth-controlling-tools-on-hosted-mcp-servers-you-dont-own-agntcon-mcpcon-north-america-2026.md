---
title: "Authorization After OAuth: Controlling Tools on Hosted MCP Servers You Don't Own"
date: 2026-10-23T22:35:00.000Z
endDate: 2026-10-23T23:00:00.000Z
upcoming: true
cover_image: /assets/talks/agntcon-mcpcon-north-america-2026.jpg
cover_image_large: /assets/talks/agntcon-mcpcon-north-america-2026.jpg
venue:
  name: "AGNTCon + MCPCon North America 2026"
  url: "https://events.linuxfoundation.org/agntcon-mcpcon-north-america/"
  location: "230A (Concourse Level), San Jose Convention Center, San Jose, CA"
sessionUrl: "https://events.linuxfoundation.org/agntcon-mcpcon-north-america/program/schedule/?id=1253860"
registrationUrl: "https://events.linuxfoundation.org/agntcon-mcpcon-north-america/register/"
tags: ["mcp", "security", "zero trust", "agentic ai", "oauth", "pomerium", "github"]
---

Hosted MCP servers usually give you two knobs: broad OAuth scopes upstream, and tool exposure at deploy time.

Your engineers may be allowed to do almost anything GitHub permits. Their agents should not. You might want an agent to open a pull request, but leave merging to a human. If you do not operate the hosted server, you cannot add that distinction there.

This talk shows how to close that gap with an identity-aware bridge. Pomerium sits in front of a hosted MCP server, handles OAuth for the user, evaluates per-tool and per-identity policy on each MCP call, and audits tool names and arguments. The interesting part is applying a proven proxy pattern to MCP so authorization happens at runtime, not deploy time.

I will demo this live against GitHub's hosted MCP server, with the audit log visible. The agent opens a pull request. Then we flip one policy toggle and the same agent is blocked from merging, without changing the client, server, or GitHub permissions.

GitHub is the marquee demo, but the pattern is broader: add policy and audit controls for hosted MCP servers you don't own.
