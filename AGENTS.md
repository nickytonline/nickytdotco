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
- Search: Pagefind builds from `dist/`.
- Deploy: Netlify (`netlify.toml`).

## Where Things Live

- Routes: `src/pages/`.
- UI: `src/components/`, `src/layouts/`.
- Content: `src/content/` (schemas in `src/content/config.ts`).
- Live loaders: `src/content/loaders/`, config in `src/live.config.ts`.
- Styles: `src/styles/` (globals in `src/styles/global.css`).
- Static: `public/`.

## Content & Routing

- Blog: `src/content/blog/` (frontmatter: `title`, `date`, optional `excerpt`, `tags`, `cover_image`, `series`, `draft`).
- Talks: `src/content/talks/` (video metadata + links).
- Drafts: excluded from production builds.
- RSS: `src/pages/feed.xml.ts`, `src/pages/stream-schedule-feed.xml.ts`.

## Env & Integrations

- Env schema: `.env.schema`, types: `env.d.ts` (Varlock).
- Required vars: `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN`, `GITHUB_TOKEN`, `DEV_API_KEY`, `URL`.

## Code Standards

- Formatting: Oxfmt (`vp fmt`); linting: Oxlint (`vp lint`).
- TypeScript: explicit types when helpful; unused vars use `_` prefix.
- Naming: content slugs are kebab-case.

## Change Hygiene

- Do not edit `dist/` or `node_modules/` directly.
- Keep dependency changes intentional; update `package.json` and `package-lock.json` together.
- Prefer `rg` for search.

## Review & Delivery

- Commits: use Conventional Commits (`feat:`, `fix:`, `refactor:`, `style:`).
- PRs: include description, linked issue (if any), screenshots for UI changes.
- Conduct: follow `contributing.md`.

<!--VITE PLUS START-->

# Using Vite+, the Unified Toolchain for the Web

This project is using Vite+, a unified toolchain built on top of Vite, Rolldown, Vitest, tsdown, Oxlint, Oxfmt, and Vite Task. Vite+ wraps runtime management, package management, and frontend tooling in a single global CLI called `vp`. Vite+ is distinct from Vite, and it invokes Vite through `vp dev` and `vp build`. Run `vp help` to print a list of commands and `vp <command> --help` for information about a specific command.

Docs are local at `node_modules/vite-plus/docs` or online at https://viteplus.dev/guide/.

## Review Checklist

- [ ] Run `vp install` after pulling remote changes and before getting started.
- [ ] Run `vp check` and `vp test` to format, lint, type check and test changes.
- [ ] Check if there are `vite.config.ts` tasks or `package.json` scripts necessary for validation, run via `vp run <script>`.
- [ ] If setup, runtime, or package-manager behavior looks wrong, run `vp env doctor` and include its output when asking for help.

<!--VITE PLUS END-->
