import { visit } from "unist-util-visit";

/**
 * Rehype plugin to replace embed placeholders with component HTML at build time
 */
export function rehypeEmbedComponents() {
  return async (tree) => {
    const promises = [];

    visit(tree, "element", (node) => {
      // YouTube embeds
      if (
        node.properties &&
        node.properties["data-youtube-embed"] !== undefined
      ) {
        const videoId = node.properties["data-video-id"];
        const startTime = node.properties["data-start-time"];

        const promise = (async () => {
          try {
            const response = await fetch(
              `https://www.youtube.com/oembed?url=http://www.youtube.com/watch?v=${videoId}&format=json`,
            );
            const data = await response.json();
            const title = data.title || `YouTube video ${videoId}`;

            const timeParam = startTime ? `?start=${startTime}` : "";
            const src = `https://www.youtube.com/embed/${videoId}${timeParam}`;

            // Create wrapper div with video-player class
            node.tagName = "div";
            node.properties = {
              className: ["video-player"],
            };
            node.children = [
              {
                type: "element",
                tagName: "iframe",
                properties: {
                  src,
                  title,
                  width: "560",
                  height: "315",
                  allow:
                    "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",
                  allowfullscreen: true,
                  loading: "lazy",
                  referrerpolicy: "strict-origin-when-cross-origin",
                  style:
                    "position: absolute; width: 100%; height: 100%; left: 0px; top: 0px",
                },
                children: [],
              },
            ];
          } catch (error) {
            console.error(
              `Failed to fetch YouTube data for ${videoId}:`,
              error,
            );
          }
        })();
        promises.push(promise);
      }

      // Twitter embeds
      else if (
        node.properties &&
        node.properties["data-twitter-embed"] !== undefined
      ) {
        const tweetId = node.properties["data-tweet-id"];

        const promise = (async () => {
          try {
            const response = await fetch(
              `https://publish.twitter.com/oembed?url=${encodeURIComponent(
                `https://twitter.com/anyone/status/${tweetId}`,
              )}`,
            );

            if (response.ok) {
              const data = await response.json();
              node.tagName = "div";
              node.properties = { className: ["twitter-embed"] };
              node.children = [
                {
                  type: "raw",
                  value: data.html,
                },
              ];
            } else if (response.status === 404) {
              node.tagName = "p";
              node.children = [
                { type: "text", value: "The Tweet has been deleted." },
              ];
            }
          } catch (error) {
            const xUrl = `https://x.com/anyone/status/${tweetId}`;
            node.tagName = "a";
            node.properties = {
              href: xUrl,
              style: "margin-top: 10px;margin-bottom: 10px;",
            };
            node.children = [{ type: "text", value: xUrl }];
          }
        })();
        promises.push(promise);
      }

      // CodePen embeds
      else if (
        node.properties &&
        node.properties["data-codepen-embed"] !== undefined
      ) {
        const url = node.properties["data-url"];
        const urlObj = new URL(url);
        const [, user, , codepenId] = urlObj.pathname.split("/");

        node.tagName = "p";
        node.properties = {
          className: ["codepen"],
          "data-height": "265",
          "data-theme-id": "dark",
          "data-default-tab": "js,result",
          "data-user": user,
          "data-slug-hash": codepenId,
          style:
            "height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;",
          "data-pen-title": `${codepenId} by @${user}`,
        };
        node.children = [
          {
            type: "element",
            tagName: "span",
            children: [
              { type: "text", value: "See the Pen " },
              {
                type: "element",
                tagName: "a",
                properties: { href: url },
                children: [{ type: "text", value: url }],
              },
              { type: "text", value: ` by ${user} (` },
              {
                type: "element",
                tagName: "a",
                properties: { href: `https://codepen.io/${user}` },
                children: [{ type: "text", value: `@${user}` }],
              },
              { type: "text", value: ") on " },
              {
                type: "element",
                tagName: "a",
                properties: { href: "https://codepen.io" },
                children: [{ type: "text", value: "CodePen" }],
              },
              { type: "text", value: "." },
            ],
          },
        ];

        // Add script tag after the paragraph
        const scriptNode = {
          type: "element",
          tagName: "script",
          properties: {
            async: true,
            src: "https://static.codepen.io/assets/embed/ei.js",
          },
          children: [],
        };
        const index = node.parent?.children.indexOf(node);
        if (index !== undefined && node.parent) {
          node.parent.children.splice(index + 1, 0, scriptNode);
        }
      }

      // Generic/GitHub embeds
      else if (
        node.properties &&
        node.properties["data-generic-embed"] !== undefined
      ) {
        const url = node.properties["data-url"];
        const encodedUrl = encodeURIComponent(url).replace(/\/$/, "");

        node.tagName = "a";
        node.properties = { href: url };
        node.children = [
          {
            type: "element",
            tagName: "span",
            properties: { className: ["visually-hidden"] },
            children: [
              { type: "text", value: `The ${url} repository on GitHub` },
            ],
          },
          {
            type: "element",
            tagName: "picture",
            children: [
              {
                type: "element",
                tagName: "source",
                properties: {
                  type: "image/webp",
                  srcset: `https://v1.opengraph.11ty.dev/${encodedUrl}/small/webp/ 375w, https://v1.opengraph.11ty.dev/${encodedUrl}/medium/webp/ 650w`,
                  sizes: "100vw",
                },
                children: [],
              },
              {
                type: "element",
                tagName: "source",
                properties: {
                  type: "image/jpeg",
                  srcset: `https://v1.opengraph.11ty.dev/${encodedUrl}/small/jpeg/ 375w, https://v1.opengraph.11ty.dev/${encodedUrl}/medium/jpeg/ 650w`,
                  sizes: "100vw",
                },
                children: [],
              },
              {
                type: "element",
                tagName: "img",
                properties: {
                  alt: `OpenGraph image for ${url}`,
                  loading: "lazy",
                  decoding: "async",
                  src: `https://v1.opengraph.11ty.dev/${encodedUrl}/small/jpeg/`,
                  width: "650",
                  height: "341",
                },
                children: [],
              },
            ],
          },
        ];
      }

      // Dev.to link embeds
      else if (
        node.properties &&
        node.properties["data-devlink-embed"] !== undefined
      ) {
        const url = node.properties["data-url"];
        const encodedUrl = encodeURIComponent(url).replace(/\/$/, "");

        node.tagName = "a";
        node.properties = { href: url };
        node.children = [
          {
            type: "element",
            tagName: "span",
            properties: { className: ["visually-hidden"] },
            children: [{ type: "text", value: `The ${url} post on DEV` }],
          },
          {
            type: "element",
            tagName: "picture",
            children: [
              {
                type: "element",
                tagName: "source",
                properties: {
                  type: "image/webp",
                  srcset: `https://v1.opengraph.11ty.dev/${encodedUrl}/small/webp/ 375w, https://v1.opengraph.11ty.dev/${encodedUrl}/medium/webp/ 650w`,
                  sizes: "100vw",
                },
                children: [],
              },
              {
                type: "element",
                tagName: "source",
                properties: {
                  type: "image/jpeg",
                  srcset: `https://v1.opengraph.11ty.dev/${encodedUrl}/small/jpeg/ 375w, https://v1.opengraph.11ty.dev/${encodedUrl}/medium/jpeg/ 650w`,
                  sizes: "100vw",
                },
                children: [],
              },
              {
                type: "element",
                tagName: "img",
                properties: {
                  alt: `OpenGraph image for ${url}`,
                  loading: "lazy",
                  decoding: "async",
                  src: `https://v1.opengraph.11ty.dev/${encodedUrl}/small/jpeg/`,
                  width: "650",
                  height: "341",
                },
                children: [],
              },
            ],
          },
        ];
      }

      // Twitch embeds
      else if (
        node.properties &&
        node.properties["data-twitch-embed"] !== undefined
      ) {
        const videoId = node.properties["data-video-id"];
        const src = `https://player.twitch.tv/?video=${videoId}&parent=www.nickyt.co`;

        node.tagName = "iframe";
        node.properties = {
          src,
          height: "360",
          width: "640",
          allowfullscreen: true,
          frameborder: "0",
          loading: "lazy",
          title: `Twitch video ${videoId}`,
        };
      }

      // Vimeo embeds
      else if (
        node.properties &&
        node.properties["data-vimeo-embed"] !== undefined
      ) {
        const videoId = node.properties["data-video-id"];
        const src = `https://player.vimeo.com/video/${videoId}?autoplay=0&controls=1&loop=0`;

        node.tagName = "iframe";
        node.properties = {
          src,
          width: "640",
          height: "360",
          frameborder: "0",
          allow: "autoplay; fullscreen; picture-in-picture",
          allowfullscreen: true,
          loading: "lazy",
          title: `Vimeo video ${videoId}`,
        };
      }

      // Spotify embeds
      else if (
        node.properties &&
        node.properties["data-spotify-embed"] !== undefined
      ) {
        const uri = node.properties["data-uri"];
        const src = `https://open.spotify.com/embed/${uri}?utm_source=generator&theme=0`;

        node.tagName = "iframe";
        node.properties = {
          style: "border-radius:12px",
          src,
          width: "100%",
          height: "232",
          frameborder: "0",
          allowfullscreen: "",
          allow:
            "autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture",
          loading: "lazy",
          title: `Spotify embed ${uri}`,
        };
      }

      // Buzzsprout embeds
      else if (
        node.properties &&
        node.properties["data-buzzsprout-embed"] !== undefined
      ) {
        const episodeId = node.properties["data-episode-id"];
        const src = `https://www.buzzsprout.com/${episodeId}?client_source=small_player&iframe=true`;

        node.tagName = "iframe";
        node.properties = {
          src,
          loading: "lazy",
          width: "100%",
          height: "200",
          frameborder: "0",
          scrolling: "no",
          title: `Buzzsprout episode ${episodeId}`,
        };
      }

      // CodeSandbox embeds
      else if (
        node.properties &&
        node.properties["data-codesandbox-embed"] !== undefined
      ) {
        const sandboxId = node.properties["data-sandbox-id"];
        const src = `https://codesandbox.io/embed/${sandboxId}?fontsize=14&hidenavigation=1&theme=dark`;

        node.tagName = "iframe";
        node.properties = {
          src,
          style:
            "width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;",
          title: `CodeSandbox ${sandboxId}`,
          allow:
            "accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking",
          sandbox:
            "allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts",
          loading: "lazy",
        };
      }

      // Instagram embeds
      else if (
        node.properties &&
        node.properties["data-instagram-embed"] !== undefined
      ) {
        const url = node.properties["data-url"];

        node.tagName = "blockquote";
        node.properties = {
          className: ["instagram-media"],
          "data-instgrm-permalink": url,
          "data-instgrm-version": "14",
        };
        node.children = [
          {
            type: "element",
            tagName: "a",
            properties: { href: url },
            children: [{ type: "text", value: "View this post on Instagram" }],
          },
        ];

        // Add Instagram script
        const scriptNode = {
          type: "element",
          tagName: "script",
          properties: { async: true, src: "//www.instagram.com/embed.js" },
          children: [],
        };
        const index = node.parent?.children.indexOf(node);
        if (index !== undefined && node.parent) {
          node.parent.children.splice(index + 1, 0, scriptNode);
        }
      }
    });

    await Promise.all(promises);
  };
}
