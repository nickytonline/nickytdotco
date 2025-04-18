---json
{
  "title": "Rethinking Authorization in the Age of AI Agents",
  "excerpt": "We’re entering the age of agentic AI — where software agents, not just users, are taking action on...",
  "date": "2025-04-18T13:56:33.941Z",
  "tags": [
    "mcp",
    "agenticai",
    "ai"
  ],
  "cover_image": "https://www.nickyt.co/images/posts/_dynamic_image_width=1000,height=420,fit=cover,gravity=auto,format=auto_https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2F62a9s0vzblgp7gnjtv83.jpg",
  "canonical_url": "https://dev.to/pomerium/rethinking-authorization-in-the-age-of-ai-agents-110c",
  "reading_time_minutes": 1,
  "template": "post"
}
---

We’re entering the age of agentic AI — where software agents, not just users, are taking action on our behalf.

With standards like the [Model Context Protocol](https://modelcontextprotocol.io/introduction) (MCP) are making this more seamless by letting agents access tools and services in a structured, context-aware way. But here's the catch: most existing authorization models weren’t built for this kind of actor.

[OAuth](https://en.wikipedia.org/wiki/OAuth), [role based access control](https://en.wikipedia.org/wiki/Role-based_access_control) (RBAC), and traditional session-based models assume a user is behind every request. With agentic systems, intent is often delegated, context can shift dynamically, and agents might act across boundaries we didn’t originally model. Who's responsible? What are they allowed to do? And how do we reason about trust when the actor isn't a person?

We need to start thinking beyond human-centric auth — and my co-worker [Bobby](https://www.linkedin.com/in/bobby-desimone/)’s post, "Agentic Access Is Here. Your Authorization Model Is Probably Broken.", makes a great case for why.

Give it a read and let me know what you think!

{% embed "https://thenewstack.io/agentic-access-is-here-your-authorization-model-is-probably-broken/" %}

Photo by <a href="https://unsplash.com/@omilaev?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Igor Omilaev</a> on <a href="https://unsplash.com/photos/two-hands-touching-each-other-in-front-of-a-pink-background-gVQLAbGVB6Q?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>
