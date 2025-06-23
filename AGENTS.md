# Agent Guidelines for www.nickyt.co

## Build Commands
- `npm start` - Development server with Sass watch and Eleventy serve
- `npm run serve` - Eleventy development server only
- `npm run production` - Production build
- `npm run sass:process` - Compile Sass to CSS

## Code Style
- **Formatting**: Uses Prettier with default config (empty .prettierrc)
- **Imports**: CommonJS modules (`require`/`module.exports`)
- **Functions**: Use function declarations for exports, arrow functions for inline
- **Naming**: camelCase for variables/functions, kebab-case for files
- **Strings**: Double quotes preferred, template literals for interpolation
- **Comments**: JSDoc for function documentation, inline comments sparingly
- **Error Handling**: Try-catch blocks for async operations, graceful fallbacks

## Architecture
- **Static Site**: Eleventy (11ty) with Nunjucks templates
- **Styling**: Sass compilation to CSS
- **Content**: Markdown blog posts in `src/blog/`
- **Data**: JSON files in `src/_data/`
- **Shortcodes**: Custom embeds in `src/shortCodes/`
- **Filters**: Date/content filters in `src/filters/`