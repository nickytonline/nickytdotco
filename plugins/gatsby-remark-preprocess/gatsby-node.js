/* eslint-env node */
const TWITTER_OEMBED_TYPE = 'twitter';
const YOUTUBE_OEMBED_TYPE = 'youtube';
const INSTAGRAM_OEMBED_TYPE = 'instagram';

const EMBED_TYPES = Object.freeze([
    TWITTER_OEMBED_TYPE,
    YOUTUBE_OEMBED_TYPE,
    INSTAGRAM_OEMBED_TYPE,
]);

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

        // TODO: Fix this. Omitting for now as it doesn't convert to an oEmbed.
        // case INSTAGRAM_OEMBED_TYPE:
        //     return `https://www.instagram.com/p/${oEmbedAssetId}/`;

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
        console.log('processing a dev.to embed');
        internal.content = processMarkdown(internal.content);
    }
};
