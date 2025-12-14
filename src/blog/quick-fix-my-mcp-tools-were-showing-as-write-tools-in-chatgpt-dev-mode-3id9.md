---json
{
  "title": "Quick Fix: My MCP Tools Were Showing as Write Tools in ChatGPT Dev Mode",
  "excerpt": "I recently enabled ChatGPT developer mode and noticed something weird: all my dev.to MCP server tools...",
  "date": "2025-09-11T02:17:14.309Z",
  "tags": [
    "chatgpt",
    "mcp",
    "typescript",
    "ai"
  ],
  "cover_image": "https://www.nickyt.co/images/posts/_dynamic_image_width=1000,height=420,fit=cover,gravity=auto,format=auto_https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Fohri44xa5yin75q1l594.jpg",
  "canonical_url": "https://www.nickyt.co/blog/quick-fix-my-mcp-tools-were-showing-as-write-tools-in-chatgpt-dev-mode-3id9/",
  "reading_time_minutes": 2,
  "template": "post",
  "series": {
    "name": "Series 33658",
    "collection_id": 33658
  }
}
---

I recently enabled [ChatGPT developer mode](https://platform.openai.com/docs/guides/developer-mode) and noticed something weird: all my dev.to MCP server tools were showing up as write tools, even though they're purely read-only operations that just fetch data.

Turns out there are [additional MCP tool annotations](https://modelcontextprotocol.io/docs/concepts/tools#available-tool-annotations) I wasn't using that fix this issue.

## The Fix

I added `readOnlyHint` and `openWorldHint` annotations to all my tools:

```typescript
{% raw %}
server.registerTool("get_articles", {
  description: "Get articles from dev.to",
  annotations: {
    readOnlyHint: true,
    openWorldHint: true
  },
  // ... rest of tool definition
});
{% endraw %}
```

Here's the PR

{% embed "https://github.com/nickytonline/dev-to-mcp/pull/4" %}

## The Result

Now my tools properly show up as read-only in ChatGPT dev mode instead of being mislabeled as write tools.

![ChatGPT in dev mode showing the tools for the dev.to MCP server](https://www.nickyt.co/images/posts/_uploads_articles_n9odbdd7dntgkw035t2u.png)

Thanks to my coworker [@wasaga](https://github.com/wasaga) for pointing me toward that part of the MCP docs!

If you're building MCP servers, check out the [available tool annotations](https://modelcontextprotocol.io/docs/concepts/tools#available-tool-annotations) to make sure your tools are properly labeled.

Want to check out the dev.to MCP server? 👇 Also, don't forget to give it a star!

{% embed "https://github.com/nickytonline/dev-to-mcp" %}

Until the next one peeps!

If you want to stay in touch, all my socials are on [nickyt.online](https://nickyt.online). Like dev tips? Check out [OneTipAWeek.com](https://OneTipAWeek.com)!

Photo by <a href="https://unsplash.com/@tonchik?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Anton Savinov</a> on <a href="https://unsplash.com/photos/a-bunch-of-tools-hanging-up-on-a-wall-2Qlj2Gaft7w?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>
