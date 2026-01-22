# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
```bash
npm run dev        # Start dev server (default port from ENV.PORT in .env)
npm start          # Alias for npm run dev
```

### Building
```bash
npm run build      # Full production build pipeline:
                   # 1. Format check (Prettier + ESLint)
                   # 2. Type check (astro check)
                   # 3. Build site (astro build)
                   # 4. Build search index (pagefind --site dist)

npm run preview    # Preview production build locally
```

### Code Quality
```bash
npm run format          # Auto-format with Prettier and fix ESLint issues
npm run format:check    # Check formatting and linting (used in build)
npm run lint            # Run ESLint
npm run lint:fix        # Fix ESLint issues
```

### Type Checking
```bash
npx astro check    # Type check all Astro/TypeScript files
```

## Architecture Overview

### Framework & Stack
- **Astro 5.x** with static site generation (SSG)
- **Netlify** deployment with static hosting
- **Tailwind CSS v4** for styling
- **TypeScript** throughout with strict mode
- **React** for interactive components (Search)
- **MDX** for blog posts and talks
- **Pagefind** for client-side search (built at compile time)

### Content Collections

Two primary collections defined in `src/content/config.ts`:

**Blog** (`src/content/blog/`)
- MDX files with frontmatter
- Schema: title, date, excerpt, tags, cover_image, canonical_url, draft, reading_time_minutes, series
- Series support via `series.collection_id` and `series.name`
- Drafts excluded in production builds

**Talks** (`src/content/talks/`)
- MDX files for conference talks
- Schema: title, date, video (url, type, image), venue, tags, slideDeck, sourceCode, additionalLinks
- Video types: youtube, vimeo, custom

### Live Collections (Experimental)

Uses Astro's `liveContentCollections` feature to fetch external data at build time. Configured in `src/live.config.ts`:

1. **Stream Schedule** - Airtable API (requires `AIRTABLE_API_KEY`, `AIRTABLE_STREAM_GUEST_BASE_ID`)
2. **Newsletter** - Beehiiv RSS feed
3. **Pinned Projects** - GitHub GraphQL API (requires `GITHUB_TOKEN`)
4. **Brewfile** - GitHub raw file + Homebrew/Cask APIs

All loaders are in `src/content/loaders/` and implement error handling with graceful degradation.

### Routing Patterns

**Static routes:** `/`, `/about`, `/blog`, `/talks`, `/uses`, `/newsletter`, `/projects`, `/watch`, `/socials`

**Dynamic routes:**
- `/blog/[...slug].astro` - Blog posts (rest parameter captures any depth)
- `/talks/[slug].astro` - Individual talks
- `/tags/[tag].astro` - Tag pages (normalized: lowercase, slugified)
- `/tags/[tag]/[type].astro` - Tag pages filtered by type (posts/talks)

**RSS feeds:**
- `/feed.xml.ts` - Main blog feed
- `/stream-schedule-feed.xml.ts` - Stream schedule feed

### Component Architecture

**Layouts:**
- `MainLayout.astro` - Base layout with theme toggle, skip links, global CSS
- `Post.astro` - Blog post layout with PostIntro, SeriesNavigation, TableOfContents

**Key Components:**
- `Search.tsx` - React-based search with keyboard shortcuts (`/` or `Cmd/Ctrl+K`)
- `Embed.astro` - Intelligent URL parser for embeds (YouTube, Twitter, GitHub, CodePen, Dev.to, Twitch, Vimeo, Spotify, CodeSandbox, Instagram)
- Individual embed components in `src/components/embeds/`
- `SeriesNavigation.astro` - Shows navigation for blog post series
- `TableOfContents.astro` - Auto-generated from headings (shows if 3+ headings)

**Social Components:**
- Individual link components: BlueskyLink, GitHubLink, LinkedInLink, TwitterLink, WebsiteLink
- `SocialLinks.astro` - Unified social links component

### Markdown Processing

**Custom Remark Plugin** (`src/utils/remarkEmbedDirectives.js`)
- Enables directive syntax: `::youtube{videoId="xxx"}`
- Transforms to data attributes for hydration
- Supports all embed types

**Rehype Plugins** (configured in `astro.config.mjs`)
- `rehype-slug` - Adds IDs to all headings
- `rehype-autolink-headings` - Adds `#` anchor links to headings

**Expressive Code:**
- Theme: GitHub Dark
- Custom styling: rose-100 border, rounded corners, padding
- Automatic code wrapping and indent preservation

### Styling System

**Tailwind v4** (`tailwind.config.cjs`)
- Custom color palette: primary, highlight, light, mid, dark, slate
- Pink accent: `#fedb8b` (light), `#ffc857` (dark)
- Fonts: Inter (body), Space Grotesk (headings)
- Dark mode: class-based strategy

