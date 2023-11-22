---json
{
  "title": "TypeScript: Infer Types to Avoid Explicit Types",
  "excerpt": "The idea for this post came about while I was reviewing this pull request (PR) for OpenSauced.       ...",
  "date": "2023-11-21T04:59:47.514Z",
  "tags": [
    "typescript",
    "beginners",
    "react"
  ],
  "cover_image": "https://www.nickyt.co/images/posts/_practicaldev_image_fetch_s--QH2UibfW--_c_imagga_scale,f_auto,fl_progressive,h_420,q_auto,w_1000_https:__dev-to-uploads.s3.amazonaws.com_uploads_articles_lijgw6h1zjd18tliwifs.png",
  "canonical_url": "https://www.nickyt.co/blog/infer-types-to-avoid-explicit-types-1pnn",
  "reading_time_minutes": 4,
  "template": "post"
}
---

The idea for this post came about while I was reviewing this pull request (PR) for [OpenSauced](https://opensauced.pizza).

{% embed "https://github.com/open-sauced/app/pull/2168" %}

My friend Brittney Postma (@brittneypostma) who is a huge Svelte fan, wanted to add Svelte to the list of available interests from our explore page.

[![Image description](https://www.nickyt.co/images/posts/_uploads_articles_ua2d5toq5zw880dxdwlg.png)](https://app.opensauced.pizza/javascript/dashboard/filter/recent)

She made some changes which worked while running the dev server, but TypeScript was complaining, causing the build to fail.

```bash
{% raw %}
4:49:27 PM: ./lib/utils/recommendations.ts:3:7
4:49:27 PM: Type error: Property "svelte" is missing in type "{ react: string[]; javascript:
stringIl; python: string|]; ml: string|]; ai: stringI]; rust: string[l; ruby: string[]; c:
stringIl; cpp: string|]; csharp: string|]; php: string|]; java: string[]; typescript: string|];
golang: string||; vue: string||; kubernetes: string|]; hacktoberfest: string|]; clojure:
stringIl; }" but required in type "Record<"ruby" | "javascript" | "python" | "java" ||
"typescript" | "csharp" | "cpp" | "php" | "c" | "ai" | "ml" | "react" | "golang" | "rust" |
"svelte" | "vue" | "kubernetes" | "hacktoberfest" | "clojure", string[]>".
4:49:27 PM: 1 | import { interestsType } from "./getInterestOptions";
4:49:27 PM: 2
4:49:27 PM: > 3 | const recommendations: Record‹interestsType, string[]> = {
4:49:27 PM: ^
4:49:27 PM: 4 | react: ["Skyscanner/backpack"],
4:49:27 PM: 5 | javascript: ["EddieHubCommunity/LinkFree"],
4:49:27 PM: python: ["randovania/randovania"],
4:49:28 PM: Failed during stage "building site": Build script returned non-zero exit code: 2
{% endraw %}
```

I mentioned adding 'svelte' to the `topic` prop's union type in the [LanguagePillProps](https://github.com/open-sauced/app/blob/00486f7b45c7e185208030422f675718724c1d4a/components/atoms/LanguagePill/LanguagePill.tsx#L24-L47) interface in our `LanguagePill` component should resolve the issue. Narrator, it did.

Having to add `'svelte'` to the `topic` props type fixed the issue, but it was extra work. Typically, you want to **infer types as much as possible**.

**Just a note.** This is not criticizing Brittney’s pull request (PR). This post is about a potential refactoring I noticed while reviewing her PR which could improve the types maintenance in the project.

## Examples of Type Inference

You might already be inferring types without realizing it. Here are some examples of types being inferred.

```typescript
{% raw %}
let counter = 0
{% endraw %}
```

`counter` gets inferred as type `number`. You could write this as `let counter: number = 0`, but the explicit type is unnecessary.

Let's look at an example of an array

```typescript
{% raw %}
let lotteryNumbers = [1, 34, 65, 43, 89, 56]
{% endraw %}
```

`lotteryNumbers` gets inferred as `Array<number>`. Again, you could explicitly type it.

```typescript
{% raw %}
// Array<number> or the shorter syntax, number[]
let lotteryNumbers: Array<number> = [1, 34, 65, 43, 89, 56]
{% endraw %}
```

But once again, it's unnecessary. Take it for a spin in the [TypeScript playground](https://www.typescriptlang.org/play?#code/PTAEEsDsDMFMCd6wCagC4E8AOsIGdQBDSIxQjUAe2lEgFcBbAIwTwCgAbWNUDytNAgwA5Ri3gEAvKADaARgA0oAMwAWJQDYArEtXKlADgCcSrRoC6bNiFCwAHlg7gAxuDQcKmHEQLFS8cioaemZWTm4qNAALBAAZfkF4ETFWAC5QAEEyDAAeEPEAPlBpGXUVACZNHQrDU3MgA) to see for yourself.

## The Changes

Here's the PR I put up.

{% embed "https://github.com/open-sauced/app/pull/2192" %}

I did some other refactoring in the pull request, but the big chunk of it was this diff.

```diff
{% raw %}
interface LanguagePillProps {
-  topic:
-    | "react"
-    | "javascript"
-    | "python"
-    | "ML"
-    | "AI"
-    | "rust"
-    | "ruby"
-    | "c"
-    | "cpp"
-    | "csharp"
-    | "php"
-    | "java"
-    | "typescript"
-    | "golang"
-    | "vue"
-    | "Kubernetes"
-    | "hacktoberfest"
-    | "clojure"
+  topic: InterestType
  classNames?: string;
  onClick?: () => void;
}
{% endraw %}
```

`InterestType` is a type inferred from the `interests` array (see [getInterestOptions.ts](https://github.com/open-sauced/app/blob/beta/lib/utils/getInterestOptions.ts#L1-L22)).

```typescript
{% raw %}
const interests = [
  "javascript",
  "python",
  "java",
  "typescript",
  "csharp",
  "cpp",
  "php",
  "c",
  "ruby",
  "ai",
  "ml",
  "react",
  "golang",
  "rust",
  "svelte",
  "vue",
  "kubernetes",
  "hacktoberfest",
  "clojure",
] as const;
export type InterestType = (typeof interests)[number];
{% endraw %}
```

Aside from the type being inferred, the type is now data-driven. If we want to add a new language to the `interests` array, all places where the `InterestType` are used now have that new language available. If there is some code that requires all the values in that union type to be used, TypeScript will complain.

![TypeScript complaining that property 'svelte' is missing in type '{ react: any; rust: any; javascript: any; ai: any; ml: any; python: any; typescript: any; csharp: any; cpp: any; php: any; c: any; ruby: any; java: any; golang: any; vue: any; kubernetes: any; hacktoberfest: any; clojure: any; }' but required in type 'Record<"javascript" | "python" | "java" | "typescript" | "csharp" | "cpp" | "php" | "c" | "ruby" | "ai" | "ml" | "react" | "golang" | "rust" | "svelte" | "vue" | "kubernetes" | "hacktoberfest" | "clojure", StaticImageData>'.](https://www.nickyt.co/images/posts/_uploads_articles_wub4v6h58nxn41l60te0.png)

In fact, a new issue was opened today because an SVG for Svelte was missing in another part of the application.

{% embed "https://github.com/open-sauced/app/issues/2195" %}

If the `InterestType` has been used everywhere that error would have been caught by TypeScript just like in the screenshot above
## Typing Function Return Types

For return types in functions, there are definitely two camps. Some think that return types should always be explicitly typed even if they can be inferred, and others not so much. I tend to lean towards inference for function return types, but agree with Matt Pocock's take that if you have branching in your function, e.g. `if`/`else`, `switch`, an explicit return type is preferred. More on that in Matt's video.

{% embed "https://www.youtube.com/watch?v=nwSe95uFN8E" %}

## Wrap it up!

Types are great, and so is TypeScript, but that doesn't mean you need to type everything. Whenever possible, lean on type inference, and explicitly type when necessary.
