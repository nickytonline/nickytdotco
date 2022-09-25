---json
{
  "title": "VS Code Tip of the Week: Keyboard Shortcuts for Moving Focus",
  "excerpt": "This week's tip of the week is all about configuring some shortcuts that allow you to move focus...",
  "date": "2022-03-23T03:20:47.656Z",
  "tags": [
    "vscode",
    "productivity",
    "vscodetips"
  ],
  "cover_image": "https://www.iamdeveloper.com/images/posts/_practicaldev_image_fetch_s--CyhoGbDV--_c_imagga_scale,f_auto,fl_progressive,h_420,q_auto,w_1000_https:__dev-to-uploads.s3.amazonaws.com_uploads_articles_vzafopvh6qln5xd8scag.png",
  "canonicalUrl": "https://www.iamdeveloper.com/vscodetips/2022/march-22nd-2022-vs-code-tip-of-the-week-3hio/",
  "reading_time_minutes": 1,
  "template": "post"
}
---

This week's tip of the week is all about configuring some shortcuts that allow you to move focus between the editor and the integrated terminal.

By default, <kbd>CTRL</kbd> + <kbd>`</kbd> toggles the integrated terminal. I use this all the time.

I struggled with moving back and forth between the terminal and the current tab in the editor. Toggling the terminal closes the terminal panel, and focus is brought back to the current tab in the editor, but what if you want to toggle between the two without closing the integrated terminal panel?

Thanks to [this post on Stackoverflow](https://stackoverflow.com/a/43012779/77814), I was well on my way to achieving this.

The only problem with this solution was it hijacked how the original intergrated terminal toggle worked with <kbd>CTRL</kbd> + <kbd>`</kbd>.

No problem, just add another keyboard shortcut! What I ended up with was the following for my keyboard shortcuts.

```javascript
{% raw %}
{
  ...
  // Toggle between terminal and editor focus
  { "key": "ctrl+`", "command": "workbench.action.terminal.focus" },
  {
    "key": "ctrl+`",
    "command": "workbench.action.focusActiveEditorGroup",
    "when": "terminalFocus"
  },
  // Toggle integrated terminal panel
  {
    "key": "ctrl+escape",
    "command": "workbench.action.terminal.toggleTerminal"
  }
}
{% endraw %}
```

So now, toggling between the editor and integrated terminal can be done using <kbd>CTRL</kbd> + <kbd>`</kbd> and if I want to close the integrated terminal panel, I use <kbd>CTRL</kbd> + <kbd>ESC</kbd>.

If you're new to modifying keyboard shortcuts, check out the [VS Code official documentation](https://code.visualstudio.com/docs/getstarted/keybindings).

Happy VS Coding!
