const jsdom = require('@tbranyen/jsdom');
const {JSDOM} = jsdom;
const minify = require('../utils/minify.js');
const slugify = require('slugify');
const getSize = require('image-size');
const fetch = require('node-fetch');
const DEV_TO_URL = 'https://dev.to';
const site = require('../_data/site.json');
const markup = String.raw;

// TODO: Pull this out and import

/**
 * Updates an article URL to point to my article on my site if it is an article of mine from DEV. Otherwise, point to the DEV article link,
 *
 * @param {string} url
 *
 * @returns An updated article URL.
 */
function updateArticleUrl(url) {
  if (/\/nickytonline\/.+/.test(url)) {
    // This is my own article from DEV, so I want the URL to be the one on my site instead.
    return site.url + url.replace('/nickytonline', '/posts');
  }

  return DEV_TO_URL + url;
}

// TODO: Pull this out and import.
/**
 * Adds a missing title attribute to iframes that are missing them by pulling
 * the title text from the iframe's document.
 *
 * @param {HTMLElement[]} embeds
 * @param {Document} document
 */
async function addMissingIframeTitleAttributes(embeds, document) {
  const responses = await Promise.all(embeds.map(({src}) => fetch(src)));
  const devToUserHtmls = await Promise.all(responses.map(response => response.text()));

  embeds.forEach((embed, index) => {
    const holderElement = document.createElement('div');
    holderElement.innerHTML = devToUserHtmls[index];

    const title =
      holderElement.querySelector('title')?.textContent?.trim() ||
      'This framed page appears to have no title.';

    embed.setAttribute('title', title);
  });
}

// TODO: Pull this out and import

// TODO: Pull this function out of here.
async function processArticleEmbeds(embeds, document) {
  /** This is what the markup from the iframe that gets converted looks like:
   *
   * <div class="ltag__link">
   *   <a href="/nickytonline" class="ltag__link__link">
   *     <div class="ltag__link__pic">
   *       <img src="https://res.cloudinary.com/practicaldev/image/fetch/s--zhsA-ZEm--/c_fill,f_auto,fl_progressive,h_150,q_auto,w_150/https://dev-to-uploads.s3.amazonaws.com/uploads/user/profile_image/9597/68d6245f-3152-4ed2-a245-d015fca4160b.jpeg" alt="nickytonline image">
   *     </div>
   *   </a>
   *   <a href="/devteam/let-s-pair-during-a-live-coding-session-8he" class="ltag__link__link">
   *     <div class="ltag__link__content">
   *       <h2>Let's Pair during a Live Coding Session!</h2>
   *       <h3>Nick Taylor (he/him) ・ Jul 14 ・ 2 min read</h3>
   *       <div class="ltag__link__taglist">
   *         <span class="ltag__link__tag">#webdev</span>
   *         <span class="ltag__link__tag">#pairprogramming</span>
   *         <span class="ltag__link__tag">#livecoding</span>
   *         <span class="ltag__link__tag">#meta</span>
   *       </div>
   *     </div>
   *   </a>
   * </div>
   *
   */
  if (embeds.length === 0) {
    return;
  }

  const responses = await Promise.all(embeds.map(({src}) => fetch(src)));
  const devToArticleHtmls = await Promise.all(responses.map(response => response.text()));

  embeds.forEach((embed, index) => {
    const html = devToArticleHtmls[index];
    const holderElement = document.createElement('div');
    holderElement.innerHTML = html;
    const articleContent = holderElement.querySelector('.ltag__link');
    articleContent.className =
      'ltag__link box-flex align-center flex-wrap space-center md:flex-nowrap md:space-after';

    for (const link of articleContent.querySelectorAll('.ltag__link__link')) {
      link.setAttribute('href', updateArticleUrl(link.getAttribute('href')));

      if (!link.querySelector('.ltag__link__pic')) {
        link.removeAttribute('class');
      }
    }

    embed.replaceWith(articleContent);
  });
}

// TODO: Pull this function out of here.
async function processDevToEmbeds(embeds = [], document) {
  const githubEmbeds = embeds.filter(({src}) =>
    src.startsWith('https://dev.to/embed/github')
  );

  // Give GitHub embeds a better background for colour contrast.
  githubEmbeds.forEach(embed => {
    embed.removeAttribute('style');

    const player = document.createElement('div');

    // TODO: consolidate into just GitHub wrapper class.
    player.classList.add('devto-embed-wrapper');
    player.appendChild(embed.cloneNode(true));

    embed.replaceWith(player);
  });

  const articleEmbeds = embeds.filter(({src}) =>
    src.startsWith(DEV_TO_URL + '/embed/link')
  );

  await processArticleEmbeds(articleEmbeds, document);

  const remainingEmbeds = embeds.filter(({src}) =>
    src.startsWith('https://dev.to/embed/listing')
  );

  remainingEmbeds.forEach(embed => {
    embed.removeAttribute('style');

    const player = document.createElement('div');

    player.classList.add('devto-embed-wrapper');
    player.appendChild(embed.cloneNode(true));

    embed.replaceWith(player);
  });
}

