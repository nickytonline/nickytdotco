import React from 'react';
import _ from 'lodash';
import moment from 'moment-strftime';

import { getPages, Link, safePrefix } from '../utils';

export default class PostsBlock extends React.Component {
    render() {
        let display_posts = _.orderBy(
            getPages(this.props.pageContext.pages, '/posts'),
            'frontmatter.date',
            'desc',
        );
        let recent_posts = display_posts.slice(
            0,
            _.get(this.props, 'section.num_posts_displayed'),
        );
        return (
            <section
                id={_.get(this.props, 'section.section_id')}
                className="block"
            >
                <h2 className="block-title underline">
                    {_.get(this.props, 'section.title')}
                </h2>
                <div className="post-feed">
                    {_.map(recent_posts, (post, post_idx) => (
                        <article key={post_idx} className="post">
                            <Link
                                className="post-inside"
                                to={safePrefix(_.get(post, 'url'))}
                            >
                                {_.get(post, 'frontmatter.thumb_img_path') && (
                                    <img
                                        className="thumbnail"
                                        src={safePrefix(
                                            _.get(
                                                post,
                                                'frontmatter.thumb_img_path',
                                            ),
                                        )}
                                        alt={_.get(post, 'frontmatter.title')}
                                        loading="lazy"
                                    />
                                )}
                                <header className="post-header">
                                    <h3 className="post-title">
                                        {_.get(post, 'frontmatter.title')}
                                    </h3>
                                </header>
                                <div className="post-content">
                                    <p>{_.get(post, 'frontmatter.excerpt')}</p>
                                </div>
                                <footer className="post-meta">
                                    <time
                                        className="published"
                                        dateTime={moment(
                                            _.get(post, 'frontmatter.date'),
                                        ).strftime('%Y-%m-%d %H:%M')}
                                    >
                                        {moment(
                                            _.get(post, 'frontmatter.date'),
                                        ).strftime('%B %d, %Y')}
                                    </time>
                                </footer>
                            </Link>
                        </article>
                    ))}
                </div>
                {_.get(this.props, 'section.actions') && (
                    <p className="block-cta">
                        {_.map(
                            _.get(this.props, 'section.actions'),
                            (action, action_idx) => (
                                <Link
                                    key={action_idx}
                                    to={safePrefix(_.get(action, 'url'))}
                                    className="button"
                                >
                                    {_.get(action, 'label')}
                                </Link>
                            ),
                        )}
                    </p>
                )}
            </section>
        );
    }
}