**Global Styles** (`src/styles/global.css`)
- CSS custom properties for theming
- Dark mode color overrides using `.dark` class
- Typography with `text-balance` and `text-wrap: pretty`
- Consistent spacing via `--flow-space`
- Heading styles with custom tracking
- Anchor link hover effects
- Focus states for accessibility

### Environment Variables

Managed by Varlock integration (`@varlock/astro-integration`):
- Schema defined in `.env.schema`
- Auto-generates TypeScript types to `env.d.ts`
- Access via `ENV` from `varlock/env`

**Required variables:**
- `AIRTABLE_API_KEY` - For stream schedule data
- `AIRTABLE_STREAM_GUEST_BASE_ID` - Airtable base ID
- `GITHUB_TOKEN` - For pinned projects
- `DEV_API_KEY` - Dev.to API
- `URL` - Site URL

### Utilities & Helpers

**Filter Utilities** (`src/utils/filters.ts`)
- `dateFilter()` - Human-readable dates with ordinals ("1st January 2024")
- `w3DateFilter()` - ISO 8601 format
- `htmlDateString()` - yyyy-MM-dd format
- `seriesFilter()` - Filter posts by series
- `seriesName()` - Extract series name from various formats

**Other Utilities:**
- `src/utils/tag-utils.ts` - Tag normalization and display
- `src/utils/date-utils.ts` - Luxon-based date operations
- `src/utils/video-utils.ts` - YouTube ID extraction and embed helpers
- `src/utils/markdown.ts` - Markdown parsing/rendering
- `src/utils/schedule-utils.ts` - Stream schedule transformations

### Build Pipeline

The build process (`npm run build`) runs these steps sequentially:

1. **Format Check** - Prettier and ESLint validation (zero warnings enforced)
2. **Type Check** - `astro check` validates all TypeScript/Astro files
3. **Site Build** - Astro builds static site to `dist/`
4. **Search Index** - Pagefind indexes content marked with `data-pagefind-body`

Draft posts are automatically excluded in production builds.

### Search Implementation

**Pagefind Integration:**
- Built at compile time from `dist/` directory
- Client-side search (no server needed)
- Indexes content via `data-pagefind-body` attribute
- Supports filtering by `data-pagefind-filter-type` (Post, Talk)

**Search Component** (`src/components/Search.tsx`)
- React component with state management
- Keyboard shortcuts: `/` or `Cmd/Ctrl+K` to open, `Esc` to close
- Arrow keys for navigation, `Enter` to select
- Debounced search (300ms)
- Lazy loads Pagefind library

### Netlify Configuration

**Domain Redirects** (`netlify.toml`)
- `iamdeveloper.com` → `nickyt.co`
- `/posts/*` → `/blog/*`
- Mastodon webfinger alias
- Custom short links for slides/demos

**Headers:**
- Privacy headers (Permissions-Policy)
- Home page caching: `max-age=259200` (3 days)

### Path Aliases

Configured in `astro.config.mjs` and `tsconfig.json`:
- `@/` → `/src/`

### ESLint Configuration

**Plugins:** TypeScript, Astro, JSX A11y

**Key Rules:**
- Unused vars with `_` prefix allowed
- `@typescript-eslint/no-explicit-any` as warning
- JSX A11y rules adjusted for Astro components
- Zero warnings enforced in build

**Ignored paths:** `dist/`, `node_modules/`, `.astro/`, `.netlify/`, `public/`, `*.cjs`, `env.d.ts`

## Important Patterns

### Adding Blog Posts
1. Create MDX file in `src/content/blog/`
2. Add required frontmatter: `title`, `date`
3. Optional: `excerpt`, `tags`, `cover_image`, `series`, `draft`
4. Use `draft: true` to exclude from production builds
5. Series posts need matching `series.collection_id` or `series.name`

### Adding Embeds
Use directive syntax in MDX:
```markdown
::youtube{videoId="dQw4w9WgXcQ"}
::github{url="https://github.com/user/repo"}
::twitter{tweetId="123456789"}
```

### Adding Live Collection Loaders
1. Create loader in `src/content/loaders/`
2. Implement `loadCollection()` and `loadEntry()` methods
3. Return `{ entries, error? }` structure
4. Add to `src/live.config.ts`
5. Handle errors gracefully (return empty arrays on failure)

### Theme Toggle
Persisted to localStorage as `theme` key. Values: `"light"` | `"dark"`. Applies `.dark` class to `<html>` element.

### Content Filtering
- Use `data.draft !== true` to exclude drafts in production
- Use `seriesFilter()` for series navigation
- Tags are normalized to lowercase and slugified

### Type Safety
- All content collections use Zod schemas
- Environment variables auto-generate types
- Custom `urlOrRelative` validator for flexible URL handling

## Node Version

Requires Node.js 22 or higher (specified in `package.json` engines).
