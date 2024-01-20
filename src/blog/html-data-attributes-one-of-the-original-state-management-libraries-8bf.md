---json
{
  "title": "HTML Data Attributes: One of the Original State Management Libraries",
  "excerpt": "I was streaming recently and discussed how I implemented part of a graph I was building out.      The...",
  "date": "2023-11-30T04:43:12.514Z",
  "tags": [
    "html",
    "javascript",
    "webdev"
  ],
  "cover_image": "https://www.nickyt.co/images/posts/_cdn-cgi_image_width=1000,height=420,fit=cover,gravity=auto,format=auto_https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Ft75ycfq41xj3y82ihzjs.png",
  "canonical_url": "https://www.nickyt.co/blog/html-data-attributes-one-of-the-original-state-management-libraries-8bf/",
  "reading_time_minutes": 3,
  "template": "post"
}
---

I was [streaming recently](https://nickyt.live) and discussed how I implemented part of a graph I was building out.

{% embed "https://www.youtube.com/watch?v=eSpkar-hNzU" %}

The graph is interactive, where you can navigate with the keyboard or hover over parts of the graph and a list item is bolded.

![A graph component showing the most used programming languages with a horizontal bar that has different colours whose widths are the percentage of each most used language. As items are hovered or given focus with the keyboard, the associate language text and percentage is bolded.](https://www.nickyt.co/images/posts/_uploads_articles_d438ysat5nngz1efqije.gif)

Here's the pull request.

{% embed "https://github.com/open-sauced/app/pull/2158" %}

So what's this have to do with [HTML data attributes](https://developer.mozilla.org/en-US/docs/Learn/HTML/Howto/Use_data_attributes)? Well, before we get into that, what is an HTML data attribute? And what is an HTML attribute?

HTML elements have a predefined set of attributes that are valid attributes. You are probably familiar with a lot of them.

For example, a text input, is an input HTML element that has a `type` equal to `text`. `type` is an attribute.

Another one you are likely familiar with is `class`. This is the attribute you use to add one or more CSS classes to an HTML tag.

```html
{% raw %}
<a href="/awesome-product" class="funky-link">Awesome Product</a>
{% endraw %}
```

_Note: If you've worked mainly with [React](https://react.dev/), the `className` prop on a component generates an HTML `class` attribute when your component renders._

You can create non-standard attributes, like `item` or `productId` that will work, but if you want to access them, you would have to access them via the attribute getter, e.g.

```javascript
{% raw %}
// Get the awesome product HTML element.
const someElement = document.querySelector('#awesome-product');

// get attribute returns the value or if there is none, it returns null
const productId = someElement.getAttribute('productId');
{% endraw %}
```

If you have a lot of these bespoke attributes, you'll always have to use `.getAttribute()`.

Insert "There must be a better way" GIF here. 🤣

There is a better standard way to go about this, data attributes. Data attributes are a standard part of HTML. All you need to do is have them begin with `data-` and if the rest of the attribute is more than one word, separate them with hyphens.

For example, our `productId` would now become `data-product-id`. That looks like many extra characters, and we're still using `.getAttribute`.

Although, `.getAttribute` works, it's not necessary. HTML elements, when accessed via JavaScript, have a special property called, [dataset](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dataset). The dataset property contains all the `data-*` attributes.

So for example, if I wanted to get the value of the `data-product-id` attribute, I can do the following:

```javascript
{% raw %}
// Get the awesome product HTML element.
const someElement = document.querySelector('#awesome-product');

const productId = someElement.dataset.productId
{% endraw %}
```

So a few things are happening under the hood. All the data attributes when accessed via the `dataset` property no longer have `data-` in their names, and when the attribute has more than one word in it like `data-product-id`, it gets converted to camel case, `productId`.

The real power of this is if there are several of these attributes on an element, they're all available under the `dataset` property.

As mentioned at the beginning, I'm currently using a data attribute in the graph I made, but if you happen to be reading this on [dev.to](https://dev.to), they leverage data attributes quite a bit.

DEV is a [Rails](https://rubyonrails.org/) monolith, which uses [Preact](https://preactjs.com/) in the front-end using [islands architecture](https://www.patterns.dev/vanilla/islands-architecture). The reason why I mention all this is that it's not a full-stack JavaScript application, and there is no state management library like [Redux](https://redux.js.org/) or [Zustand](https://github.com/pmndrs/zustand) in use. The data store, for the most part on the front end, is all data attributes.

If you use the browser tools to inspect the home page of DEV, you'll see that the `body` HTML element is jam packed with data attributes.

![some of the markup from the dev.to homepage showing data attributes in use on DEV](https://www.nickyt.co/images/posts/_uploads_articles_3z5fetfxrdl8awwrp8jk.png)

State management libraries are definitely useful in certain contexts, but sometimes leveraging what the platform gives you, like data attributes, can be beneficial for your use case.

`<p data-bye="That's all folks">Later</p>`
