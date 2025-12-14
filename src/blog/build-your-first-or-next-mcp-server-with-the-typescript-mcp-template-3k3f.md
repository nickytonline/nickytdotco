---json
{
  "title": "Build Your First (or Next) MCP Server with the TypeScript MCP Template",
  "excerpt": "Build Your First (or Next) MCP Server with the TypeScript MCP Template   If you've been...",
  "date": "2025-10-07T04:30:00.075Z",
  "tags": [
    "typescript",
    "mcp",
    "ai"
  ],
  "cover_image": "https://www.nickyt.co/images/posts/_dynamic_image_width=1000,height=420,fit=cover,gravity=auto,format=auto_https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Fqk9desvu661fsof3htv6.jpg",
  "canonical_url": "https://www.nickyt.co/blog/build-your-first-or-next-mcp-server-with-the-typescript-mcp-template-3k3f/",
  "reading_time_minutes": 6,
  "template": "post",
  "series": {
    "name": "Series 33658",
    "collection_id": 33658
  }
}
---

# Build Your First (or Next) MCP Server with the TypeScript MCP Template

If you've been wanting to build your own Model Context Protocol (MCP) server but weren't sure where to start, I've got something that might save you a bunch of time. I recently extracted a TypeScript template from my real-world MCP projects that handles all the boilerplate and lets you focus on what actually matters: building your tools and resources.

{% embed "https://github.com/nickytonline/mcp-typescript-template" %}

## MCP Is Still Pretty New

Here's the thing: MCP is still pretty new, and people are just starting to explore building their own servers. There aren't a ton of templates and starter projects out there yet, so I decided to create one.

