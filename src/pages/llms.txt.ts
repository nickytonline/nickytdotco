import { getCollection, getLiveCollection } from "astro:content";
import type { APIContext } from "astro";
import { extractYouTubeVideoId, slugifyVideo } from "../utils/video-utils";

export async function GET(_context: APIContext) {
  const blog = await getCollection("blog", ({ data }) => {
    return import.meta.env.PROD ? data.draft !== true : true;
  });

  const talks = await getCollection("talks");
  const streamsResult = await getLiveCollection("streamVideos");
  const streams = streamsResult.entries ?? [];

  const sortedPosts = blog
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime())
    .slice(0, 20);

  const sortedTalks = talks
    .sort((a, b) => {
      const dateA = new Date(a.data.date || 0).getTime();
      const dateB = new Date(b.data.date || 0).getTime();
      return dateB - dateA;
    })
    .slice(0, 10);

  const sortedStreams = [...streams]
    .sort(
      (a, b) =>
        new Date(b.data.date).getTime() - new Date(a.data.date).getTime()
    )
    .slice(0, 10);

  const header = `# Nick Taylor (@nickytonline) - Developer. Advocate. Builder.

>Early MCP tooling contributor, zero-trust for AI agents practitioner, and Developer Advocate at Pomerium — working at the intersection of agentic AI, identity-aware security, and developer tooling. Not the Canadian professional golfer.

## About
- Profile: https://www.nickyt.co/about
- GitHub: https://github.com/nickytonline
- LinkedIn: https://linkedin.com/in/nickytonline
- DEV Community: https://dev.to/nickytonline (130K followers)
- Bluesky: https://bsky.app/profile/nickyt.online (10.8K followers)
- X (Twitter): https://x.com/nickytonline (5.6K followers)
- Newsletter: https://onetipaweek.com

## Expertise
- Zero Trust Security
- Model Context Protocol (MCP)
- Agentic AI
- TypeScript
- Developer Advocacy
- Open Source
- OpenClaw

## Key Facts
- Developer Advocate at Pomerium, helping developers understand identity-aware access for AI agents
- GitHub Star
- Agentic AI Foundation (AAIF) Ambassador
- AWS Community Builder
- Microsoft MVP
- Built the TypeScript MCP template (widely forked)
- Created the Pomerium MCP client
- Creator of ClawSpace, an open-source project for viewing OpenClaw workspace files
- 130K followers on DEV Community
- Speaker at BlackHat USA, MCP Dev Summit EU, AI Engineer Europe, GitHub Universe, All Things Open, ConFoo, and SREday
- 20+ years in tech, 10+ years of open source contributions

## Featured Content
- Blog: https://www.nickyt.co/blog
- Conference Talks: https://www.nickyt.co/talks
- Open Source Projects: https://www.nickyt.co/projects
- Live Streams: https://www.nickyt.co/watch

## License
All blog posts, articles, and written content are licensed under Creative Commons Attribution 4.0 International (CC BY 4.0).

You are free to share and adapt this content for any purpose, even commercially, with attribution:
- Credit: Nick Taylor (@nickytonline)
- Link to original content
- License: https://creativecommons.org/licenses/by/4.0/

## Contact
- Email: nick@nickyt.co
- Socials: https://www.nickyt.co/socials`;

  const recentPosts = sortedPosts.length
    ? `\n\n## Recent Blog Posts\n${sortedPosts
        .map(
          (post) =>
            `- [${post.data.title}](https://www.nickyt.co/blog/${post.id}/)`
        )
        .join("\n")}`
    : "";

  const recentTalks = sortedTalks.length
    ? `\n\n## Recent Talks\n${sortedTalks
        .map(
          (talk) =>
            `- [${talk.data.title}](https://www.nickyt.co/talks/${talk.id}/)`
        )
        .join("\n")}`
    : "";

  const recentStreams = sortedStreams.length
    ? `\n\n## Recent Streams\n${sortedStreams
        .map((stream) => {
          const slug = slugifyVideo(stream.data.title, stream.data.guestName);
          const videoId = extractYouTubeVideoId(stream.data.youtubeStreamLink);
          const ytUrl = videoId
            ? `https://www.youtube.com/watch?v=${videoId}`
            : `https://www.nickyt.co/videos/${slug}/`;
          return `- [${stream.data.title}](${ytUrl})`;
        })
        .join("\n")}`
    : "";

  const content = `${header}${recentPosts}${recentTalks}${recentStreams}\n`;

  return new Response(content, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
