[![Netlify Status](https://api.netlify.com/api/v1/badges/c2c08a6d-097d-49df-b32d-27fa3d7fc8f8/deploy-status)](https://app.netlify.com/sites/iamdeveloperdotcom/deploys)

# Welcome

This is the source code for the website of Nick Taylor, built using <a href="https://astro.build/">Astro</a>, a modern web framework for building fast, content-focused websites. The codebase was migrated from Eleventy (11ty) and now leverages Astro's hybrid rendering capabilities (static, server, and Islands/SPA) and <a href="https://docs.astro.build/en/guides/integrations-guide/mdx/">MDX</a> for content.

## Terminal commands

### Install the dependencies first

```bash
npm install
```

### Serve the site locally in watch mode

```bash
npm start
```

### Build a production version of the site

```bash
npm run production
```

#### Test the production site locally

```bash
cd dist
npx serve
```

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
