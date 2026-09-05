# Repository Guidelines (TOC Style)

## Quick Start

- Install Vite+ CLI: `curl -fsSL https://vite.plus | bash` (one-time setup, see [guide](https://viteplus.dev/guide/)).
- Install deps: `vp install` (Node.js 22+).
- Dev server: `vp run dev` (runs Astro dev on port 4321; do **not** use `vp dev`, which starts Vite's raw server on port 5173).
- Build pipeline: `vp run build`.
- Preview build: `vp run preview`.
- Format/lint: `vp fmt .`, `vp fmt --check .`, `vp lint .`, `vp lint --fix .`.
- Type check: `vp dlx astro check`.

## Architecture

- Stack: Astro 5.x SSG, React for interactivity, MDX content, Tailwind v4.
- Search: Turso vector search via `GET /api/search` (Gemini embeddings); Cmd-K dialog in `src/components/Search.tsx` searches after 500ms debounce once 2 characters are typed (Enter still searches immediately / opens a result). Query strings are capped at 200 chars; query embeddings are cached in Turso. `/api/search` is rate-limited at the Netlify edge (20 req/IP/min).
- Deploy: Netlify (`netlify.toml`).

## Where Things Live

- Routes: `src/pages/`.
- UI: `src/components/`, `src/layouts/`.
- Content: `src/content/` (schemas in `src/content/config.ts`).
- Live loaders: `src/content/loaders/`, config in `src/live.config.ts`.
- Styles: `src/styles/` (globals in `src/styles/global.css`).
- Static: `public/`.
- E2E tests: `e2e/`, config in `playwright.config.ts`.

## Content & Routing

- Blog: `src/content/blog/` (frontmatter: `title`, `date`, optional `excerpt`, `tags`, `cover_image`, `series`, `draft`). Slugs/filenames are generated locally from `title` via `slugify` in `bin/generateDevToPosts.ts`, not from dev.to's slug; the original dev.to slug is preserved as `dev_to_slug`.
- Talks: `src/content/talks/` (video metadata + links).
- Drafts: excluded from production builds.
- RSS: `src/pages/feed.xml.ts`, `src/pages/stream-schedule-feed.xml.ts`.

## Env & Integrations

- Env schema: `.env.schema`, types: `env.d.ts` (Varlock).
- Required vars for the site: `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN`, `TURSO_SEARCH_DATABASE_URL`, `TURSO_SEARCH_AUTH_TOKEN`, `GITHUB_TOKEN`, `DEV_API_KEY`, `GEMINI_API_KEY`, `URL`.
- Sync scripts use scoped Varlock env dirs instead of the root schema: `env/devto/.env.schema` (imports `DEV_API_KEY`, used by `vp run generate:posts`) and `env/search/.env.schema` (`GEMINI_API_KEY`, `TURSO_SEARCH_*`, optional `TURSO_*` for stream guests, used by `vp run index:search`). All are invoked as `varlock run --path env/<name> -- ...` from `package.json`. Live streams and schedule come from Turso via Astro live loaders (`streamVideos`, `streamSchedule`). Embeddings run in `.github/workflows/index-search.yml` on **push to `main`**, **workflow_dispatch**, and when production SSR pages (`/`, `/watch`, `/newsletter`) regenerate after CDN cache expiry. Those Netlify functions detect production from `Astro.locals.netlify.context.deploy.context` (not `process.env.CONTEXT`, which is outside the Varlock schema and unset in the SSR bundle), dispatch the workflow with `GITHUB_TOKEN` (`actions:write`) at most once per hour, and log `[search-reindex] Kicked off…` or a skip reason when they run. Not during the Netlify build and not on PRs. Batches of 5 with a 5s pause so Gemini rate limits are tolerated; content hashes skip unchanged docs.

## Testing (E2E)

- Playwright specs live in `e2e/`; run with `vp run test:e2e` (`test:e2e:ui` for UI mode, `test:e2e:report` to reopen the last HTML report).
- Locally, tests run against a real production build, not the dev server: `playwright.config.ts`'s `webServer` builds and serves via `npx varlock run -- netlify serve` unless `PLAYWRIGHT_BASE_URL` is set. This is required, not optional — `astro preview` throws ("adapter does not support the preview command") because `@astrojs/netlify` has no preview entrypoint, and search hits the production `/api/search` function against the Turso index.
- `netlify-cli` is expected as a **global** install (`npm install -g netlify-cli`), not a project dependency — it's Netlify's own recommended install method and avoids ~400 extra packages in `node_modules` for something CI never touches. `webServer.command` checks `command -v netlify` first and fails with an install hint if it's missing.
- `varlock run --` matters: it resolves real secrets before `netlify serve`'s own `.env.development` injection runs, so the real values win instead of the raw unresolved `op://...` reference strings.
- CI (`.github/workflows/e2e.yml`) does not build at all — it polls the `deploy/netlify` commit status until Netlify's own build finishes, then sets `PLAYWRIGHT_BASE_URL` to that deploy preview's URL. This tests the real deployed environment (real edge/geo behavior, real search API) and needs no app secrets in the workflow at all, since Netlify's own build environment already has them. PR-only: Netlify only posts that commit status for deploy previews, not for direct pushes to `main` — a push to `main` has already passed this check on its PR beforehand.

## Code Standards

- Formatting: Oxfmt (`vp fmt`); linting: Oxlint (`vp lint`).
- **Before every commit**, run `vp fmt .` then `vp fmt --check .` (or `npm run format`). Netlify `npm run build` starts with `format:check` and fails the whole deploy if Oxfmt is unhappy. Use `vp fmt` (reads `vite.config.ts` `fmt`, including `printWidth: 80`). Do **not** run bare `oxfmt` from `node_modules` — that uses defaults and will not match CI.
- Pre-commit hook: this repo already has one. `prepare` runs `vp config`, which installs `.vite-hooks/pre-commit` (`vp staged` on matching staged files). Locally that is the Husky-style hook. Cursor Cloud sets `core.hooksPath` to its own agent hooks, so **the Vite+ hook does not run on agent commits** — format in the same turn as the commit.
- TypeScript: explicit types when helpful; unused vars use `_` prefix.
- Naming: content slugs are kebab-case.

## Design System & Styling

- Tailwind v4 theme tokens live in `src/styles/global.css` under `:root`, `.dark`, and `@theme inline`.
- Prefer semantic color utilities: `bg-background`, `text-foreground`, `text-muted-foreground`, `bg-card`, `text-card-foreground`, `bg-secondary`, `text-secondary-foreground`, `bg-popover`, `text-popover-foreground`, `border-border`, `text-brand`, `bg-brand-solid`, `bg-brand-solid-hover`, `bg-brand-soft`, `border-brand`, `border-brand-border`, `text-destructive`, `text-warning-foreground`, and `bg-warning-soft`.
- Full token-to-utility mapping (surfaces, text, borders/focus, brand, status, third-party) is kept in sync in `.github/instructions/design-system.instructions.md` — update both files together when tokens change.
- Do not introduce raw palette classes such as `text-pink-*`, `bg-rose-*`, `text-gray-*`, `text-red-*`, or arbitrary color utilities like `text-[#...]` in UI code. Add or reuse a named token in `global.css` instead.
- Third-party brand colors are allowed only through named tokens such as `text-youtube` and `text-twitch`.
- Keep Tailwind utility classes for layout, spacing, typography, and state, but route color decisions through the design tokens.

## Change Hygiene

- Do not edit `dist/` or `node_modules/` directly.
- Keep dependency changes intentional; update `package.json` and `package-lock.json` together.
- Prefer `rg` for search.
- Do not commit until `vp fmt --check .` passes on the files you touched.

## Review & Delivery

- Commits: use Conventional Commits (`feat:`, `fix:`, `refactor:`, `style:`).
- PRs: include description, linked issue (if any), screenshots for UI changes.
- Conduct: follow `contributing.md`.

<!--VITE PLUS START-->

# Using Vite+, the Unified Toolchain for the Web

This project is using Vite+, a unified toolchain built on top of Vite, Rolldown, Vitest, tsdown, Oxlint, Oxfmt, and Vite Task. Vite+ wraps runtime management, package management, and frontend tooling in a single global CLI called `vp`. Vite+ is distinct from Vite, and it invokes Vite through `vp dev` and `vp build`. Run `vp help` to print a list of commands and `vp <command> --help` for information about a specific command.

Docs are local at `node_modules/vite-plus/docs` or online at https://viteplus.dev/guide/.

## Built-in Commands vs Scripts

`vp <name>` runs a built-in command. `vp run <name>` runs a `package.json` script or a `vite.config.ts` task. Scripts cannot overwrite built-ins, so `vp dev` and `vp run dev` may do different things. Check `package.json` and `vite.config.ts` first, and run `vp run <name>` when the project defines a script or task with that name.

## Tool Versions

Run `vp toolchain` to show versions and relationships in the active Vite+
release. Add a tool name to select part of the graph. For example, run
`vp toolchain vite`. Use `--global` to ignore the local `vite-plus` package. Use
`vp why <package>` to show the package-manager dependency graph.

## Review Checklist

- [ ] Run `vp install` after pulling remote changes and before getting started.
- [ ] Run `vp check` and `vp test` to format, lint, type check and test changes.
- [ ] Check if there are `vite.config.ts` tasks or `package.json` scripts necessary for validation, run via `vp run <script>`.
- [ ] If setup, runtime, or package-manager behavior looks wrong, run `vp env doctor` and include its output when asking for help.

<!--VITE PLUS END-->
