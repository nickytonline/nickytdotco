---
stackbit_url_path: posts/renaming-a-file-via-git-after-it-has-been-deleted-in-a-pr-41dn
title: Git file renaming issues (deleting/adding instead of renaming)
date: '2019-02-07T03:10:19.770Z'
excerpt: >-
  Photo by Markus Spiske on Unsplash  Hey folks, I need a little help as I've
  kind of reached the...
thumb_img_path: >-
  https://res.cloudinary.com/practicaldev/image/fetch/s--vasWZK4---/c_imagga_scale,f_auto,fl_progressive,h_420,q_auto,w_1000/https://thepracticaldev.s3.amazonaws.com/i/cu5csch4pwfki2r0yfac.jpg
comments_count: 14
positive_reactions_count: 13
tags:
  - help
  - git
  - github
canonical_url: >-
  https://www.iamdeveloper.com/posts/renaming-a-file-via-git-after-it-has-been-deleted-in-a-pr-41dn/
template: post
---


Photo by [Markus Spiske](https://unsplash.com/photos/xekxE_VR0Ec?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/search/photos/source-control?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)

Hey folks, I need a little help as I've kind of reached the extend of my gitfu.

I'm [working on a PR](https://github.com/sindresorhus/refined-github/pull/1750# issuecomment-460886960) and I didn't realise at the time, but some files were committed as a deleted file (the original file) and a new file (the rename of the old file) when I renamed some of them. I was asked to ensure it's renamed in Git so as to preserve the history. Fair enough.

So if you look at the comments in the PR (I link to the first one about renaming in there), you'll see that I've done the following in a few different was but here is the gist of it:

- Recovered the deleted file, 
`source/libs/icons.js`

- Deleted the new file, 
`source/libs/icons.tsx`

- Commit those changes
- Run a 
`git mv source/libs/icons.js source/libs/icons.tsx`

- Push to the remote, and the PR shows it as a file rename with no file changes.
- The next commit is putting back the changes I had in 
`source/libs/icons.tsx`
.
- Push to the remote, and the PR shows that 
`source/libs/icons.js`
 has been deleted and 
`source/libs/icons.tsx`
 has been added.

I've even had one of the maintainers of the repo try to give me a hand, but he ends up in the same predicament as I do.

Any suggestions gitfolk?

*[This post is also available on DEV.](https://dev.to/nickytonline/renaming-a-file-via-git-after-it-has-been-deleted-in-a-pr-41dn)*


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
