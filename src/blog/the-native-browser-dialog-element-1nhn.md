---json
{
  "title": "Unlocking the Power of HTML's Native Browser Dialog Element",
  "excerpt": "All the major browsers now support the &lt;dialog /&gt; element. Why add this HTML element? User land...",
  "date": "2024-01-23T15:32:20.475Z",
  "tags": [
    "html",
    "javascript",
    "beginners",
    "a11y"
  ],
  "cover_image": "https://www.nickyt.co/images/posts/_cdn-cgi_image_width=1000,height=420,fit=cover,gravity=auto,format=auto_https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2F1fy48qlmq4k5ls340il1.jpg",
  "canonical_url": "https://dev.to/opensauced/the-native-browser-dialog-element-1nhn",
  "reading_time_minutes": 3,
  "template": "post"
}
---

All the major browsers now support the `<dialog />` element. Why add this HTML element? User land code, code that developers write to fill in gaps of the browser, was doing similar things repeatedly, especially around focus trapping, and browser engines responded by adding this functionality directly in the browser.

## Focus Trapping

What is focus trapping? It's a feature where you do not want focus outside a specific element, and that element typically contains focusable elements.

For example, a form in a modal to confirm an action: As a user uses the keyboard to navigate, they go to the next focusable element, e.g. a button.

If they reach the last focusable element in the modal, without focus trapping, the focus would go to the next focusable element in the [document object model](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model) (DOM). With focus trapping, you go from the last focusable back to the first focusable element in the parent element.

In user land, popular packages like [focus-trap](https://www.npmjs.com/package/focus-trap) have enabled developers to incorporate focus trapping.

## &lt;dialog /&gt; for Modal Dialogs

With the dialog element, you get this for free, although there is a gotcha. If you add a dialog element to the page with the [open](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog#open) attribute set, the dialog element will become visible on the page; however, focus trapping will not work as you'd expect in a modal.

From the [API documentation](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog#open):

> Note: While you can toggle between the open and closed states of non-modal dialog boxes by toggling the presence of the open attribute, this approach is not recommended.

To get focus trapping working, the JavaScript API is required. You can display a modal on the screen by calling the [HTMLDialogElement showModal method](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/showModal).

_Note that you'll need to [view this CodePen in full view](https://codepen.io/nickytonline/full/NWJvbPe) because, [for some reason, modal dialog focus trapping does not work in the CodePen editor view](https://x.com/nickytonline/status/1749655288221782110)._

{% codepen "https://codepen.io/nickytonline/pen/NWJvbPe" %}

Not only do you get focus trapping, you also get modal close functionality that people have come to expect via the Escape key.

All of that is already amazing, but another common thing people were doing in user land was adding a background to block out users from interacting with the page. With the `<dialog />` element, we can add a `::backdrop` pseudo-element that does this for you. All you need to do is style it. In the CodePen above, uncomment out this code in the CSS panel to see this in action.

```css
{% raw %}
dialog::backdrop {
  background-color: purple;
  opacity: 0.55;
  filter: blur(100px);
}
{% endraw %}
```

## &lt;dialog /&gt; for Non-Modal Dialogs

The structure of a non-modal dialog element is the same as a modal dialog. The main difference is to show a non-modal dialog, you need to call the [HTMLDialogElement show method](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/show).

With a non-modal dialog, the user is not blocked from navigating the rest of the page, i.e. no focus trapping, and the Escape key will not automatically close the dialog.

{% codepen "https://codepen.io/nickytonline/pen/ExMvNJw" %}

## Closing a dialog

To close a dialog or modal, we can use the [HTMLDialogElement  close method](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/close).

```typescript
{% raw %}
const modal = document.querySelector("dialog");

// some button in the dialog that has a click event listener registered
modal.querySelector("button").addEventListener("click", () => {
  modal.close();
});
{% endraw %}
```

## Wrapping up

The web platform keeps getting better. It's great to see pain points in user land that had user solutions come natively to browser land.

## References

- [Using JavaScript to trap focus in an element](https://hidde.blog/using-javascript-to-trap-focus-in-an-element/)
- [MDN - &lt;dialog&gt;: The Dialog element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog)
- GitHub issue [<dialog> element should trap focus](https://github.com/w3c/html/issues/1514) from the _w3c/html_ repository.
- [Dialog - web.dev](https://web.dev/learn/html/dialog)

Stay saucy peeps!
