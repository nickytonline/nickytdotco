import React from 'react';
import { Helmet } from 'react-helmet';
import _ from 'lodash';
import { GatsbySocialImage } from 'gatsby-plugin-cloudinary-social-cards';

import { safePrefix } from '../utils';
import Header from './Header';
import Footer from './Footer';

export default class Body extends React.Component {
    render() {
        const siteTitle = _.get(
            this.props,
            'pageContext.site.siteMetadata.title',
        );
        const postTitle = _.get(this.props, 'pageContext.frontmatter.title')
            ? _.get(this.props, 'pageContext.frontmatter.title') + ' - '
            : '';

        const excerpt =
            _.get(this.props, 'pageContext.frontmatter.template') === 'post'
                ? _.get(this.props, 'pageContext.frontmatter.excerpt')
                : `Welcome to Nick Taylor's Web Site`;

        return (
            <React.Fragment>
                <Helmet>
                    <title>
                        {postTitle}
                        {}
                    </title>
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
                        ) && (
                            <link
                                rel="canonical"
                                href={_.get(
                                    this.props,
                                    'pageContext.frontmatter.canonical_url',
                                )}
                            />
                        )}
                </Helmet>
                <GatsbySocialImage
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
