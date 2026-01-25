import { getCollection } from "astro:content";
import type { APIContext } from "astro";

export async function GET(_context: APIContext) {
  const blog = await getCollection("blog", ({ data }) => {
    return import.meta.env.PROD ? data.draft !== true : true;
  });

  const talks = await getCollection("talks");
  const streams = await getCollection("streams");

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

  const sortedStreams = streams
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime())
    .slice(0, 10);

  const header = `# Nick Taylor (@nickytonline) - Software Developer

> Microsoft MVP, GitHub Star, and Developer Advocate at Pomerium with 20+ years in tech and a decade of open source contributions. Not the Canadian professional golfer.

## About
- Profile: https://www.nickyt.co/about
- GitHub: https://github.com/nickytonline
- Newsletter: https://onetipaweek.com

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
            `- [${post.data.title}](https://www.nickyt.co/blog/${post.slug}/)`
        )
        .join("\n")}`
    : "";

  const recentTalks = sortedTalks.length
    ? `\n\n## Recent Talks\n${sortedTalks
        .map(
          (talk) =>
            `- [${talk.data.title}](https://www.nickyt.co/talks/${talk.slug}/)`
        )
        .join("\n")}`
    : "";

  const recentStreams = sortedStreams.length
    ? `\n\n## Recent Streams\n${sortedStreams
        .map(
          (stream) =>
            `- [${stream.data.title}](https://www.youtube.com/watch?v=${stream.data.videoId})`
        )
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
