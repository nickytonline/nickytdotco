import process from "node:process";
import { defineConfig } from "astro/config";
import netlify from "@astrojs/netlify";
import mdx from "@astrojs/mdx";
import tailwindcss from "@tailwindcss/vite";
import varlockintegration from "@varlock/astro-integration";
import { ENV } from "varlock/env";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import expressiveCode from "astro-expressive-code";
import sitemap from "@astrojs/sitemap";
import { unified } from "@astrojs/markdown-remark";

import react from "@astrojs/react";
import emdash from "emdash/astro";
import { libsql } from "emdash/db";
import { blobs } from "./packages/emdash-netlify/src/index.ts";
import { resolveEmDashSiteUrl } from "./packages/emdash-netlify/src/site-url.ts";
import { embedPlugin } from "./src/emdash/embed-plugin.ts";

// https://astro.build/config
export default defineConfig({
  output: "static",
  adapter: netlify(),
  site: "https://www.nickyt.co",
  compressHTML: true,
  image: {
    remotePatterns: [
      { protocol: "https", hostname: "img.youtube.com" },
      { protocol: "https", hostname: "cdn.thenewstack.io" },
      { protocol: "https", hostname: "labs.iximiuz.com" },
    ],
  },
  integrations: [
    varlockintegration(),
    expressiveCode(),
    mdx(),
    react(),
    sitemap(),
    emdash({
      ...(ENV.EMDASH_TURSO_DATABASE_URL
        ? {
            database: libsql({
              url: ENV.EMDASH_TURSO_DATABASE_URL,
              authToken: ENV.TURSO_AUTH_TOKEN,
              migrationAuthTokenEnv: "TURSO_AUTH_TOKEN",
            }),
          }
        : {}),
      storage: blobs(),
      plugins: [embedPlugin()],
      siteUrl: resolveEmDashSiteUrl({
        url: ENV.URL,
        deployPrimeUrl: ENV.DEPLOY_PRIME_URL,
        context: process.env.CONTEXT,
      }),
    }),
  ],
  markdown: {
    processor: unified({
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
    }),
  },
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        "@": "/src",
      },
    },
    build: {
      rollupOptions: {
        external: ["/pagefind/pagefind.js"],
      },
    },
  },
  server: {
    port: ENV.PORT,
  },
});
