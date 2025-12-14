---json
{
  "title": "My Shell Aliases",
  "excerpt": "Everyone has their favourite aliases for git and the shell. I have written about my git aliases...",
  "date": "2019-10-11T01:45:17.000Z",
  "tags": [
    "zsh",
    "cli",
    "shell"
  ],
  "cover_image": "https://www.nickyt.co/images/posts/_dynamic_image_width=1000,height=420,fit=cover,gravity=auto,format=auto_https%3A%2F%2Fthepracticaldev.s3.amazonaws.com%2Fi%2F5vnflnscj2k2amsyzwkg.jpg",
  "canonical_url": "https://www.nickyt.co/blog/my-shell-aliases-1obk/",
  "reading_time_minutes": 1,
  "template": "post"
}
---

Everyone has their favourite aliases for git and the shell. I have written about my git aliases before but not my shell aliases.

{% link "https://dev.to/nickytonline/my-git-aliases-5dea" %}

It is not a long list, but I have some that I find useful that you may find useful as well. Currently, my preferred shell is zsh. Here is what I currently have in my config.

```bash
{% raw %}
alias rimraf='rm -rf'
alias flushdns='sudo killall -HUP mDNSResponder'
alias zshconfig='vi ~/.zshrc'
alias nr='npm run'
alias ni='npm i'
alias y='yarn'
alias story='yarn storybook'
alias code='code-insiders'
alias tw='yarn test:watch'
alias '$'=''
alias zshconfig='vi ~/.zshrc'
{% endraw %}
```

What's in your shell aliases?

Photo by [Krzysztof Niewolny](https://unsplash.com/@epan5?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/s/photos/shell?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)
