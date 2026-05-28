---
title: "Zero Trust Infrastructure for AI Agents: Securing Your Development Workflow"
date: 2026-05-27T08:00:00.000Z
venue:
  name: "DevOpsDays Sibiu 2026"
  url: "https://devopsdays.org/events/2026-sibiu/"
tags: ["mcp", "agentic ai", "zero trust", "ai", "oauth", "security", "devopsdays"]
slideDeck: https://docs.google.com/presentation/d/e/2PACX-1vSLUv1c_IqXnqm8gUIsT0uxHab9aKdclxxLMX6HCITBgdxlcn8_mduSg65ZdwfsjWjSRvGNC4TyZZDC/pub?start=false&loop=false&delayms=5000&slide=id.g35ee33cdc91_0_1
---

Your team wants to ship AI assistants that interact with internal systems, modify configurations, and automate workflows. Security wants to know what those agents can actually do and whether anything is being audited. OAuth alone does not bridge that gap because its scopes were never designed for AI-driven automation and are typically too coarse-grained for agents acting on your behalf.

This talk walks through building secure AI agent infrastructure from day one using Zero Trust patterns and the Model Context Protocol (MCP). The approach is a dual-layer architecture: an Identity-Aware Proxy in front of MCP servers, paired with fine-grained authorization policies that govern exactly which tool calls an agent can make.

We'll see it live against the GitHub MCP server, with an agent permitted to open pull requests but blocked from merging, plus the audit trail to prove it. Everything shown is open source and deployable, so you leave with a working reference implementation rather than a slide-ware pattern.

- [github.com/pomerium/pomerium](https://github.com/pomerium/pomerium) — an open core Identity-Aware Proxy
- [github.com/nickytonline/github-mcp-http](https://github.com/nickytonline/github-mcp-http) - a fork of the GitHub MCP server
- [github.com/nickytonline/mcp-typescript-template](https://github.com/nickytonline/mcp-typescript-template) — a template for building your own MCP server in TypeScript
