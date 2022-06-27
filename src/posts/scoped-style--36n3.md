---json
{
  "title": "scoped-style",
  "excerpt": "a tiny CSS in JS library",
  "date": "2018-12-30T23:12:39.460Z",
  "tags": [
    "javascript",
    "css",
    "cssinjs"
  ],
  "cover_image": null,
  "canonicalUrl": "https://www.iamdeveloper.com/posts/scoped-style--36n3/",
  "reading_time_minutes": 1,
  "template": "post"
}
---

{% github "https://github.com/sadick254/scoped-style" %}

A new kid on the CSS in JS block.

Plays nicely with Preact, React, Hyperapp and InfernoJS.

An example from the readme for React:

```
{% raw %}
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

{% endraw %}
```
