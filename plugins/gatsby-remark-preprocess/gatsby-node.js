/* eslint-env node */
const TWITTER_OEMBED_TYPE = 'twitter';
const YOUTUBE_OEMBED_TYPE = 'youtube';
const INSTAGRAM_OEMBED_TYPE = 'instagram';

const EMBED_TYPES = Object.freeze([
    TWITTER_OEMBED_TYPE,
    YOUTUBE_OEMBED_TYPE,
    INSTAGRAM_OEMBED_TYPE,
]);

let instagramCounter = 0;

const reEmbedFinder = new RegExp(
    `<iframe .+?src="https://dev.to/embed/(${EMBED_TYPES.join(
        '|',
    )})\\?args=([^"]+)"[^>]+></iframe>`,
    'g',
);

function buildOembedUrl(fullRawMarkdown, oEmbedType, oEmbedAssetId) {
    console.log('oEmbed info', { oEmbedType, oEmbedAssetId });
    switch (oEmbedType) {
        case YOUTUBE_OEMBED_TYPE:
            return `https://www.youtube.com/watch?v=${oEmbedAssetId}`;

        // Set this back to just the embed URL once https://github.com/raae/gatsby-remark-oembed/issues/128 is fixed.
        case INSTAGRAM_OEMBED_TYPE:
            return `<iframe class="instagram-media instagram-media-rendered" id="instagram-embed-${instagramCounter++}" src="https://www.instagram.com/p/${oEmbedAssetId}/embed/?cr=1&amp;v=12&amp;wp=628&amp;rd=https%3A%2F%2Fgatsby-remark-oembed.netlify.app&amp;rp=%2F#%7B%22ci%22%3A0%2C%22os%22%3A849.1599999833852%2C%22ls%22%3A714.7600001189858%2C%22le%22%3A792.0250000897795%7D" allowtransparency="true" allowfullscreen="true" frameborder="0" height="832" data-instgrm-payload-id="instagram-media-payload-0" scrolling="no" style="background: white; max-width: 658px; width: calc(100% - 2px); border-radius: 3px; border: 1px solid rgb(219, 219, 219); box-shadow: none; display: block; margin: 0px 0px 12px; min-width: 326px; padding: 0px;"></iframe>`;

        case TWITTER_OEMBED_TYPE:
            return `https://twitter.com/nickytonline/status/${oEmbedAssetId}`;

        default:
            // No change
            return fullRawMarkdown;
    }
}

function processMarkdown(markdown) {
    // Convert DEV YouTube embed to an oembed that get's processed by @raee/gatsby-remark-oembed
    const processedMarkdown = markdown.replace(reEmbedFinder, buildOembedUrl);

    return processedMarkdown;
}

exports.mutateSource = ({ markdownNode: { internal } }) => {
    if (internal.content.includes('dev.to/embed')) {
        instagramCounter = 0;
        console.log('processing a dev.to embed');
        internal.content = processMarkdown(internal.content);
    }
};
