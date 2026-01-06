import { visit } from "unist-util-visit";

/**
 * Remark plugin to handle custom directives for embeds
 * Converts ::youtube{videoId="xxx"} syntax to component HTML
 */
export function remarkEmbedDirectives() {
  return (tree) => {
    visit(tree, (node) => {
      if (
        node.type === "containerDirective" ||
        node.type === "leafDirective" ||
        node.type === "textDirective"
      ) {
        const name = node.name;
        const attrs = node.attributes || {};

        // Handle different embed types
        if (name === "youtube") {
          const data = node.data || (node.data = {});
          const videoId = attrs.videoId || attrs.id;
          const startTime = attrs.startTime || attrs.start;

          data.hName = "div";
          data.hProperties = {
            "data-youtube-embed": "",
            "data-video-id": videoId,
            ...(startTime && { "data-start-time": startTime }),
          };
        } else if (name === "twitter" || name === "x") {
          const data = node.data || (node.data = {});
          data.hName = "div";
          data.hProperties = {
            "data-twitter-embed": "",
            "data-tweet-id": attrs.tweetId || attrs.id,
          };
        } else if (name === "codepen") {
          const data = node.data || (node.data = {});
          data.hName = "div";
          data.hProperties = {
            "data-codepen-embed": "",
            "data-url": attrs.url,
          };
        } else if (name === "github" || name === "embed") {
          const data = node.data || (node.data = {});
          data.hName = "div";
          data.hProperties = {
            "data-generic-embed": "",
            "data-url": attrs.url,
          };
        } else if (name === "link") {
          const data = node.data || (node.data = {});
          data.hName = "div";
          data.hProperties = {
            "data-devlink-embed": "",
            "data-url": attrs.url,
          };
        } else if (name === "twitch") {
          const data = node.data || (node.data = {});
          data.hName = "div";
          data.hProperties = {
            "data-twitch-embed": "",
            "data-video-id": attrs.videoId || attrs.id,
          };
        } else if (name === "vimeo") {
          const data = node.data || (node.data = {});
          data.hName = "div";
          data.hProperties = {
            "data-vimeo-embed": "",
            "data-video-id": attrs.videoId || attrs.id,
          };
        } else if (name === "spotify") {
          const data = node.data || (node.data = {});
          data.hName = "div";
          data.hProperties = {
            "data-spotify-embed": "",
            "data-uri": attrs.uri,
          };
        } else if (name === "buzzsprout") {
          const data = node.data || (node.data = {});
          data.hName = "div";
          data.hProperties = {
            "data-buzzsprout-embed": "",
            "data-episode-id": attrs.episodeId || attrs.id,
          };
        } else if (name === "codesandbox") {
          const data = node.data || (node.data = {});
          data.hName = "div";
          data.hProperties = {
            "data-codesandbox-embed": "",
            "data-sandbox-id": attrs.sandboxId || attrs.id,
          };
        } else if (name === "instagram") {
          const data = node.data || (node.data = {});
          data.hName = "div";
          data.hProperties = {
            "data-instagram-embed": "",
            "data-url": attrs.url,
          };
        }
      }
    });
  };
}
