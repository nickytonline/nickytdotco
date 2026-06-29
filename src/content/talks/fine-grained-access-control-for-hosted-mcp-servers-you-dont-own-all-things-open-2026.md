---
title: "Fine-Grained Access Control for Hosted MCP Servers You Don't Own"
date: 2026-10-19T12:00:00.000Z
endDate: 2026-10-20T12:00:00.000Z
upcoming: true
venue:
  name: "All Things Open 2026"
  url: "https://2026.allthingsopen.org/"
  location: "Raleigh Convention Center, Raleigh, NC"
sessionUrl: "https://2026.allthingsopen.org/sessions/fine-grained-access-control-for-hosted-mcp-servers-you-dont-own"
registrationUrl: "https://2026.allthingsopen.org/register"
tags: ["mcp", "zero trust", "agentic ai", "security", "pomerium", "oauth"]
---

Hosted MCP servers are shipping fast, and each one brings its own authentication flow, scopes, and credential model. For AI agents, the default integration pattern is risky and hard to manage: give the agent credentials to every upstream service and hope the permission boundaries hold.

This talk presents a reusable pattern for placing an identity-aware proxy in front of hosted MCP servers you do not control and do not want to modify. Instead of pushing every OAuth flow and token into the agent, the proxy mediates access across services and enforces policy at the point where tool calls happen.

In a live demo, I'll show how this approach can:

- bridge authentication across multiple upstream MCP servers,
- restrict tool usage beyond coarse OAuth scopes with per-tool policy enforcement, and
- produce an audit trail for allowed and denied tool invocations.

The demo uses Pomerium, an open source identity-aware proxy licensed under Apache 2.0, but the talk focuses on the broader pattern: reducing credential sprawl, tightening agent permissions, and adding auditability to hosted MCP deployments without modifying upstream servers.
