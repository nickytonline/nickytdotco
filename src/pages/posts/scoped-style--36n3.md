---
stackbit_url_path: posts/scoped-style--36n3
title: 'scoped-style '
date: '2018-12-30T23:12:39.460Z'
excerpt: a tiny CSS in JS library
thumb_img_path: null
comments_count: 10
positive_reactions_count: 17
tags:
  - javascript
  - githunt
  - css
  - cssinjs
canonical_url: 'https://www.iamdeveloper.com/posts/scoped-style--36n3/'
template: post
---



<iframe class="liquidTag" src="https://dev.to/embed/github?args=https%3A%2F%2Fgithub.com%2Fsadick254%2Fscoped-style" style="border: 0; width: 100%;"></iframe>


A new kid on the CSS in JS block.

Plays nicely with Preact, React, Hyperapp and InfernoJS.

An example from the readme for React:


```
import React from "react"
import scoped from "scoped-style"

const styled = scoped(React.createElement)


// define global css
styled.global`

  * {
    margin: 0;
  }

  html,
  body {
    width: 100%;
    height: 100%;
  }

`;

// and scoped css
const Button = styled("button")`

  background: ${props => props.primary ? "orange": "gray"};
  border: none;
  border-radius: 2px;
  :hover {
    padding: 10px;
  }

`

const App = () => (
  <div>
    <Button primary>Login</Button>
  </div>
)

// Your rendering code

```


*[This post is also available on DEV.](https://dev.to/nickytonline/scoped-style--36n3)*


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
