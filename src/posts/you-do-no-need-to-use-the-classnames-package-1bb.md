---
stackbit_url_path: posts/you-do-no-need-to-use-the-classnames-package-1bb
title: You do not need to use the classnames package
date: '2019-10-23T18:27:07.000Z'
excerpt: >-
  Photo by David Rotimi on Unsplash  Do not get me wrong, the classnames package
  is really handy. It is...
thumb_img_path: >-
  https://res.cloudinary.com/practicaldev/image/fetch/s--jCK8u0FL--/c_imagga_scale,f_auto,fl_progressive,h_420,q_auto,w_1000/https://thepracticaldev.s3.amazonaws.com/i/vxmx385yqbvafn2si5f5.jpg
comments_count: 6
positive_reactions_count: 31
tags:
  - javascript
  - react
canonical_url: >-
  https://www.iamdeveloper.com/posts/you-do-no-need-to-use-the-classnames-package-1bb/
template: post
---


Photo by [David Rotimi](https://unsplash.com/@davidrotimi?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/s/photos/different?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)

Do not get me wrong, the [classnames](https://www.npmjs.com/package/classnames) package is really handy. It is also quite popular with just over 3.5 million downloads per week as of the date of this blog post. Most React based projects I have worked on use it.

If you are not familiar with the 
`classnames`
 package, it allows you to build a set of CSS classes based on some conditionals. Straight from there documentation:


```javascript
classNames('foo', 'bar'); // => 'foo bar'
classNames('foo', { bar: true }); // => 'foo bar'
classNames({ 'foo-bar': true }); // => 'foo-bar'
classNames({ 'foo-bar': false }); // => ''
classNames({ foo: true }, { bar: true }); // => 'foo bar'
classNames({ foo: true, bar: true }); // => 'foo bar'
```


Note: 
`true`
 and 
`false`
 are used to simplify the example, but normally these would be conditional variables, methods or functions.

Having said that, JavaScript has come a long way and there are features in the language that allow us to do pretty much the same thing, specifically [template strings](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals) or as it is also called, template literals.

If you are not familiar with template strings, you can build a string with variables mixed in. Let us look at the previous examples, but this time with template strings.


```javascript
`
foo bar
` // => 'foo bar', not that exciting
`
foo ${ true ? 'bar': '' }
`; // => 'foo bar'
`
${true ? 'foo-bar': '' }
`; // => 'foo-bar'
`
${ false ? 'foo-bar' : ''}
` // => ''
`
${ true? 'foo': '' }, { true ? 'bar': '' }
`; // => 'foo bar'
`
${ true ? 'foo' : ''} ${ true? 'bar' : '' }
`; // => 'foo bar'
```


These are trivial examples, but it is just to show you that you can do pretty much the same thing with template literals. If you want to see this in action, here is an example from my site's source:


<iframe class="liquidTag" src="https://dev.to/embed/github?args=https%3A%2F%2Fgithub.com%2Fnickytonline%2Fwww.iamdeveloper.com" style="border: 0; width: 100%;"></iframe>




```jsx
...
<nav
   className={`
navbar is-transparent ${styles.navbar}
`}
   role="navigation"
   aria-label="main-navigation"
   data-cy="nav-bar"
>
...
```


[https://github.com/nickytonline/www.iamdeveloper.com/blob/master/src/components/Navbar.tsx# L51](https://github.com/nickytonline/www.iamdeveloper.com/blob/master/src/components/Navbar.tsx# L51)

This is not mind blowing code, but just another way to do it.

Happy coding!

*[This post is also available on DEV.](https://dev.to/nickytonline/you-do-no-need-to-use-the-classnames-package-1bb)*


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
