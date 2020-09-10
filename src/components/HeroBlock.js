import React from 'react';
import _ from 'lodash';

import { markdownify } from '../utils';

export default class HeroBlock extends React.Component {
    render() {
        return (
            <section
                id={_.get(this.props, 'section.section_id')}
                className="hero"
            >
                {_.get(this.props, 'section.title') ? (
                    <h2 className="hero-title">
                        {_.get(this.props, 'section.title')}
                    </h2>
                ) : (
                    <h2 className="hero-title">
                        <em>Hi!</em>{' '}
                        {`I'm ${_.get(
                            this.props,
                            'pageContext.site.data.author.name',
                        )}`}
                    </h2>
                )}
                <div className="hero-text">
                    {markdownify(_.get(this.props, 'section.content'))}
                </div>
            </section>
        );
    }
}
