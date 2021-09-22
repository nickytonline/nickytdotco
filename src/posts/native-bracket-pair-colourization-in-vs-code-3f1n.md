---
stackbit_url_path: posts/native-bracket-pair-colourization-in-vs-code-3f1n
title: Native Bracket Pair Colourization in VS Code
date: '2021-09-04T20:08:55.335Z'
excerpt: >-
  Cross-posted from community.VSCodeTips.com  I’m a big fan of the Bracket Pair
  Colorizer extension,...
thumb_img_path: null
comments_count: 2
positive_reactions_count: 18
tags:
  - vscode
canonical_url: >-
  https://community.vscodetips.com/nickytonline/native-bracket-pair-colourization-in-vs-code-310a
template: post
---
Cross-posted from [community.VSCodeTips.com](https://community.vscodetips.com/nickytonline/native-bracket-pair-colourization-in-vs-code-310a)

I’m a big fan of the [Bracket Pair Colorizer](https://marketplace.visualstudio.com/items?itemName=CoenraadS.bracket-pair-colorizer) extension, but it looks like this is [native in VS Code now](https://code.visualstudio.com/updates/v1_60# _high-performance-bracket-pair-colorization) and much faster!


<iframe class="liquidTag" src="https://dev.to/embed/twitter?args=1434229375860240385" style="border: 0; width: 100%;"></iframe>


## Configure native bracket pair colourization

1. Make sure to remove the Bracket Pair Colorizer extension.
2. Update VS Code 
3. Open your user settings via <kbd>CMD</kbd>  (<kbd>CTRL</kbd> for non-Mac users) + <kbd>Shift</kbd>  + <kbd>P</kbd>  and type settings. The settings JSON file will open. Add the following:


```json
"editor.bracketPairColorization.enabled": true
```


All colors are themeable and up to six colors can be configured.

James Q. Quick has a video about getting this all set up


<iframe class="liquidTag" src="https://dev.to/embed/youtube?args=KZC2_OMaEpc" style="border: 0; width: 100%;"></iframe>


Happy VS Coding!

*[This post is also available on DEV.](https://dev.to/nickytonline/native-bracket-pair-colourization-in-vs-code-3f1n)*


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
