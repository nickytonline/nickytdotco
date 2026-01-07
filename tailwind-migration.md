# Tailwind v4 Migration Plan

## Goal
Move `public/styles/global.css` to Tailwind v4. Replace as many utility classes as possible with Tailwind equivalents, while keeping bespoke CSS where Tailwind cannot express the styles yet.

## Progress
- Utility classes (layout, spacing, typography, colors, z-index, sr-only, w-fit, float-left) are now covered by Tailwind and removed from `src/styles/legacy.css`.

## Plan
1. **Inventory existing CSS**
   - Categorize `public/styles/global.css` into:
     - Base reset and element defaults
     - Design tokens / CSS variables
     - Utilities (spacing, typography, layout, colors)
     - Component classes (buttons, nav, post, pagination, forms)
     - Font-face declarations
   - Use `rg` in `src/` to find which classes are still in use.

2. **Decide Tailwind setup strategy**
   - Add Tailwind v4 to the Astro build (Astro integration or PostCSS).
   - Define theme tokens for colors, fonts, spacing, z-index, and breakpoints to match current CSS variables.
   - Create `src/styles/tailwind.css` with the Tailwind entrypoint and base layer:
     - `@tailwind base; @tailwind components; @tailwind utilities;` (or v4 `@import`)
     - `@layer base` for resets + element defaults that must remain.

3. **Map utilities to Tailwind equivalents**
   - Replace common utilities with Tailwind classes in templates:
     - `bg-*`, `color-*`, `gap-*`, `pad-*`, `text-*`, `flex-*`, `align-*`, etc.
   - Document any missing utilities that require custom extensions.

4. **Extract component styles**
   - For component classes like `.button`, `.intro`, `.nav__*`, `.post__*`, `.pagination`, `.field-list__*`:
     - Move into Tailwind `@layer components` with `@apply`.
     - Keep bespoke CSS for features Tailwind doesn’t cover (e.g., `clip-path`, `shape-outside`).

5. **Migrate typography & content styles**
   - Replace heading/body sizes with Tailwind utilities or a Tailwind typography-style layer.
   - Keep special blog/article styling in a component layer or scoped CSS module if needed.

6. **Reduce global CSS footprint**
   - After replacing classes, reduce `public/styles/global.css` to:
     - Font-face declarations
     - CSS variables (if not moved into Tailwind theme)
     - Remaining bespoke rules
   - Move the file into `src/styles/` and import it via Astro so it builds with Tailwind.

7. **Validate and clean up**
   - Run `npm run build`.
   - Scan for unused classes and remove dead rules.
   - Add a short migration note in `README.md` or `guide.md` for Tailwind usage patterns.
