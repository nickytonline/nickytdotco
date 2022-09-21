/* eslint-env node */
const path = require('path');
const fs = require('fs').promises;
const {DateTime} = require('luxon');
const hashnodeData = require(`../_data/hashnodeUrls.json`);
const blogPostEmbeds = require(`../_data/embeddedPostsMarkup.json`);
const twitterEmbeds = require(`../_data/twitterEmbeds.json`);
const site = require(`../_data/site.json`);
const TWITTER_EMBEDS_FILE_PATH = path.join(__dirname, '../_data/twitterEmbeds.json');

async function updateTwitterEmbeds(twitterEmbeds, filepath) {
  const data = JSON.stringify(twitterEmbeds, null, 2);

  await fs.writeFile(filepath, data, () =>
    console.log(`Saved Twitter embeds markup to ${filepath}!`)
  );
}

/**
 * Generates markup for a boost on DEV button.
 *
 * @param {string} fileSlug A pages file slug.
 * @param {string} url A pages URL.
 *
 * @returns {string} Markup for a boost links on DEV and Hashnode.
 */
function boostLink(title, fileSlug, url, canonicalUrl) {
  const isVsCodeTips = url.startsWith('/vscodetips/');
  if (!url.startsWith('/posts/') && !isVsCodeTips) {
    return '';
  }

  let hashnodeBoosterLink = '';
  const hashnodeUrl = hashnodeData[fileSlug];

  if (hashnodeUrl) {
    hashnodeBoosterLink =
      `<a href="${hashnodeUrl}" class="boost-link">Boost on Hashnode</a>` +
      hashnodeBoosterLink;
  }

  const intentToTweet = `<a class="boost-link" href="https://twitter.com/intent/tweet?text=${encodeURIComponent(
    `${title} by ${site.authorHandle} ${site.url}${url}`
  )}">Share on Twitter</a>`;

  const intentToLinkedIn = `<a class="boost-link" href="https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
    site.url + url
  )}">Share on LinkedIn</a>`;

  const foremBoostLink = `<a href="https://dev.to/nickytonline/${fileSlug}" class="boost-link">Boost on DEV</a>`;

  return `${foremBoostLink}${hashnodeBoosterLink}${intentToTweet}${intentToLinkedIn}`;
}

/**
 * Generates an iframe for a YouTube video embed.
 *
 * @param {string} videoUrl A YouTube video URL
 *
 * @returns {string} Markup for a YouTube video embed.
 */
async function youtubeEmbed(videoUrl) {
  let videoId;
  let time;

  if (videoUrl.includes('https://')) {
    [, videoId, time] = videoUrl.match(/.+\?v=([^&]+)(?:&t=([^&]+)s)?/) ?? [];
  } else {
    videoId = videoUrl;
  }

  const timeQueryParameter = time ? `?start=${time}` : '';
  const url = `https://www.youtube.com/embed/${videoId}${timeQueryParameter}`;
  const response = await fetch(
    `https://www.youtube.com/oembed?url=http://www.youtube.com/watch?v%3D${videoId}&format=json`
  );

  if (response.status === 404) {
    return `<div class="video-player"><p>Video is no longer available.</p></div>`;
  }

  const {title} = await response.json();

  return `<div class="video-player">
      <iframe
        title="${title}"
        loading="lazy"
        src="${url}"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen="allowFullScreen"
        style="position: absolute; width: 100%; height: 100%; left: 0px; top: 0px"
        width="560"
        height="315"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
      ></iframe>
    </div>`;
}

/**
 * Generates a code snippet for Google Analytics
 *
 * @param {string} googleAnalyticsId A Google Analytics ID
 * @param {boolean} isProduction Whether or not the application is being built for production or not.
 *
 * @returns {string} The markup snippet to inject Google Analytics.
 */
function googleAnalytics(
  googleAnalyticsId,
  isProduction = process.env.NODE_ENV === `production`
) {
  if (!isProduction) {
    return '';
  }

  return `<script async="async" src="https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag() {
        dataLayer.push(arguments);
      }
      gtag('js', new Date());

      gtag('config', '${googleAnalyticsId}');
    </script>`;
}

