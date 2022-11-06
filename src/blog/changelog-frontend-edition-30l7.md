---json
{
  "title": "Changelog: Frontend Edition",
  "excerpt": "I Tweeted this out last week that we moved to Preact X and Testing Library.                         ...",
  "date": "2020-06-24T19:09:12.079Z",
  "tags": [
    "changelog",
    "javascript",
    "testing"
  ],
  "cover_image": "https://www.iamdeveloper.com/images/posts/_practicaldev_image_fetch_s--RbUzG7vH--_c_imagga_scale,f_auto,fl_progressive,h_420,q_auto,w_1000_https:__dev-to-uploads.s3.amazonaws.com_i_taavig1ker0pmxi35grk.png",
  "canonicalUrl": "https://www.iamdeveloper.com/posts/changelog-frontend-edition-30l7/",
  "reading_time_minutes": 5,
  "template": "post"
}
---

I Tweeted this out last week that we moved to Preact X and Testing Library.

{% twitter "1273706469096140802" %}

Let’s dig in to all the improvements we’ve been making in the frontend.

## Preact X

DEV is now running Preact X (currently 10.4.4 at the time of writing this post). I followed the [official Preact X upgrade guide](https://preactjs.com/guide/v10/upgrade-guide/) to move us from 8.5.2 to 10.4.4. So, what does the new version of Preact give us as developers? You can read about all the new things in the [What’s new in Preact X
](https://preactjs.com/guide/v10/whats-new/) post on the Preact site. In a nutshell, a lot of the functionality that was previously only available in React is now available in Preact as well—hooks, fragments, context, `componentDidCatch` to name a few.

## Testing Library
DEV has moved away from [preact-render-spy](https://github.com/mzgoddard/preact-render-spy) and [preact-render-to-json](https://github.com/nathancahill/preact-render-to-json) for a couple of reasons. The main one was that neither of these tools were working with the Preact upgrade. The second is that the official React documentation recommends [react-testing-library](https://testing-library.com/docs/react-testing-library) and [Jest](https://jestjs.io/) as the tools of choice when working with React components. For those reasons, we moved to [preact-testing-library](https://github.com/testing-library/preact-testing-library), a project that is also a part of the [Testing Library](https://testing-library.com/) family.

As part of the move, we deprecated the usage of snapshot testing except for in design system components. I am still fairly new to [Testing Library](https://testing-library.com/), but have found it to be fairly intuitive and it encourages building accessible applications. I’m also a big fan of the `debug()` function.

### Accessibility (a11y) Testing

Testing Library encourages building accessible applications, but we can do more. [Nick Colley](https://github.com/nickcolley) has taken the wonderful aXe tool from [Deque Systems](https://www.deque.com/) and integrated it with Jest as a [custom Jest matcher](https://jestjs.io/docs/en/expect#custom-matchers-api) called [jest-axe](https://github.com/nickcolley/jest-axe) for testing accessibility.

When jest-axe is used in conjunction with preact-testing-library, we get notified of a11y errors allowing us to fix them. All the tests in the DEV code base related to Preact components test for a11y errors.

A typical a11y test in a component test file looks like this.

```javascript
{% raw %}
  it('should have no a11y violations', async () => {
    const { container } = render(
      <MyComponent />,
    );
    const results = await axe(container);

    expect(results).toHaveNoViolations();
  });
{% endraw %}
```

And when this test fails, you are presented with readable errors to fix the a11y issues.

```bash
{% raw %}
expect(received).toHaveNoViolations(expected)

    Expected the HTML found at $('.crayons-btn--icon') to have no violations:

    <button class="crayons-btn crayons-btn--outlined crayons-btn--icon" type="button" data-testid="subscription-settings">

    Received:

    "Buttons must have discernible text (button-name)"

    Fix any of the following:
      Element does not have inner text that is visible to screen readers
      aria-label attribute does not exist or is empty
      aria-labelledby attribute does not exist, references elements that do not exist or references elements that are empty
      Element's default semantics were not overridden with role="presentation"
      Element's default semantics were not overridden with role="none"
      Element has no title attribute or the title attribute is empty

    You can find more information on this issue here: 
    https://dequeuniversity.com/rules/axe/3.5/button-name?application=axeAPI
{% endraw %}
```

## More Frontend Updates!
### Storybook Updates

In May, I wrote an update about our usage of Storybook.

{% link "https://dev.to/devteam/changelog-dev-has-some-stories-for-you-15kn" %}

Since then, we’ve continued to use Storybook to build out design system components and some critical application components. Moving to Preact X has allowed us to finally start using some more powerful Storybook addons. I mentioned a11y testing above, so to complement this, we added the [Storybook a11y addon](https://github.com/storybookjs/storybook/tree/master/addons/a11y).

![Screenshot of DEV's Storybook](https://www.iamdeveloper.com/images/posts/_i_6r9hi9d4dzks6xg830dn.png)

In addition to that, we have a custom [Storybook decorator](https://storybook.js.org/docs/addons/introduction/#1-decorators) that allows you to change DEV themes so you can ensure you are building out things correctly for each theme we support.

![Screenshot of DEV's Storybook theme switcher](https://www.iamdeveloper.com/images/posts/_i_5m5nmopxsvq7l4g8jywe.png)

You can view DEV's work in progress Storybook [here](https://storybook.forem.com). Every merge to our main branch related to Storybook stories will deploy an updated Storybook, so what you see is always the latest and greatest. Thanks to [Netlify](https://www.netlify.com/) deploy previews, you can see the Storybook related to every PR! 🔥

### Improvements to Jest

There are no big changes to our Jest setup, just a few tweaks. First off, as we have been testing more in the frontend, our code coverage has been increasing. So as coverage goes up, we want to avoid any drop in coverage, so we added coverage thresholds to our Jest configuration.

```javascript
{% raw %}
module.exports = {
  ...
  coverageThreshold: {
    global: {
      statements: 40,
      branches: 35,
      functions: 39,
      lines: 41,
    },
  },
...
{% endraw %}
```

Another super handy addition is in jest watch mode. You can now filter by a test’s name or filename.

![Screenshot of jest test runner options in watch mode](https://www.iamdeveloper.com/images/posts/_i_6alsv3g4epkpn9r84qgy.png)

![Screenshot of jest test runner options in watch mode for filtering test files based on filename](https://www.iamdeveloper.com/images/posts/_i_i4yqse0rnlxpsfmydy4e.png)

Is that all? Yes it is. Surely you jest. 😆

### Updated Linting Rules

Previously, we were using the [AirBnB Style Guide](https://github.com/airbnb/javascript) as the base for all our linting on the frontend. Although a great project, we found the rules to be somewhat rigid. We opted to go with the [ESLint recommended rule set](https://github.com/eslint/eslint/blob/master/conf/eslint-recommended.js) paired with the [Preact recommended rule set](https://github.com/preactjs/eslint-config-preact).

Just a reminder, we use [Prettier](https://prettier.io/) in the project, so that handles all formatting of frontend files.

A **big shoutout** to my co-worker @ridhwana for helping me migrate all the tests to preact-testing-library. 👏 I'm really excited about all the changes we have been making on the frontend, and look forward to continue to improve it. If you feel like contributing to the project in regards to the frontend, don’t be shy to DM me on DEV, Twitter or wherever. I’m pretty much @nickytonline everywhere. If email is your jam, hit me up at nick@dev.to.

That’s all for now folks!
