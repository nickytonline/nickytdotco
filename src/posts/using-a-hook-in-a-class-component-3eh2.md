---json
{
  "title": "How to Use a React Hook in a Class Component",
  "excerpt": "Did you know that you can use hooks in class components?   OK, I'm lying, kind of. You can't use a...",
  "date": "2022-03-28T19:03:10.011Z",
  "tags": [
    "react",
    "javascript"
  ],
  "cover_image": "https://www.iamdeveloper.com/images/posts/_practicaldev_image_fetch_s--NBwmN8Qr--_c_imagga_scale,f_auto,fl_progressive,h_420,q_auto,w_1000_https:__dev-to-uploads.s3.amazonaws.com_uploads_articles_h8jx0vy2dbgwqsfpynbu.jpeg",
  "canonicalUrl": "https://www.iamdeveloper.com/posts/using-a-hook-in-a-class-component-3eh2/",
  "reading_time_minutes": 2,
  "template": "post"
}
---

Did you know that you can use [hooks](https://beta.reactjs.org/learn#using-hooks) in [class components](https://reactjs.org/docs/react-component.html)? 

OK, I'm lying, kind of. You can't use a hook directly in a class component, but you can use a hook in a wrapped function component with a [render prop](https://reactjs.org/docs/render-props.html) to achieve this.

Before going ahead with this, if you're able to convert your class component to a function component, prefer that. But if the component needs to remain a class component for whatever reason, this pattern works great. You will most likely encounter this scenario when working on a mature React codebase.

The beauty of this pattern is that you can build new components as function components using hooks. Class components that can't be upgraded for whatever reason benefit from the same functionality via a thin compatibility layer, the wrapper component.

Let's first create a hook.

```javascript
{% raw %}
import { useEffect, useState } from "react";

export function useDarkMode() {
  // Taken from https://usehooks.com/useDarkMode/

  // For this to persist, we'd use localStorage or some other kind
  // of way to persist between sessions.
  // see e.g. https://usehooks.com/useLocalStorage/
  const [enabledState, setEnabledState] = useState(false);
  const enabled = enabledState;

  useEffect(() => {
    const className = "dark-mode";
    const element = document.body;
    if (enabled) {
      element.classList.add(className);
    } else {
      element.classList.remove(className);
    }
  }, [enabled]);
  return [enabled, setEnabledState];
}
{% endraw %}
```

Now let's create a function component that has a render prop. Note that the prop does not literally need to be called `render`, but it tends to convey its purpose.

```jsx
{% raw %}
// I wouldn't normally call a component something like this.
// It's just to convey what it is doing for the purpose of the article
const UseDarkModeHookWrapperComponent = ({ render }) => {
  const [darkMode, setDarkMode] = useDarkMode(false);

  // Uses the render prop called render that will expose the value and
  // setter for the custom hook
  return render(darkMode, setDarkMode);
};
{% endraw %}
```

And now, let's use the wrapper component in a class component.

```jsx
{% raw %}
export default class App extends Component {
  render() {
    return (
      <UseDarkModeHookWrapperComponent
        render={(darkMode, setDarkMode) => {
          return (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "200px",
                gap: "2rem",
                maxWidth: "50%",
                placeItems: "center"
              }}
            >
              <ThemeToggler darkMode={darkMode} setDarkMode={setDarkMode} />
              hello
            </div>
          );
        }}
      />
    );
  }
}
{% endraw %}
```

And voilà! You're using your hook in a class component. Here's the complete application in action.

{% codesandbox "recursing-haibt-uxgkke" %}

If you want to see a real-world example, look no further than the Forem codebase. Here's the [useMediaQuery hook](https://github.com/forem/forem/blob/main/app/javascript/shared/components/useMediaQuery.js), and here's the [wrapper component](https://github.com/forem/forem/blob/main/app/javascript/shared/components/MediaQuery.jsx). If you want to see it in action, it's called in the [ReadingList component](https://github.com/forem/forem/blob/main/app/javascript/readingList/readingList.jsx#L240-L277).

Photo by <a href="https://unsplash.com/@jamievalmat?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Jamie Matociños</a> on <a href="https://unsplash.com/s/photos/hook?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
