---json
{
  "title": "You do not need to use the classnames package",
  "excerpt": "Do not get me wrong, the classnames package is really handy. It is also quite popular with just over...",
  "date": "2019-10-23T18:27:07.000Z",
  "tags": [
    "javascript",
    "react"
  ],
  "cover_image": "https://www.iamdeveloper.com/images/posts/_practicaldev_image_fetch_s--jCK8u0FL--_c_imagga_scale,f_auto,fl_progressive,h_420,q_auto,w_1000_https:__thepracticaldev.s3.amazonaws.com_i_vxmx385yqbvafn2si5f5.jpg",
  "canonicalUrl": "https://www.iamdeveloper.com/posts/you-do-no-need-to-use-the-classnames-package-1bb/",
  "reading_time_minutes": 2,
  "template": "post"
}
---

Do not get me wrong, the [classnames](https://www.npmjs.com/package/classnames) package is really handy. It is also quite popular with just over 3.5 million downloads per week as of the date of this blog post. Most React based projects I have worked on use it.

If you are not familiar with the `classnames` package, it allows you to build a set of CSS classes based on some conditionals. Straight from there documentation:

```javascript
{% raw %}
classNames('foo', 'bar'); // => 'foo bar'
classNames('foo', { bar: true }); // => 'foo bar'
classNames({ 'foo-bar': true }); // => 'foo-bar'
classNames({ 'foo-bar': false }); // => ''
classNames({ foo: true }, { bar: true }); // => 'foo bar'
classNames({ foo: true, bar: true }); // => 'foo bar'
{% endraw %}
```

Note: `true` and `false` are used to simplify the example, but normally these would be conditional variables, methods or functions.

Having said that, JavaScript has come a long way and there are features in the language that allow us to do pretty much the same thing, specifically [template strings](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals) or as it is also called, template literals.

If you are not familiar with template strings, you can build a string with variables mixed in. Let us look at the previous examples, but this time with template strings.

```javascript
{% raw %}
`foo bar` // => 'foo bar', not that exciting
`foo ${ true ? 'bar': '' }`; // => 'foo bar'
`${true ? 'foo-bar': '' }`; // => 'foo-bar'
`${ false ? 'foo-bar' : ''}` // => ''
`${ true? 'foo': '' }, { true ? 'bar': '' }`; // => 'foo bar'
`${ true ? 'foo' : ''} ${ true? 'bar' : '' }`; // => 'foo bar'
{% endraw %}
```

These are trivial examples, but it is just to show you that you can do pretty much the same thing with template literals. If you want to see this in action, here is an example from my site's source:

{% github "https://github.com/nickytonline/iamdeveloper.com" %}


```jsx
{% raw %}
...
<nav
   className={`navbar is-transparent ${styles.navbar}`}
   role="navigation"
   aria-label="main-navigation"
   data-cy="nav-bar"
>
...
{% endraw %}
```

[https://github.com/nickytonline/www.iamdeveloper.com/blob/master/src/components/Navbar.tsx#L51](https://github.com/nickytonline/www.iamdeveloper.com/blob/master/src/components/Navbar.tsx#L51)

This is not mind blowing code, but just another way to do it.

Happy coding!

Photo by [David Rotimi](https://unsplash.com/@davidrotimi?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/s/photos/different?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)
