# Repository Guidelines (TOC Style)

## Quick Start

- Install deps: `npm install` (Node.js 22+).
- Dev server: `npm run dev` (`npm start` alias).
- Build pipeline: `npm run build`.
- Preview build: `npm run preview`.
- Format/lint: `npm run format`, `npm run format:check`, `npm run lint`, `npm run lint:fix`.
- Type check: `npx astro check`.

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

- Formatting: Prettier; linting: ESLint (`eslint.config.js`).
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
