---json
{
  "title": "Native Bracket Pair Colourization in VS Code",
  "excerpt": "Cross-posted from community.VSCodeTips.com  I’m a big fan of the Bracket Pair Colorizer extension,...",
  "date": "2021-09-04T20:08:55.335Z",
  "tags": [
    "vscode"
  ],
  "cover_image": null,
  "template": "post"
}
---
Cross-posted from [community.VSCodeTips.com](https://community.vscodetips.com/nickytonline/native-bracket-pair-colourization-in-vs-code-310a)

I’m a big fan of the [Bracket Pair Colorizer](https://marketplace.visualstudio.com/items?itemName=CoenraadS.bracket-pair-colorizer) extension, but it looks like this is [native in VS Code now](https://code.visualstudio.com/updates/v1_60#_high-performance-bracket-pair-colorization) and much faster!

{% twitter "1434229375860240385" %}

## Configure native bracket pair colourization

1. Make sure to remove the Bracket Pair Colorizer extension.
2. Update VS Code 
3. Open your user settings via <kbd>CMD</kbd>  (<kbd>CTRL</kbd> for non-Mac users) + <kbd>Shift</kbd>  + <kbd>P</kbd>  and type settings. The settings JSON file will open. Add the following:

```json
{% raw %}
"editor.bracketPairColorization.enabled": true
{% endraw %}
```

All colors are themeable and up to six colors can be configured.

James Q. Quick has a video about getting this all set up

{% youtube "KZC2_OMaEpc" %}

More tips at [https://vscodetips.com](vscodetips.com)!

Happy VS Coding!
