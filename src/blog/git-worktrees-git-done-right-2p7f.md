---json
{
  "title": "Git Worktrees: Git Done Right",
  "excerpt": "I recently discovered Git worktrees, and they've completely changed how I work with Git. I'd heard...",
  "date": "2025-07-21T18:17:54Z",
  "tags": [
    "git",
    "productivity",
    "github"
  ],
  "cover_image": "https://www.nickyt.co/images/posts/_dynamic_image_width=1000,height=420,fit=cover,gravity=auto,format=auto_https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2F6c5lwmvy9p1enw57jyuj.jpg",
  "canonical_url": "https://www.nickyt.co/blog/git-worktrees-git-done-right-2p7f/",
  "reading_time_minutes": 4,
  "template": "post"
}
---

I recently discovered Git worktrees, and they've completely changed how I work with Git. I'd heard about them before but never really understood what they were or why I'd need them. Now? I've been using them every single day for the past couple of weeks, and they've become a key part of my workflow.

They're so good, that I shared it as a One Tip of the Week:

{% embed "https://one-tip-a-week.beehiiv.com/p/one-tip-a-week-git-worktrees" %}

Big thanks to bashbunni for introducing me to git worktrees through her excellent intro video:

{% embed "https://www.youtube.com/watch?v=8vsRb2mTBA8" %}

## What Are Git Worktrees?

Git worktrees let you check out multiple branches from the same repository simultaneously, each in its own working directory. Instead of constantly switching between branches with `git checkout`, you can have separate directories for different features, bug fixes, or experiments.

So, instead of having one workspace where you juggle multiple branches (and constantly use `git stash` to save your work), you get multiple workspaces. One for each branch you're actively working on.

Before worktrees, my typical workflow looked like this:

- Work on feature A
- Stash changes when I need to switch to fix a bug
- Checkout bug fix branch
- Fix bug, commit, push
- Switch back to feature A
- Pop stash and continue

With worktrees, I can have both branches available simultaneously. Bye bye stash.

## Git Aliases for Worktrees

The basic worktree commands aren't too complex. You can run something like `git worktree add -b my-branch ../my-branch`, but I'm lazy and wanted something even simpler. So I created some git aliases:

```bash
{% raw %}
# List worktrees
git wtl

# Add a worktree
git wta name-of-my-worktree

# Remove a worktree
git wtr name-of-my-worktree
{% endraw %}
```

Run these commands in your shell to add these git aliases:

```bash
{% raw %}
git config --global alias.wta '!f() { git worktree add -b "$1" "../$1"; }; f'
git config --global alias.wtr '!f() { git worktree remove "../$1"; }; f'
git config --global alias.wtl '!f() { git worktree list; }; f'
{% endraw %}
```

Less keystrokes, same git worktree goodness.

## Shell Alias for Checking Out Pull Requests

I'm a huge fan of the [GitHub CLI](https://cli.github.com/), especially for pull requests. I typically run `gh co 123` to pull down pull request 123. The CLI is so good.

Unfortunately, `gh co` doesn't support a `--worktree` flag at the moment, so I created a shell alias that combines the power of GitHub CLI with git worktrees:

```bash
{% raw %}
# cpr - create a git worktree for a pull request
# Usage: cpr <PR_NUMBER> [<REMOTE>]
# Example: cpr 1234 origin
# If no remote is specified, it defaults to 'origin'.
# Note: This command fetches the branch associated with the PR and creates a worktree in the current directory.
# The worktree will be named after the branch.
# Ensure you have the GitHub CLI installed and authenticated with `gh auth login`.
cpr() {
  pr="$1"
  remote="${2:-origin}"
  branch=$(gh pr view "$pr" --json headRefName -q .headRefName)
  git fetch "$remote" "$branch"
  git worktree add "../$branch" "$branch"
  cd "../$branch" || return
  echo "Switched to new worktree for PR #$pr: $branch"
}
{% endraw %}
```

Now I can run `cpr 123` and immediately have that pull request ready to review in its own dedicated workspace. No more switching contexts, no more losing my place.

Remember to start a new shell instance after adding this alias for it to take effect.

## Git Worktrees and VS Code

For VS Code, Cursor, Windsurf, or other VS Code forks, there's a handy [Git Worktree extension](https://marketplace.visualstudio.com/items?itemName=PhilStainer.git-worktree) that makes managing worktrees even easier.

![Command Palette open in VS Code showing available Git Worktree commands](https://www.nickyt.co/images/posts/_uploads_articles_wo6i424rp1opt2g8hwrg.png)

I use this extension primarily to list and switch between worktrees when I'm in VS Code. It makes switching git worktrees like switching projects, similar to another favourite VS Code extension, [Project Manager](https://marketplace.visualstudio.com/items?itemName=alefragnani.project-manager).

## Where Git Worktrees Really Come in Handy

Git worktrees are particularly useful when you:

- Work on multiple features simultaneously
- Need to quickly switch between reviewing PRs and active development
- Want to run comparisons between branches (side-by-side testing)
- Collaborate on projects where you frequently need to check others' work
- Deal with long-running branches that you don't want to lose context on

## The Bottom Line

Git worktrees have instantly become an integral part of my development workflow.

If you haven't tried git worktrees yet, I highly encourage you to give them a shot. Start with the basic commands, add the aliases I've shared, and see how they fit into your workflow. I have a feeling they'll become as essential to you as they have to me.

The combination of git worktrees, the GitHub CLI, and a few well-crafted aliases has supercharged my productivity. Give it a try. You won't regret it.

If you want to stay in touch, all my socials are on [nickyt.online](https://nickyt.online).

Photo by <a href="https://unsplash.com/@szmigieldesign?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Lukasz Szmigiel</a> on <a href="https://unsplash.com/photos/forest-trees-jFCViYFYcus?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>
