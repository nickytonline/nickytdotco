import { defineConfig } from "astro/config";
import netlify from "@astrojs/netlify";
import mdx from "@astrojs/mdx";
import tailwindcss from "@tailwindcss/vite";
import varlockintegration from "@varlock/astro-integration";
import { ENV } from "varlock/env";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import expressiveCode from "astro-expressive-code";

import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  output: "static",
  adapter: netlify(),
  site: "https://www.nickyt.co",
  integrations: [
    expressiveCode({
      themes: ["github-dark"],
      styleOverrides: {
        borderRadius: "0.75rem",
        borderWidth: "2px",
        borderColor: "rgb(254 231 243)", // rose-100
        codePaddingBlock: "1rem",
        codePaddingInline: "1.5rem",
        frames: {
          shadowColor: "transparent",
        },
        uiFontFamily: "inherit",
      },
      defaultProps: {
        wrap: true,
        preserveIndent: true,
      },
    }),
    mdx(),
    react(),
  ],
  markdown: {
    rehypePlugins: [
      rehypeSlug,
      [
        rehypeAutolinkHeadings,
        {
          behavior: "append",
          properties: {
            className: ["heading-anchor"],
            ariaLabel: "Link to this section",
          },
          content: {
            type: "text",
            value: "#",
          },
        },
      ],
    ],
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