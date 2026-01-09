import { defineConfig } from "astro/config";
import netlify from "@astrojs/netlify";
import mdx from "@astrojs/mdx";
import tailwindcss from "@tailwindcss/vite";
import varlockintegration from "@varlock/astro-integration";
import { ENV } from "varlock/env";

import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  output: "static",
  adapter: netlify(),
  site: "https://www.nickyt.co",
  integrations: [mdx(), react()],
  markdown: {
    shikiConfig: {
      theme: "github-dark",
    },
  },
  vite: {
    plugins: [tailwindcss(), varlockintegration()],
    resolve: {
      alias: {
        "@": "/src",
      },
    },
  },
  server: {
    port: ENV.PORT,
  },
});