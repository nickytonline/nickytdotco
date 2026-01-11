# Repository Guidelines

## Project Structure & Module Organization
- `src/` contains the Astro site source.
- Routes live in `src/pages/`, layouts in `src/layouts/`, UI components in `src/components/`.
- Content lives in `src/content/` and `src/blog/`.
- Styling is split between `src/scss/` and `src/styles/`.
- Shared data sits in `src/_data/`.
- Static assets go in `public/` and are copied as-is at build time.
- Build output is generated in `dist/` (do not commit).

## Build, Test, and Development Commands
- `npm run dev` or `npm start`: start the Astro dev server.
- `npm run build`: run `astro check` and build the site to `dist/`.
- `npm run preview`: serve the production build locally.

## Coding Style & Naming Conventions
- Formatting follows Prettier defaults (`.prettierrc` is empty).
- Use ESM imports/exports (`"type": "module"` in `package.json`).
- Prefer double quotes and template literals for interpolation.
- Use camelCase for JS/TS variables and functions.
- Use kebab-case for filenames, e.g. `post-card.astro`.

## Testing Guidelines
- There is no dedicated test runner; validation happens via `npm run build`.
- Treat `astro check` failures as blockers before merging.

## Commit & Pull Request Guidelines
- Use Conventional Commits, e.g. `feat:`, `fix:`, `docs:`, or scoped variants like `feat(search):`.
- Discuss changes with maintainers before opening a PR (issue or email).
- PRs should include a clear description and relevant links; add screenshots for UI changes.
- Ensure build artifacts are not committed.

## Configuration & Environment Notes
- Node.js >= 22 is required.
- Deployment is configured for Netlify via `netlify.toml`.
