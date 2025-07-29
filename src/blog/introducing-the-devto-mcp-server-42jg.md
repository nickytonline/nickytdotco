---json
{
  "title": "Introducing the dev.to MCP server",
  "excerpt": "If you've been wondering how to get your AI tools talking to dev.to's content without building yet...",
  "date": "2025-07-29T03:55:35.681Z",
  "tags": [
    "mcp",
    "agenticai",
    "devto",
    "ai"
  ],
  "cover_image": "https://www.nickyt.co/images/posts/_dynamic_image_width=1000,height=420,fit=cover,gravity=auto,format=auto_https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Fpuvgni3pd332f3uqdwhi.jpg",
  "canonical_url": "https://www.nickyt.co/blog/introducing-the-devto-mcp-server-42jg/",
  "reading_time_minutes": 4,
  "template": "post"
}
---

If you've been wondering how to get your AI tools talking to dev.to's content without building yet another custom integration, I've got something that might interest you. I recently built an MCP server for dev.to that makes this whole thing a lot more straightforward.

{% embed "https://github.com/nickytonline/dev-to-mcp" %}

Why? Well, a couple of reasons. One, I used to work at Forem, so dev.to is near and dear to my heart. The other reason is because I've been doing a lot of work in the MCP space recently.

{% embed "https://www.youtube.com/watch?v=KY1kCZkqUh0" %}

{% embed "https://github.com/pomerium/mcp-app-demo" %}

## What's MCP All About?

Let me back up a bit. [The Model Context Protocol](https://modelcontextprotocol.io/docs/getting-started/intro) (MCP) is Anthropic's open standard for connecting AI models to external data sources.

MCP is like having a standardized way for any AI system to talk to external resources without reinventing the wheel every time. It's been dubbed "the USB-C for AI."

## What dev-to-mcp Does

The dev-to-mcp server exposes [dev.to's public API](https://developers.forem.com/api) through six focused tools. Here's what you get:

**Content Discovery:**

- `get_articles` - Filter by author, tag, popularity, publication state
- `search_articles` - Full-text search across all of dev.to's content  
- `get_tags` - Access trending tags and topics

For example, ask to get the latest React articles

![getting latest react articles using the dev.to mcp server in VS Code](https://www.nickyt.co/images/posts/_uploads_articles_pn4jrhuh22hzoev8iz4q.gif)

**Content Access:**

- `get_article` - Grab specific articles by ID or URL path
- `get_user` - Pull author profiles and user info
- `get_comments` - Read through article discussions and comment threads

Here I am asking for my articles:

In VS Code:

![dev.to MCP server running in VS Code](https://www.nickyt.co/images/posts/_uploads_articles_lzgklq2yswknlrh3lv9y.gif)

In the [Pomerium MCP app demo](https://github.com/pomerium/mcp-app-demo).

![dev.to MCP server running in the Pomerium MCP app demo](https://www.nickyt.co/images/posts/_uploads_articles_ws6g3hy499m5glc9zxgz.png)

In Goose:

![dev.to MCP server running in Goose](https://www.nickyt.co/images/posts/_uploads_articles_ulwvcfxq2rvtxw9ymvjb.gif)

## Real-World Use Cases

Once your AI has direct access to dev.to's ecosystem, you can do things like:

- Research the latest React patterns by pulling top articles tagged with "react"
- Track specific authors' posting patterns and expertise areas
- Analyze community discussions to understand developer sentiment on new technologies
- Generate content recommendations based on trending topics and engagement

The possibilities get interesting when you start combining different searches and analyses.

## Getting It Running

The setup is pretty straightforward:

```bash
{% raw %}
npm install
npm run build  
npm start
{% endraw %}
```

That's it. Your MCP server is now running on `http://localhost:3000` and ready to serve up dev.to data. Use it in your favourite MCP client, like VS Code, Claude, Goose, etc.

For development, there's watch mode:
```bash
{% raw %}
npm run dev
{% endraw %}
```

And if you want to deploy it via Docker:

```bash
{% raw %}
docker build -t dev-to-mcp .
docker run -p 3000:3000 dev-to-mcp
{% endraw %}
```

However you run it, remember that the URL when you register it in an MCP client like VS Code will be e.g. `http://localhost:3000/mcp`


!['"dev.to MCP": {
	"url": "http://localhost:3000/mcp",
	"type": "http"
},'](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/rnybtg68ehrogk7q01oq.png)



## Under the Hood

The MCP server leverages the MCP TypeScript SDK and Vite for a clean, modern development experience.

{% embed "https://github.com/modelcontextprotocol/typescript-sdk" %}

## What's Next

This is meant to be the dev.to public API server. You obviously have access to additional API calls with a dev.to API key as well, but for the initial release, I omitted that to keep things simple.

It'd be neat if you could register an OAuth app to avoid API keys altogether. That way, it could be deployed with the additional user-specific endpoints without exposing keys.

@ben, if you want to host it officially, I think that'd be awesome, and I'd also be happy to move it to the forem org if there's interest.

For those interested in trying it out if you don't feel like deploying it yourself, it's available at https://devto.mcp.maisonlab.dev. If you try to use it, you'll be denied, so if you're OK with sending me your email address, I can add you to the [Pomerium policy](https://www.pomerium.com/docs/reference/routes/policy) to give you access.

That's it! Check out the repo and give it a star if you find it useful. 😎

If you want to stay in touch, all my socials are on [nickyt.online](https://nickyt.online).

Photo by <a href="https://unsplash.com/@siderius_creativ?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Gerard Siderius</a> on <a href="https://unsplash.com/photos/a-robot-holding-a-gun-next-to-a-pile-of-rolls-of-toilet-paper-YeoSV_3Up-k?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>