/**
 * Generates a social image for the given title and excerpt of a page.
 *
 * @param {string} title
 * @param {string} excerpt
 *
 * @returns {string} An URL in string format representing a social image for a page.
 */
function socialImage(title, excerpt = '') {
  const innerWhitespaceTrimmedExcerpt = excerpt.replace(/\s+/g, ' ');
  const truncatedExcerpt =
    innerWhitespaceTrimmedExcerpt.length > 101
      ? innerWhitespaceTrimmedExcerpt.substr(0, 101) + '...'
      : innerWhitespaceTrimmedExcerpt;
  const encodedTitle = encodeURIComponent(encodeURIComponent(title));
  const encodedExcerpt = encodeURIComponent(encodeURIComponent(truncatedExcerpt));
  const encodedAuthor = encodeURIComponent(
    encodeURIComponent(`${site.authorName} ${site.authorHandle}`)
  );
  const textColor = '333333';

  return `https://res.cloudinary.com/nickytonline/image/upload/w_1280,h_669,c_fill,q_auto,f_auto/w_860,c_fit,co_rgb:${textColor},g_south_west,x_370,y_380,l_text:roboto_64_bold:${encodedTitle}/w_860,c_fit,co_rgb:${textColor},g_north_west,x_370,y_320,l_text:arial_42:${encodedExcerpt}/w_860,c_fit,co_rgb:${textColor},g_north_west,x_820,y_600,l_text:arial_36:${encodedAuthor}/twitter-blog-post-social-card_bqhgzt`;
}

/**
 * Generates an embed based on the given URL.
 *
 * @param {string} rawUrl URL to embed.
 *
 * @returns {string} Markup for the embed.
 */
function embedEmbed(rawUrl) {
  const url = new URL(rawUrl);

  // This is based off the generic dev.to embed liquid tag.
  if (url.hostname.includes(`youtube.com`) || url.hostname.includes(`youtu.be`)) {
    const videoId = url.searchParams.get('v') ?? url.pathname.substr(1);

    return youtubeEmbed(videoId);
  }

  if (url.hostname.includes(`github.com`)) {
    return githubEmbed(url);
  }

  if (url.hostname.includes(`twitter.com`)) {
    const {tweetId} = rawUrl.match(
      /twitter\.com\/[^\/]+\/status\/(?<tweetId>[^\/]+)/
    ).groups;
    return twitterEmbed(tweetId);
  }

  if (url.hostname.includes(`dev.to`)) {
    const {username, slug} = rawUrl.match(
      /dev\.to\/(?<username>[^\/]+)\/(?<slug>[^\/]+)/
    ).groups;

    if (slug) {
      return devLinkEmbed(url);
    }

    if (username) {
      return devUserEmbed(username);
    }
  }

  throw new Error(`unsupported embed for ${url}`);
}

/**
 * Generates a Twitter embed based for the given Twee ID.
 *
 * @param {string} tweetId A tweet ID
 *
 * @returns {string} Markup for the Twitter embed.
 */
async function twitterEmbed(tweetId) {
  if (!twitterEmbeds[tweetId]) {
    // It doesn't matter who the user is. It's the Tweet ID that matters.
    const response = await fetch(
      `https://publish.twitter.com/oembed?url=${encodeURIComponent(
        `https://twitter.com/anyone/status/${tweetId}`
      )}`
    );

    console.log(`Grabbing markup for Tweet https://twitter.com/anyone/status/${tweetId}`);

    const {html} = await response.json();

    twitterEmbeds[tweetId] = html;
    await updateTwitterEmbeds(twitterEmbeds, TWITTER_EMBEDS_FILE_PATH);
  }

  return twitterEmbeds[tweetId] ?? `<div>Missing Tweet embed with ID ${tweetId}</div>`;
}

/**
 * Generates a Codepen embed for the given Codepen URL.
 *
 * @param {string} url A codepen URL
 *
 * @returns {string} Markup for the Codepen embed.
 */
function codepenEmbed(url) {
  return `<iframe height="300" style="width: 100%;" scrolling="no" title="Codepen from ${url}" src="${url}?default-tab=js%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true"></iframe>`;
}

/**
 * Generates markup for the given dev.to blog post URL.
 *
 * @param {string} blogPostUrl A dev.to URL
 *
 * @returns {string} Markup for the dev.to link embed.
 */
