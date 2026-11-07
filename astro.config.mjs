import process from "node:process";
import { defineConfig, sessionDrivers } from "astro/config";
import netlify from "@astrojs/netlify";
import { cacheNetlify } from "@astrojs/netlify/cache";
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

const onNetlify = process.env.NETLIFY === "true";

// https://astro.build/config
export default defineConfig({
  output: "static",
  // EmDash publish routes call Astro.cache.invalidate. This provider turns
  // those tags into Netlify durable cache purges.
  cache: { provider: cacheNetlify() },
  // EmDash admin auth uses Astro sessions. @astrojs/netlify defaults sessions
  // to Netlify Blobs (`sessionDrivers.netlifyBlobs`). In local `astro dev`
  // that driver still calls `getStore()` and throws MissingBlobsEnvironmentError
  // unless `siteID` + `token` (or NETLIFY_BLOBS_CONTEXT) are present — the Vite
  // Blobs emulation does not always inject that context into the session path.
  // Use a filesystem driver locally; leave unset on Netlify so the adapter keeps
  // Blobs sessions in production.
  ...(!onNetlify
    ? {
        session: {
          driver: sessionDrivers.fsLite({
            base: ".astro/sessions",
          }),
        },
      }
    : {}),
  // Only for local `astro dev`: Edge Functions emulation boots Deno via
  // @netlify/edge-functions-dev, which crashes on Deno 2.9.6+
  // (`unexpected argument '--allow-scripts'`). Never pass this on Netlify
  // builds/deploys — production edge functions (e.g. /api/search rate
  // limit) must keep their default enabled behavior. Remove once
  // netlify/primitives#790 ships.
  adapter: netlify(
    onNetlify
      ? {}
      : {
          devFeatures: {
            edgeFunctions: false,
          },
        }
  ),
  site: "https://www.nickyt.co",
  compressHTML: true,
  image: {
    remotePatterns: [
      { protocol: "https", hostname: "img.youtube.com" },
      { protocol: "https", hostname: "cdn.thenewstack.io" },
      { protocol: "https", hostname: "labs.iximiuz.com" },
      {
        protocol: "https",
        hostname: "repository-images.githubusercontent.com",
      },
      { protocol: "https", hostname: "opengraph.githubassets.com" },
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
