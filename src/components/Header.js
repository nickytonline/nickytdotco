import React from 'react';
import _ from 'lodash';

import { Link, safePrefix } from '../utils';
import Social from './Social';

export default class Header extends React.Component {
    render() {
        return (
            <aside>
                <header
                    id="masthead"
                    className={
                        'site-header ' +
                        _.get(
                            this.props,
                            'pageContext.site.siteMetadata.header.bg',
                        )
                    }
                >
                    <div className="site-header-wrap">
                        <div className="site-header-inside">
                            <div className="site-branding">
                                {_.get(
                                    this.props,
                                    'pageContext.site.siteMetadata.header.profile_img',
                                ) && (
                                    <p className="profile">
                                        <Link
                                            className="headshot"
                                            to={safePrefix('/')}
                                        >
                                            <img
                                                src={safePrefix(
                                                    _.get(
                                                        this.props,
                                                        'pageContext.site.siteMetadata.header.profile_img',
                                                    ),
                                                )}
                                                className="avatar"
                                                alt="Author Avatar"
                                                loading="lazy"
                                            />
                                        </Link>
                                    </p>
                                )}
                                <div className="site-identity">
                                    {_.get(
                                        this.props,
                                        'pageContext.frontmatter.template',
                                    ) === 'home' ||
                                    _.get(
                                        this.props,
                                        'pageContext.frontmatter.template',
                                    ) === 'blog' ? (
                                        <h1 className="site-title">
                                            <Link to={safePrefix('/')}>
                                                {_.get(
                                                    this.props,
                                                    'pageContext.site.siteMetadata.header.title',
                                                )}
                                            </Link>
                                        </h1>
                                    ) : (
                                        <p className="site-title">
                                            <Link to={safePrefix('/')}>
                                                {_.get(
                                                    this.props,
                                                    'pageContext.site.siteMetadata.header.title',
                                                )}
                                            </Link>
                                        </p>
                                    )}
                                    {_.get(
                                        this.props,
                                        'pageContext.site.siteMetadata.header.tagline',
                                    ) && (
                                        <p className="site-description">
                                            {_.get(
                                                this.props,
                                                'pageContext.site.siteMetadata.header.tagline',
                                            )}
                                        </p>
                                    )}
                                </div>
                                {_.get(this.props, 'pageContext.menus.main') &&
                                    _.get(
                                        this.props,
                                        'pageContext.site.siteMetadata.header.has_nav',
                                    ) && (
                                        <button
                                            id="menu-toggle"
                                            className="menu-toggle"
                                        >
                                            <span className="screen-reader-text">
                                                Menu
                                            </span>
                                            <span
                                                className="icon-menu"
                                                aria-hidden="true"
                                            />
                                        </button>
                                    )}
                            </div>
                            {_.get(this.props, 'pageContext.menus.main') &&
                                _.get(
                                    this.props,
                                    'pageContext.site.siteMetadata.header.has_nav',
                                ) && (
                                    <nav
                                        id="main-navigation"
                                        className="site-navigation"
                                        aria-label="Main Navigation"
                                    >
                                        <div className="site-nav-wrap">
                                            <div className="site-nav-inside">
                                                <ul className="menu">
                                                    {_.map(
                                                        _.get(
                                                            this.props,
                                                            'pageContext.menus.main',
                                                        ),
                                                        (item, item_idx) => (
                                                            <li
                                                                key={item_idx}
                                                                className={
                                                                    'menu-item ' +
                                                                    (_.get(
                                                                        this
                                                                            .props,
                                                                        'pageContext.url',
                                                                    ) ===
                                                                    _.get(
                                                                        item,
                                                                        'url',
                                                                    )
                                                                        ? ' current-menu-item'
                                                                        : '')
                                                                }
                                                            >
                                                                <Link
                                                                    to={safePrefix(
                                                                        _.get(
                                                                            item,
                                                                            'url',
                                                                        ),
                                                                    )}
                                                                >
                                                                    {_.get(
                                                                        item,
                                                                        'title',
                                                                    )}
                                                                </Link>
                                                            </li>
                                                        ),
                                                    )}
                                                </ul>
                                                {_.get(
                                                    this.props,
                                                    'pageContext.site.siteMetadata.header.has_social',
                                                ) && <Social {...this.props} />}
                                            </div>
                                        </div>
                                    </nav>
                                )}
                        </div>
                    </div>
                </header>
            </aside>
        );
    }
}
