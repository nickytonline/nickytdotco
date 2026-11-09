# EmDash upgrade work order

This file is the handoff for upgrading the project at `/Users/nicktaylor/dev/oss/nickytdotco` to the npm `latest` release. The updater resolved the direct packages, changed and installed them where needed, refreshed the project EmDash skills, and compared the installed core migration manifests. It did not edit application code, apply a database migration, or deploy the site.

## Package changes

- `@emdash-cms/auth-atproto`: `0.2.47` → `0.2.50` (`^0.2.8` → `^0.2.50`)
- `emdash`: `1.2.0` → `1.4.0` (`^1.2.0` → `^1.4.0`)

## Release entries to assess

These are the complete authored major, minor, and patch entries crossed by the direct EmDash packages in this project. Changesets dependency-bump entries and attribution wrappers have been removed. Check whether each entry affects code or configuration in this project. Do not adopt an unrelated feature merely because it appears here.

### Change 1

Applies to: `@emdash-cms/auth-atproto@0.2.49` (patch), `emdash@1.3.1` (patch)  
Source: [#4013](https://github.com/emdash-cms/emdash/pull/4013)

Fixes the admin login page so the help text under a provider's `LoginForm` is no longer hard-coded to "Enter your handle to sign in." for every provider.

Providers can now export an optional `loginHelp` string or component from their admin entry. When `loginHelp` is absent, the page falls back to a neutral "Continue with {label}." message.

The built-in AT Protocol provider keeps its handle-specific prompt and translates it using the admin's active locale. It requires `@lingui/react` as a peer dependency; if your package manager does not install peers automatically, install a compatible Lingui 5 version alongside the provider.

### Change 2

Applies to: `emdash@1.4.0` (minor)  
Source: [#3856](https://github.com/emdash-cms/emdash/pull/3856)

Adds `admin.hiddenNavItems` to hide built-in admin areas a site doesn't use. Set it to any of `calendar`, `media`, `comments`, `menus`, `redirects`, `widgets`, `sections`, `bylines`, and `import`, for example `admin: { hiddenNavItems: ["comments", "redirects"] }`. Hidden areas disappear from the sidebar and the command palette. On the dashboard, listing `media` hides the Upload Media button, and listing `calendar` keeps the Scheduled count but removes its link to the calendar. The pages and API routes stay reachable for users with the required role. An unknown name fails the build.

### Change 3

Applies to: `emdash@1.4.0` (patch)  
Source: [#4364](https://github.com/emdash-cms/emdash/pull/4364)

Fixes translating a menu on Cloudflare D1, which failed for larger menus and left an empty translated menu behind. On D1, translating or deleting a menu and reordering or replacing its items now either save completely or leave the menus unchanged.

#### What should I do?

If translating a menu failed before, delete the empty translated menu it left behind, then translate the menu again.

### Change 4

Applies to: `emdash@1.4.0` (patch)  
Source: [#4167](https://github.com/emdash-cms/emdash/pull/4167)

Fixes extra database round trips on `getEmDashEntry` and `getEmDashCollection` for sites that register byline custom fields or have entries with an author but no explicit byline credit. These reads now resolve bylines from the content query itself and load custom-field values in one batched step, instead of re-reading every entry's credits. On Cloudflare D1, a page that reads a few entries saves two to six sequential queries.

### Change 5

Applies to: `emdash@1.4.0` (patch)  
Source: [#4287](https://github.com/emdash-cms/emdash/pull/4287)

Fixes expired OAuth tokens and unused login codes from `emdash login` and MCP clients staying in the database forever. Scheduled cleanup now deletes them after they expire.

### Change 6

Applies to: `emdash@1.4.0` (patch)  
Source: [#4286](https://github.com/emdash-cms/emdash/pull/4286)

Fixes lost edits on D1, Durable Objects and PostgreSQL when two saves of the same entry, both based on the same version, arrive at once, for example from two MCP clients or from scripts using `emdash content update --rev`: both reported success, and the first was silently overwritten. The second save now returns `409 CONFLICT`, the same response a save based on an outdated version already gets.

### Change 7

Applies to: `emdash@1.4.0` (patch)  
Source: [#4459](https://github.com/emdash-cms/emdash/pull/4459)

Fixes `POST /_emdash/api/oauth/token` returning uppercase `INVALID_GRANT` for refresh-token and device-code failures. These responses now use the RFC-standard `invalid_grant` code so OAuth clients can recognize rejected grants and restart authorization.

### Change 8

Applies to: `emdash@1.4.0` (patch)  
Source: [#4243](https://github.com/emdash-cms/emdash/pull/4243)

Fixes Cloudflare-cached pages remaining outdated after content is deleted or unpublished. Pages using EmDash cache hints no longer send an automatic `Last-Modified` header, so Cloudflare stops answering `304 Not Modified` based on an entry timestamp that does not cover related lists or settings changes. This applies to entry, collection, publication-date, and reference-list hints. Sites using an object cache reload those content snapshots once after upgrading so cached validators from earlier versions are not reused.

Taxonomy definitions and collection-to-taxonomy mappings also revalidate in the background after 30 seconds, so long-lived server processes pick up changes saved elsewhere without adding a blocking query to each render. A failed refresh retains the last good snapshot.

#### What should I do?

`cacheHint.lastModified` is no longer populated automatically. For an entry's displayed modification date, use `entry.data.updatedAt` instead; it is not a validator for the whole page.

Pages relying on automatic validators also lose Astro's implicit `Cache-Control: no-cache` header. Set your own browser `Cache-Control` if you need a fresh check on every visit. If you want conditional requests, supply a custom `lastModified` hint to `Astro.cache.set()`. Its timestamp must advance whenever any part of the response changes, including settings, related entries, deletions, and unpublishes.

### Change 9

Applies to: `emdash@1.4.0` (patch)  
Source: [#4157](https://github.com/emdash-cms/emdash/pull/4157)

Fixes external auth providers, such as Cloudflare Access, writing the session store on every authenticated `/_emdash` request. EmDash now writes the session only when the signed-in user differs from the stored one, so sites on Cloudflare no longer spend one Workers KV write per request, which could exhaust the Workers Free plan's daily write limit and hit KV's one-write-per-second limit on a key for parallel requests.

### Change 10

Applies to: `emdash@1.4.0` (patch)  
Source: [#3192](https://github.com/emdash-cms/emdash/pull/3192)

Names media downloads after the file that was uploaded. The public media file route previously sent `Content-Disposition: attachment` with no `filename`, so browsers fell back to the last path segment of the URL and saved every PDF, DOCX or CSV under its storage key. The route now looks the original filename up by storage key and emits both the quoted ASCII `filename` and the RFC 5987 `filename*` form, so non-ASCII names survive.

Media with no matching database row is served exactly as before, and a failed lookup never fails the download.

### Change 11

Applies to: `emdash@1.4.0` (patch)  
Source: [#3129](https://github.com/emdash-cms/emdash/pull/3129)

Fixes saving an entry turning an empty image or file field (`""`) into `{ "provider": "external", "id": "", "src": "" }`. A blank image or file field, or a blank image inside a repeater, is now saved as `null`, the canonical empty value. Entries with no image stop changing on every save after that.

A required image or file field now returns a validation error for `""` instead of saving an empty image. This only affects API, MCP or import clients, because the admin never sends `""`.

### Change 12

Applies to: `emdash@1.4.0` (patch)  
Source: [#4296](https://github.com/emdash-cms/emdash/pull/4296)

Fixes media usage tracking in collections that have a reference field named `title` or `name`, where saving an entry recorded none of the images and files it uses. Saving now records them.

#### What should I do?

Entries in those collections that were saved before this release can still be missing from **Used in** after you upgrade. Open **Settings → Media usage tracking** and wait until it shows **Ready**. If it shows **Needs attention** instead, repair each affected collection once:

```sh
npx emdash media repair-usage --collection <collection>
```

### Change 13

Applies to: `emdash@1.4.0` (patch)  
Source: [#4285](https://github.com/emdash-cms/emdash/pull/4285)

Fixes menus showing dead links to entries that are in the trash or not published. `getMenu()` leaves those items out. Any item `getMenu()` leaves out now takes its child items with it, instead of moving them to the top level of the menu. In edit mode, menus still link to unpublished entries. With the object cache enabled, a cached menu now refreshes when an entry or taxonomy term it links to changes.

### Change 14

Applies to: `emdash@1.4.0` (patch)  
Source: [#4365](https://github.com/emdash-cms/emdash/pull/4365)

Fixes creating a child menu item through the menu items API on PostgreSQL. A request with a `parentId` and no `sortOrder` failed; the item is now placed after its existing siblings.

### Change 15

Applies to: `emdash@1.4.0` (patch)  
Source: [#4208](https://github.com/emdash-cms/emdash/pull/4208)

Fixes content list search, in the admin and through the content list API's `q` parameter, failing when the collection has a reference field named `title` or `name`. The search now leaves out a reference field bound to a relation and matches the entry's other fields.

### Change 16

Applies to: `emdash@1.4.0` (patch)  
Source: [#4205](https://github.com/emdash-cms/emdash/pull/4205)

Fixes entry creation, entry saves and content-list search failing with `no such column` in a collection that has a reference field marked `searchable`. Adding such a field to a search-enabled collection failed, and after a seed turned search on, creating or saving any entry in that collection failed. Site search and content-list search now ignore the `searchable` flag on a reference field bound to a relation.

#### What should I do?

If creating or saving entries in a collection still fails after upgrading and the server log shows `no such column`, open the collection under **Content Types**, untick **Search** and save, then tick it again and save. This rebuilds the collection's search index.

### Change 17

Applies to: `emdash@1.4.0` (patch)  
Source: [#4386](https://github.com/emdash-cms/emdash/pull/4386)

Fixes entry slugs being generated from a field named `title` instead of the collection's configured title field. In a collection whose `titleField` is `name` and which also has a `title` field (a person's job title, say), typing in the editor now fills the slug from the name, and entries created through the API without a slug get one from the name too, so two people with the same job title no longer collide with `SLUG_CONFLICT`. Collections without a `titleField` keep the previous `title`, then `name`, order.

### Change 18

Applies to: `emdash@1.4.0` (patch)  
Source: [#4394](https://github.com/emdash-cms/emdash/pull/4394)

Fixes sandboxed plugin `ctx.taxonomies` mutations (`createTerm()`, `addEntryTerms()`, and `removeEntryTerms()`), `ctx.content.create()`, versioned content actions (`getVersioned()`, `publish()`, `unpublish()`, `schedule()`, `unschedule()`, `getTrashedVersioned()`, and `restore()`), and `ctx.comments.setStatus()` on Cloudflare when requests run across multiple Worker isolates. Content creation consistently uses runtime validation and hooks and preserves `translationOf` links instead of falling back to a plain database insert.

Runner-created invocations without a content-create callback now receive `Content creation is not configured` rather than a database insert that bypasses runtime behavior. `createPluginTestHost()` supplies a database-backed callback with content-handler validation so transport-level tests can continue creating content and linked translations without starting the full EmDash runtime. It preserves the transport host's support for `data.slug` and `data.status`.

Await these operation promises before returning from a plugin route or hook. Their RPC connection now lasts only for that invocation; unlike the previous loopback binding, it cannot support work that outlives the invocation.

Publication after-hooks remain deferred. Same-entry actions attempted while an after-hook is running can return `CONTENT_ACTION_REENTRANT`; faster callback routing can expose this overlap in tests that assumed hooks had already finished. In runtime-host tests, call `await host.waitForDeferredTasks()` after an action before inspecting its after-hook effects or starting another action on the same entry. This method waits for queued deferred runtime work, including work those tasks enqueue; it does not run future scheduled tasks or wait for arbitrary unawaited plugin operations.

### Change 19

Applies to: `emdash@1.4.0` (patch)  
Source: [#4380](https://github.com/emdash-cms/emdash/pull/4380)

Fixes `emdash site import` failing with `COLLECTION_EXISTS` when manually deleted target collections still have media-usage cleanup pending. For these manually deleted collections, import now runs as many cleanup steps as the request budget allows, then imports the collection in the same request if enough budget remains. It waits for active deletion leases or retry delays before reusing a slug. Cancellation during this per-collection cleanup stops before importing the collection. Failed cleanup of a manually deleted collection includes recovery instructions, and collection schema error messages are preserved in status `errorDetail`.

### Change 20

Applies to: `emdash@1.4.0` (patch)  
Source: [#4276](https://github.com/emdash-cms/emdash/pull/4276)

Fixes site builds using `zustand/traditional` or other dependencies that default-import `use-sync-external-store` shims, which previously failed with a missing default export error.

### Change 21

Applies to: `emdash@1.4.0` (patch)  
Source: [#4396](https://github.com/emdash-cms/emdash/pull/4396)

Fixes keyboard navigation and entrance animations in the admin and visual editor's floating toolbars with Tiptap 3.20.3 and later. Escape closes image alt-text editing, Shift+Tab returns to the caption, and arrow keys move between toolbar controls again.

### Change 22

Applies to: `emdash@1.4.0` (patch)  
Source: [#3279](https://github.com/emdash-cms/emdash/pull/3279)

Fixes the visual editing toolbar's "Open in admin" so each entry gets its own admin window. The window name was a single constant shared by the whole site, so opening the admin for one entry navigated away from another already open in that tab. A repeat click on the same entry still reuses that entry's window.

### Change 23

Applies to: `emdash@1.4.0` (patch)  
Source: [#3596](https://github.com/emdash-cms/emdash/pull/3596)

Caches widget areas in the object cache. With an object cache configured, `<WidgetArea>`, `getWidgetArea()`, `getWidgetAreaWithCacheHint()` and `getWidgetAreas()` no longer query the database on each page load. Widget changes made in the admin, by seeding or by a site transfer invalidate the cached areas; code that writes the widget tables directly should call the new `invalidateWidgetObjectCache()` export.

### Change 24

Applies to: `emdash@1.4.0` (patch)  
Source: [#3890](https://github.com/emdash-cms/emdash/pull/3890)

Fixes importing WordPress custom post types with a hyphen in their name (such as `team-member`) through the EmDash Exporter plugin. The import created the `team_member` collection but then failed every entry with `Collection "team-member" does not exist`, and custom taxonomies for that post type were not linked to the collection. The review step now shows the collection the import will use and recognizes it on a repeated import, so field type conflicts with it are reported. The `wxrSource` import source now suggests the same valid collection names, such as `team_member` for `team-member` and `wp_content` for a post type named `content`.

### Change 25

Applies to: `emdash@1.3.1` (patch)  
Source: [#4069](https://github.com/emdash-cms/emdash/pull/4069)

Fixes sites on Cloudflare Workers in the default `auto` migration mode serving pages without their content, with a 200 status, after an upgrade whose migrations a request could not finish.

Such a site now answers with a 503 response until its migrations are applied, so uptime checks notice it. A deployed Worker also no longer starts a migration that processes every entry and revision of a large site, such as the datetime normalization from 0.39.0; it answers with 503 until `emdash migrate` applies it.

#### What should I do?

If your site runs on Workers in `auto` mode and upgrades from 0.38 or earlier, run `emdash migrate` before you deploy, as described in [Apply large content migrations from the CLI](https://docs.emdashcms.com/deployment/core-migrations/#apply-large-content-migrations-from-the-cli).

If a site answers with 503 after an upgrade, read the Worker log. When it names a pending migration, apply it with `emdash migrate`. When it reports a held migration lock, follow [Release a stuck migration lock](https://docs.emdashcms.com/deployment/core-migrations/#release-a-stuck-migration-lock).

### Change 26

Applies to: `emdash@1.3.1` (patch)  
Source: [#4226](https://github.com/emdash-cms/emdash/pull/4226)

Fixes purged pages being cached again with stale site settings, including SEO verification tags, titles, and logos, on sites with or without an object cache. Route-cache fills with an object cache read settings directly from the database. Without an object cache, responses using an outdated settings snapshot are kept out of the route cache, and the next render reloads the settings. Warm settings snapshots also revalidate in the background after 30 seconds, retaining the last good value if a reload fails.

### Change 27

Applies to: `emdash@1.3.1` (patch)  
Source: [#4180](https://github.com/emdash-cms/emdash/pull/4180)

Fixes `emdash login` and `emdash logout` ignoring `EMDASH_URL`. Without `--url`, they now use the site in `EMDASH_URL`, like the other commands, instead of always going to `http://localhost:4321`.

### Change 28

Applies to: `emdash@1.3.1` (patch)  
Source: [#4239](https://github.com/emdash-cms/emdash/pull/4239)

Fixes CLI commands failing behind Cloudflare Access once the EmDash access token saved by `emdash login` has expired. Refreshing the token now sends the custom headers from `--header`, `EMDASH_HEADERS` and `emdash login`, as every other request does. `EmDashClient` from `emdash/client` now also runs the `interceptors` you pass on its automatic token refresh request.

### Change 29

Applies to: `emdash@1.3.1` (patch)  
Source: [#4070](https://github.com/emdash-cms/emdash/pull/4070)

Fixes `createField` on D1 leaving a field in the schema without a backing column when the collection reaches the column limit. Failed fields can now be created after freeing a column, without a `FIELD_EXISTS` error.

### Change 30

Applies to: `emdash@1.3.1` (patch)  
Source: [#4161](https://github.com/emdash-cms/emdash/pull/4161)

Fix an issue where the redirect middleware would rerun a route and hide the original error when the route (or later middleware) threw. The catch block is now narrowed to the redirect lookup, so `next()` is called exactly once and route errors propagate to Astro. Failures during the middleware's own post-response work (404 logging and cache handling) are still caught and logged rather than propagated.

### Change 31

Applies to: `emdash@1.3.1` (patch)  
Source: [#4181](https://github.com/emdash-cms/emdash/pull/4181)

Fixes the admin dashboard showing the number of users to roles that cannot list users. The Users card, and `userCount` in the `GET /_emdash/api/dashboard` response, are now limited to Administrators.

### Change 32

Applies to: `emdash@1.3.1` (patch)  
Source: [#4170](https://github.com/emdash-cms/emdash/pull/4170)

Fixes `<Image>` from `emdash/ui` so images with a blurhash placeholder keep their focal point. The generated style previously omitted the separating semicolon between the placeholder background and `object-position`, which caused browsers to discard both declarations.

### Change 33

Applies to: `emdash@1.3.1` (patch)  
Source: [#4043](https://github.com/emdash-cms/emdash/pull/4043)

Fixes media previews and file downloads timing out on Node.js sites using S3-compatible storage, including Cloudflare R2, after repeated cache revalidation or HEAD requests.

### Change 34

Applies to: `emdash@1.3.1` (patch)  
Source: [#4024](https://github.com/emdash-cms/emdash/pull/4024)

Fixes `getEmDashCollection()` returning empty results when `where` or `orderBy` uses a custom field while migration `086_relations_structural` is pending. Reference fields become available on the next request after migrating, without waiting for the object cache to expire. Missing columns unrelated to caller fields are reported as collection-loading errors rather than filter warnings.

### Change 35

Applies to: `emdash@1.3.1` (patch)  
Source: [#4255](https://github.com/emdash-cms/emdash/pull/4255)

Fixes menu item create, update, and reorder requests accepting missing, cross-menu, or cyclic parents that can hide items from rendered menus. Invalid parent changes now return a validation error without changing the menu; reorder validation uses the final state of the batch.

Unchanged parent links from older writes do not block label edits or reorders, so menus with legacy invalid data remain editable.

### Change 36

Applies to: `emdash@1.3.1` (patch)  
Source: [#4224](https://github.com/emdash-cms/emdash/pull/4224)

Fixes locale-aware queries when Astro locales use custom paths and codes, such as `{ path: "en", codes: ["en-US"] }`. Passing `Astro.currentLocale` to content, menu, taxonomy, and byline queries now matches rows stored under either the configured path or its codes. New writes use the path, while existing code-stamped rows keep their IDs, locale values, and associations. Reapplying seeds using either spelling reuses existing rows instead of creating duplicates.

When both path- and code-stamped rows exist for the same slug or name, lookups and seed matching prefer the path, then codes in configuration order. Public content queries consider only published rows, so a draft path row does not hide a published code row. Existing rows are not merged or deleted: listings retain both, and row-ID lookups remain available. This read-side compatibility avoids a destructive data migration or manual renaming during upgrade.

### Change 37

Applies to: `emdash@1.3.1` (patch)  
Source: [#4229](https://github.com/emdash-cms/emdash/pull/4229)

Fixes repeated plugin storage index registration so unchanged declarations no longer rewrite the `_plugin_indexes` registry rows on every sync. This reduces background write traffic on D1 and other SQLite-backed deployments when index declarations have not changed.

### Change 38

Applies to: `emdash@1.3.1` (patch)  
Source: [#4220](https://github.com/emdash-cms/emdash/pull/4220)

Reduces database round trips for the `search()`, `searchCollection()`, and `getSuggestions()` helpers, including searches with no matches, to improve response times on Cloudflare D1. Empty or whitespace-only queries no longer query the database. Autocomplete also skips collections whose search indexes are missing.

### Change 39

Applies to: `emdash@1.3.1` (patch)  
Source: [#4201](https://github.com/emdash-cms/emdash/pull/4201)

Fixes captions being omitted from image field values and their generated TypeScript types. Image selection, content saves, and seed export/import preserve captions, including explicitly empty captions. Seed exports keep library defaults separately from per-use captions. Image and focal-point edits retain per-use captions unless the caption is explicitly edited. Templates should read the top-level `caption`; the legacy `meta.caption` alias stays consistent when present.

For existing image fields whose captions were previously omitted, reselect the image or explicitly edit its caption, then save and publish the content entry. Upgrading alone does not fill captions into previously stored content values.

### Change 40

Applies to: `emdash@1.3.1` (patch)  
Source: [#4256](https://github.com/emdash-cms/emdash/pull/4256)

Fixes D1 parameter-limit errors when updating the status of up to 100 comments at once or saving content with more than 100 byline credits.

### Change 41

Applies to: `emdash@1.3.1` (patch)  
Source: [#4225](https://github.com/emdash-cms/emdash/pull/4225)

Fixes duplicate menu items and widgets when concurrent first requests apply the same seed through D1 bindings. Menu and widget replacements are atomic on D1 bindings, transactional SQLite, and PostgreSQL, so a failed replacement retains the previous items. This does not make replacements atomic on the Durable Object SQL backend.

### Change 42

Applies to: `emdash@1.3.1` (patch)  
Source: [#4221](https://github.com/emdash-cms/emdash/pull/4221)

Fixes the `Image` component from `emdash/ui` rejecting the `quality` prop during `astro check`. Quality now reaches both Astro image rendering paths and providers that support it, without leaking onto unoptimized `<img>` elements.

Fixes EmDash's internal-media transforms on Cloudflare serving the full-size original for Astro quality presets or fractional and out-of-range numbers. Presets `low`, `mid`, `high`, and `max` map to 25, 50, 80, and 100; finite numbers are rounded and clamped to 1–100.

### Change 43

Applies to: `emdash@1.3.1` (patch)  
Source: [#4074](https://github.com/emdash-cms/emdash/pull/4074)

Fixes stale automatic slug-change redirects hiding new entries published at the old URL. Publishing an entry now removes the automatic redirect from its URL, so visitors can reach the new page.

### Change 44

Applies to: `emdash@1.3.1` (patch)  
Source: [#4179](https://github.com/emdash-cms/emdash/pull/4179)

Fixes Subscribers, and other users without `content:read_drafts`, seeing unpublished content through the content API and MCP tools. Asking for the terms or translations of a draft or scheduled entry now returns not found, and MCP `content_get` returns only the published version of an entry with unpublished changes.

### Change 45

Applies to: `emdash@1.3.1` (patch)  
Source: [#4203](https://github.com/emdash-cms/emdash/pull/4203)

Fixes pages that show categories, tags or term counts hanging with a 524 error for every visitor on a Cloudflare Workers isolate after one visitor disconnected while the isolate was loading taxonomy definitions or its list of collections.

### Change 46

Applies to: `emdash@1.3.1` (patch)  
Source: [#4106](https://github.com/emdash-cms/emdash/pull/4106)

Stop forcing `blank: true` on every new text link.

TipTap's Link extension defaults `HTMLAttributes.target` to `"_blank"`. Because both the admin rich-text editor and the inline visual editor configured Link with only styling classes, the default survived deep-merge, so every link created with `setLink()` was serialized as `blank: true` and rendered with `target="_blank" rel="noopener noreferrer"`. Both editors now set `target: null` in their Link `HTMLAttributes`, so newly saved text links no longer open in a new tab unless an author explicitly chooses that option (available only for image links today).

Existing content that already has `blank: true` is unchanged and will continue to open in a new tab.

### Change 47

Applies to: `emdash@1.3.1` (patch)  
Source: [#4207](https://github.com/emdash-cms/emdash/pull/4207)

Fixes edits disappearing after unpublishing an entry in a collection without revisions: the editor showed the previously published content after every save, and the next save wrote it back over the edits. Saves now keep the edits, including on entries unpublished before this release.

### Change 48

Applies to: `emdash@1.3.0` (minor)  
Source: [#4117](https://github.com/emdash-cms/emdash/pull/4117)

Updates the visual-editing rich text editor's selection toolbar and slash menu to match the admin editor's.

Selecting text now shows the admin's toolbar: a Turn into menu, link, bold, italic, underline, strikethrough, inline code, and a More menu with subscript, superscript, alignment, and Clear formatting. With the caret in a link, a bar shows where it goes, with buttons to edit or remove it, and clicking a link no longer opens it in a new tab. A typed bare domain such as `example.com` links to `https://example.com`, and a link the editor can't use is refused with a message.

The slash menu now groups its commands, shows each one's Markdown shortcut and description, ranks matches as you type (`/bl` finds Bullet List), and finds Heading 4 to 6 by name. Headings 4 to 6 now show at their own size while editing instead of as Heading 1. Both menus follow the system's light or dark theme and stay readable in dark mode.

### Change 49

Applies to: `emdash@1.3.0` (minor)  
Source: [#4137](https://github.com/emdash-cms/emdash/pull/4137)

Adds an image picker and an image toolbar to the visual-editing rich text editor.

Typing `/image` now opens a picker below the line instead of a full-screen dialog. It shows the media library nine images a page, newest first, with a tab for each media provider the site has set up. One click, or the arrow keys and Enter, inserts an image.

The picker no longer uploads images. To use a new image, upload it to the media library in the admin first, then choose it with `/image`. When the library is empty, the picker links to the media library, which opens in a new tab.

Images now show as they publish, with their alignment and a caption field right underneath. Selecting one shows a toolbar to replace it, edit its alt text, or delete it. Replacing an image keeps its caption and takes the new image's alt text.

Typing `/image` now opens a picker only in the editor it was typed in, not in every editor on the page, and an inserted image no longer gets its file name as its alt text. An image inserted from a line inside a quote or list now goes after the quote or list; saving used to drop an image inside one.

### Change 50

Applies to: `emdash@1.3.0` (minor)  
Source: [#4068](https://github.com/emdash-cms/emdash/pull/4068)

Adds `emdash migrate --take-over-lock <id>`, which applies pending migrations under a stuck D1 migration lock without freeing it first. Releasing the lock with `--release-lock` and then running `emdash migrate` let a Worker in `auto` mode take the free lock in between, and the apply failed with a lock error.

```sh
pnpm emdash migrate --take-over-lock 1788264000000
```

Like `--release-lock`, it asks you to confirm the target, or needs `--expected-target-fingerprint` in a non-interactive shell.

### Change 51

Applies to: `emdash@1.3.0` (minor)  
Source: [#4136](https://github.com/emdash-cms/emdash/pull/4136)

Adds readable revision history to the content editor. Selecting a version in the **Revisions** panel shows it in place, read-only, with added text highlighted and removed text struck through in the color of the person who saved it. The selected version lists its changes in plain words, such as "Changed the title", and selecting one scrolls to it. **Restore** moves to a bar at the bottom of the editor, and a version that matches an earlier one is marked "Restored from" with that version's date. **Save** and **Publish** pause while a version is open. The panel no longer shows raw JSON.

The revisions list API (`GET /_emdash/api/content/{collection}/{id}/revisions`) and the MCP `revision_list` tool include each revision's `author` as `{ id, name }`, or `null` when no author was recorded or the account no longer exists, so editors without access to user management can see who saved each version.

`ContentEditor`'s `onRevisionRestored` callback can now return a promise. The restore stays pending until it settles, and the restore dialog shows the error if it rejects. When a host passes this callback, the restored version stays on screen until `item` carries the restored draft, and the writer can't go back to editing before then. The editor still refreshes the entry's `content` and `revisions` queries, so a host that reads `item` from the entry's `content` query needs no change. Other hosts must reload `item` from the callback.

### Change 52

Applies to: `emdash@1.3.0` (minor)  
Source: [#3623](https://github.com/emdash-cms/emdash/pull/3623)

Adds a **Disallow AI training** option to **Settings > SEO**. When it is on, `/robots.txt` disallows the AI training crawlers and opt-out tokens `Amazonbot`, `Applebot-Extended`, `Bytespider`, `CCBot`, `ClaudeBot`, `Google-Extended`, `GPTBot`, and `meta-externalagent`, and adds a `Content-Signal: search=yes, ai-train=no` line. Search engine access stays as your other rules define it. The rules are added to both the default and a custom `robots.txt`. The option is also available as `seo.disallowAiTraining` in the settings API and the MCP `settings_update` tool. It is off by default, so existing `robots.txt` output is unchanged.

### Change 53

Applies to: `emdash@1.3.0` (patch)  
Source: [#4034](https://github.com/emdash-cms/emdash/pull/4034)

Fixes `emdash whoami` failing on sites behind Cloudflare Access: it now sends the headers from `--header` and `EMDASH_HEADERS` and reads `EMDASH_URL`, like the other commands. Without a token on localhost, it now signs in through the dev bypass and reports the dev user, and exits 1 when no site answers or the site isn't running under `astro dev`, so scripts can use it as a reachability check.

### Change 54

Applies to: `emdash@1.3.0` (patch)  
Source: [#3955](https://github.com/emdash-cms/emdash/pull/3955)

Fixes `<CommentForm>` making right-to-left pages (`<html dir="rtl">`) about 10,000 pixels wider, with a horizontal scrollbar. This happened on every such page in Firefox, and in Chrome and Safari when the form or an element around it is positioned, for example with `position: relative`. On right-to-left pages, `<Comments>` now also indents threaded replies from the right, and the separator before a signed-in commenter's email in `<CommentForm>` no longer touches the email.

### Change 55

Applies to: `emdash@1.3.0` (patch)  
Source: [#3907](https://github.com/emdash-cms/emdash/pull/3907)

Reduces `getComments()` to a single database query when the approved comment list fits on one page.

Pages rendering comments previously ran a `COUNT` query followed by the list query, even when the result was not truncated. `getComments()` now fetches the list first and derives the total from the returned rows whenever cursor pagination indicates there are no more pages, falling back to `COUNT` only for posts that exceed the page limit. Cache misses on sites without an object cache benefit most.

### Change 56

Applies to: `emdash@1.3.0` (patch)  
Source: [#4133](https://github.com/emdash-cms/emdash/pull/4133)

Fixes Contributors being unable to save changes to their own drafts. A Contributor could create an entry, but the next save, the entry lock, and setting categories or tags returned 403. Contributors can now edit their own entries while they are drafts, in the admin, the REST API, and the MCP `content_update` tool. They still cannot edit entries once they are published or scheduled, or publish them.

The new `content:edit_own_drafts` permission grants this and is held by Contributor and every higher role. No other role's permissions change.

### Change 57

Applies to: `emdash@1.3.0` (patch)  
Source: [#3937](https://github.com/emdash-cms/emdash/pull/3937)

Fixes slower page loads for logged-out visitors on D1 with `session: "auto"` or `"primary-first"` and no `coalesce`. A session runs a request's queries one at a time, so EmDash's preload of site settings, menus, widget areas, and taxonomy terms for HTML pages delayed the page's own first query and added queries the page might never use. In that setup EmDash no longer preloads them; those queries run only when the page uses them. Sites with `coalesce: true` keep the preload, batched into one round trip.

New Cloudflare sites from the templates now use `d1({ binding: "DB", session: "auto", coalesce: true })`, so reads issued together share one D1 round trip, with or without read replication. To get the same on an existing site, set `session: "auto"` (or `"primary-first"`) and `coalesce: true` in its `d1()` call; `coalesce` has no effect without a session. `coalesce` is experimental: a read and a write started together may run write-first, so await a read before a write that must not affect it.

### Change 58

Applies to: `emdash@1.3.0` (patch)  
Source: [#4171](https://github.com/emdash-cms/emdash/pull/4171)

Fixes the admin dashboard for users without `content:read_drafts`, such as Subscribers. Recent activity and collection counts now include only published entries, matching what these users can open elsewhere in the admin, and scheduled-publication policy notices are no longer shown to them. Contributors and above see the dashboard as before.

### Change 59

Applies to: `emdash@1.3.0` (patch)  
Source: [#4128](https://github.com/emdash-cms/emdash/pull/4128)

On sites that use a route cache such as Workers Cache, creating or duplicating an entry no longer purges cached pages. The new entry is a draft that no public page shows, so pages that list the collection stay cached until a later change to published content. This applies to `POST /_emdash/api/content/{collection}`, `POST /_emdash/api/content/{collection}/{id}/duplicate`, and the `content_create` and `content_duplicate` MCP tools. `content_create` with `status: "published"` still purges the collection and the new entry.

### Change 60

Applies to: `emdash@1.3.0` (patch)  
Source: [#4000](https://github.com/emdash-cms/emdash/pull/4000)

Fixes first-user passkey registration so the newly created Admin is authenticated immediately after registration verification. Clicking "Open the dashboard" now opens the dashboard instead of redirecting to the login page.

### Change 61

Applies to: `emdash@1.3.0` (patch)  
Source: [#4073](https://github.com/emdash-cms/emdash/pull/4073)

Fixes force-deleting a collection so it also removes the entries' records in shared tables: revisions, SEO data, comments, content bylines, taxonomy assignments, entry locks, and the revision prune queue. Previously these rows were left behind because only the content table, FTS table, and collection row were dropped.

### Change 62

Applies to: `emdash@1.3.0` (patch)  
Source: [#4045](https://github.com/emdash-cms/emdash/pull/4045)

Fixes site settings updates during a running export so the export's `write_epoch` bump happens inside the same transaction. If the export fence cannot record the write, the settings update now rolls back instead of committing invisibly to the export.

### Change 63

Applies to: `emdash@1.3.0` (patch)  
Source: [#3824](https://github.com/emdash-cms/emdash/pull/3824)

Fixes MCP `content_create` and `content_update` rejecting writes that omit a blocks field with "must be an array". A create that omits a blocks field treats it as empty, and an update keeps the stored blocks. Supplied non-array values are still rejected.

### Change 64

Applies to: `emdash@1.3.0` (patch)  
Source: [#3885](https://github.com/emdash-cms/emdash/pull/3885)

Fix plugin storage cursor behavior when the anchor row of an ordered page is deleted. `PluginStorageRepository.query()` now encodes scalar ordered field values into the cursor and compares subsequent pages against those values, so ascending walks no longer end early and descending walks no longer restart from the top. Cursors for non-scalar values (objects or arrays) or very long strings fall back to the anchor-row lookup used before this fix, keeping those pages working while still surfacing a clear invalid-cursor error when that anchor row has been deleted. Legacy cursors that do not contain the field values still work under the same fallback.

### Change 65

Applies to: `emdash@1.3.0` (patch)  
Source: [#3825](https://github.com/emdash-cms/emdash/pull/3825)

Fixes content writes to single-type blocks fields rejecting blocks that omit `_type`, including nested Markdown conversion over MCP and the TypeScript client. EmDash infers the only allowed type on ordinary writes; multiple allowed types, seed files, and stored blocks of a different type still require an explicit `_type`. Explicit invalid types remain errors.

### Change 66

Applies to: `emdash@1.3.0` (patch)  
Source: [#3942](https://github.com/emdash-cms/emdash/pull/3942)

Fixes the visual-editing rich text editor adding a revision to the entry's history every time it saves on blur. Its saves now replace the pending draft revision, like the admin editor's autosave.

### Change 67

Applies to: `emdash@1.3.0` (patch)  
Source: [#3982](https://github.com/emdash-cms/emdash/pull/3982)

Fixes new and changed redirects being ignored for pages already in the Workers Cache. Saving a redirect for an exact path now clears the cached page at that path.

### Change 68

Applies to: `emdash@1.3.0` (patch)  
Source: [#4102](https://github.com/emdash-cms/emdash/pull/4102)

Fixes the MCP `content_create` tool so it accepts optional `seo` and `publishedAt` fields and persists them in the same call. Agents no longer need to create a post and then call `content_update` just to set SEO metadata or backdate an item. `publishedAt` is gated behind the `content:publish_any` permission, matching the REST API and `content_update`.

### Change 69

Applies to: `emdash@1.3.0` (patch)  
Source: [#3791](https://github.com/emdash-cms/emdash/pull/3791)

Fixes two problems with number fields in the content editor. Clearing a number field now saves it as empty instead of `0`, which previously failed a field's minimum (such as `min: 1`) or silently stored zero. Decimal values such as `4.50` no longer block the Save button with the browser's "nearest valid values" message, while `integer` fields keep stepping in whole numbers.

### Change 70

Applies to: `emdash@1.3.0` (patch)  
Source: [#3202](https://github.com/emdash-cms/emdash/pull/3202)

Fixes full-text search so queries containing lowercase words like "and", "or", "not" or "near" are no longer parsed as FTS5 operators. This restores results for searches with possessive apostrophes and keeps prefix matching for those queries.

### Change 71

Applies to: `emdash@1.3.0` (patch)  
Source: [#4092](https://github.com/emdash-cms/emdash/pull/4092)

Fixes WordPress imports through the EmDash Exporter plugin losing Advanced Custom Fields values: a field stored on only one post was never created, and a repeater row that only one post had was lost. For ACF field groups assigned to a post type, the import now creates a field for every ACF field and stores selects, checkboxes, repeaters, groups, relationships and other structured values as JSON. Relationship, post object, user and taxonomy values that arrive as WordPress posts, users or terms keep only their IDs, so a related post's content and password or a user's password hash are not copied into EmDash. A collection from an earlier import keeps the fields it has, so its repeaters still arrive as one field per row and sub-field.

#### What should I do?

Running the import again skips entries that already exist, so if you imported ACF relationship, post object or user fields through the exporter with an earlier version, check those JSON fields for whole WordPress posts and users yourself.

### Change 72

Applies to: `emdash@1.3.0` (patch)  
Source: [#988](https://github.com/emdash-cms/emdash/pull/988)

Fixes MCP tool names for plugins with scoped IDs such as `@acme/calendar`: their tools are listed as `acme__calendar__<tool>`, which MCP clients accept. Update saved calls that use the old scoped names. Plugins with plain IDs keep their names, and the admin plugin list displays the generated names before consent.

A plugin tool whose JSON Schema cannot be read no longer stops other tools from loading. Unreadable input schemas accept object inputs for route validation; unreadable output schemas are omitted. Duplicate generated names keep the first tool and log a warning instead of disabling the MCP endpoint.

### Change 73

Applies to: `emdash@1.3.0` (patch)  
Source: [#3584](https://github.com/emdash-cms/emdash/pull/3584)

Removes up to two database round trips from the first request after a cold start on sites with the plugin marketplace or registry enabled.

With the sandbox disabled (`sandbox: false`), a failure to load the in-process plugin adapter now stops startup with an error instead of silently starting without any marketplace plugins, matching how sandboxed plugins listed in the integration config already behave.

### Change 74

Applies to: `emdash@1.3.0` (patch)  
Source: [#4005](https://github.com/emdash-cms/emdash/pull/4005)

Fixes server-rendered pages that inspect public plugin route metadata before dispatching, so logged-out visitors can load plugin data. Public metadata is available through `getPublicPluginRouteMeta` for both visitors and signed-in users. Private route metadata stays on the signed-in `getPluginRouteMeta` helper.

### Change 75

Applies to: `emdash@1.3.0` (patch)  
Source: [#2768](https://github.com/emdash-cms/emdash/pull/2768)

Fixes scheduled maintenance stopping after the initialization request in Cloudflare `astro dev`. EmDash now drives its own maintenance through a dev-only workerd route from the long-lived dev server, keeping plugin cron jobs, scheduled publishing, cleanup, and declared plugin storage index creation running between requests without invoking application-wide scheduled jobs. Also works with HTTPS dev servers, including self-signed certificates.

### Change 76

Applies to: `emdash@1.3.0` (patch)  
Source: [#4053](https://github.com/emdash-cms/emdash/pull/4053)

Fixes the `defaultRole` and `roleMapping` hover text for external auth providers and Cloudflare Access, which called role 30 "Editor" and role 40 "Developer". Role 30 is Author and can publish its own content, and role 40 is Editor. Only the descriptions and examples changed, not how roles resolve.

#### What should I do?

If you set `defaultRole` or a `roleMapping` entry to `30` because the hover text said Editor, check that Author access is what you meant. Use `20` (Contributor) for people who should not publish. The Access `defaultRole` still defaults to `30`.

### Change 77

Applies to: `emdash@1.3.0` (patch)  
Source: [#3997](https://github.com/emdash-cms/emdash/pull/3997)

Fixes Astro's route cache, such as Workers Cache, storing a page at a redirect's source after the redirect was saved. A Worker isolate that had not yet reloaded its redirect rules could render the old page and the route cache kept it, even after the cached page was purged. Before the route cache stores a response, the redirect middleware now checks that its rules are current and answers with the redirect when they have changed. This costs one database read for each response the route cache stores; other responses are unchanged.

### Change 78

Applies to: `emdash@1.3.0` (patch)  
Source: [#4097](https://github.com/emdash-cms/emdash/pull/4097)

Fixes oversized plugin screenshots failing to load in the admin registry gallery with HTTP 413.

The registry artifact proxy now requests the `feed_fullsize` image preset for screenshots instead of `feed_thumbnail`. This aligns the admin preview with the public plugin site and avoids the lossless upscaling that pushed modest source images over the 1 MiB proxy cap.

### Change 79

Applies to: `emdash@1.3.0` (patch)  
Source: [#4072](https://github.com/emdash-cms/emdash/pull/4072)

Fixes the datetime normalization migration taking hours on large Cloudflare D1 sites and starting over after every interruption. It now writes changed rows in batches, and running `emdash migrate` again after a failed write continues from the last written batch.

### Change 80

Applies to: `emdash@1.3.0` (patch)  
Source: [#4044](https://github.com/emdash-cms/emdash/pull/4044)

Fix saving a draft when retired fields remain only in the published content row. A full read-then-write update no longer fails validation for keys the entry already stores in its live data but that are absent from the current draft revision. Genuinely never-stored unknown keys are still rejected.

### Change 81

Applies to: `emdash@1.3.0` (patch)  
Source: [#3987](https://github.com/emdash-cms/emdash/pull/3987)

Fixes saves in the admin and through MCP reporting an error when the configured cache provider fails to purge, although the change was already saved. These saves now report success, and the failed purge is logged.

### Change 82

Applies to: `emdash@1.3.0` (patch)  
Source: [#3921](https://github.com/emdash-cms/emdash/pull/3921)

Fixes `emdash seed` to avoid leaking duplicate media rows and adds `--skip-media` for storage-less seeds.

- `$media` references now deduplicate against existing ready media rows by content hash, so re-running `emdash seed ... --on-conflict=update` reuses the same rows instead of creating new ones each time.
- New `--skip-media` flag resolves `$media` references to external URLs without downloading files or creating local `./uploads`, which is useful when seeding a site whose media lives in remote object storage.

### Change 83

Applies to: `emdash@1.3.0` (patch)  
Source: [#4014](https://github.com/emdash-cms/emdash/pull/4014)

Fixes visual editing selecting all of a text field's text when it is clicked, which made the first keystroke replace the whole value. A click now places the caret where it lands, including on a field inside a link, and text selected by dragging stays selected.

### Change 84

Applies to: `emdash@1.3.0` (patch)  
Source: [#3942](https://github.com/emdash-cms/emdash/pull/3942)

Fixes visual editing for empty Portable Text fields, such as the body of a new post. Edit mode now renders the inline editor for them, so the field can be written on the page instead of having no editor at all. The empty editor stays blank until it is clicked, then shows a "Type / for commands..." hint. In edit mode, an empty Portable Text field reads as an empty array instead of `null`.

### Change 85

Applies to: `emdash@1.3.0` (patch)  
Source: [#4058](https://github.com/emdash-cms/emdash/pull/4058)

Warns during `astro build` and `astro dev` when the installed `@emdash-cms/cloudflare` version differs from `emdash`. The adapter depends on the exact `emdash` version it was released with, so upgrading only one of the two packages installs a second copy of `emdash` that the adapter runs against. The warning names both versions and the command to install matching ones.

### Change 86

Applies to: `emdash@1.3.0` (patch)  
Source: [#3265](https://github.com/emdash-cms/emdash/pull/3265)

Fixes `getEmDashCollection`'s `where` filter so an object with none of `gt`, `gte`, `lt` or `lte` (such as `{ in: [...] }`) now logs a warning instead of silently returning unfiltered rows. Long array values no longer fail on Cloudflare D1 with "too many SQL variables": the longest arrays are each bound as one JSON parameter, keeping ordering and paging in the database on SQLite, D1 and PostgreSQL. Values bound that way compare as text.

### Change 87

Applies to: `emdash@1.3.0` (patch)  
Source: [#4056](https://github.com/emdash-cms/emdash/pull/4056)

Fixes WordPress WXR imports overcounting skipped items. The "skipped (already exists)" count in the admin, and the `skipped` value returned by `POST /_emdash/api/import/wordpress/execute`, now only include entries whose slug already exists in the target collection and locale. Menu items, reusable blocks (imported as sections), revisions and post types you disabled are no longer counted. The "X of Y" progress shown during the import no longer runs past the number of selected items.

### Change 88

Applies to: `emdash@1.3.0` (patch)  
Source: [#4113](https://github.com/emdash-cms/emdash/pull/4113)

Send an identifying `User-Agent: EmDash-Importer/1.0` header on all WordPress plugin importer requests. Without this header, hosts that block requests with an empty User-Agent (such as ScalaHosting's bot filter) returned 403 during analyze and media import. The plugin API fetcher now adds the header to every request, and direct media downloads from `fetchMedia` send the same value. This matches the existing media import route behavior.

### Change 89

Applies to: `emdash@1.3.0` (patch)  
Source: [#4150](https://github.com/emdash-cms/emdash/pull/4150)

Explains why the WordPress exporter import can't connect when Cloudflare's bot protection answers with a challenge page. The URL check and the analyze and import steps now say that bot protection blocked the request and how to let it through, instead of reporting that WordPress couldn't be detected or that the analysis failed. In this case the analyze and execute endpoints return the `WP_SITE_CHALLENGE` error code with status 502, and probe results include `challenged: true`.

### Change 90

Applies to: `emdash@1.3.0` (patch)  
Source: [#4150](https://github.com/emdash-cms/emdash/pull/4150)

Stops a WordPress exporter import with the bot-protection message when Cloudflare challenges a request for taxonomies, menus, site settings, or the media list. Previously the import skipped that part without telling you and finished without it. The analyze and execute endpoints now return `WP_SITE_CHALLENGE` with status 502 in these cases too.

### Change 91

Applies to: `emdash@1.3.0` (patch)  
Source: [#3892](https://github.com/emdash-cms/emdash/pull/3892)

Fixes the WordPress export file (WXR) import in the admin keeping links to the old WordPress domain in imported content. Links to the source site are now rewritten to root-relative paths. The WordPress permalink structure is kept (for example `/2024/05/my-post/`), so add redirects if your routes differ. Links to uploaded files stay absolute, including in raw HTML blocks, which the WordPress plugin import previously turned into broken relative `/wp-content/` links. Links inside reusable blocks imported as sections are not changed.

The import analysis now also shows the real site title and address instead of a generic "WordPress Site" heading. For programmatic use, `parseWxrString` now returns the export's site metadata (it was always empty before), and content fetched through `wxrSource` gets the same link rewriting.

### Change 92

Applies to: `emdash@1.3.0` (patch)  
Source: [#4090](https://github.com/emdash-cms/emdash/pull/4090)

Fixes WordPress XML imports creating `acf_field` and `acf_field_group` collections full of serialized field settings on sites that use Advanced Custom Fields. The admin import now skips ACF's own post types, as it already does for WordPress internals such as revisions and menu items. Collections created by earlier imports stay in place; delete them in the admin if you don't need them.

### Change 93

Applies to: `emdash@1.3.0` (patch)  
Source: [#4123](https://github.com/emdash-cms/emdash/pull/4123)

Fixes `media:afterUpload` hooks being silently dropped for REST API multipart uploads and MCP `media_create` uploads on Cloudflare Workers. Both upload paths now defer hook execution through `after()`, matching the admin confirm flow so hooks that perform async work complete as expected.

## Agent skills

The updater ran:

```sh
npx --yes skills@1.7.0 add emdash-cms/skills -y
```

Use the refreshed `upgrading-emdash` skill for this work order. If the skills command reported a conflict or failure, resolve that before continuing.

## Core database migrations

Installed EmDash changed from `1.2.0` to `1.4.0`.

No core migrations were added by this upgrade.

Build the upgraded project and inspect the exact database target:

```sh
npm run build
npm exec -- emdash migrate --status
```

If the status reports pending migrations, stop before starting or deploying the upgraded application. Follow [Backups and recovery](https://docs.emdashcms.com/guides/backups/) to create a restorable recovery point. A JSON backup is not a recovery point. After a human has reviewed the target and backup, apply the pending migrations:

```sh
npm exec -- emdash migrate
```

The command shows the target and asks for confirmation. In a non-interactive shell, add `--expected-target-fingerprint` with the target fingerprint that the status command printed for the reviewed database.

Deploy the same build artifact with the project's deployment workflow, without rebuilding it. On Cloudflare Workers, run `wrangler deploy`.

Verify the deployed database against that artifact:

```sh
npm exec -- emdash migrate --check
```

## Verification

1. Assess every release entry above and make the project changes it requires.
2. Run the project's format, tests, typecheck, and build commands.
3. Inspect the migration target and pending names before applying them.
4. Verify the public site, admin sign-in, content editing, media reads, and encrypted plugin settings after deployment.
