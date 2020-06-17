/* global require, exports */
const path = require('path');
const { createFilePath } = require('gatsby-source-filesystem');
const _ = require('lodash');

function findFileNode({ node, getNode }) {
    let fileNode = node;
    let ids = [fileNode.id];

    while (fileNode && fileNode.internal.type !== `File` && fileNode.parent) {
        fileNode = getNode(fileNode.parent);

        if (!fileNode) {
            break;
        }

        if (_.includes(ids, fileNode.id)) {
            console.log(`found cyclic reference between nodes`);
            break;
        }

        ids.push(fileNode.id);
    }

    if (!fileNode || fileNode.internal.type !== `File`) {
        console.log('did not find ancestor File node');
        return null;
    }

    return fileNode;
}

exports.onCreateNode = ({ node, getNode, actions }, options) => {
    const { createNodeField } = actions;

    if (node.internal.type === 'MarkdownRemark') {
        let fileNode = findFileNode({ node, getNode });
        if (!fileNode) {
            throw new Error(
                'could not find parent File node for MarkdownRemark node: ' +
                    node,
            );
        }

        let url;
        if (node.frontmatter.url) {
            url = node.frontmatter.url;
        } else if (_.get(options, 'uglyUrls', false)) {
            url = path.join(
                fileNode.relativeDirectory,
                fileNode.name + '.html',
            );
        } else {
            url = createFilePath({ node, getNode });
        }

        createNodeField({ node, name: 'url', value: url });
        createNodeField({
            node,
            name: 'absolutePath',
            value: fileNode.absolutePath,
        });
        createNodeField({
            node,
            name: 'relativePath',
            value: fileNode.relativePath,
        });
        createNodeField({ node, name: 'absoluteDir', value: fileNode.dir });
        createNodeField({
            node,
            name: 'relativeDir',
            value: fileNode.relativeDirectory,
        });
        createNodeField({ node, name: 'base', value: fileNode.base });
        createNodeField({ node, name: 'ext', value: fileNode.ext });
        createNodeField({ node, name: 'name', value: fileNode.name });
    }
};

exports.createPages = ({ graphql, getNode, actions, getNodesByType }) => {
    const { createPage, deletePage } = actions;

    // Use GraphQL to bring only the "id" and "html" (added by gatsby-transformer-remark)
    // properties of the MarkdownRemark nodes. Don't bring additional fields
    // such as "relativePath". Otherwise, Gatsby's GraphQL resolvers might infer
    // types these fields as File and change their structure. For example, the
    // "html" attribute exists only on a GraphQL node, but does not exist on the
    // underlying node.
    return graphql(`
        {
            allMarkdownRemark(
                filter: {
                    frontmatter: {
                        tags: {
                            nin: [
                                "weeklylearn"
                                "watercooler"
                                "jokes"
                                "fun"
                                "explainlikeimfive"
                            ]
                        }
                    }
                }
            ) {
                edges {
                    node {
                        html
                        id
                        frontmatter {
                            tags
                        }
                    }
                }
            }
        }
    `).then((result) => {
        if (result.errors) {
            return Promise.reject(result.errors);
        }

        const nodes = result.data.allMarkdownRemark.edges.map(
            ({ node }) => node,
        );
        const siteNode = getNode('Site');
        const siteDataNode = getNode('SiteData');
        const sitePageNodes = getNodesByType('SitePage');
        const sitePageNodesByPath = _.keyBy(sitePageNodes, 'path');

        const pages = nodes.map((graphQLNode) => {
            // Use the node id to get the underlying node. It is not exactly the
            // same node returned by GraphQL, because GraphQL resolvers might
            // transform node fields.
            const node = getNode(graphQLNode.id);

            return {
                url: node.fields.url,
                relativePath: node.fields.relativePath,
                relativeDir: node.fields.relativeDir,
                base: node.fields.base,
                name: node.fields.name,
                frontmatter: node.frontmatter,
                html: graphQLNode.html,
            };
        });

        nodes.forEach((graphQLNode) => {
            const node = getNode(graphQLNode.id);
            const matches = /<a href="([^"]+)">This post is also available on DEV\.<\/a>/.exec(
                graphQLNode.html,
            );

            if (matches !== null) {
                node.frontmatter.dev_url = matches[1];
            }

            const url = node.fields.url;
            const template = node.frontmatter.template;
            const component = path.resolve(`./src/templates/${template}.js`);

            const existingPageNode = _.get(sitePageNodesByPath, url);
            if (existingPageNode) {
                deletePage(existingPageNode);
            }

            const page = {
                path: url,
                component: component,
                context: {
                    url: url,
                    relativePath: node.fields.relativePath,
                    relativeDir: node.fields.relativeDir,
                    base: node.fields.base,
                    name: node.fields.name,
                    frontmatter: node.frontmatter,
                    html: graphQLNode.html.replace(
                        /<a href="[^"]+">This post is also available on DEV\.<\/a>/,
                        '',
                    ),
                    pages: pages,
                    site: {
                        siteMetadata: siteNode.siteMetadata,
                        pathPrefix: siteNode.pathPrefix,
                        data: _.get(siteDataNode, 'data', null),
                    },
                },
            };

            if (existingPageNode && !_.get(page, 'context.menus')) {
                page.context.menus = _.get(existingPageNode, 'context.menus');
            }

            createPage(page);
        });
    });
};
