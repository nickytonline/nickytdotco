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

## Design System & Styling

- Tailwind v4 theme tokens live in `src/styles/global.css` under `:root`, `.dark`, and `@theme inline`.
- Prefer semantic color utilities: `bg-background`, `text-foreground`, `text-muted-foreground`, `bg-card`, `text-card-foreground`, `bg-secondary`, `text-secondary-foreground`, `bg-popover`, `text-popover-foreground`, `border-border`, `text-brand`, `bg-brand-solid`, `bg-brand-soft`, `text-warning-foreground`, and `bg-warning-soft`.
- Do not introduce raw palette classes such as `text-pink-*`, `bg-rose-*`, `text-gray-*`, `text-red-*`, or arbitrary color utilities like `text-[#...]` in UI code. Add or reuse a named token in `global.css` instead.
- Third-party brand colors are allowed only through named tokens such as `text-youtube` and `text-twitch`.
- Keep Tailwind utility classes for layout, spacing, typography, and state, but route color decisions through the design tokens.

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
