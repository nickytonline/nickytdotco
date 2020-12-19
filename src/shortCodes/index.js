/* eslint-env node */
const site = require('../_data/site.json');

/**
 * Generates markup for a boost on DEV button.
 *
 * @param {string} fileSlug A pages file slug.
 * @param {string} url A pages URL.
 *
 * @returns {string} Markup for a boost on DEV button.
 */
function boostButton(fileSlug, url) {
  if (!url.startsWith('/posts/')) {
    return '';
  }

  return `<a href="https://dev.to/nickytonline/${fileSlug}" class="booster">Boost on DEV</a>`;
}

/**
 * Generates an iframe for a YouTube video embed.
 *
 * @param {string} videoUrl A YouTube video URL
 *
 * @returns {string} Markup for a YouTube video embed.
 */
function youtube(videoUrl) {
  const videoId = videoUrl.replace(/.+\?v=(.+)/, '$1');

  return `<iframe
        loading="lazy"
        src="https://www.youtube.com/embed/${videoId}?feature=oembed"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen="allowFullScreen"
        style="position: absolute; width: 100%; height: 100%; left: 0px; top: 0px;"
        width="480"
        height="270"
        frameborder="0"
      ></iframe>`;
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
  googleAnalyticsId = site.googleAnalyticsId,
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

      gtag('config', 'UA-55732414-1');
    </script>`;
}

module.exports = {boostButton, youtube, googleAnalytics};
