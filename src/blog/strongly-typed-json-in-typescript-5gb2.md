---json
{
  "title": "Strongly Typed JSON in TypeScript",
  "excerpt": "Someone in one of the Slack communities I'm a part of asked today how to type JSON in TypeScript,...",
  "date": "2022-04-01T03:36:19.595Z",
  "tags": [
    "typescript"
  ],
  "cover_image": "https://www.nickyt.co/images/posts/_cdn-cgi_image_width=1000,height=420,fit=cover,gravity=auto,format=auto_https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2F7sjay11pqa91it8euj0l.png",
  "canonical_url": "https://www.nickyt.co/blog/strongly-typed-json-in-typescript-5gb2/",
  "reading_time_minutes": 2,
  "template": "post"
}
---

Someone in one of the Slack communities I'm a part of asked today how to type JSON in TypeScript, specifically importing JSON and then typing it. They wondered if casting the JSON to `unknown` and then casting to a known type when consumed was a good approach.

The solution is not that complicated. We need to get our hands a little dirty and dig into the TypeScript compiler options for our project.

By default, if you import JSON, TypeScript will mention that it can't import it with the following error message:

`Cannot find module './data.json'. Consider using '--resolveJsonModule' to import module with '.json' extension.ts(2732)`

![](https://www.nickyt.co/images/posts/_uploads_articles_s5csqewe14a9n4kr523d.png)

So TypeScript tells us what to do. Add the `--resolveJsonModule` flag. This is helpful if we're running the TypeScript CLI, but that is not what we're doing. What needs to be done is to add the `resolveJsonModule` key to the compiler options in the tsconfig.json file and set it to `true`.

```json
{% raw %}
{
  "compilerOptions": {
    "resolveJsonModule": true,
    // more awesome compiler options
  }
}
{% endraw %}
```

Once that's done, you'll notice that if you type `data.`, we have fully typed JSON data.

![data variable in VS Code displaying autocomplete with properties of the data object](https://www.nickyt.co/images/posts/_uploads_articles_w5o2nxl0hik2gwhpy6m1.png)

This is great for using data in a typed manner, but what if we needed the JSON type elsewhere in the project? We can create a type for it using `typeof`.

`type PersonalInfo = typeof data;`

![The type PersonalInfo displaying its shape in CodeSandbox](https://www.nickyt.co/images/posts/_uploads_articles_g5sbz0a6386yfgwz7376.png)

You can play around with this CodeSandbox and have some fun seeing it all in action.

{% codesandbox "zealous-marco-urxdvy" %}
