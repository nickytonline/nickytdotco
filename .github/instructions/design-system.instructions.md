---
applyTo: "src/**/*.{astro,tsx,ts,js,css}"
description: "Use when authoring UI, Tailwind classes, CSS, colors, dark mode states, or design-system tokens in nickytdotco."
---

# Design System Authoring

Use Tailwind utilities for layout, spacing, typography, responsive behavior, and state. Route color decisions through the project tokens in `src/styles/global.css`.

## Color Tokens

Prefer these semantic utilities in UI code:

- Surfaces: `bg-background`, `bg-card`, `bg-popover`, `bg-secondary`, `bg-muted`
- Text: `text-foreground`, `text-card-foreground`, `text-popover-foreground`, `text-secondary-foreground`, `text-muted-foreground`
- Borders and focus: `border-border`, `border-brand`, `border-brand-border`, `ring-brand`, `outline-brand`, `ring-focus-ring`, `outline-focus-ring`
- Brand accents: `text-brand`, `bg-brand-solid`, `bg-brand-solid-hover`, `bg-brand-soft`, `text-brand-soft-foreground`, `text-brand-foreground`, `decoration-brand`
- Status: `text-destructive`, `bg-destructive/10`, `border-destructive/30`, `bg-warning-soft`, `text-warning-foreground`, `border-warning-border`
- Third-party brands: `text-youtube`, `text-twitch`, `text-github`, `text-x`, `text-linkedin`, `text-devto`, `text-bluesky`, `text-mastodon`
- Language accents: `bg-typescript`

## Rules

- Do not add raw palette color utilities like `text-pink-*`, `bg-rose-*`, `text-gray-*`, `bg-red-*`, or `border-amber-*` for UI styling.
- Do not add arbitrary color utilities like `text-[#...]`, `bg-[#...]`, or `border-[#...]` in source UI. Add a named token in `global.css` instead.
- Avoid one-off dark-mode color overrides when a token already adapts in `.dark`.
- Use raw CSS color values only inside `global.css` token definitions or third-party integration overrides.
- For hover and focus states, verify contrast in light and dark mode. Prefer inverse token pairs such as `bg-brand-solid text-brand-foreground` and `hover:bg-background hover:text-brand`.
- Keyboard focus is a global 2px `outline` using `--focus-ring` on `:focus-visible` in `global.css`. Do not add `focus:outline-none` to suppress it. Mouse clicks stay outline-free via `:focus:not(:focus-visible)`. Stretched card links that ring a parent with `focus-within` should use the `stretch-link` class.
