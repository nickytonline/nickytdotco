---
title: My Git Aliases
date: '2018-08-26T00:00:00.000Z'
excerpt: I’m going to provide my list of git aliases and explain what each alias does
thumb_img_path: >-
  https://res.cloudinary.com/practicaldev/image/fetch/s--Bsq7n131--/c_imagga_scale,f_auto,fl_progressive,h_420,q_auto,w_1000/https://thepracticaldev.s3.amazonaws.com/i/c31gesmnfndo89bh4673.jpg
comments_count: 28
positive_reactions_count: 185
tags:
  - git
  - productivity
  - developertools
canonical_url: 'https://www.iamdeveloper.com/blog/2018-08-25-my-git-aliases/'
template: post
---


Photo courtesy of Flickr user [cindy](https://www.flickr.com/photos/10433743@N06/35124387840/in/photolist-VvPEMN-JwSw3b-p73wLh-eiGWHv-pCT4Hm-e6YNg1-739KFW-ss4Yf-g1pYtw-5igZSR-dtNHYt-66LXG8-FVgnJe-a5N3Cr-boce82-G45Uh-4rZF7i-4fi2L4-WL8Tsp-bTY9DX-6uwDpe-291Xx9r-ooFeXR-dk27Hj-dMENeK-8Jm1oE-6Z7gbC-iZgy6m-a3GKzJ-qHiwTU-x2hdp-jGvoT9-d46TUW-88gpDX-8Jm2cu-NzVwP-aqGuxu-mTpiAH-7kzyHd-73T4C1-bFkSSv-zv4KM-79Cfjz-51Gumc-V78mt2-5vAwY-pWXK6q-8iXFxF-7i5PJA-w3Rw1s)

Alright, so @philnash [roped me into this one](https://dev.to/philnash/comment/518o). This keeps in line with my other posts that are “Not just a Gist”. If you want to read about those posts, check out these:


<iframe class="liquidTag" src="https://dev.to/embed/link?args=https%3A%2F%2Fdev.to%2Fnickytonline%2Fmy-mac-setup-2m05" style="border: 0; width: 100%;"></iframe>


<iframe class="liquidTag" src="https://dev.to/embed/link?args=https%3A%2F%2Fdev.to%2Fnickytonline%2Fmy-visual-studio-code-setup-2ima" style="border: 0; width: 100%;"></iframe>


This post’s birth comes from [a gist](https://gist.github.com/nickytonline/128d7d164d1eea5daba6753ed0829f41# file-gitconfig) which is essentially a copy paste of my git aliases.

I’m going to provide my list of git aliases and explain what each alias does, plain and simple. Let’s get started! 🏁 For those new to git aliases, please see the [defacto docs on aliases](https://git-scm.com/book/en/v2/Git-Basics-Git-Aliases).

Before we get started, why git aliases? Well for one thing, I don’t know about you, but some git commands are hard to remember and also, we’re programmers, which means we’re lazy by default to be efficient. 🐢 —\> 🐇

1. 
`alias.a add .`
 - Running 
`git add`
 will add all files that have changed as staged.

2. 
`alias.aliases config --get-regexp alias`
 - Running 
`git aliases`
 will show all the aliases you have configured globally in git.

3. 
`alias.bi bisect`
 - Running 
`git bi`
 will run git’s [bisect](https://git-scm.com/docs/git-bisect) to help you figure out which commit has a bug.

4. 
`alias.ci commit -m`
 - This will commit a file with the message you specify, e.g. 
`git ci "awesome commit!"`
.

5. 
`alias.co checkout`
 - This will checkout the branch you specify, e.g. 
`git co my-awesome-branch`


6. 
`alias.colast checkout -`
 - Running 
`git colast`
 will checkout the previous branch you were working in.

7. 
`alias.db branch -D`
 - This will delete the branch you specify, e.g. 
`git db my-not-so-awesome-branch`
. Note that this will only work if the branch you’re deleting is not the one you’re currently working in.

8. 
`alias.laf fsck --lost-found`
 - Running 
`git laf`
 will bring you to [git’s lost and found](https://git-scm.com/docs/git-lost-found). I’ll admit that I rarely use this, so perhaps it doesn’t warrant an alias and just some professional Googling.

9. 
`alias.last log -1 HEAD`
 - Running 
`git last`
 will show you what your last commit was.

10. 
`alias.nb checkout -b`
 - This will create a new branch, e.g. 
`git nb my-awesome-branch`
.

11. 
`alias.pror remote prune origin`
 - Running 
`git pror`
 will do some cleanup on the 
`origin`
 remote via [pruning](https://git-scm.com/docs/git-prune).

12. 
`alias.pr pull --rebase`
 - This will rebase your current branch with the branch specified, e.g. 
`git pr develop`
.

13. 
`alias.ra rebase --abort`
 - Running 
`git ra`
 will abort a [rebase](https://git-scm.com/docs/git-rebase). Run this when you’re like, my rebase is currently messed up. Get me outta here!

14. 
`alias.rc rebase --continue`
 - Running 
`git rc`
 will continue a [rebase](https://git-scm.com/docs/git-rebase). You typically run this when you’ve handled any conflicts in a rebase.

15. 
`alias.pf push --force-with-lease`
 - Running 
`git pf`
 forces a push, but it is a little less destructive than forcing a push. See here for more info on [—force-with-lease vs. —force](https://developer.atlassian.com/blog/2015/04/force-with-lease).

16. 
`alias.psu push --set-upstream`
 - Run this when you want to push a branch for the first time to the remote (typically 
`origin`
), e.g. 
`git psu origin my-awesome-branch`
.

17. 
`alias.remotes remote -v`
 - Running 
`git remotes`
 shows all the remotes currently configured for a repository.

18. 
`alias.renb branch -m`
 - When you want to rename a branch, run e.g. 
`git renb my-awesom-branch my-awesome-branch`
.

19. 
`alias.rhh reset --hard HEAD`
 - The nuclear option. Run 
`git rhh`
 to wipe out all your changes and start from the 
`HEAD`
.

20. 
`alias.rh reset --hard`
 - When you specify what to reset to, a hard reset is performed, e.g. 
`git rh HEAD~2`
.

21. 
`alias.s status -s`
 - Running 
`git s`
 will give you a more terse [status](https://git-scm.com/docs/git-status). Instead of this


```bash
On branch post/my-git-aliases
Your branch is up to date with 'origin/post/my-git-aliases'.

Changes not staged for commit:
 (use "git add <file>..." to update what will be committed)
 (use "git checkout -- <file>..." to discard changes in working directory)

       modified: src/pages/articles/2018-08-24-my-git-aliases/index.md

no changes added to commit (use "git add" and/or "git commit -a")
```


You get this


```bash
M src/pages/articles/2018-08-24-my-git-aliases/index.md
```


22. 
`alias.stashes stash list`
 - Running 
`git stashes`
 shows you all the stashes you have from [stashing](https://git-scm.com/book/en/v1/Git-Tools-Stashing). e.g.


```bash
stash@{0}: WIP on upgrade: bff6257 Destructuring OCD...
stash@{1}: WIP on upgrade: 3d73199 Fixed LiceCap link.
stash@{2}: WIP on upgrade: c2f78g6 Update default title.
```


23. 
`alias.unstash stash pop`
 - Running 
`git unstash`
 pops a stash off the list of saved stashes.

24. 
`alias.vc clean -dfx`
 - Running 
`git vc`
 cleans your git repository, so anything not in git is wiped, e.g. 
`node_modules`
, settings files which aren’t supposed to be in a repo etc. So BEWARE before you run this.

25. 
`alias.refactor commit -m 👷Refactor`
 - When running 
`git refactor`
, a generic refactor message is used for committing any staged files, i.e. 
`👷Refactor`
. I’ll probably improve on this to just allow a user to concatenate a custom message to it. But that’s for another day.

26. 
`alias.formatting commit -m 💅Formatting`
 - When running 
`git formatting`
, a generic formatting message is used for committing any staged files, i.e. 
`💅Formatting`
. I’ll probably improve on this to allow a user to concatenate a custom message to it. But that’s for another day.

27. 
`alias.comments commit -m 📒Comments`
 - When running 
`git comments`
, a generic comments message is used for committing any staged files, i.e. 
`📒Comments`
. I’ll probably improve on this to allow a user to concatenate a custom message to it. But that’s for another day.

28. 
`alias.tests commit -m ✅Tests`
 - When running 
`git tests`
, a generic tests message is used for committing any staged files, i.e. 
`✅Tests`
. I’ll probably improve on this to allow a user to concatenate a custom message to it. But that’s for another day.

29. 
`alias.prum pull --rebase upstream master`
 - Running 
`git prum`
 rebases your current branch off your upstream remote.

30. 
`alias.mend commit --amend`
 - Running 
`git mend`
 lets you amend a commit.

FIN

*[This post is also available on DEV.](https://dev.to/nickytonline/my-git-aliases-5dea)*


<script>
const parent = document.getElementsByTagName('head')[0];
const script = document.createElement('script');
script.type = 'text/javascript';
script.src = 'https://cdnjs.cloudflare.com/ajax/libs/iframe-resizer/4.1.1/iframeResizer.min.js';
script.charset = 'utf-8';
script.onload = function() {
    window.iFrameResize({}, '.liquidTag');
};
parent.appendChild(script);
</script>    
