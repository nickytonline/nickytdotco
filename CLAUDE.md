# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Setup

```bash
npm install  # Requires Node.js 22+
```

### Development

```bash
npm run dev      # Start dev server (uses ENV.PORT from varlock)
npm run preview  # Preview production build locally
```

### Build & Validation

```bash
npm run build         # Full build: format:check → astro check → astro build
npm run format        # Format with Prettier and auto-fix ESLint issues
npm run format:check  # Check formatting (Prettier) and ESLint with 0 warnings tolerance
npm run lint          # Run ESLint
npm run lint:fix      # Auto-fix ESLint issues
```

**Important**: The build command enforces code quality - it will fail if formatting is incorrect or ESLint warnings exist.

## Architecture Overview

### Tech Stack

- **Astro 5** (Static Site Generation) with Netlify adapter
- **React 19** for interactive UI components (EventCalendar, SeriesNavigation, etc.)
- **TypeScript** with strict mode and path aliases (`@/` → `./src/`)
- **Tailwind CSS v4** with custom design system
- **MDX** for blog posts with embedded components
- **Expressive Code** for syntax highlighting (GitHub Dark theme)
- **Varlock** for type-safe environment variable management

### Project Structure

```
src/
├── components/       # UI components (Astro & React)
│   ├── embeds/      # Custom embeds (YouTube, Twitter, Spotify, etc.)
│   └── *.astro      # Layout components (Header, Footer, BlogPostCard)
├── content/         # Content collections (Zod-validated)
│   ├── blog/        # 180+ MDX blog posts
│   ├── talks/       # Conference talks and presentations
│   ├── vscodetips/  # VS Code tips
│   └── config.ts    # Content schemas
├── layouts/         # Page templates
│   ├── MainLayout.astro  # Base layout with dark mode, header, footer
│   └── Post.astro        # Blog post layout with series navigation
├── pages/           # File-based routing
│   ├── blog/[...slug].astro  # Dynamic blog routes
│   ├── tags/[tag].astro      # Tag archive pages
│   ├── feed.ts               # RSS feed endpoint
│   └── *.astro               # Static pages
├── utils/           # Utility functions
│   ├── filters.ts           # Date formatting, series filtering, truncation
│   ├── schedule-utils.ts    # Airtable streaming schedule integration
│   ├── youtube-utils.ts     # RSS feed parsing for YouTube playlists
│   ├── tag-utils.ts         # Tag management
│   ├── video-utils.ts       # Video timestamp parsing
│   └── remarkEmbedDirectives.js  # Custom Remark plugin for embeds
├── data/            # Static configuration
│   ├── site.ts      # Site metadata and config
│   └── navigation.json  # Navigation structure
└── styles/          # Global styles
    └── tailwind.css # Tailwind imports + custom CSS
```

### Content Collections

**Blog Posts** (`src/content/blog/`):

- MDX format with Zod schema validation
- Frontmatter fields:
  - `title` (required), `date` (required), `excerpt`, `description`
  - `tags`, `cover_image`, `canonical_url` (for cross-posts)
  - `draft` (filtered in production), `reading_time_minutes`
  - `series` (object with `name` and `collection_id` for multi-part articles)
- Custom directive syntax via `remarkEmbedDirectives.js`:
  - `::youtube{videoId="xxx"}` → YouTube embed
  - `::twitter{tweetId="xxx"}` → Twitter/X embed
  - Supports: Spotify, Twitch, Vimeo, CodePen, CodeSandbox, Instagram, GitHub, DevLinks, Buzzsprout

**Talks** (`src/content/talks/`):

- Conference talks, streams, and presentations
- Schema includes: `title`, `date`, `venue` (name + URL), `tags`
- Optional: `video` (URL + type + image), `slideDeck`, `sourceCode`, `additionalLinks`

### Key Architectural Patterns

**1. Static Generation with Dynamic Data**

- All pages are statically generated (`output: "static"`)
- External data (Airtable, YouTube RSS) fetched at build time
- Netlify CDN caching headers set per-response

**2. Dark Mode**

- Class-based (`darkMode: "class"` in Tailwind config)
- Theme toggle in `MainLayout.astro` with localStorage + system preference detection
- Dark variants throughout component styling

**3. Path Aliases**

- Use `@/` for imports: `import { site } from "@/data/site"`
- Configured in `tsconfig.json` and `astro.config.mjs`

**4. Series Navigation**

- Multi-part blog posts use `series` frontmatter
- `SeriesNavigation.tsx` React component provides prev/next navigation
- `seriesFilter()` utility in `filters.ts` handles complex series queries

**5. Environment Variables**

- Managed by Varlock (`varlock/env`)
- Type-safe access via `ENV` object
- Sensitive vars: `AIRTABLE_API_KEY`, `AIRTABLE_STREAM_GUEST_BASE_ID`
- Auto-generated `env.d.ts` for IDE support

