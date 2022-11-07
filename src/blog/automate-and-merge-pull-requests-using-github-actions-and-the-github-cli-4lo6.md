---json
{
  "title": "Automate and Auto-Merge Pull Requests using GitHub Actions and the GitHub CLI",
  "excerpt": "So I've written about how I automated content updates for my blog before. I even gave a talk on...",
  "date": "2022-11-06T01:32:09.368Z",
  "tags": [
    "github",
    "githubcli",
    "githubactions",
    "git"
  ],
  "cover_image": "https://www.iamdeveloper.com/images/posts/_practicaldev_image_fetch_s--MPFZD2M0--_c_imagga_scale,f_auto,fl_progressive,h_420,q_auto,w_1000_https:__dev-to-uploads.s3.amazonaws.com_uploads_articles_n5zbeeuatd9c42b1etvc.jpg",
  "canonicalUrl": "https://www.iamdeveloper.com/posts/automate-and-merge-pull-requests-using-github-actions-and-the-github-cli-4lo6",
  "reading_time_minutes": 5,
  "template": "post"
}
---

So I've written about how I automated content updates for my blog before. I even gave a talk on it.

{% embed "https://dev.to/nickytonline/my-eleventy-meetup-talk-3b2p" %}

This post builds off of that. I recently improved how I automate content updates for my blog. This is a recap in case you haven't read my post above.

## How content automation was

I use dev.to as a headless CMS via the [dev.to API](https://dev.to/t/api). I run that in a nightly GitHub action that pulls the latest content, and if anything has changed, I merge those changes to the `main` branch. I also update my streaming page on my website with my latest videos from YouTube using the YouTube API.

This has been working fine, but it has some shortcomings:

1. Pushing straight to the `main` branch without a pull request (PR), there are no deploy previews on Netlify.

2. [Branch protection](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/defining-the-mergeability-of-pull-requests/about-protected-branches) was pretty loose

3. If there are issues building the site, I'll only know about it when it fails to build for production.

## How content automation improved

So I decided to automate creating pull requests (PR) for content updates and auto-merge them as long as all my checks pass.

{% embed "https://github.com/nickytonline/iamdeveloper.com/pull/61" %}

Having a PR brings all the things that were lacking:

1. Now there are deploy previews on Netlify

2. Branch protection is more rigid. I require checks to pass as well as a pull request.

3. If a build fails, I'll see it happen for a deploy preview instead of a build for production.

## Prepare your Repository for PR Automation

### General Repository Settings

To be able to auto-merge a branch, you need to modify some settings in your repository. Navigate to, e.g. https://github.com/nickytonline/iamdeveloper.com/settings, scroll to the bottom of the general settings and ensure that `Allow auto-merge` is checked.

![Allow auto-merge checked in a GitHub repository's general settings](https://www.iamdeveloper.com/images/posts/_uploads_articles_ydpifg55ey6b6rnvh1yc.png)

Optionally, what I did was auto-delete branches. If you want to do the same, ensure that `Automatically delete head branches` is checked.

![Automatically delete head branches checked in a GitHub repository's general settings](https://www.iamdeveloper.com/images/posts/_uploads_articles_5ybamm8gve0cl96p1l38.png)

### Configuring Branch Protection

This is not required for what I'm demonstrating, but I and many others in the industry highly recommend enabling branch protection in general for a repository.

For the auto-merge PR use case, we'll add the following branch protection for the `main` branch:

1. Require PRs for the main branch
2. Do not require PR approvals

![Pull request section of branch protection settings in a GitHub repository](https://www.iamdeveloper.com/images/posts/_uploads_articles_s8gl2yej8bmk1nu1jz6o.png)

3. Require checks to pass

![Required checks pane of branch protection settings in a GitHub repository](https://www.iamdeveloper.com/images/posts/_uploads_articles_d9xwgx9uatfq8psjcefy.png)

## Automating an Auto-Merge PR

I already had a GitHub action in place to update content. They run once a day. For example, here is how the update blog posts action looks like

```yaml
{% raw %}
name: Get latest blog posts
on:
  schedule:
    # Everyday at midnight UTC
    - cron: '0 0 * * *'
  workflow_dispatch:

jobs:
  update_profile_data:
    name: Get latest blog posts
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v3
        with:
          node-version: 16.17.1
      - name: Get blog posts
        env:
          DEV_API_KEY: ${{ secrets.DEV_API_KEY }}
        run: |
          npm install
          node --experimental-fetch bin/generateDevToPosts.js
          node bin/generateHashnodeUrlMapping.js
      - name: Commit changes
        id: commit
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: |
          git config user.name "GitHub Actions Bot"
          git config user.email "<>"
          git pull origin main
          git add .
          if [[ -n "$(git status --porcelain)" ]]; then
            git commit -m "chore (automated): update blog posts"
            git push origin main
          fi
{% endraw %}
```

The main things happening here are I'm getting the latest code from the `main` branch, and then I run

```bash
{% raw %}
npm install
node --experimental-fetch bin/generateDevToPosts.js
node bin/generateHashnodeUrlMapping.js
{% endraw %}
```

If you're wondering why I'm using `--experimental-fetch`, it's because I'm using [native fetch in Node.js 16](https://nodejs.org/fa/blog/release/v16.15.0/#add-fetch-api).

The scripts above generate changes if any. If there are changes, they're committed and merged into the main branch.

```bash
{% raw %}
git config user.name "GitHub Actions Bot"
git config user.email "<>"
git pull origin main
git add .
if [[ -n "$(git status --porcelain)" ]]; then
  git commit -m "chore (automated): update blog posts"
  git push origin main
fi
{% endraw %}
```

To use a PR instead, I went with the following, in this case, for updating blog posts.

```bash
{% raw %}
PR_TITLE="chore (automated): update blog posts"
BRANCH_NAME="chore_automated_update_blog_posts_$(date +%s)"

git branch $BRANCH_NAME
git switch $BRANCH_NAME

# There are potentially multiple files if the blog post has images.
git add .

# See if we have any changes. We should.
if [[ -n "$(git status --porcelain)" ]]; then
  echo "Creating PR \"$PR_TITLE\" for branch $BRANCH_NAME"
  git commit -m "$PR_TITLE"
  git push origin $BRANCH_NAME
  gh pr create --title "$PR_TITLE" --body "This is an automated PR to update blog posts"
  gh pr merge --auto --delete-branch --squash "$BRANCH_NAME"
else
  # Shouldn't end up here, but log that there was nothing to sync
  echo "Looks like there was nothing to update."
fi
{% endraw %}
```

So like before, the GitHub action has already gotten the latest code from the main branch, and we've run our Node.js scripts to get the latest blog posts.

Instead of committing straight to the main branch, we now create a PR via the [GitHub CLI](https://cli.github.com/).

```bash
{% raw %}
gh pr create --title "$PR_TITLE" --body "This is an automated PR to update blog posts"
{% endraw %}
```

Once the pull request is created, the following GitHub CLI command sets up the PR to auto-merge if all the checks pass.

```bash
{% raw %}
gh pr merge --auto --delete-branch --squash "$BRANCH_NAME"
{% endraw %}
```

## The Result

After publishing this post, I [ran the GitHub action](https://github.com/nickytonline/iamdeveloper.com/actions/runs/3402455746), and this is the PR it generated and auto-merged.

{% embed "https://github.com/nickytonline/iamdeveloper.com/pull/64" %}

And that's it. I love automated work, and GitHub Actions and the GitHub CLI facilitate this.

Photo by <a href="https://unsplash.com/@richygreat?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Richy Great</a> on <a href="https://unsplash.com/s/photos/github?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
