[![Netlify Status](https://api.netlify.com/api/v1/badges/c2c08a6d-097d-49df-b32d-27fa3d7fc8f8/deploy-status)](https://app.netlify.com/sites/iamdeveloperdotcom/deploys)

# Nick Taylor's Personal Website

This is the source code for [nickyt.co](https://www.nickyt.co), Nick Taylor's personal website and blog.

## Tech Stack

- **[Astro](https://astro.build/)** - Modern web framework for building fast, content-focused websites
- **[React](https://react.dev/)** - For interactive UI components
- **[MDX](https://docs.astro.build/en/guides/integrations-guide/mdx/)** - For blog posts and content with embedded components
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[Expressive Code](https://expressive-code.com/)** - Syntax highlighting for code blocks
- **[Netlify](https://netlify.com)** - Hosting and deployment platform
- **Node.js 22+** - Runtime environment

## Terminal commands

### Install the dependencies first

```bash
npm install
```

### Run in dev mode

```bash
npm run dev
```

### Build a production version of the site

```bash
npm run build
```

#### Test the production site locally

```bash
npm run preview
```

## Styling

- Tailwind v4 is configured in `tailwind.config.cjs` and `postcss.config.cjs`.
- Global styles are loaded from `src/styles/tailwind.css`, which imports `src/styles/legacy.css` for bespoke rules.

## Licensing

This project contains two separate licenses:

1. **Code License**: The website's source code (in the project root and all non-content folders) is licensed under the MIT License.
   - For full details, see the [LICENSE.txt](./LICENSE.txt) file in the root directory of this project.

2. **Content License**: All blog posts, articles, and other written content in the `src/content/` directory are licensed under the Creative Commons Attribution 4.0 International License (CC BY 4.0).
   - You are free to share and adapt this content for any purpose, even commercially, as long as you give appropriate credit.
   - To view a copy of this license, see the [src/content/CONTENT_LICENSE.txt](./src/content/CONTENT_LICENSE.txt) file or visit [https://creativecommons.org/licenses/by/4.0/](https://creativecommons.org/licenses/by/4.0/).

Please note that this licensing arrangement applies to all content and code in this repository, regardless of when it was committed.

### Using Content from This Blog

If you wish to use, share, or adapt any content from this blog:

1. Provide appropriate credit by mentioning the original author (Nick Taylor).
2. Include a link to the original article or this repository.
3. Indicate if any changes were made.
4. Link to the Creative Commons license.

Example attribution: "This work is based on [Article Title] by Nick Taylor, originally published at [Blog URL], licensed under CC BY 4.0."

For any use of the website's code, please refer to the terms specified in the [LICENSE.txt](./LICENSE.txt) file.

If you have any questions about licensing or usage, please open an issue in this repository.
