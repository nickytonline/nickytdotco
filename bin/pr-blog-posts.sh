#!/usr/bin/env bash

set -euo pipefail

export PR_TITLE="chore (automated): update blog posts"

# Find an open PR with the exact title so repeated scheduled runs update the
# same branch instead of creating a queue of automated PRs.
EXISTING_PR_NUMBER=$(gh pr list \
  --state open \
  --limit 100 \
  --json number,title \
  --jq '[.[] | select(.title == env.PR_TITLE) | .number] | first // empty')

if [[ -n "$EXISTING_PR_NUMBER" ]]; then
  echo "Updating existing PR #$EXISTING_PR_NUMBER"

  gh pr checkout "$EXISTING_PR_NUMBER"
  BRANCH_NAME=$(git branch --show-current)

  echo "Merging origin/main into $BRANCH_NAME"
  # GitHub Actions checks out a shallow repository. Fetch the full history so
  # the PR branch and main have a common ancestor for the merge.
  if [[ "$(git rev-parse --is-shallow-repository)" == "true" ]]; then
    git fetch --unshallow origin
  fi
  git fetch origin main
  git merge origin/main --no-edit
else
  BRANCH_NAME="chore_automated_update_blog_posts_$(date +%s)"

  echo "Creating branch $BRANCH_NAME"
  git switch -c "$BRANCH_NAME"
fi

echo "Generating blog posts"
vp run generate:posts
vp run format

# There are potentially multiple files if the blog post has images.
git add .

# Commit generated changes when there are any. An existing PR may also have
# received a merge commit above, which should still be pushed below.
if [[ -n "$(git diff --cached --name-only)" ]]; then
  echo "Committing generated changes for $BRANCH_NAME"
  git commit -m "$PR_TITLE"
else
  echo "Looks like there were no generated changes."
fi

# Push and verify it succeeded.
if ! git push origin "$BRANCH_NAME"; then
  echo "Failed to push branch"
  exit 1
fi

if [[ -z "$EXISTING_PR_NUMBER" ]]; then
  echo "Creating PR \"$PR_TITLE\" for branch $BRANCH_NAME"
  # Use --head flag to explicitly specify the branch
  gh pr create --head "$BRANCH_NAME" --title "$PR_TITLE" --body "This is an automated PR to update blog posts"
  gh pr merge --auto --delete-branch --squash "$BRANCH_NAME"
else
  echo "Updated existing PR #$EXISTING_PR_NUMBER"
fi
