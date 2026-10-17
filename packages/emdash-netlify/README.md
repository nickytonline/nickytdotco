# @nickyt/emdash-netlify

Netlify adapter for [EmDash](https://emdashcms.com/) 1.2 and later. EmDash documents Node and Cloudflare. This package covers the two gaps on Netlify Functions:

- **Media** lives in a site-wide [Netlify Blobs](https://docs.netlify.com/build/data-and-storage/netlify-blobs/) store. Function disks are ephemeral, so the local filesystem adapter cannot hold uploads. Blobs does not offer signed upload URLs; the admin uploads through the EmDash API (`NOT_SUPPORTED`, the same signal the local adapter uses).
- **Scheduled publishing** cannot use the in-process Node timer. EmDash only turns that timer off for `@astrojs/cloudflare`. A scheduled function POSTs once a minute to an on-demand Astro route, and that route calls `runScheduledTasks()` from `emdash/middleware` inside the server bundle (the virtual modules are not available in a standalone function).

Content stays on libSQL/Turso via `libsql()` from `emdash/db`. This package does not add a database driver.

## Use

```js
import netlify from "@astrojs/netlify";
import emdash from "emdash/astro";
import { libsql } from "emdash/db";
import { blobs } from "@nickyt/emdash-netlify";

export default defineConfig({
  adapter: netlify(),
  integrations: [
    emdash({
      database: libsql({
        url: process.env.EMDASH_TURSO_DATABASE_URL,
        authToken: process.env.TURSO_AUTH_TOKEN,
      }),
      storage: blobs(),
    }),
  ],
});
```

Wire `netlify/functions/emdash-scheduled.ts` to the package's scheduled handler, and add an on-demand route that checks `EMDASH_SCHEDULE_SECRET` before calling `runScheduledTasks()`.

Outside Netlify (`NETLIFY` unset), storage falls back to `.emdash/uploads` so `astro dev` can accept uploads.

## Upstream

`generateSchedulerModule` in EmDash treats every non-Cloudflare adapter as a long-lived Node process and injects `NodeCronScheduler`. On Netlify that timer does not survive between invocations. An upstream change should return `createScheduler = null` when `adapter.name === "@astrojs/netlify"`, the same as Cloudflare, and publish this package as `@emdash-cms/netlify`.
