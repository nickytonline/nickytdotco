/* eslint-env node */
const TWITTER_OEMBED_TYPE = 'twitter';
const YOUTUBE_OEMBED_TYPE = 'youtube';
const INSTAGRAM_OEMBED_TYPE = 'instagram';

const EMBED_TYPES = Object.freeze([
  TWITTER_OEMBED_TYPE,
  YOUTUBE_OEMBED_TYPE,
  INSTAGRAM_OEMBED_TYPE
]);

/**
 * Creates embedded markup for a YouTube video.
 *
 * @param {string} videoId The ID of a YouTube video post.
 *
 * @returns A string of markup for an iframe for the YouTube video.
 */
function createYouTubeEmbedMarkup(videoId) {
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
 * Creates embedded markup for an Instagram post.
 *
 * @param {string} postId The ID of an Instagram post.
 *
 * @returns A string of markup for an iframe for an Instragram post with the given post ID.
 */
function createInstagramEmbedMarkup(postId) {
  return `
    <iframe
      title="Instagram post"
      loading="lazy"
      src="https://www.instagram.com/p/${postId}/embed/?cr=1&amp;v=12&amp;wp=628&amp;rd=https%3A%2F%2Fgatsby-remark-oembed.netlify.app&amp;rp=%2F#%7B%22ci%22%3A0%2C%22os%22%3A849.1599999833852%2C%22ls%22%3A714.7600001189858%2C%22le%22%3A792.0250000897795%7D"
      allowtransparency="true"
      frameborder="0"
      height="832"
      scrolling="no"
      style="background: white; max-width: 658px; width: calc(100% - 2px); border-radius: 3px; border: 1px solid rgb(219, 219, 219); box-shadow: none; display: block; margin: 0px 0px 12px; min-width: 326px; padding: 0px;"
    ></iframe>
  `;
}

/**
 * Creates embedded markup for a Twitter post.
 *
 * @param {string} postId The ID of an Twitter post.
 *
 * @returns A string of markup for an iframe for a Twitter post with the given post ID.
 */
function convertToTwitterOEmbed(postId) {
  return `
    <iframe
      loading="lazy"
      id="twitter-widget-${postId}"
      scrolling="no"
      allowtransparency="true"
      style="width: 550px; height: 564px; display: block;"
      title="Twitter Tweet"
      src="https://platform.twitter.com/embed/index.html?creatorScreenName=nickytonline&amp;dnt=false&amp;embedId=twitter-widget-2&amp;frame=false&amp;hideCard=false&amp;hideThread=false&amp;id=${postId}&amp;lang=en&amp;origin=https%3A%2F%2Fwww.iamdeveloper.com%2F&amp;theme=light&amp;widgetsVersion=ed20a2b%3A1601588405575&amp;width=550px"
      data-tweet-id="1282526470196338690"
      frameborder="0"
    ></iframe>
  `;
}

const reEmbedFinder = new RegExp(
  `<iframe .+?src="https://dev.to/embed/(${EMBED_TYPES.join(
    '|'
  )})\\?args=([^"]+)"[^>]+></iframe>`,
  'g'
);

/**
 * Creates embedded markup for the given oEmbed type and oEmbed ID.
 *
 * @param {string} fullRawMarkdown The original raw markdown.
 * @param {string} oEmbedType The oEmbed type.
 * @param {string} oEmbedAssetId The asset ID for the given oEmbed.
 *
 * @returns A string of markup for an iframe for the given oEmbed type and oEmbed ID.
 */
function generateEmbeddedMarkup(fullRawMarkdown, oEmbedType, oEmbedAssetId) {
  switch (oEmbedType) {
    case YOUTUBE_OEMBED_TYPE:
      return createYouTubeEmbedMarkup(oEmbedAssetId);

    // Set this back to just the embed URL once https://github.com/raae/gatsby-remark-oembed/issues/128 is fixed.
    case INSTAGRAM_OEMBED_TYPE:
      return createInstagramEmbedMarkup(oEmbedAssetId);

    case TWITTER_OEMBED_TYPE:
      return convertToTwitterOEmbed(oEmbedAssetId);

    default:
      // No change
      return fullRawMarkdown;
  }
}

/**
 * Converts DEV embeds to an oEmbed in an iframe.
 *
 * @param {string} markdown The original raw markdown
 *
 * @returns Markdown with DEV embeds that were converted oEmbeds, if any.
 */
function convertDevEmbeds(markdown) {
  const processedMarkdown = markdown.replace(reEmbedFinder, generateEmbeddedMarkup);

  return processedMarkdown;
}

/**
 * Removes the posted on DEV link at the end of the content.
 *
 * @param {string} postBody The body of a post
 *
 * @returns The content minus the posted on DEV link at the end of the content.
 */
function removePostIsOnDevLink(postBody = '') {
  return postBody.replace(
    /<a href="[^"]+">This post is also available on DEV\.<\/a>/,
    ''
  );
}

module.exports = {convertDevEmbeds, removePostIsOnDevLink};