**6. Markdown Processing Pipeline**

```
MDX → Remark Plugins → Rehype Plugins → HTML
       ↓                 ↓
  remarkEmbedDirectives  rehypeSlug
                         rehypeAutolinkHeadings
```

**7. External Integrations**

- **Airtable**: Streaming guest schedule (`src/utils/schedule-utils.ts`)
  - Three stream types: "nickyt.live", "2-full-2-stack", "pomerium-live"
  - Filters guests from yesterday onwards
- **YouTube RSS**: Multiple playlist feeds parsed (`src/utils/youtube-utils.ts`)
  - Main channel, nickyt.live, 2 Full 2 Stack, guest appearances, Pomerium Live
  - Includes special video injection logic (e.g., KubeConEU25)

### ESLint Configuration

Uses flat config format (`eslint.config.js`):

- `@eslint/js` recommended rules
- `typescript-eslint` recommended rules
- `eslint-plugin-astro` for Astro-specific linting
- `eslint-plugin-jsx-a11y` for accessibility
- Custom rules:
  - Unused vars prefixed with `_` are ignored
  - TypeScript `any` is a warning, not an error
  - A11y rules are set to warn (not error)

**Ignored files**: `dist/`, `node_modules/`, `.astro/`, `.netlify/`, `public/`, `*.cjs`, `env.d.ts`

### Styling System

**Tailwind CSS v4** (`tailwind.config.cjs`):

- Custom spacing scale: `100`, `300`, `500`, `600`, `700`, `800`, `900`, `max`
- Custom colors: `primary`, `highlight`, `light`, `mid`, `dark`, `slate` + shades
- Custom z-index: `300`, `400`, `500`, `600`, `700`
- Fonts: Inter (body), Space Grotesk (headings) via `@fontsource`

**Global styles** (`src/styles/tailwind.css`):

- Imports legacy custom CSS from `src/styles/legacy.css`
- Prose styling for blog post content

### Deployment (Netlify)

**Build Configuration** (`netlify.toml`):

- Command: `npm run build`
- Publish directory: `dist/`
- Custom headers: `Permissions-Policy: interest-cohort=()`
- 30+ redirect rules for:
  - Domain migrations (iamdeveloper.com → nickyt.co)
  - Path redirects (/posts/_ → /blog/_)
  - External services (newsletter, Discord, Mastodon webfinger)
  - Short URLs for slides and demos

**Environment Detection**:

- Uses `process.env.CONTEXT` for Netlify environment
- Timezone detection from Netlify geo context

## Common Workflows

### Adding a New Blog Post

1. Create MDX file in `src/content/blog/`
2. Add required frontmatter: `title`, `date`
3. Optional: Add `tags`, `excerpt`, `cover_image`, `series`
4. Use `draft: true` to exclude from production
5. Use custom directives for embeds: `::youtube{videoId="xxx"}`

### Creating a Multi-Part Series

1. Add `series` to frontmatter:
   ```yaml
   series:
     name: "My Series Name"
     collection_id: 12345
   ```
2. Use same `name` and `collection_id` for all posts in series
3. `SeriesNavigation` component will auto-generate prev/next links

### Adding a New Talk

1. Create MDX file in `src/content/talks/`
2. Required: `title`, `date`, `venue` (name + optional URL), `tags`
3. Optional: Add `video`, `slideDeck`, `sourceCode`, `additionalLinks`

### Working with External Data

- **Airtable schedule**: Modify `src/utils/schedule-utils.ts`
- **YouTube feeds**: Modify `src/utils/youtube-utils.ts`
- Both utils include caching headers for Netlify CDN

### Styling Components

- Use Tailwind utility classes (refer to custom config for available values)
- Dark mode: Add `dark:` variants to classes
- Use `@/` path alias for imports: `import { cn } from "@/lib/utils"`

### Environment Variables

- Add new vars to Varlock schema (see existing env files)
- Access via `ENV.VARIABLE_NAME`
- Restart dev server after changes

## Important Notes

### Content Licensing

- **Code**: MIT License (root LICENSE.txt)
- **Blog Content**: Creative Commons Attribution 4.0 (src/content/CONTENT_LICENSE.txt)
- Do not modify license files without explicit permission

### Build Requirements

- Node.js 22+ required (`engines` in package.json)
- Build fails if:
  - Prettier formatting is incorrect
  - ESLint has warnings (enforced by `--max-warnings 0`)
  - TypeScript type checking fails (`astro check`)

### Accessibility

- Use semantic HTML elements
- Include ARIA labels where appropriate
- Test with keyboard navigation
- ESLint will warn about a11y issues

### Performance Considerations

- All pages are statically generated
- External data fetched at build time (not runtime)
- Use Netlify CDN caching headers for dynamic data
- Images should include `width`, `height`, and `alt` attributes
