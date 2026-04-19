---
title: "Claws Out: Securing and Building with OpenClaw"
date: 2026-04-09T12:40:00.000Z
venue:
  name: "AI Engineer Europe"
  url: "https://ai.engineer/europe"
tags: ["openclaw", "security", "ai", "pomerium", "zero trust"]
video:
  { "url": "https://www.youtube.com/watch?v=O_IMsEg91g8&t=14220s", "type": "youtube" }
---

Running OpenClaw without hardening access to it is a bad idea. We'll cover how I secured my OpenClaw, McClaw, contributed trusted-proxy auth mode to the OpenClaw project, and how I use it to build tools.

We're going to build something live during the talk using OpenClaw, the same way I built Clawspace, a browser-based file explorer/editor for your OpenClaw workspace.

- [feat(gateway): add trusted-proxy auth mode](https://github.com/openclaw/openclaw/pull/15940)
- [github.com/nickytonline/clawspace](https://github.com/nickytonline/clawspace) — a browser-based file explorer/editor for an OpenClaw workspace
- [github.com/pomerium/pomerium](https://github.com/pomerium/pomerium) — an open core Identity-Aware Proxy
