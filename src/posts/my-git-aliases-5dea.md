---json
{
  "title": "My Git Aliases",
  "excerpt": "I’m going to provide my list of git aliases and explain what each alias does",
  "date": "2018-08-26T00:00:00.000Z",
  "tags": [
    "git",
    "productivity",
    "developertools"
  ],
  "cover_image": "https://www.iamdeveloper.com/images/posts/_practicaldev_image_fetch_s--Bsq7n131--_c_imagga_scale,f_auto,fl_progressive,h_420,q_auto,w_1000_https:__thepracticaldev.s3.amazonaws.com_i_c31gesmnfndo89bh4673.jpg",
  "canonicalUrl": "https://www.iamdeveloper.com/posts/my-git-aliases-5dea/",
  "reading_time_minutes": 4,
  "template": "post"
}
---

Alright, so @philnash [roped me into this one](https://dev.to/philnash/comment/518o).

This post’s birth comes from [a gist](https://gist.github.com/nickytonline/128d7d164d1eea5daba6753ed0829f41#file-gitconfig) which is essentially a copy paste of my git aliases.

I’m going to provide my list of git aliases and explain what each alias does, plain and simple. Let’s get started! 🏁 For those new to git aliases, please see the [defacto docs on aliases](https://git-scm.com/book/en/v2/Git-Basics-Git-Aliases). In a nutshell though, to create your own aliases, use the following git command.

```bash
{% raw %}
git config --global alias.somealias some-git-command
{% endraw %}
```

Before we get started, why git aliases? Well for one thing, I don’t know about you, but some git commands are hard to remember and also, we’re programmers, which means we’re lazy by default to be efficient. 🐢 —\> 🐇

- `a = add .` — Running `git add` will add all files that have changed as staged.
- `b = branch` — Lists all branches for your repository on your local machine.
- `bi = bisect` — Running `git bi` will run git’s [bisect](https://git-scm.com/docs/git-bisect) to help you figure out which commit has a bug.
- `ci = commit -m` — This will commit a file with the message you specify, e.g. `git ci "awesome commit!"`.
- `co = checkout` — This will checkout the branch you specify, e.g. `git co my-awesome-branch`
- `colast = checkout -` — Running `git colast` will checkout the previous branch you were working in.
- `db = branch -D` — This will delete the branch you specify, e.g. `git db my-not-so-awesome-branch`. Note that this will only work if the branch you’re deleting is not the one you’re currently working in.
- `laf = fsck --lost-found` — Running `git laf` will bring you to [git’s lost and found](https://git-scm.com/docs/git-lost-found). I’ll admit that I rarely use this, so perhaps it doesn’t warrant an alias and just some professional Googling.
- `last = log -1 HEAD` — Running `git last` will show you what your last commit was.
- `lc = diff HEAD^ HEAD` - Compares the head of your branch to the previous commit.
- `pf = push --force-with-lease` — Running `git pf` forces a push, but it is a little less destructive than forcing a push. See here for more info on [—force-with-lease vs. —force](https://developer.atlassian.com/blog/2015/04/force-with-lease).
- `psu = push --set-upstream` — Run this when you want to push a branch for the first time to the remote (typically `origin`), e.g. `git psu origin my-awesome-branch`.
- `pr = pull --rebase` — This will rebase your current branch with the branch specified, e.g. `git pr develop`.
- `ra = rebase --abort` — Running `git ra` will abort a [rebase](https://git-scm.com/docs/git-rebase). Run this when you’re like, my rebase is currently messed up. Get me outta here!
- `rc = rebase --continue` — Running `git rc` will continue a [rebase](https://git-scm.com/docs/git-rebase). You typically run this when you’ve handled any conflicts in a rebase.
- `remotes = remote -v` — Running `git remotes` shows all the remotes currently configured for a repository.
- `renb = branch -m` — When you want to rename a branch, run e.g. `git renb my-awesom-branch my-awesome-branch`.
- `rhh = reset --hard HEAD` — The nuclear option. Run `git rhh` to wipe out all your changes and start from the `HEAD`.
- `rh = reset --hard` — When you specify what to reset to, a hard reset is performed, e.g. `git rh HEAD~2`.
- `sfc = diff-tree --no-commit-id --name-only -r` — Shows files (relative file paths) for a specific commit, e.g.

```bash
{% raw %}
❯ git sfc HEAD                                
src/posts/any-contribution-to-open-source-is-valuable-57d3.md
src/posts/april-16th-2021-what-did-you-learn-this-week-3e72.md
src/posts/are-there-plans-for-reviewers-of-articles-we-post--42nf.md
{% endraw %}
```
 
- `s = status -s` — Running `git s` will give you a more terse [status](https://git-scm.com/docs/git-status). Instead of this

```bash
{% raw %}
On branch post/my-git-aliases
Your branch is up to date with 'origin/post/my-git-aliases'.

Changes not staged for commit:
 (use "git add <file>..." to update what will be committed)
 (use "git checkout -- <file>..." to discard changes in working directory)

       modified: src/pages/articles/2018-08-24-my-git-aliases/index.md

no changes added to commit (use "git add" and/or "git commit -a")
{% endraw %}
```

You get this

```bash
{% raw %}
M src/pages/articles/2018-08-24-my-git-aliases/index.md
{% endraw %}
```
- `stashes = stash list` — Running `git stashes` shows you all the stashes you have from [stashing](https://git-scm.com/book/en/v1/Git-Tools-Stashing). e.g.

```bash
{% raw %}
stash@{0}: WIP on upgrade: bff6257 Destructuring OCD...
stash@{1}: WIP on upgrade: 3d73199 Fixed LiceCap link.
stash@{2}: WIP on upgrade: c2f78g6 Update default title.
{% endraw %}
```
- `unstash = stash pop` — Running `git unstash` pops a stash off the list of saved stashes.
- `vc = clean -dfx` — Running `git vc` cleans your git repository, so anything not in git is wiped, e.g. `node_modules`, settings files which aren’t supposed to be in a repo etc. So BEWARE before you run this.
- `mend = commit --amend` — Running `git mend` lets you amend a commit.
- `trigger = commit --allow-empty -m "Trigger Build"` — Creates an empty commit. This is handy when you need to restart a build remotely in your CI/CD pipeline without committing changes.
- `alias = ! git config --get-regexp ^alias\. | sed -e s/^alias\.// -e s/\ /\ =\ /` — Running `git aliases` will show all the aliases you have configured globally in git.

Although it's not Git aliases, I also highly recommend using the [GitHub CLI](https://cli.github.com).

Photo courtesy of Flickr user [cindy](https://www.flickr.com/photos/10433743@N06/35124387840/in/photolist-VvPEMN-JwSw3b-p73wLh-eiGWHv-pCT4Hm-e6YNg1-739KFW-ss4Yf-g1pYtw-5igZSR-dtNHYt-66LXG8-FVgnJe-a5N3Cr-boce82-G45Uh-4rZF7i-4fi2L4-WL8Tsp-bTY9DX-6uwDpe-291Xx9r-ooFeXR-dk27Hj-dMENeK-8Jm1oE-6Z7gbC-iZgy6m-a3GKzJ-qHiwTU-x2hdp-jGvoT9-d46TUW-88gpDX-8Jm2cu-NzVwP-aqGuxu-mTpiAH-7kzyHd-73T4C1-bFkSSv-zv4KM-79Cfjz-51Gumc-V78mt2-5vAwY-pWXK6q-8iXFxF-7i5PJA-w3Rw1s)
