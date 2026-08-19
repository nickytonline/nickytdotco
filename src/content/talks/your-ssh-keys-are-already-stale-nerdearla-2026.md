---
title: "Your SSH Keys Are Already Stale"
date: 2026-09-25T15:45:00-03:00
endDate: 2026-09-25T16:25:00-03:00
upcoming: true
cover_image: "/assets/talks/nerdearla-ssh-title-card.png"
cover_image_large: "/assets/talks/nerdearla-ssh-title-card.png"
venue:
  name: "Nerdearla Buenos Aires"
  url: "https://nerdearla.com/en/argentina/"
  location: "Ciudad Cultural Konex, Buenos Aires, Argentina"
registrationUrl: "https://tickets.nerdearla.com/?utm_source=website&utm_medium=footer&utm_campaign=argentina2026"
tags: ["ssh", "security", "devops", "sre", "identity", "infrastructure"]
---

Someone on your team left six months ago. Their SSH key is probably still on a server somewhere.

That is the quiet horror of traditional SSH access. Keys get copied, teams change, contractors leave, and `authorized_keys` become infrastructure archaeology.

This talk takes a different approach: treating SSH as an identity-aware access problem instead of a key distribution problem. The question becomes, “should this person be allowed to connect right now?”, not “did this key get copied to the right server?”

We’ll walk through how an identity-aware proxy can handle native SSH while keeping the SSH command developers already know. Users still connect with a normal SSH client. On first use, they authenticate through a browser. The proxy checks policy and issues short-lived SSH certificates. Servers only need a trusted CA public key configured once.

That changes the operational model. New user? No keys to distribute. Contractor left? No keys to clean up later. `authorized_keys` stops being the thing you chase across every server.

We’ll also look at central policy: identity, group membership, time, username, and request context. Revoke access in one place, and the next connection reflects that immediately.

The talk ends with a live demo: first connection, authentication, certificate inspection, policy changes, and access revocation.

Attendees leave with a practical model for replacing long-lived SSH keys with short-lived, identity-backed access while keeping SSH feeling like SSH.