module.exports = async function(value, outputPath) {
  if (outputPath.endsWith('.html')) {
    const DOM = new JSDOM(value, {
      resources: 'usable'
    });

    const document = DOM.window.document;
    const articleImages = [...document.querySelectorAll('main article img, .intro img')];
    const articleHeadings = [
      ...document.querySelectorAll('main article h2, main article h3')
    ];
    const articleEmbeds = [
      ...document.querySelectorAll('main article iframe:not(.liquidTag)')
    ];
    const devToEmbeds = [...document.querySelectorAll('.liquidTag')];

    if (articleImages.length) {
      articleImages.forEach(image => {
        image.setAttribute('loading', 'lazy');

        const file = image.getAttribute('src');

        if (file.indexOf('http') < 0) {
          const dimensions = getSize('src' + file);

          image.setAttribute('width', dimensions.width);
          image.setAttribute('height', dimensions.height);
        }

        // If an image has a title it means that the user added a caption
        // so replace the image with a figure containing that image and a caption
        if (image.hasAttribute('title')) {
          const figure = document.createElement('figure');
          const figCaption = document.createElement('figcaption');

          figCaption.innerHTML = image.getAttribute('title');

          image.removeAttribute('title');

          figure.appendChild(image.cloneNode(true));
          figure.appendChild(figCaption);

          image.replaceWith(figure);
        }
      });
    }

    // Loop each heading and add a little anchor and an ID to each one
    articleHeadings.forEach(heading => {
      const headingSlug = slugify(heading.textContent.toLowerCase());
      const anchor = document.createElement('a');

      anchor.setAttribute('href', `#heading-${headingSlug}`);
      anchor.classList.add('heading-permalink');
      anchor.innerHTML = minify(`
        <span class="visually-hidden"> permalink</span>
        <svg fill="currentColor" aria-hidden="true" focusable="false" width="1em" height="1em" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path d="M9.199 13.599a5.99 5.99 0 0 0 3.949 2.345 5.987 5.987 0 0 0 5.105-1.702l2.995-2.994a5.992 5.992 0 0 0 1.695-4.285 5.976 5.976 0 0 0-1.831-4.211 5.99 5.99 0 0 0-6.431-1.242 6.003 6.003 0 0 0-1.905 1.24l-1.731 1.721a.999.999 0 1 0 1.41 1.418l1.709-1.699a3.985 3.985 0 0 1 2.761-1.123 3.975 3.975 0 0 1 2.799 1.122 3.997 3.997 0 0 1 .111 5.644l-3.005 3.006a3.982 3.982 0 0 1-3.395 1.126 3.987 3.987 0 0 1-2.632-1.563A1 1 0 0 0 9.201 13.6zm5.602-3.198a5.99 5.99 0 0 0-3.949-2.345 5.987 5.987 0 0 0-5.105 1.702l-2.995 2.994a5.992 5.992 0 0 0-1.695 4.285 5.976 5.976 0 0 0 1.831 4.211 5.99 5.99 0 0 0 6.431 1.242 6.003 6.003 0 0 0 1.905-1.24l1.723-1.723a.999.999 0 1 0-1.414-1.414L9.836 19.81a3.985 3.985 0 0 1-2.761 1.123 3.975 3.975 0 0 1-2.799-1.122 3.997 3.997 0 0 1-.111-5.644l3.005-3.006a3.982 3.982 0 0 1 3.395-1.126 3.987 3.987 0 0 1 2.632 1.563 1 1 0 0 0 1.602-1.198z"/>
        </svg>`);

      heading.setAttribute('id', `heading-${headingSlug}`);
      heading.appendChild(anchor);
    });

    // Look for videos are wrap them in a container element
    articleEmbeds.forEach(embed => {
      if (embed.hasAttribute('allowfullscreen')) {
        const player = document.createElement('div');

        player.classList.add('video-player');

        player.appendChild(embed.cloneNode(true));

        embed.replaceWith(player);
      }
    });

    await processDevToEmbeds(devToEmbeds, document);

    // Fixes a11y issue of iframes from embeds missing a title attribute
    const iframesWithMissingTitleAttributes = [
      ...document.querySelectorAll('iframe:not([title])')
    ];
    await addMissingIframeTitleAttributes(iframesWithMissingTitleAttributes, document);

    return '<!DOCTYPE html>\r\n' + (await document.documentElement.outerHTML);
  }

  return value;
};
