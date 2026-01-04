import { defineConfig } from "astro/config";
import netlify from "@astrojs/netlify";
import mdx from "@astrojs/mdx";
import remarkDirective from "remark-directive";
import { remarkEmbedDirectives } from "./src/utils/remarkEmbedDirectives.js";
import { rehypeEmbedComponents } from "./src/utils/rehypeEmbedComponents.js";

// https://astro.build/config
export default defineConfig({
  output: "hybrid",
  adapter: netlify(),
  site: "https://www.nickyt.co",
  integrations: [
    mdx({
      remarkPlugins: [remarkDirective, remarkEmbedDirectives],
      rehypePlugins: [rehypeEmbedComponents],
    }),
  ],
  markdown: {
    remarkPlugins: [remarkDirective, remarkEmbedDirectives],
    rehypePlugins: [rehypeEmbedComponents],
    shikiConfig: {
      theme: "github-dark",
    },
  },
});
