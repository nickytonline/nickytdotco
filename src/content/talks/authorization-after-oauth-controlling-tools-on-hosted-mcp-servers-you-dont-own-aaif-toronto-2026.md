---
title: "Authorization After OAuth: Controlling Tools on Hosted MCP Servers You Don't Own"
date: 2026-12-09T18:00:00-05:00
endDate: 2026-12-09T21:00:00-05:00
upcoming: true
cover_image: /assets/talks/aaif-toronto-agentic-ai-night-2026.jpg
cover_image_large: /assets/talks/aaif-toronto-agentic-ai-night-2026.jpg
venue:
  name: "AAIF Toronto: Agentic AI Night"
  url: "https://luma.com/5lhxsfth"
  location: "Cohere Office, Downtown Toronto, ON, Canada"
registrationUrl: "https://luma.com/5lhxsfth"
videoComingSoon: true
tags: ["mcp", "security", "zero trust", "agentic ai", "oauth", "pomerium", "github"]
---

Hosted MCP servers usually give you two knobs: broad OAuth scopes upstream, and tool exposure at deploy time.

Your engineers may be allowed to do almost anything GitHub permits. Their agents should not. You might want an agent to open a pull request, but leave merging to a human. If you do not operate the hosted server, you cannot add that distinction there.

This talk shows how to close that gap with an identity-aware bridge. Pomerium sits in front of a hosted MCP server, handles OAuth for the user, evaluates per-tool and per-identity policy on each MCP call, and audits tool names and arguments. The interesting part is applying a proven proxy pattern to MCP so authorization happens at runtime, not deploy time.

I will demo this live against GitHub's hosted MCP server, with the audit log visible. The agent opens a pull request. Then we flip one policy toggle and the same agent is blocked from merging, without changing the client, server, or GitHub permissions.

GitHub is the marquee demo, but the pattern is broader: add policy and audit controls for hosted MCP servers you don't own.
