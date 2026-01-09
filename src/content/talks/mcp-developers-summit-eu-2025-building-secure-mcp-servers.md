---
title: "Secure from Day One: Building Production Ready MCP Servers"
date: 2025-10-02T06:00:00.000Z
venue:
  name: "MCP Developers Summit EU 2025"
  url: "https://mcpdevsummit.ai/"
tags: ["mcp", "security", "oauth", "identity", "zero trust", "ai"]
video:
  { "url": "https://www.youtube.com/watch?v=_wtJzDf068w", "type": "youtube" }
slideDeck: "https://docs.google.com/presentation/d/e/2PACX-1vQeCiB__9gwoTMDI_Zu8PcRg5GpgGNfu4TqGAwDiiRjw2dWfeKBQZwU9e8mrRxcN74dtAvQ68zXPt0w/pub?start=false&loop=false&delayms=5000"
---

The Model Context Protocol (MCP) is transforming how AI agents interact with APIs and data, but many MCP servers are built like prototypes, leaving security as an afterthought instead of a core part of the development workflow. This session blends explanation with live coding to show how to build security in from day one. We start with an MCP server that has no authentication, add OAuth 2.1 support, and then show how organizations can unify identity and access control using an open-source identity-aware proxy such as Pomerium.

Along the way, we highlight common security gaps including missing OAuth flows, inconsistent token validation, and unscoped tool exposure. You will see how to apply fine-grained, context-aware policies that protect not only the MCP server itself but also individual tools based on user identity and session context. Attendees will leave with a clear understanding of secure MCP patterns and a path to production-ready deployments.
