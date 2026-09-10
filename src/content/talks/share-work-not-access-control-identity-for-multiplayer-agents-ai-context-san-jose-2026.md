---
title: "Share Work, Not Access: Control & Identity for Multiplayer Agents"
date: 2026-09-23T11:30:00-07:00
endDate: 2026-09-23T11:55:00-07:00
upcoming: true
cover_image: /assets/talks/ai-context-san-jose-2026-thumb.jpg
cover_image_large: /assets/talks/ai-context-san-jose-2026-cover.jpg
venue:
  name: "AI Context San Jose"
  url: "https://www.aicontextseries.com/san-jose"
  location: "AI Context Room 1, CreaTV San José, 38 S Second St, San Jose, CA"
sessionUrl: "https://www.aicontextseries.com/san-jose"
registrationUrl: "https://www.aicontextseries.com/san-jose"
promo: >-
  If you're coming to AI Context San Jose, tickets are **50% off**
  with code [**NICKTAYLOR50**](https://luma.com/sanjose26?coupon=NICKTAYLOR50).
  Use it when you [register on Luma](https://luma.com/sanjose26?coupon=NICKTAYLOR50).
tags:
  [
    "agentic ai",
    "identity",
    "security",
    "zero trust",
    "authorization",
    "pomerium",
  ]
---

The moment a second person joins an AI agent's conversation, whose permissions does the agent use? Current systems like Claude Tag basically force broad permission scoped at the channel level.

Multiplayer agents also break the assumption that one session represents one user. When developers, operators, and security teams work through the same agent, combining their permissions can turn collaboration into privilege escalation.

This talk introduces the concept of run identity. Run identity binds each agent action to the person who approved it, the workload that executes it, the associated context, and the task in progress.

I'll show a live Slack demo where one colleague asks an agent to inspect production logs and is denied. A second colleague joins the same investigation and succeeds under a separate identity. The first colleague never inherits that access.

We'll look at when and where the current privilege model would result in fairly serious if subtle consequences, and how deterministic authorization outside the agent loop makes secure collaboration possible. The future of multiplayer agents should mean sharing work, not access.
