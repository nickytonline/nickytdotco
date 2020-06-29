/* global require, module, process, __dirname */

require('dotenv').config();

module.exports = {
    pathPrefix: '/',
    siteMetadata: require('./site-metadata.json'),
    plugins: [
        `gatsby-plugin-preact`,
        `gatsby-plugin-react-helmet`,
        {
            resolve: 'gatsby-plugin-cloudinary-social-cards',
            options: {
                cloudName: 'nickytonline',
                apiKey: process.env.CLOUDINARY_API_KEY,
                apiSecret: process.env.CLOUDINARY_API_SECRET,
                imageTemplate: 'static/images/social.jpg',
                imageOptions: {
                    titleFont: 'futura',
                    titleExtraConfig: '_bold',
                    titleLeftOffset: 30,
                    titleBottomOffset: 179,
                    taglineLeftOffset: 30,
                    taglineTopOffset: 500,
                    textColor: 'ffffff',
                    textAreaWidth: 860,
                },
            },
        },
        `gatsby-source-data`,
        {
            resolve: `gatsby-source-filesystem`,
            options: {
                name: `pages`,
                path: `${__dirname}/src/pages`,
            },
        },
        {
            resolve: `gatsby-plugin-stackbit-static-sass`,
            options: {
                inputFile: `${__dirname}/src/sass/main.scss`,
                outputFile: `${__dirname}/public/assets/css/main.css`,
            },
        },
        {
            resolve: `gatsby-transformer-remark`,
            options: {
                plugins: [`gatsby-remark-component`],
            },
        },
        {
            resolve: `gatsby-remark-page-creator`,
            options: {},
        },
        {
            resolve: `@stackbit/gatsby-plugin-menus`,
            options: {
                sourceUrlPath: `fields.url`,
                pageContextProperty: `menus`,
                menus: require('./src/data/menus.json'),
            },
        },
        // 'gatsby-plugin-offline',
        {
            resolve: 'gatsby-plugin-manifest',
            options: {
                name: 'Just some dev',
                short_name: 'Just some dev',
                start_url: '/',
                background_color: '#f7f0eb',
                theme_color: '#a2466c',
                // Enables "Add to Homescreen" prompt and disables browser UI (including back button)
                // see https://developers.google.com/web/fundamentals/web-app-manifest/#display
                display: 'standalone',
                icon: 'static/images/apple-touch-icon.png',
            },
        },
        'gatsby-plugin-postcss',
        'gatsby-plugin-sitemap',
        {
            resolve: 'gatsby-plugin-google-analytics',
            options: {
                trackingId: 'UA-55732414-1',
                // Puts tracking script in the head instead of the body
                head: false,
                // Setting this parameter is optional
                anonymize: true,
                // Setting this parameter is also optional
                respectDNT: true,
                // Avoids sending pageview hits from custom paths
                exclude: ['/preview/**', '/do-not-track/me/too/'],
            },
        },
        {
            resolve: 'gatsby-plugin-web-font-loader',
            options: {
                google: {
                    families: ['Roboto'],
                },
            },
        },
        {
            resolve: `@raae/gatsby-remark-oembed`,
            options: {
                // usePrefix defaults to false
                // usePrefix: true is the same as ["oembed"]
                usePrefix: ['oembed', 'video'],
                providers: {
                    // Important to exclude providers
                    // that adds js to the page.
                    // If you do not need them.
                    exclude: ['Twitter', 'YouTube', 'Instagram'],
                },
            },
        },
    ],
};