function devLinkEmbed(blogPostUrl) {
  const {
    url: devToUrl,
    title,
    published_timestamp,
    reading_time_minutes,
    tags,
    canonical_url,
    user: {name, username, profile_image},
  } = blogPostEmbeds[blogPostUrl];

  const url = canonical_url ?? devToUrl;
  const publishDate = DateTime.fromJSDate(new Date(published_timestamp))
    .setLocale('en-CA')
    .toLocaleString(DateTime.DATE_FULL);

  return `<article class="ltag__link box-flex align-center flex-wrap space-center md:flex-nowrap md:space-after" title="${title}">
      <a rel="author" href="https://dev.to/${username}" class="ltag__link__link">
        <div class="ltag__link__pic">
          <img src="${profile_image}" alt="${`Author ${name}'s profile on dev.to`}">
        </div>
      </a>
      <a href="${url}">
        <div class="ltag__link__content">
          <h1 class="ltag__link__title">${title}</h1>
          <div><span aria-hidden="true">${name}</span> ・ <time datetime="${published_timestamp}">${publishDate}</time> ・ ${reading_time_minutes} min read</div>
          <ul class="ltag__link__taglist">
            ${tags.map((tag) => `<li>#${tag}</li>`).join(``)}
          </ul>
        </div>
      </a>
    </article>`;
}

/**
 * Generates a GitHub embed for the given GitHub URL.
 *
 * @param {string} url A GitHub URL
 *
 * @returns {string} Markup for the GitHub embed.
 */
function githubEmbed(url) {
  const encodedUrl = encodeURIComponent(url).replace(/\/$/, '');

  return `<a href="${url}">
  <span class="visually-hidden">The ${url} repository on GitHub</span><picture>
  <source type="image/webp" srcset="https://v1.opengraph.11ty.dev/${encodedUrl}/small/webp/ 375w, https://v1.opengraph.11ty.dev/${encodedUrl}/medium/webp/ 650w" sizes="100vw" />
  <source type="image/jpeg" srcset="https://v1.opengraph.11ty.dev/${encodedUrl}/small/jpeg/ 375w, https://v1.opengraph.11ty.dev/${encodedUrl}/medium/jpeg/ 650w" sizes="100vw" />
  <img alt="OpenGraph image for ${url}" loading="lazy" decoding="async" src="https://v1.opengraph.11ty.dev/${encodedUrl}/small/jpeg/" width="650" height="341" />
</picture></a>`;
}

/**
 * Generates a Instagram embed for the given Instagram URL.
 *
 * @param {string} postId An Instagram post ID
 *
 * @returns {string} Markup for the Instagram embed.
 */
function instagramEmbed(postId) {
  return `<iframe
      title="Instagram post at https://www.instagram.com/p/${postId}"
      loading="lazy"
      src="https://www.instagram.com/p/${postId}/embed/"
      allowtransparency="true"
      frameborder="0"
      height="832"
      scrolling="no"
      style="background: white; max-width: 658px; width: calc(100% - 2px); border-radius: 3px; border: 1px solid rgb(219, 219, 219); box-shadow: none; display: block; margin: 0px 0px 12px; min-width: 326px; padding: 0px;"
    ></iframe>`;
  return `<iframe title="Instagram post at ${url}" class="liquidTag" src="https://dev.to/embed/instagram?args=${encodeURIComponent(
    url
  )}" style="border: 0; width: 100%;"></iframe>`;
}

/**
 * Generates a CodeSandbox embed for the given CodeSandbox ID.
 *
 * @param {string} sandboxId A CodeSandbox ID.
 *
 * @returns {string} Markup for the CodeSandbox embed.
 */
function codeSandboxEmbed(sandboxId) {
  return `<iframe src="https://codesandbox.io/embed/${sandboxId}?fontsize=14&hidenavigation=1&theme=dark"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="CodeSandbox with ID ${sandboxId}"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>`;
}

module.exports = {
  boostLink,
  youtubeEmbed,
  googleAnalytics,
  socialImage,
  embedEmbed,
  twitterEmbed,
  codepenEmbed,
  devLinkEmbed,
  githubEmbed,
  instagramEmbed,
  codeSandboxEmbed,
};
