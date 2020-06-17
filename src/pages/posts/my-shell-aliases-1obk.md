---
title: My Shell Aliases
date: '2019-10-11T01:45:17.000Z'
excerpt: >-
  Photo by Krzysztof Niewolny on Unsplash  Everyone has their favourite aliases
  for git and the shell....
thumb_img_path: >-
  https://res.cloudinary.com/practicaldev/image/fetch/s--LxZFwaP4--/c_imagga_scale,f_auto,fl_progressive,h_420,q_auto,w_1000/https://thepracticaldev.s3.amazonaws.com/i/5vnflnscj2k2amsyzwkg.jpg
comments_count: 18
positive_reactions_count: 102
tags:
  - zsh
  - cli
  - shell
canonical_url: 'https://www.iamdeveloper.com/blog/2019-10-10-my-shell-aliases/'
template: post
---


Photo by [Krzysztof Niewolny](https://unsplash.com/@epan5?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/s/photos/shell?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)

Everyone has their favourite aliases for git and the shell. I have written about my git aliases before but not my shell aliases.


<iframe class="liquidTag" src="https://dev.to/embed/link?args=https%3A%2F%2Fdev.to%2Fnickytonline%2Fmy-git-aliases-5dea" style="border: 0; width: 100%;"></iframe>


It is not a long list, but I have some that I find useful that you may find useful as well. Currently, my preferred shell is zsh. Here is what I currently have in my config.


```
alias zshconfig='vi $HOME/.zshrc'
alias rimraf='rm -rf'
alias flushdns='sudo killall -HUP mDNSResponder'
alias y='yarn' # I am lazy, one character FTW. YOLO
alias ni='npm install'
alias nr='npm run'
alias g='git'
alias code='code-insiders'

alias edge='/Applications/Microsoft\ Edge\ Beta.app/Contents/MacOS/Microsoft\ Edge\ Beta --remote-debugging-port=2015'
alias chrome='/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --remote-debugging-port=9222'i

crat() {
        npx create-react-app $1 --typescript
}
```


The 
`edge`
 and 
`chrome`
 aliases are useful to me because I like to use VS Code when debugging. Having the browsers start up with remote debugging makes that process easier.

What's in your shell aliases?

*[This post is also available on DEV.](https://dev.to/nickytonline/my-shell-aliases-1obk)*


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
