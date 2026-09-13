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
- Avoid one-off dark-mode color overrides when a token already adapts in `.dark` or `.windows95`.
- Themes are exclusive classes on `<html>`: light (no theme class), `.dark`, or `.windows95` (POC). Prefer semantic tokens so all three stay consistent; use `@custom-variant windows95` only when a token is not enough.
- Theme UI is a compact menu in `ThemeToggle.astro`: one trigger showing the active theme, with Light / Dark / Windows 95 options in a `radiogroup` that always opens below the trigger. Light/dark options are individual full circles attached under the trigger; Windows 95 stays same-size square tiles. Use a generic four-pane window glyph for Windows 95 — not the Microsoft Windows logo.
- In `.windows95`, put readable text on silver surfaces (`[data-site-header]` / `main` / `[data-site-footer]`); teal `--background` is desktop chrome only. Do not apply raised window chrome to in-page `<header>`/`<footer>` blocks (e.g. tag footers) or soft `.tag-pill` links. Interactive controls (`button`, `summary`, and CTA anchors with `bg-brand-solid` / `bg-secondary` / bordered `inline-flex`) use classic raised gray Win95 button chrome with a pressed active state — exclude `lite-youtube`'s `.lyt-playbtn` / `.lty-playbtn` so the silver fill does not hide the poster. Navy/black on silver meets AA; do not place `text-brand` or `text-muted-foreground` on teal.
- Use raw CSS color values only inside `global.css` token definitions or third-party integration overrides.
- For hover and focus states, verify contrast in light, dark, and windows95. Prefer inverse token pairs such as `bg-brand-solid text-brand-foreground` and `hover:bg-background hover:text-brand`.
- Keyboard focus: links, buttons, and summaries already restyle on `:focus` (underline, color, or background) — do not add a second outline. Exception: the current-page item in main nav (`aria-current="page"`) keeps its underline on `:focus-visible` but switches text and decoration to `foreground`, because it already looks active at rest. Form fields (`input`, `select`, `textarea`) get a 2px `--focus-ring` outline. Project cards ring the card via `focus-within`.
