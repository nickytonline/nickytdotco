import { defineConfig } from "astro/config";
import netlify from "@astrojs/netlify";

// https://astro.build/config
export default defineConfig({
  output: "hybrid",
  adapter: netlify(),
  site: "https://www.nickyt.co",
  integrations: [],
  markdown: {
    shikiConfig: {
      theme: "github-dark",
    },
  },
});
