---json
{
  "title": "TypeScript Tips Part II: Declaration Merging",
  "excerpt": "Declaration merging has been around for a while now in TypeScript. In a nutshell it lets you merge...",
  "date": "2019-02-12T02:45:09.000Z",
  "tags": [
    "typescript",
    "webdev",
    "frontend"
  ],
  "cover_image": "https://www.iamdeveloper.com/images/posts/_practicaldev_image_fetch_s--w8s2XMWB--_c_imagga_scale,f_auto,fl_progressive,h_420,q_auto,w_1000_https:__thepracticaldev.s3.amazonaws.com_i_tx8rjo1ef8rdzwwfmhqe.jpg",
  "canonicalUrl": "https://www.iamdeveloper.com/posts/typescript-tips-part-ii-declaration-merging-5gba/",
  "reading_time_minutes": 3,
  "template": "post"
}
---

[Declaration merging](https://www.typescriptlang.org/docs/handbook/declaration-merging.html) has been around for a while now in TypeScript. In a nutshell it lets you merge definitions of types.
There's plenty of examples in the documentation, so let's just start off with something simple.

```javascript
{% raw %}
enum HardDriveType {
	ssd,
	sata
}

enum ProcessorType {
	i3,
	i5,
	i7,
	i9
}

interface Computer {
	processor: ProcessorType;
}

interface Computer {
	hardDriveType: HardDriveType;
}

// interface has been merged
const myPC: Computer = {
	hardDriveType: HardDriveType.ssd,
	processor: ProcessorType.i9
};

// interface is merged so type checking fails since the processor property is missing
const myBadPC: Computer = {
	hardDriveType: HardDriveType.ssd,
};
{% endraw %}
```

You can [play around with the example](https://www.typescriptlang.org/play/#src=enum%20HardDriveType%20%7B%0A%09ssd%2C%0A%09sata%0A%7D%0A%0Aenum%20ProcessorType%20%7B%0A%09i3%2C%0A%09i5%2C%0A%09i7%2C%0A%09i9%0A%7D%0A%0Ainterface%20Computer%20%7B%0A%09processor%3A%20ProcessorType%3B%0A%7D%0A%0Ainterface%20Computer%20%7B%0A%09hardDriveType%3A%20HardDriveType%3B%0A%7D%0A%0A%2F%2F%20interface%20has%20been%20merged%0Aconst%20myPC%3A%20Computer%20%3D%20%7B%0A%09hardDriveType%3A%20HardDriveType.ssd%2C%0A%09processor%3A%20ProcessorType.i9%0A%7D%3B%0A%0A%2F%2F%20interface%20is%20merged%20so%20type%20checking%20fails%20since%20the%20processor%20property%20is%20missing%0Aconst%20myBadPC%3A%20Computer%20%3D%20%7B%0A%09hardDriveType%3A%20HardDriveType.ssd%2C%0A%7D%3B) in the TypeScript Playground.
So two interfaces called `Computer` are declared and all the properties of those interfaces are merged together into one declaration for the `Computer` interface. This is a simple example to show how it works, but in a real world app, you wouldn't be declaring the interface in two pieces in a file. Let's go with something more realistic.

You are using a third-party library or it's something in your project that needs to live on the `window`. The `window` has it's own type, the [Window interface](https://github.com/Microsoft/TypeScript/blob/master/lib/lib.dom.d.ts#L16513). This type has all the properties you'd expect to find on MDN about `window`.

Let's use our a fictitious 3rd party library called `awesomeThing`. It gets loaded onto the `window` object so we need to enhance the `Window` interface.

```javascript
{% raw %}
export interface AwesomeThing {
	doIt: () => void;
}

declare global {
	interface Window {
		awesomeThing: AwesomeThing
	}
}

// The window interface has been merged with our interface to add awesomeThing.
window.awesomeThing.doIt();

// Errors because it's not on the `Window` interface.
window.thingThatIsNotOnWindow.doIt();
{% endraw %}
```

You can [play around with the example](https://www.typescriptlang.org/play/#src=export%20interface%20AwesomeThing%20%7B%0D%0A%09doIt%3A%20()%20%3D%3E%20void%3B%0D%0A%7D%0D%0A%0D%0Adeclare%20global%20%7B%0D%0A%09interface%20Window%20%7B%0D%0A%09%09awesomeThing%3A%20AwesomeThing%0D%0A%09%7D%0D%0A%7D%0D%0A%0D%0A%2F%2F%20The%20window%20interface%20has%20been%20merged%20with%20our%20interface%20to%20add%20awesomeThing.%0D%0Awindow.awesomeThing.doIt()%3B%0D%0A%0D%0A%2F%2F%20Errors%20because%20it's%20not%20on%20the%20%60Window%60%20interface.%0D%0Awindow.thingThatIsNotOnWindow.doIt()%3B) in the TypeScript Playground.

If you'd like to see some real world examples in open source, look no further than a recent PR of mine that got merged to the [Refined GitHub](https://github.com/sindresorhus/refined-github/pull/1750) browser extension repository. I was really happy getting this PR in because it's an extension I use everyday.

{% twitter "1093893754992320513" %}

Specifically, check out [globals.d.ts](https://github.com/sindresorhus/refined-github/blob/master/source/globals.d.ts#L78) in the project.

That's pretty much all there is to it. To summarize, declaration merging is a great way to enhance existing types.

Photo by [Mike Enerio](https://unsplash.com/photos/2IkxeDKaZdY?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/search/photos/train-tracks?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)
