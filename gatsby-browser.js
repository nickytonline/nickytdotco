/* eslint-env node */
// require('prismjs/themes/prism-coy.css');

/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/browser-apis/
 */

exports.onInitialClientRender = () => {
    if (
        'onGatsbyInitialClientRender' in window &&
        typeof window.onGatsbyInitialClientRender === 'function'
    ) {
        window.onGatsbyInitialClientRender();
    }
};

exports.onRouteUpdate = () => {
    if (
        'onGatsbyRouteUpdate' in window &&
        typeof window.onGatsbyRouteUpdate === 'function'
    ) {
        window.onGatsbyRouteUpdate();
    }
};
