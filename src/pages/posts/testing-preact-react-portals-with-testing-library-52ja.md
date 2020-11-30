---
stackbit_url_path: posts/testing-preact-react-portals-with-testing-library-52ja
title: Testing Preact/React Portals with Testing Library
date: '2020-11-30T20:30:08.253Z'
excerpt: >-
  This post was going to be about troubles I ran into testing Portals, but in
  the end after writing thr...
thumb_img_path: >-
  https://res.cloudinary.com/practicaldev/image/fetch/s--QKlm36gi--/c_imagga_scale,f_auto,fl_progressive,h_420,q_auto,w_1000/https://dev-to-uploads.s3.amazonaws.com/i/5k0g29qxe74ob9kty1ee.png
comments_count: 0
positive_reactions_count: 4
tags:
  - react
  - preact
  - testing
  - webdev
canonical_url: >-
  https://dev.to/nickytonline/testing-preact-react-portals-with-testing-library-52ja
template: post
---
This post was going to be about troubles I ran into testing Portals, but in the end after writing three quarters of this post, the problems I thought I had were not problems and I ended up simplifying my tests. 🙃

Those test refinements are in


<iframe class="liquidTag" src="https://dev.to/embed/github?args=https%3A%2F%2Fgithub.com%2Fforem%2Fforem%2Fpull%2F11685" style="border: 0; width: 100%;"></iframe>


Regardless, it's still a good run down of how to test Portals.

