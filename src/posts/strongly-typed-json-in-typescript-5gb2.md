---
title: Strongly Typed JSON in TypeScript
date: '2022-03-31T06:44:30.902Z'
excerpt: Someone in one of the Slack communities I'm a part of asked today how to type JSON in TypeScript, specifically importing JSON and then typing it.
tags:
  - typescript
  - beginners
template: post
---

Someone in one of the Slack communities I'm a part of asked today how to type JSON in TypeScript, specifically importing JSON and then typing it. They wondered if casting the JSON to `unknown` and then casting to a known type when consumed was a good approach.

The solution is not that complicated. We just need to get our hands a little dirty and dig into the TypeScript compiler options for our project.

By default, if you import JSON, TypeScript will mention that it can't import it with the following error message:

`Cannot find module './data.json'. Consider using '--resolveJsonModule' to import module with '.json' extension.ts(2732)`

![](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/s5csqewe14a9n4kr523d.png)

So TypeScript tells us what to do. Add the `--resolveJsonModule` flag. This is helpful if we're running the TypeScript CLI, but that is not what we're doing. What needs to be done is to add the `resolveJsonModule` key to the compiler options in the tsconfig.json file and set it to `true`.

```json
{
  "compilerOptions": {
    "resolveJsonModule": true
    // more awesome compiler options
  }
}
```

Once that's done, you'll notice that if you type `data.`, we have fully typed JSON data.

![data variable in VS Code displaying autocomplete with properties of the data object](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/w5o2nxl0hik2gwhpy6m1.png)

This is great for using data in a typed manner, but what if we needed the JSON type elsewhere in the project? We can create a type for it using `typeof`.

`type PersonalInfo = typeof data;`

![The type PersonalInfo displaying its shape in CodeSandbox](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/g5sbz0a6386yfgwz7376.png)

You can play around with this CodeSandbox and have some fun seeing it all in action.

<iframe src="https://codesandbox.io/embed/zealous-marco-urxdvy?fontsize=14&hidenavigation=1&theme=dark"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="zealous-marco-urxdvy"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>
