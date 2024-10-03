---json
{
  "title": "TypeScript and React: Enforcing Props for Accessibility",
  "excerpt": "Recently, I added a small accessibility win to our code base.                                  fix:...",
  "date": "2023-11-06T10:32:57.828Z",
  "tags": [
    "a11y",
    "typescript",
    "react",
    "webdev"
  ],
  "cover_image": "https://www.nickyt.co/images/posts/_dynamic_image_width=1000,height=420,fit=cover,gravity=auto,format=auto_https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Fwgr46tn6thqblgdxmbna.jpg",
  "canonical_url": "https://www.nickyt.co/blog/typescript-and-react-enforcing-props-for-accessibility-2h49/",
  "reading_time_minutes": 5,
  "template": "post"
}
---

Recently, I added a small accessibility win to our code base.

{% embed "https://github.com/open-sauced/app/pull/2035" %}

The nice thing about baking in accessibility wins into components is that it improves the accessibility of the application everywhere the component is used within the app.

The TLDR; is I added two mandatory props to our `<ToggleSwitch />` component to enforce a label for the component.  However, the challenge was that one of them had to be required, but not both.

## The Component before the change

The component before the change had a bunch of props, but there was no label associated with the [toggle button](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/button_role#toggle_buttons) which the `<ToggleComponent />` component generated.

```typescript
{% raw %}
interface ToggleSwitchProps {
  name: string;
  checked: boolean;
  handleToggle: () => void;
  size?: "sm" | "lg" | "base";
  classNames?: string;
}
{% endraw %}
```

Typically, a button will have text associated to it, but in this case, there was no text for the button which was causing the accessibility issue. When no text is present, you have a few options.

-  You can have text that is only visible to screen readers and other assistive technologies. To accomplish this you can create a CSS class, e.g. `sr-only` to move the text off the screen for sighted users, but since it's still visible in the document object model (DOM), assistive technologies can pick it up.

Note: [Tailwind](https://tailwindcss.com/) is pretty popular these days, so if you go with this option, you can use the [sr-only](https://tailwindcss.com/docs/screen-readers) CSS class that they provide out of the box.

- You can use the [aria-label attribute](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-label) to provide the necessary label text, e.g.

```html
{% raw %}
<button aria-label="Page Visibility" type="button" role="switch" aria-checked="false" data-state="unchecked" value="on" id="isPublic" aria-labelledby="make-public-explainer" class="flex rounded-2xl p-[2px] transition overflow-hidden bg-light-slate-8 w-10 h-5">
    <span data-state="unchecked" class="bg-white block rounded-2xl  h-full w-1/2"></span>
</button>
{% endraw %}
```
This will be used when the toggle button is announced for assistive technologies.

- You can use the [aria-labelledby attribute](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-labelledby) to provide the necessary label text. Typically it's linked to an element in the DOM that gives a description of what the element is used for.

```html
{% raw %}
<span id="make-public-explainer">Make this list publicly visible</span>

<!-- more markup... -->

<button type="button" role="switch" aria-checked="false" data-state="unchecked" value="on" id="isPublic" aria-labelledby="make-public-explainer" class="flex rounded-2xl p-[2px] transition overflow-hidden bg-light-slate-8 w-10 h-5">
    <span data-state="unchecked" class="bg-white block rounded-2xl  h-full w-1/2"></span>
</button>
{% endraw %}
```

This will be used when the toggle button is announced for assistive technologies as well. The main difference is the text contents of the element with the id `make-public-container` will be used instead.

In our case, I opted for the aria attributes represented by the `ariaLabel` and `ariaLabelledBy` props in the component.

## The TLDR;

If you want to get to the solution right away, take a peek at [these lines of code in the PR](https://github.com/open-sauced/app/pull/2035/files#diff-7ba8ff168f19cb385c73134b5856401c472fc7d00002d9ec00f6ef6166c24049R10).

## Attempt 1: Use a Discriminated Union Type

A [discriminated union type](https://www.typescriptlang.org/docs/handbook/unions-and-intersections.html#discriminating-unions) in TypeScript is a union type where one or more types differ on a particular property, e.g. `type`. 

So in our case, maybe a `labelType` where the values could be `aria-label` and `aria-labelledby`. Although this would work, it meant adding two props to set a label. One for the `labelType`, and another being the `label`. And to be honest, this didn't make sense for a couple of reasons. In the case of `aria-labelledby`, the `label` would be an ID for an element in the [Document Object Model](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Introduction) (DOM) vs. an actual label. Renaming this to `labelOrId` seemed clunky.

## Attempt 2: `ariaLabel` or `ariaLabelledBy` Props

This is really what I wanted. The component takes either the `ariaLabel` prop or the `ariaLabelledBy` prop.

I tried to keep things verbose to test the waters.

```typescript
{% raw %}
type ToggleSwitchProps =
  | {
      name: string;
      checked: boolean;
      handleToggle: () => void;
      size?: "sm" | "lg" | "base";
      classNames?: string;
      ariaLabel: string;
    }
  | {
      name: string;
      checked: boolean;
      handleToggle: () => void;
      size?: "sm" | "lg" | "base";
      classNames?: string;
      ariaLabelledBy: string;
    };
{% endraw %}
```

In my head, this looked good. Narrator: "It was not". From a quick glance, this might look good, but what this translates into is `ariaLabel` and `ariaLabelledBy` being both optional.

Take a peek at the [TypeScript Playground example](https://www.typescriptlang.org/play?#code/C4TwDgpgBAKg9gcwQGwgZQO4EtgGMAWACgE5xgDOUAvAFBRQA+UA3nfewHYCGAthAFxRywYlg4IA3G3ZQCEXAGsIAE0EAjOHFRcOUmfXw7lqeElSCAFAEpqAPigA3OFmV795LAC8IAfkEAich5-Rih-ZAQQpn81LnIIfzcZXGQ48gA5XghyPyERMUlpdi5RLgAZLjUIZEFhUXEkqABfNiZWfShuPlr8hqL6OUUVdU1tXX6oQw5jCFMUAShrO0dnVwmPb1zA4NDwyN3Y+MSJlLTMvhye+sKOkqxyyurUZQAhECuCxqapGlw4DmEUDApAogjmqEwOAIJDIlCoLAmXQW-n8ABoTvh5EpVFARABXCDojpTGbghZLKj2ZhNInuLzIw4JWnJVLkDJZcgBchwPgAWlObLREzuDyqNTCMHwWEo0qgXCgqTFQtupQqYuebwCLl5wDgvO5fOqED4HGA-hoLV+-25qAAdMosMQLMDYVYgA) demonstrating this.

Since this didn't work, I didn't bother refactoring, but it can be shortened to this.

```typescript
{% raw %}
type ToggleSwitchProps = {
  name: string;
  checked: boolean;
  handleToggle: () => void;
  size?: "sm" | "lg" | "base";
  classNames?: string;
} & ({ ariaLabel: string } | { ariaLabelledBy: string });
{% endraw %}
```


## Attempt 3: Hello `never` Type

I'm aware of the [never type](https://www.typescriptlang.org/docs/handbook/basic-types.html#never), but to the best of my knowledge, I've never used it explicitly. It's always been an inferred type for me, e.g. an error being thrown.

By assigning the `never` type to the prop that should not be included in each type of the union, I was able to enforce the exclusivity of the props. This meant that the component could only have either the `ariaLabelledBy`  prop or the `ariaLabel` prop, but not both.

```typescript
{% raw %}
type ToggleSwitchProps = {
  name: string;
  checked: boolean;
  handleToggle: () => void;
  size?: "sm" | "lg" | "base";
  classNames?: string;
} & ({ ariaLabel: string; ariaLabelledBy?: never } | { ariaLabelledBy: string; ariaLabel?: never });
{% endraw %}
```

And boom! I now had what I wanted. Check out the [TypeScript Playground example](https://www.typescriptlang.org/play?#code/C4TwDgpgBAKg9gcwQGwgZQO4EtgGMAWACgE5xgDOUAvFAN4BQUUAdgIYC2EAXFOcMVmYIA3IygEIuANYQAJjwBGcOKlbNRTfGtmp4SVDwAUASmoA+KADc4WWRt5YAXhAD8PAETl27qAB8o7sgIPv7uCqzkEO72uMgR5AByHBDkbrz8giL0AL5QAGRQhrRQrAKsADKsChDIPHwCQsIlZZXVyKiyAEIgacwQlhDEULn+xaVYFVU1Hd11GY3NE601vf2Dw8ai9AD021AA6ljt4nDsYHGC9LhwzHxQYKQUPHoo6Nh4RI+UNAxMfyzJDzuAA0Yn+Emkch4-AArhBQf9NNpdIhXkZTFQLLRsgjEeQnNwAuFIiCwX9YvEkpxyB5yKcIABaCnkcikxGLSZtDwwfBYSh8kpQOJtNmI8ac6ZyWYBWwM4BwBl0zgMmoQTjMYDuHL0HZ7fY3ADkwBOZwuzCuNzuDzI5EOwHwAEEWlNarBUahMDgCCQbdQ6GSmGxOEDceD8JIZPIoLD4QGoFpmDoIC8DIUMVicXH8c4PMSoqHyXEWVSUrT6Uyi6yC0xxctXe4eQKBawhS7SdkdbsDobjddTaxLtdbsbrRQ7Y7nW0ZiBnu63l7Pr6fnGg4T3KKwxGodHiHDq-Hkcm5+jzHRM+zs2u8xvC5TkjSAkrGcyq2Tay7px5ZfLFeXVerNRyIA) to see it in action.

![Code snippet showing the never type working](https://www.nickyt.co/images/posts/_uploads_articles_ruo4onzelne1wvjb00ev.png)

## Conclusion

The use of the `never` type solved the prop exclusivity issue and had a positive impact on the component’s accessibility. Now, the component requires a label, ensured by either the `ariaLabel` prop or the `areaLabelledBy` prop, enforcing accessibility.

Never say `never`. 😜

Photo by <a href="https://unsplash.com/@randyrizo?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Randy Rizo</a> on <a href="https://unsplash.com/photos/people-walking-on-sidewalk-during-night-time-j5uAgFCXvq0?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>
