import React from 'react';
import _ from 'lodash';
import moment from 'moment-strftime';

import { Layout } from '../components/index';
import { htmlToReact, safePrefix } from '../utils';

export default class Post extends React.Component {
    render() {
        return (
            <Layout {...this.props}>
                <article className="post post-full">
                    <header className="post-header">
                        <h1 className="post-title underline">
                            {_.get(this.props, 'pageContext.frontmatter.title')}
                        </h1>
                        <time
                            className="published"
                            dateTime={moment(
                                _.get(
                                    this.props,
                                    'pageContext.frontmatter.date',
                                ),
                            ).strftime('%Y-%m-%d %H:%M')}
                        >
                            {moment(
                                _.get(
                                    this.props,
                                    'pageContext.frontmatter.date',
                                ),
                            ).strftime('%A, %B %e, %Y')}
                        </time>
                    </header>
                    {_.get(this.props, 'pageContext.frontmatter.subtitle') && (
                        <div className="post-subtitle">
                            {htmlToReact(
                                _.get(
                                    this.props,
                                    'pageContext.frontmatter.subtitle',
                                ),
                            )}
                        </div>
                    )}
                    {_.get(
                        this.props,
                        'pageContext.frontmatter.content_img_path',
                    ) && (
                        <div className="post-thumbnail">
                            <img
                                src={safePrefix(
                                    _.get(
                                        this.props,
                                        'pageContext.frontmatter.content_img_path',
                                    ),
                                )}
                                alt={_.get(
                                    this.props,
                                    'pageContext.frontmatter.title',
                                )}
                                loading="lazy"
                            />
                        </div>
                    )}
                    <div className="post-content">
                        {htmlToReact(_.get(this.props, 'pageContext.html'))}
                    </div>
                    <footer className="post-meta">
                        <p>
                            <a
                                href={`${_.get(
                                    this.props,
                                    'pageContext.frontmatter.forem_instance_url',
                                )}#comments`}
                            >
                                Comment on the post
                            </a>
                        </p>
                    </footer>
                </article>
            </Layout>
        );
    }
}
