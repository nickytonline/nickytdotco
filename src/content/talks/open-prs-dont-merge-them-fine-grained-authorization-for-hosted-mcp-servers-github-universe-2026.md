---
title: "Open PRs, don't merge them: Fine-grained authorization for hosted MCP servers"
date: 2026-10-29T10:20:00.000-07:00
upcoming: true
cover_image: "/assets/talks/github-universe-2026-talk.jpg"
cover_image_large: "/assets/talks/github-universe-2026-talk.jpg"
venue:
  name: "GitHub Universe 2026"
  url: "https://reg.githubuniverse.com/flow/github/universe26/attendee-portal/page/sessioncatalog/session/1777489102123001ThSM"
  location: "San Francisco, CA"
sessionUrl: "https://reg.githubuniverse.com/flow/github/universe26/attendee-portal/page/sessioncatalog/session/1777489102123001ThSM"
registrationUrl: "https://githubuniverse.com/"
tags: ["mcp", "security", "zero trust", "agentic ai", "oauth", "pomerium", "github"]
---

Hosted MCP servers all work the same way: OAuth in, broad scope out. One global toggle decides which tools to expose, and every authenticated identity gets the full set. So every agent inherits everything its human can do.

Teams often want something more precise. Maybe an agent should open a pull request and leave the merge to a human. Today the upstream server can't express that, and you can't change it because it isn't yours. This session shows a pattern that works today: an identity-aware proxy that adds per-identity authorization in front of any hosted MCP server, with no changes upstream.

You'll see it live — Copilot opening a PR and leaving the merge to a reviewer, enforced per user — and you'll leave with a working pattern for the MCP servers your team already depends on.

> This is a popular session. Seating isn't guaranteed — arrive about 20 minutes early for the best chance of getting a seat.
