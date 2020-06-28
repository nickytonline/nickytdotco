import React from 'react';
import { Helmet } from 'react-helmet';
import _ from 'lodash';
import { GatsbySocialImage } from 'gatsby-plugin-cloudinary-social-cards';

import { safePrefix } from '../utils';
import Header from './Header';
import Footer from './Footer';

function getPageExcerpt(path) {
    switch (path) {
        case '/about/':
            return 'A little blurb about me.';

        case '/blog/':
            return 'My writings about all kinds of things.';

        case '/uses/':
            return 'My whole setup from software all the way to the shoes I wear at home.';

        case '/thanks/':
            return 'Thanks to the projects that made this site possible.';

        case '/contact/':
            return `Let's get in touch.`;

        default:
            return `Welcome to Nick Taylor's Web Site`;
    }
}

export default class Body extends React.Component {
    render() {
        const { path } = this.props;

        const siteTitle = _.get(
            this.props,
            'pageContext.site.siteMetadata.title',
        );
        const postTitle = _.get(this.props, 'pageContext.frontmatter.title')
            ? _.get(this.props, 'pageContext.frontmatter.title')
            : '';

        const excerpt =
            _.get(this.props, 'pageContext.frontmatter.template') === 'post'
                ? _.get(this.props, 'pageContext.frontmatter.excerpt')
                : getPageExcerpt(path);

        const canonicalUrl = _.get(
            this.props,
            'pageContext.frontmatter.canonical_url',
        );

        return (
            <React.Fragment>
                <Helmet>
                    <title>{postTitle + ' - ' + siteTitle}</title>
                    <meta charSet="utf-8" />
                    <meta
                        name="viewport"
                        content="width=device-width, initial-scale=1.0"
                    />
                    <meta name="google" content="notranslate" />
                    <meta name="description" content={excerpt} />
                    <meta
                        name="monetization"
                        content={_.get(
                            this.props,
                            'pageContext.site.siteMetadata.monetization',
                        )}
                    />
                    <link rel="preload" href="https://fonts.googleapis.com" />
                    <link
                        rel="stylesheet"
                        href={safePrefix('assets/css/main.css')}
                    />
                    {_.get(this.props, 'pageContext.frontmatter.template') ===
                        'post' &&
                        _.get(
                            this.props,
                            'pageContext.frontmatter.canonical_url',
                        ) && <link rel="canonical" href={canonicalUrl} />}
                    <meta name="twitter:card" content="summary_large_image" />
                    <meta name="twitter:creator" content="@nickytonline" />
                    <meta property="twitter:title" content={postTitle} />
                    <meta property="twitter:description" content={excerpt} />
                    <meta property="og:url" content={canonicalUrl} />
                    <meta property="og:title" content={postTitle} />
                    <meta property="og:description" content={excerpt} />
                </Helmet>
                <GatsbySocialImage
                    options
                    title={postTitle || siteTitle}
                    tagline={excerpt}
                />
                <div
                    id="page"
                    className={
                        'site style-' +
                        _.get(
                            this.props,
                            'pageContext.site.siteMetadata.layout_style',
                        ) +
                        ' palette-' +
                        _.get(
                            this.props,
                            'pageContext.site.siteMetadata.palette',
                        )
                    }
                >
                    <Header {...this.props} />
                    <div id="content" className="site-content">
                        <div className="inner">
                            <main id="main" className="site-main">
                                {this.props.children}
                            </main>
                            <Footer {...this.props} />
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}