After building the [dev.to MCP server](https://dev.to/nickytonline/introducing-the-devto-mcp-server-42jg), I realized I had a solid foundation that other folks could benefit from. So I extracted all the good parts (the TypeScript config, the MCP SDK integration, the Vite bundling setup, and Node.js's type-stripping development mode starting from v22.18.0) into a template anyone can use.

{% embed "https://dev.to/nickytonline/introducing-the-devto-mcp-server-42jg" %}

Just yesterday, I used this template to spin up my new [Pimp My Ride MCP server](https://github.com/nickytonline/pimp-my-ride-mcp). I was able to vibe code with the template in about 30 minutes to build my new MCP server.

![An animated version of Xzibit with two cars on his head](https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExcnBtcTZmZm1qamg5b3QzcXcwNXpvZWtmdTJ1cG5tNDM1ZWxjdnRmeiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/xmf00ANvBCTzG/giphy.gif)

## What You Get Out of the Box

This template comes loaded with everything you need for modern MCP server development:

**MCP Foundation:**
- Built on the official [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)
- HTTP Streamable transport (not SSE, which is deprecated)
- Express-based server for handling MCP connections (I'm a fan of [Hono.js](https://hono.dev/), but the MCP SDK leans on Express, so that's what we're using here)
- Ready-to-extend structure for tools and resources

**Modern TypeScript Development:**
- Live reload using Node.js's built-in type stripping during development (Node.js 22.18.0+, no build step needed while coding)
- Vite for production-ready ES module bundling
- Full TypeScript support with sensible defaults

**Quality Tools:**
- Vitest for testing
- ESLint and Prettier configured and ready to go with sensible defaults
- [Zod](https://zod.dev/) for runtime validation of environment variables and tool inputs

**Production Ready:**
- Express-based MCP server setup
- Pino for structured logging
- Docker support included
- Environment configuration through a clean config layer

## Getting Started

GitHub makes it easy to use this as a starting point. Instead of forking, you can [create a repository from the template](https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-repository-from-a-template#creating-a-repository-from-a-template). Just click "Use this template" on the repo page, give your new MCP server a name, and you're good to go.

Once you've created your repo from the template:

```bash
{% raw %}
git clone https://github.com/YOUR_USERNAME/your-mcp-server.git
cd your-mcp-server
npm install
npm run dev
{% endraw %}
```
or my favourite, leverage the GitHub CLI

```
{% raw %}
gh repo clone YOUR_USERNAME/your-mcp-server
{% endraw %}
```

New to the GitHub CLI? Check out 👇

{% embed "https://dev.to/opensauced/boost-productivity-with-the-github-cli-2mne" %}

## The Project Structure

Here's how everything's organized:

```
{% raw %}
src/
├── index.ts        # Your MCP Express server lives here
├── config.ts       # Environment variable validation with Zod
├── logger.ts       # Pino logging setup
└── lib/            # Your tools, resources, and helpers
    └── utils.test.ts  # Tests colocated with code
{% endraw %}
```

Your server code goes in `src/index.ts`, reusable utilities and MCP tools live in `src/lib/`, and tests sit right next to the code they're testing. Tool input schemas use Zod for runtime validation, so you get type safety and validation in one shot.

## Testing with Vitest

```bash
{% raw %}
npm run test        # Interactive mode for development
npm run test:ci     # CI mode with JSON output
{% endraw %}
```

Write your tests in `*.test.ts` files colocated to what it's testing

## Configuration Through Environment Variables

All configuration comes through environment variables, validated with Zod and parsed in `src/config.ts`:

- `PORT` - Server port (default: 3000)
- `SERVER_NAME` - Your server's name
- `LOG_LEVEL` - Pino log level (info, debug, etc.)

The Zod schema ensures your environment variables are valid at startup, so you catch config issues early instead of at runtime. Add new config values by extending the schema in `src/config.ts`. No hard-coded secrets, everything's validated and documented with defaults.

## Logging with Pino

Pino is wired up and ready for structured logging. Just import the logger and use it:

```typescript
{% raw %}
import logger from './logger';

logger.info({ userId: 123 }, 'User logged in');
logger.error({ error: err }, 'Something broke');
{% endraw %}
```

The logs are structured JSON in production and pretty-printed during development. Perfect for debugging locally and parsing in production.

## Linting and Formatting

The template comes with ESLint and Prettier pre-configured:

```bash
{% raw %}
npm run lint        # Check for issues
npm run lint:fix    # Auto-fix what we can
npm run format      # Format everything
npm run format:check  # CI-friendly format check
{% endraw %}
```

The rules are sensible: two-space indent, double quotes, trailing commas, and TypeScript-aware linting that catches the stuff that matters. Unused variables prefixed with `_` are fine (because sometimes you need that for API contracts), and `any` is discouraged but not forbidden.

## Production Ready

When you're ready to ship:

```bash
{% raw %}
npm run build  # Compile to dist/
npm start      # Run the compiled version
{% endraw %}
```

Or use the included Dockerfile:

```bash
{% raw %}
docker build -t my-mcp-server .
docker run -p 3000:3000 my-mcp-server
{% endraw %}
```

**Securing Your MCP Server**

If you're deploying your MCP server remotely (not just localhost), the [MCP security best practices](https://modelcontextprotocol.io/specification/2025-06-18/basic/security_best_practices) recommend using a proxy or gateway for authentication and authorization. I use [Pomerium to secure my MCP servers](https://www.pomerium.com/docs/capabilities/mcp) since it handles auth and access policies without me having to build that stuff myself. It's how I secure the dev.to MCP server and pimp-my-ride-mcp in production.

Full disclosure: I work at Pomerium, but I'd be using it for this even if I didn't. Managing auth and access control for remote services is a pain, and having a proxy that handles it cleanly is genuinely useful.

## Why This Setup Works

After building the dev.to MCP server and now pimp-my-ride-mcp with this setup, here's what I appreciate most:

1. **The dev loop is fast.** Node.js 22.18.0+ includes built-in type stripping, which means instant reloads without a build step during development.
2. **Vite handles production bundling.** When you're ready to ship, Vite compiles everything into clean ES modules.
3. **The MCP SDK integration is straightforward.** You can focus on building tools and resources, not wrestling with protocol details.
4. **It's opinionated but not rigid.** You can swap out pieces if you want, but the defaults work great.

## What's Next

I've got an [OAuth 2.0 PR in the works](https://github.com/nickytonline/mcp-typescript-template/pull/2) that streamlines authentication and adds coarse-grained authorization. Should be merged soon.

{% embed "https://github.com/nickytonline/mcp-typescript-template/pull/2" %}

Clone the template and start building your MCP server. Whether you're exposing an API (like I did with the [dev.to MCP server](https://github.com/nickytonline/dev-to-mcp)), wrapping a database, or creating custom tools for your AI workflow (like [pimp-my-ride-mcp](https://github.com/nickytonline/pimp-my-ride-mcp)), the template handles the boring parts so you can focus on the interesting problems.

Check out the [template repo](https://github.com/nickytonline/mcp-typescript-template) and give it a star if you find it useful. And if you build something cool with it, let me know!

If you want to stay in touch, all my socials are on [nickyt.online](https://nickyt.online).

Until the next one!

Photo by <a href="https://unsplash.com/@homaappliances?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Homa Appliances</a> on <a href="https://unsplash.com/photos/a-factory-with-a-lot-of-machines-in-it-5hPe-Tr2wog?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>
