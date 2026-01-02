# Repository Guidelines

## Project Structure & Module Organization
- `src/` holds the Astro site source. Key areas: `src/pages/` for routes, `src/layouts/` for page shells, `src/components/` for UI components, `src/content/` and `src/blog/` for markdown content, `src/scss/` and `src/styles/` for styling, and `src/_data/` for shared data.
- `public/` contains static assets copied as-is at build time.
- `dist/` is the build output (generated).
- Root config includes `astro.config.mjs`, `tsconfig.json`, and `netlify.toml`.

## Build, Test, and Development Commands
- `npm run dev` or `npm start`: run the Astro dev server.
- `npm run build`: run `astro check` then build to `dist/`.
- `npm run preview`: serve the production build locally.
- `npm run sass:process`: compile Sass (`src/scss/global.scss` -> `src/styles/global.css`).
- `npm run sass:tokens`: generate Sass tokens from `src/_data/tokens.json`.

## Coding Style & Naming Conventions
- Formatting: Prettier default config (`.prettierrc` is empty).
- Modules: ESM (`"type": "module"` in `package.json`).
- Naming: camelCase for JS/TS, kebab-case for filenames (e.g., `post-card.astro`).
- Strings: prefer double quotes; use template literals for interpolation.

## Testing Guidelines
- No dedicated test runner or test directory is configured. Use `npm run build` to validate type checks and builds before PRs.

## Commit & Pull Request Guidelines
- Commit messages follow Conventional Commits patterns (e.g., `feat:`, `fix:`, `chore:`, `docs:`; scoped variants like `feat(search):`).
- Before opening a PR, discuss the change with maintainers via issue or email.
- Ensure build or install artifacts are not committed, and verify changes are tested to the best of your ability.
- PRs should include a clear description, any relevant links, and obtain maintainer sign-off before merge.

## Configuration & Environment Notes
- Node.js version requirement: `>=18.13.0`.
- Deployment is set up for Netlify via `netlify.toml`.
