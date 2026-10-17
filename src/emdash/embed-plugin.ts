import { definePlugin } from "emdash";
import { fileURLToPath } from "node:url";

const embedBlock = {
  type: "embed",
  label: "Embed",
  icon: "link-external",
  description: "YouTube, posts, CodePen, and other media",
  placeholder: "Paste a URL...",
};

/**
 * Native EmDash plugin. Authors insert `/embed` and paste a URL.
 * The saved Portable Text block stores that URL as `id`.
 * `EmbedBlock.astro` passes it to the site's existing `<Embed />`.
 */
export function embedPlugin() {
  return {
    id: "nickyt-embed",
    version: "0.1.0",
    format: "native" as const,
    entrypoint: fileURLToPath(
      new URL("./embed-plugin-entry.ts", import.meta.url)
    ),
    componentsEntry: fileURLToPath(
      new URL("./embed-components.ts", import.meta.url)
    ),
    portableTextBlocks: [embedBlock],
  };
}

export function createPlugin() {
  return definePlugin({
    id: "nickyt-embed",
    version: "0.1.0",
    admin: {
      portableTextBlocks: [embedBlock],
    },
  });
}