At [Forem](https://forem.com), the software that powers [DEV](https://dev.to), we use [Preact](https://docs.forem.com/frontend/preact/), sprinkled throughout the application, where it makes sense. The reason being, is that the application is a Rails application and for the most part we are serving up content in the form of blog posts, listings etc. via server-side rendering.

Typically these “Preact”ified interactions are for the logged on user, but there are other spots we use it too. One of those spots is search. The way search works is, initially the search form is server-side rendered (SSR) and then the Preact Search component mounts itself in the same spot. Preact’s [Virtual DOM](https://reactjs.org/docs/faq-internals.html# what-is-the-virtual-dom) (VDOM) is smart enough to compare the DOM even on the initial render and only change things if necessary. This prevents flickering.

So the search text box is now a Preact component once the page is completely loaded. When a user enters a search query and then presses the <kbd>ENTER</kbd> key, [Instant Click](https://docs.forem.com/frontend/instant-click/) will make an AJAX call that grabs the search results based on what the user is searching for. Instant Click is a whole other topic, but feel free to read up on it.

In a nutshell, it converts a server-side rendered application into a single page application (SPA) like application. This is important to note as it’s an integral part of our story about Preact [portals](https://preactjs.com/guide/v10/switching-to-preact/# portals).

So we get our search results via AJAX and the page’s main area is updated. In the case of search, this is a search results page. Up until now, this has worked like clockwork.

My coworker [Pawel](https://dev.to/pp) has a pull request up that adds a new search form that is for mobile/smaller screens. When on mobile/smaller screens, the search text box in the top navigation gets hidden and the mobile one becomes visible. For more on that check out the PR below (it will probably be merged by the time you are reading this post)


<iframe class="liquidTag" src="https://dev.to/embed/github?args=https%3A%2F%2Fgithub.com%2Fforem%2Fforem%2Fissues%2F10424" style="border: 0; width: 100%;"></iframe>


Pawel, ran into some issues synchronizing the main search form (larger screens) with the smaller one that is contained within the search results. Right away this screamed, use a portal since it is an element that renders in a different DOM element, i.e. a Portal's container.

![An Excalidraw drawing showing the different parts of the search page rendered](https://dev-to-uploads.s3.amazonaws.com/i/3kra38249j5h7tiksj28.png) 

I reworked things so that there was now a parent component that managed the state of the original search text box and the mobile search text box that gets rendered within the search results using the [useState](https://preactjs.com/guide/v10/hooks/# usestate) hook. I did some initial tests in Pawel’s PR and it seemed to work, but on subsequent searches it stopped working.

And then it clicked. Portals are the right approach, but when new search results are rendered, a new search form for mobile view is rerendered from the server-side (via Instant Click magic), i.e. the DOM element is destroyed and recreated. Not to be confused with React updating the state of a component. 

So typing in the mobile view stopped synching the search term between search text boxes because the search text box created by the portal got wiped out by the server-side render.
 
![An Excalidraw drawing showing the different parts of the search page rendered with a new search result](https://dev-to-uploads.s3.amazonaws.com/i/384ozzl4bytwkl6jz7ig.png)

Once I figured that out, I got all the moving parts working. Check out my PR as it contains more information in the comments about this.


<iframe class="liquidTag" src="https://dev.to/embed/github?args=https%3A%2F%2Fgithub.com%2Fforem%2Fforem%2Fpull%2F11525" style="border: 0; width: 100%;"></iframe>


Alright, so now the component and portal work great in the actual application. With all that context under out belts lets discuss the issues I ran into while testing out this component with [preact-testing-library](https://github.com/testing-library/preact-testing-library), one of the testing libraries in the [Testing Library](https://testing-library.com/) family.

If you’re using preact-testing-library or [react-testing-library](https://github.com/testing-library/react-testing-library), the APIs are the same. If you’re interested you can see [what’s available in the API](https://testing-library.com/docs/preact-testing-library/api). We’re going to focus on the [render](https://testing-library.com/docs/preact-testing-library/api# render) function for the time being.

Typically you test a component like this. Note that you can choose what to destructure from the result of the render function based on what’s available in the API for your needs. We are going to go with a function that finds a DOM element by its label text.


```jsx
it('should synchronize search forms', async () => {
    const { findByLabelText } = render(<SearchFormSync />);

    // Only one input is rendered at this point because the synchSearchForms custom event is what
    // tells us that there is a new search form to sync with the existing one.
    const searchInput = await findByLabelText('search');

    // Because window.location has no search term in it's URL
    expect(searchInput.value).toEqual('');
});
```


The test above does the following:

1. Render the 
`<SearchFormSync />`
 component and make the 
`findByLabelText`
 function available by destructuring it from the result of the render function.
2. Next, we want to find an element that has an HTML 
`<label />`
 or one of the ARIA attributes for a label, for example [aria-label](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques/Using_the_aria-label_attribute).
3. From there, a built in [jest common matcher](https://jestjs.io/docs/en/using-matchers# common-matchers) is used to assert that our search textbook is initialized with an empty string, 
`expect(searchInput.value).toEqual('');`


At this point there is nothing out of the ordinary about this test. And everything passes.


```bash
 PASS  app/javascript/Search/__tests__/SearchFormSync.test.jsx
  <SearchFormSync />
    ✓ should synchronize search forms (19 ms)

Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   0 total
Time:        1.751 s, estimated 2 s
Ran all test suites related to changed files.

Watch Usage: Press w to show more.
```


Alright, let’s continue with our testing. So next up we want to ensure that both the desktop and mobile search forms render the same. Under the hood, the way it works is when a search result is returned, the search results include the mobile search form and have a little snippet of JS that emits a custom event to synchronize the forms.


```html
<div id="mobile-search-container">
  <form
    accept-charset="UTF-8"
    action="/search"
    method="get"
  >
    <input
      name="utf8"
      type="hidden"
      value="✓"
    />
    <input
      aria-label="search"
      autocomplete="off"
      class="crayons-header--search-input crayons-textfield"
      name="q"
      placeholder="Search..."
      type="text"
    />
  </form>
</div>
...
<script>
  // ... some other search related code
  
  // A custom event that gets dispatched to notify search forms to synchronize their state.
  window.dispatchEvent(new CustomEvent('syncSearchForms', { detail: { querystring: location.search } }));
</script>
```


So in our test we need to do a few things:
1. Simulate the search results URL


```javascript
    // simulates a search result returned which contains the server side rendered search form for mobile only.
    setWindowLocation(`
https://locahost:3000/search?q=${searchTerm}
`);
```


2. Have a DOM element available for the portal’s container.


```javascript
// This part of the DOM would be rendered in the search results from the server side.
// See search.html.erb.
document.body.innerHTML =
  '<div id="mobile-search-container"><form></form></div>';
```


3. Emit the custom event


```javascript
fireEvent(
  window,
  new CustomEvent('syncSearchForms', {
    detail: { querystring: window.location.search },
  }),
);
```


From there we need to assert that the search forms are in sync.


```javascript
    const [desktopSearch, mobileSearch] = await findAllByLabelText('search');
    
    expect(desktopSearch.value).toEqual(searchTerm);
    expect(mobileSearch.value).toEqual(searchTerm);
```


Let's put that all together.


```jsx
it('should synchronize search forms', async () => {
  // This part of the DOM would be rendered in the search results from the server side.
  // See search.html.erb.
  document.body.innerHTML +=
    '<div id="mobile-search-container"><form></form></div>';

  const { findByLabelText, findAllByLabelText } = render(<SearchFormSync />);

  // Only one input is rendered at this point because the synchSearchForms custom event is what
  // tells us that there is a new search form to sync with the existing one.
  const searchInput = await findByLabelText('search');

  // Because window.location has no search term in it's URL
  expect(searchInput.value).toEqual('');

  // https://www.theatlantic.com/technology/archive/2012/09/here-it-is-the-best-word-ever/262348/
  const searchTerm = 'diphthong';

  // simulates a search result returned which contains the server side rendered search form for mobile only.
  setWindowLocation(`
https://locahost:3000/search?q=${searchTerm}
`);

  fireEvent(
    window,
    new CustomEvent('syncSearchForms', {
      detail: { querystring: window.location.search },
    }),
  );

  const [desktopSearch, mobileSearch] = await findAllByLabelText('search');

  expect(desktopSearch.value).toEqual(searchTerm);
  expect(mobileSearch.value).toEqual(searchTerm);
});
```


Let's rerun the tests.


```bash
 PASS  app/javascript/Search/__tests__/SearchFormSync.test.jsx
  <SearchFormSync />
    ✓ should synchronize search forms (31 ms)

Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   0 total
Time:        1.326 s
Ran all test suites matching /sync/i.

Watch Usage: Press w to show more.
```


Awesome, so the original search form (desktop search) and the new search form (mobile/smaller screens) render properly.

Let's take a look at what happens under the hood by looking at preact-testing-library's render function](https://github.com/testing-library/preact-testing-library/blob/master/src/pure.js# L24)


```javascript
function render (
  ui,
  {
    container,
    baseElement = container,
    queries,
    hydrate = false,
    wrapper: WrapperComponent
  } = {}
) {
  if (!baseElement) {
    // Default to document.body instead of documentElement to avoid output of potentially-large
    // head elements (such as JSS style blocks) in debug output.
    baseElement = document.body
  }

  if (!container) {
    container = baseElement.appendChild(document.createElement('div'))
  }
...
```


There is an optional options parameter which we can see here destructured.


```javascript
{
  container,
  baseElement = container,
  queries,
  hydrate = false,
  wrapper: WrapperComponent
} = {}
```


In our case we're not using these so based on the code, we have no 
`baseElement`
 option set since we are not passing it in and it's default value is the 
`container`
 option which is 
`undefined`
 since we did not pass one in. So, the 
`baseElement in our case is `
document.body
`

Since we have no container defined, it gets set to `
baseElement.appendChild(document.createElement('div'))
` which is a `
<div />
` appended to the `
document.body
`. Remember from our test set up, we added the portal container DOM element via 

```
javascript
// This part of the DOM would be rendered in the search results from the server side.
// See search.html.erb.
document.body.innerHTML +=
  '<div id="mobile-search-container"><form></form></div>';

```

So before our test runs, this is what the `
document.body
` looks like

```
html
<body>
  <div
    id="mobile-search-container"
  >
    <!-- This is where our portal will be rendered -->  
    <form />
  </div>
  <!-- This is where our component will be rendered -->
  <div>
  </div>
</body>

```

Let's use preact-testing-library's [debug](https://testing-library.com/docs/react-testing-library/api/# debug) so that we can see the successful test rendered as HTML.

To use `
debug()
`, we need to add it to the destructured functions like so:

```
jsx
const { debug, findByLabelText, findAllByLabelText } = render(<SearchFormSync />);

```

Alright, now let's add the `
debug()
` call to the test.

```
jsx
it('should synchronize search forms', async () => {
  // This part of the DOM would be rendered in the search results from the server side.
  // See search.html.erb.
  document.body.innerHTML +=
    '<div id="mobile-search-container"><form></form></div>';

  const { debug, findByLabelText, findAllByLabelText } = render(
    <SearchFormSync />,
  );

  // Only one input is rendered at this point because the synchSearchForms custom event is what
  // tells us that there is a new search form to sync with the existing one.
  const searchInput = await findByLabelText('search');

  // Because window.location has no search term in it's URL
  expect(searchInput.value).toEqual('');

  // https://www.theatlantic.com/technology/archive/2012/09/here-it-is-the-best-word-ever/262348/
  const searchTerm = 'diphthong';

  // simulates a search result returned which contains the server side rendered search form for mobile only.
  setWindowLocation(
`https://locahost:3000/search?q=${searchTerm}`
);

  fireEvent(
    window,
    new CustomEvent('syncSearchForms', {
      detail: { querystring: window.location.search },
    }),
  );

  const [desktopSearch, mobileSearch] = await findAllByLabelText('search');

  expect(desktopSearch.value).toEqual(searchTerm);
  expect(mobileSearch.value).toEqual(searchTerm);
  debug();
});

```

The test runs again successfully, but now we also have some outputted markup from the rendering.

```
bash
 PASS  app/javascript/Search/__tests__/SearchFormSync.test.jsx
  <SearchFormSync />
    ✓ should synchronize search forms (43 ms)
    ✓ should synchronize search forms on a subsequent search (9 ms)

  console.log
    <body>
      <div
        id="mobile-search-container"
      >
        <form
          accept-charset="UTF-8"
          action="/search"
          method="get"
        >
          <input
            name="utf8"
            type="hidden"
            value="✓"
          />
          <input
            aria-label="search"
            autocomplete="off"
            class="crayons-header--search-input crayons-textfield"
            name="q"
            placeholder="Search..."
            type="text"
          />
        </form>
        
      </div>
      <div>
        <form
          accept-charset="UTF-8"
          action="/search"
          method="get"
        >
          <input
            name="utf8"
            type="hidden"
            value="✓"
          />
          <input
            aria-label="search"
            autocomplete="off"
            class="crayons-header--search-input crayons-textfield"
            name="q"
            placeholder="Search..."
            type="text"
          />
        </form>
      </div>
    </body>

      at debug (node_modules/@testing-library/preact/dist/pure.js:97:15)

Test Suites: 1 passed, 1 total
Tests:       2 passed, 2 total
Snapshots:   0 total
Time:        1.516 s
Ran all test suites matching /sync/i.

Watch Usage: Press w to show more.

```

So from the outputted markup, we see that the original form rendered (desktop) and the mobile search form also rendered in the portal container `
<div id="mobile-search-container" />
`.

Using `
debug()` in preact-testing-library or react-testing-library is super handy if you run into rendering issues.

And that's it! To recap, we had a component that also rendered a portal and we tested that the original component and the portal both rendered.

Until next time folks!



*[This post is also available on DEV.](https://dev.to/nickytonline/testing-preact-react-portals-with-testing-library-52ja)*


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
