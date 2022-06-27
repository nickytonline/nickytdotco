---json
{
  "title": "Automate syndication of your content with Eleventy, dev.to, and GitHub Actions",
  "excerpt": "This started off as a test post for my talk I gave this past week at the Eleventy Meetup.      Here’s...",
  "date": "2022-05-26T17:12:32.116Z",
  "tags": [
    "eleventy",
    "githubactions",
    "node",
    "webdev"
  ],
  "cover_image": "https://www.iamdeveloper.com/images/posts/_practicaldev_image_fetch_s--foEy2Mck--_c_imagga_scale,f_auto,fl_progressive,h_420,q_auto,w_1000_https:__dev-to-uploads.s3.amazonaws.com_uploads_articles_2x523d97n7fem0pci10s.png",
  "canonicalUrl": "https://www.iamdeveloper.com/posts/my-eleventy-meetup-talk-3b2p/",
  "reading_time_minutes": 6,
  "template": "post"
}
---

This started off as a test post for my talk I gave this past week at the [Eleventy Meetup](https://11tymeetup.dev/).

{% embed "https://youtu.be/Yy4eHUjLWAs" %}

Here’s the accompanying slide deck, [iamdeveloper.com/11tyMeetupMay2022](https://iamdeveloper.com/11tyMeetupMay2022).

I wasn't able to go into as much detail as I would have liked to during the talk, so this blog post compliments the talk.

Here is my flow for writing blog posts. I create and publish them on [dev.to](https://dev.to) (DEV) via the DEV editor. Every night at 8 pm Eastern, a [GitHub action](https://github.com/nickytonline/iamdeveloper.com/blob/main/.github/workflows/get-latest-posts-and-videos.yml) runs and updates my blog post markdown and associated assets. If there are changes, the main branch is updated and starts a deployment on [Netlify](https://netlify.com).

Let's break down the whole flow.

## Caching

### Blog Post Markdown

I call the DEV API, which pulls in all my blog posts. At the time of writing, the function to do that looks like this. Feel free to peek at the [complete source code](https://github.com/nickytonline/iamdeveloper.com/blob/main/bin/generateDevToPosts.js).

```javascript
{% raw %}
/**
 * Retrieves the latest blog posts from dev.to.
 *
 * @returns {Promise<object[]>} A promise that resolves to an array of blog posts.
 */
async function getDevPosts() {
  const response = await fetch(DEV_TO_API_URL + '/articles/me/published?per_page=1000', {
    headers: {
      'api-key': DEV_API_KEY,
    },
  });
  const posts = await response.json();

  return posts.filter(isValidPost);
}
{% endraw %}
```

I filter out certain posts via the `isValidPost(post)` function. I filter out discussion posts, water cooler posts etc., as I enjoy having them on DEV, but not my blog.

The API does allow you to exclude tags instead of doing it once you’ve received all posts, but for some reason it doesn’t work and I have haven’t had time to investigate why. 

### Manipulating the markdown and shortcodes

DEV uses [liquid tags](https://shopify.github.io/liquid/basics/variations/) for embedding content in blog posts. For those interested, here is the [complete list of supported embeds](https://dev.to/p/editor_guide#liquidtags) via the DEV {% raw %}`{% embed "url" %}`{% endraw %} liquid tag.

I'm using [short codes](https://www.11ty.dev/docs/shortcodes/) in Eleventy which are the same syntax as liquid tags. In the past DEV had specific liquid tags for different embeds. For example, to embed a GitHub repository, you'd use the {% raw %}`{% github "url" %}`{% endraw %} liquid tag. The liquid tag is still supported, but they now have a generic embed liquid tag, {% raw %}`{% embed "url" %}`{% endraw %} which determines what type of embed based on the URL.

In my project, I have shortcodes for specific embeds, e.g. {% raw %}`{% github "url" %}`{% endraw %}, {% raw %}`{% twitter "url" %}`{% endraw %}, etc. I have older posts that use the old liquid tags of DEV, but newer posts use the {% raw %}`{% embed "url" %}`{% endraw %} liquid tag. On my end I manipulate the markdown to convert e.g. {% raw %}`{% embed "https://twitter.com/nickytonline/status/1521650477674471424" %}`{% endraw %} to {% raw %}`{% twitter "https://twitter.com/nickytonline/status/1521650477674471424" %}`{% endraw %}

I don't support all embeds at the moment. For example, comment and tag embeds. I had DEV comment embeds at one point, but it proved troublesome for comment embeds with Tweets or any embed. I used so few of them in blog posts that I made it a rule to create a hyperlink to the comment instead. For the tag embed, I barely used it, so I made another rule to not reference a tag on DEV or, if I did, to create a hyperlink instead.

There are some other manipulations I do to the markdown that I'm probably forgetting. The markdown of a blog post from DEV is now in a state that Eleventy can consume.

#### Boost links

On all my blog posts, you'll notice that they have a Boost on DEV link, and some also have a Boost on [Hashnode](https://hashnode.com) link. I got this idea from [Stephanie Eckles](https://twitter.com/5t3ph), giving credit where credit is due.

![Boost links for DEV and Hashnode for a blog post of mine](https://www.iamdeveloper.com/images/posts/_uploads_articles_6rajggtd3owzd4q8d1ub.png)
 

These links are generated in the markdown by the `boostLink` shortcode

```javascript
{% raw %}
/**
 * Generates markup for a boost on DEV button.
 *
 * @param {string} fileSlug A pages file slug.
 * @param {string} url A pages URL.
 *
 * @returns {string} Markup for a boost links on DEV and Hashnode.
 */
function boostLink(title, fileSlug, url) {
  if (!url.startsWith('/posts/')) {
    return '';
  }

  let hashnodeBoosterLink = '';
  const hashnodeUrl = hashnodeData[fileSlug];

  if (hashnodeUrl) {
    hashnodeBoosterLink =
      `<a href="${hashnodeUrl}" class="boost-link">Boost on Hashnode</a>` +
      hashnodeBoosterLink;
  }

  const intentToTweet = `<a class="boost-link" href="https://twitter.com/intent/tweet?text=${encodeURIComponent(
    `${title} by ${site.authorHandle} ${site.url}${url}`
  )}">Share on Twitter</a>`;

  return `<a href="https://dev.to/nickytonline/${fileSlug}" class="boost-link">Boost on DEV</a>${hashnodeBoosterLink}${intentToTweet}`;
}
{% endraw %}
``` 
[Source code for the boostLink shortcode](https://github.com/nickytonline/iamdeveloper.com/blob/0e839df7ce6fe04b7991c2f7144d46e7587369e9/src/shortCodes/index.js#L8-L35) on GitHub.

One of the parameters is the blog post slug. When I pull in post from DEV, the same slug will be used for my blog post on my blog, so it's trivial generating a link back to DEV. For Hashnode, I currently import DEV posts using their DEV importer, so I need to alter some things like the slug, so that it's uniform with DEV and my blog.

I persist a list of blog post URLs from Hashnode by pulling in my Hashnode RSS feed because not all blog posts from my blog are on Hashnode. This is why only some posts have a Hashnode boost link.

### Images

Any images in blog posts not on my omission list are pulled down and committed to the repository. Currently, the only images I omit are from giphy.com. Everything else is my images or Unsplash images which I have attributed to the author as per the Unsplash guidelines.

Before downloading any images, I check if they already exist in the repository. If they don't, I download and save them.

```javascript
{% raw %}
/**
 * Saves a markdown image URL to a local file and returns the new image URL.
 * TODO: Fix mixing two concerns.
 * @param {string} markdownImageUrl
 *
 * @returns {string} Returns the new image URL.
 */
async function saveMarkdownImageUrl(markdownImageUrl = null) {
  let newMarkdownImageUrl = null;

  if (markdownImageUrl) {
    const imageUrl = new URL(markdownImageUrl);
    const imagefilename = imageUrl.pathname.replaceAll('/', '_');
    const localCoverImagePath = path.join(POSTS_IMAGES_DIRECTORY, imagefilename);

    newMarkdownImageUrl = generateNewImageUrl(imageUrl);

    if (!(await fileExists(localCoverImagePath))) {
      console.log(`Saving image ${imageUrl} to ${localCoverImagePath}`);
      await saveImageUrl(markdownImageUrl, localCoverImagePath);
    }
  }

  return newMarkdownImageUrl;
}
{% endraw %}
```
### Embedded articles

I link to DEV posts withing some of my DEV blog posts. These are persisted as well to my repostitory. They are stored in the [embeddedPostsMarkup.json](https://github.com/nickytonline/iamdeveloper.com/blob/main/src/_data/embeddedPostsMarkup.json) file I generate via the `updateBlogPostEmbeds(embeds, filepaths)` function.

```javascript
{% raw %}
async function updateBlogPostEmbeds(embeds, filePaths) {
  let blogPostEmbedsMarkup = {};

  for (const [url] of embeds) {
    // You can't use the dev.to API to grab an article by slug, so we need to use the URL instead
    // to fetch the markup of the article page to extract the article ID.
    // This is only an issue for article embeds.
    const response = await fetch(url);
    const html = await response.text();
    const match = html.match(/data-article-id="(?<blogPostId>.+?)"/);

    if (match) {
      const {blogPostId} = match.groups;
      const {
        body_html,
        body_markdown,
        comments_count,
        public_reactions_count,
        positive_reactions_count,
        ...data
      } = await getDevPost(blogPostId);

      blogPostEmbedsMarkup[url] = data;
    } else {
      throw new Error(`Could not find blog post at ${url}`);
    }
  }

  const data = JSON.stringify(blogPostEmbedsMarkup, null, 2);

  await fs.writeFile(filePaths, data, () =>
    console.log(`Saved image ${imageUrl} to ${imageFilePath}!`)
  );
}
{% endraw %}
```
[Source for the updateBlogPostsEmbeds](https://github.com/nickytonline/iamdeveloper.com/blob/0e839df7ce6fe04b7991c2f7144d46e7587369e9/src/shortCodes/index.js#L8-L35) on GitHub.

With all the files committed to the repository, the deployment will kick off if any changes are committed.

All the source code is open source, so feel free to copy my workflow. 😎

{% embed "https://github.com/nickytonline/iamdeveloper.com" %}

## Deployment

As soon as anything is updated in the repository's main branch, a deployment to Netlify begins. This is where Eleventy gets to work.

Thanks to our caching efforts, all the markdown is in a state that Eleventy can now consume. I'm currently using the latest Canary version of Eleventy along with the backported experimental version of Node 16 in case your wondering why I run Eleventy using node directlty.

`"production": "NODE_ENV=production node --experimental-fetch node_modules/.bin/eleventy"`



## Potential Improvements

* For images in the repository associated with blog posts, it'd be good to clean up images that are no longer used once a month.

* I haven't dug into this yet, but sometimes the GitHub action errors out. I'm not overly concerned at the moment as it generally passes. However, still, it'd be nice for it to recover or handle this error more gracefully.

* Currently, I manually post blog posts to Hashnode via their import from DEV functionality, add the associated tags, set the canonical URL and save the post. It would be nice to post to them when a new post is created on my blog. They don't use liquid tags. They use another format like this `%[some url]`, so I would need to handle that.

* It'd be nice to support more embeds from DEV in my blog

* Automatically posting my latest posts to social media would be nice, but I'm on the fence about this one. I enjoy writing these Tweets or short posts manually instead of having some generic Tweet or post on LinkedIn.

If you made it this far, you're awesome.
