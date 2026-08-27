---
applyTo: "**/*.{js,ts,tsx,jsx,astro,mjs,cjs,json,css,html,yml,yaml}"
description: "Format with vp fmt before committing. Use when editing source or making git commits."
---

# Formatting before commits

Netlify `npm run build` runs `vp fmt --check .` first. Unformatted files fail the deploy (Redirect rules / Header rules / Pages changed all go red).

1. Run `vp fmt .` (or `npm run format`) on changed files, then `vp fmt --check .`.
2. Use the Vite+ CLI (`vp fmt`), not bare `oxfmt`. Bare Oxfmt ignores `vite.config.ts` (`printWidth: 80`, quotes, trailing commas).
3. This repo **does** have a pre-commit hook: `.vite-hooks/pre-commit` runs `vp staged` after `vp config` (`prepare` script). Cursor Cloud overrides `core.hooksPath`, so that hook often does not run here — format manually in the same turn as `git commit`.
