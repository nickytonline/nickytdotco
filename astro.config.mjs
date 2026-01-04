import { defineConfig } from "astro/config";
import netlify from "@astrojs/netlify";
import mdx from "@astrojs/mdx";

// https://astro.build/config
export default defineConfig({
  output: "hybrid",
  adapter: netlify(),
  site: "https://www.nickyt.co",
  integrations: [mdx()],
  markdown: {
    shikiConfig: {
      theme: "github-dark",
    },
  },
});
