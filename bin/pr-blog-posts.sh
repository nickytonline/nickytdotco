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
