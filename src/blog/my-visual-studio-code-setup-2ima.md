---json
{
  "title": "My Visual Studio Code Setup",
  "excerpt": "A small write up on my Visual Studio Code setup",
  "date": "2017-12-23T14:11:11.594Z",
  "tags": [
    "visualstudiocode",
    "developertools",
    "texteditor",
    "vscode"
  ],
  "cover_image": "https://www.iamdeveloper.com/images/posts/_practicaldev_image_fetch_s--GzTj3t37--_c_imagga_scale,f_auto,fl_progressive,h_420,q_auto,w_1000_https:__thepracticaldev.s3.amazonaws.com_i_6e271uy3v8ia1h0e1c7q.png",
  "canonicalUrl": "https://www.iamdeveloper.com/posts/my-visual-studio-code-setup-2ima/",
  "reading_time_minutes": 6,
  "template": "post"
}
---

This article is also available on [iamdeveloper.com](https://www.iamdeveloper.com/blog/2017-12-20-my-visual-studio-code-setup/).

This originally was [just a gist](https://gist.github.com/nickytonline/3d5ffeab871a6662d7a3f89bb0bed0f8), but I thought it made sense to just convert it to a blog post.

As the [stateofjs.com](https://stateofjs.com) survey this year noted, Visual Studio Code is quickly becoming the [editor of choice](https://stateofjs.com/2017/other-tools/) for many web developers.

{% twitter "940799686826430464" %}

[VS Code](https://code.visualstudio.com/Download) is my editor of choice. It's great for web dev, and if you're developing with [TypeScript](http://www.typescriptlang.org), it's definitely the way to go. Fun fact... it's written in TypeScript. If you're interested in learning more about TypeScript, check out my blog post [Consider Using TypeScript](https://dev.to/nickytonline/why-you-might-want-to-consider-using-typescript-6j3).

TypeScript is what gives VS Code its refactoring and intellisense capabilities. Here's the really cool part. You get typed intellisense even if you're not using TypeScript via [Automatic Type Acquisition](https://code.visualstudio.com/docs/languages/javascript#_automatic-type-acquisition).

Alright, let's get to it. Here's my current [Visual Studio Code](https://code.visualstudio.com) setup.

## Extensions

VS Code has a huge array of extensions available on their [marketplace](https://marketplace.visualstudio.com/vscode). As well as extensions, in 2017, [extension packs](https://code.visualstudio.com/docs/extensionAPI/extension-manifest#_extension-packs) became available. tl;dr, they're a grouping of extensions.

[Settings Sync](https://marketplace.visualstudio.com/items?itemName=Shan.code-settings-sync) is a must have extension and I recommend installing it as your first extension. With this extension, you'll be able to backup most of your settings to a private gist. From there, restoring your settings is pretty easy. It's great for backing up settings as well as synching settings, which is what I do between my work and personal laptop.

### Node/JS

* [Node extension pack](https://marketplace.visualstudio.com/items?itemName=waderyan.nodejs-extension-pack) (must have)
* [Import Cost](https://marketplace.visualstudio.com/items?itemName=wix.vscode-import-cost)

### Formatting/Linting

* [Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
* [EditorConfig](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig)
* [TSLint](https://marketplace.visualstudio.com/items?itemName=eg2.tslint)
* [Prettify JSON](https://marketplace.visualstudio.com/items?itemName=mohsen1.prettify-json)
* [markdownlint](https://marketplace.visualstudio.com/items?itemName=DavidAnson.vscode-markdownlint)
* [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

### CSS

* [IntelliSense for CSS class names](https://marketplace.visualstudio.com/items?itemName=Zignd.html-css-class-completion)
* [Color Highlight](https://marketplace.visualstudio.com/items?itemName=naumovs.color-highlight)
* [Color Picker](https://marketplace.visualstudio.com/items?itemName=anseki.vscode-color)
* [HTML CSS Support](https://marketplace.visualstudio.com/items?itemName=ecmel.vscode-html-css)
* [Color Highlight](https://marketplace.visualstudio.com/items?itemName=naumovs.color-highlight)

### Debugging

Language extensions like Go and Python (see below) when installed get all the proper tooling set up to debug for those specific languages. Here's some others. The easiest way to get started with debugging is to press `F5` and VS Code will offer you debugging configurations to get set up with.

* [Debugger for Chrome](https://marketplace.visualstudio.com/items?itemName=msjsdiag.debugger-for-chrome)

### Git

* [Git extension pack](https://marketplace.visualstudio.com/items?itemName=donjayamanne.git-extension-pack) (must have)
* [Git Blame](https://marketplace.visualstudio.com/items?itemName=waderyan.gitblame)
* [gitflow](https://marketplace.visualstudio.com/items?itemName=vector-of-bool.gitflow)
* [Open in GitHub / Bitbucket / Gitlab / VisualStudio.com !](https://marketplace.visualstudio.com/items?itemName=ziyasal.vscode-open-in-github)

### Unit Testing

* [JavaScript Unit Test snippets](https://marketplace.visualstudio.com/items?itemName=iZDT.javascript-unit-test-snippet)
* [Jest](https://marketplace.visualstudio.com/items?itemName=Orta.vscode-jest)

### React

* [React Redux ES6 Snippets](https://marketplace.visualstudio.com/items?itemName=timothymclane.react-redux-es6-snippets)
* [Reactjs code snippets](https://marketplace.visualstudio.com/items?itemName=xabikos.ReactSnippets)
* [vscode-styled-components](https://marketplace.visualstudio.com/items?itemName=jpoissonnier.vscode-styled-components)

### Other Languages

* [Go](https://marketplace.visualstudio.com/items?itemName=lukehoban.Go)
* [Python](https://marketplace.visualstudio.com/items?itemName=ms-python.python)

### REPLs/Playgrounds

* [Quokka.js](https://marketplace.visualstudio.com/items?itemName=WallabyJs.quokka-vscode) (check out [Introducing Quokka...](https://medium.com/@artem.govorov/introducing-quokka-the-live-scratchpad-for-javascript-free-developer-tool-a0eb15bb4f54))

### Viewers

* [Image Preview](https://marketplace.visualstudio.com/items?itemName=kisstkondoros.vscode-gutter-preview)
* [SVG Viewer](https://marketplace.visualstudio.com/items?itemName=cssho.vscode-svgviewer)
* [View in Browser](https://marketplace.visualstudio.com/items?itemName=qinjia.view-in-browser)
* **Update 2018/02/16:** [Polacode](https://marketplace.visualstudio.com/items?itemName=pnp.polacode), not a viewer per se, but a great way to take beautiful images of code snippets.

{% twitter "964579536137523200" %}

### DevOpsy Stuff

* [Jenkinsfile Support](https://marketplace.visualstudio.com/items?itemName=secanis.jenkinsfile-support)
* [Docker](https://marketplace.visualstudio.com/items?itemName=PeterJausovec.vscode-docker)

### Hack the Editor

* [Guides](https://marketplace.visualstudio.com/items?itemName=spywhere.guides)
* [Custom CSS and JS Loader](https://marketplace.visualstudio.com/items?itemName=be5invis.vscode-custom-css) (currently used for the [Cobalt 2 theme](https://marketplace.visualstudio.com/items?itemName=wesbos.theme-cobalt2).)

**Update 2018/01/28:** The Custom CSS and JS Loader can also be used to get a kind of Operator Mono look by using two fonts. See the tweet below. I did run in to some issues though. The main one was that the CSS class names had changed. Just read the whole tweet thread for all the info.

{% twitter "957434255872839680" %}

TLDR; check out https://gist.github.com/nickytonline/8086319bf5836797ee3dea802a77000d. (maybe another gist to blog post? 😉). And the end result is this. Not sure if I like the cursive in code yet, but maybe it'll grow on me.

![](https://www.iamdeveloper.com/images/posts/_i_hnlbb6v5eorv1u8mb70k.png)


### Miscellaneous

* [Project Manager](https://marketplace.visualstudio.com/items?itemName=alefragnani.project-manager)
* [Bookmarks](https://marketplace.visualstudio.com/items?itemName=alefragnani.Bookmarks)
* [Gatsby Snippets](https://marketplace.visualstudio.com/items?itemName=nickytonline.vscode-gatsby-snippets)
* [XML Tools](https://marketplace.visualstudio.com/items?itemName=DotJoshJohnson.xml)

## Themes

* [Cobalt 2](https://marketplace.visualstudio.com/items?itemName=wesbos.theme-cobalt2)
* [Dracula theme](https://marketplace.visualstudio.com/items?itemName=dracula-theme.theme-dracula)
* [One Dark Pro](https://marketplace.visualstudio.com/items?itemName=zhuangtongfa.Material-theme)
* [Material theme](https://marketplace.visualstudio.com/items?itemName=Equinusocio.vsc-material-theme)

### Current Theme Setup

I'm currently taking the [Cobalt 2](https://marketplace.visualstudio.com/items?itemName=wesbos.theme-cobalt2) theme for a spin with the Fish Shell Fisherman Agnoster theme.

![Cobalt 2 Theme with Fisherman Agnoster Theme](https://www.iamdeveloper.com/images/posts/_nickytonline_3d5ffeab871a6662d7a3f89bb0bed0f8_raw_c00e3c60587414e788f62f89a503bc5a9b220bd0_cobalt2_agnoster_theme.jpg)

I still love using the [Dracula theme](https://marketplace.visualstudio.com/items?itemName=dracula-theme.theme-dracula) with the Fish Shell Fisherman Joker theme, but thought I'd switch it up for a bit.

![Dracula Theme with Fisherman Joker Theme](https://www.iamdeveloper.com/images/posts/_nickytonline_3d5ffeab871a6662d7a3f89bb0bed0f8_raw_c00e3c60587414e788f62f89a503bc5a9b220bd0_dracula_joker_theme.jpg)

I've also used [One Dark Pro](https://marketplace.visualstudio.com/items?itemName=zhuangtongfa.Material-theme), and [Material theme](https://marketplace.visualstudio.com/items?itemName=Equinusocio.vsc-material-theme) which are great as well.

## Shell

I use [Fish Shell](https://fishshell.com) and [Fisherman](https://github.com/fisherman/fisherman) with the Agnoster theme right now.

## Font

I use [Fira Code](https://github.com/tonsky/FiraCode) in VS Code. Once you've [installed](https://github.com/tonsky/FiraCode/wiki#installing-font) Fira Code, the setup in Code is quite easy.

![Fira Font](https://www.iamdeveloper.com/images/posts/_3a8948f34284f378ead7af5846aa432035c687ad_687474703a2f2f732e746f6e736b792e6d652f696d67732f666972615f636f64655f6c6f676f2e737667)

Open your user settings and add the following:

```json
{% raw %}
  // Controls the font family.
  "editor.fontFamily": "Fira Code",
  "editor.fontLigatures": true,
  // Controls the font size.
  "editor.fontSize": 14,
{% endraw %}
```

Boom! Bob's your uncle and you now have Fira Code in all it's awesome ligatureness (is that a word?).

## Custom Key Bindings

```json
{% raw %}
// Place your key bindings in this file to overwrite the defaults
[
  {
    "key": "cmd+shift+z",
    "command": "workbench.action.terminal.focus"
  },
  {
    "key": "cmd+shift+a",
    "command": "workbench.action.terminal.focusNext"
  },
  {
    "key": "cmd+shift+s",
    "command": "workbench.action.terminal.focusPrevious"
  },
  {
    "key": "cmd+shift+x",
    "command": "workbench.action.terminal.kill"
  }
]
{% endraw %}
```

Also, if you're looking for great tips and tricks on Visual Studio code, check out [www.vscodetips.com](https://www.vscodetips.com). One last thing that I'm really looking forward to is the availabilty of [Live Share](https://code.visualstudio.com/blogs/2017/11/15/live-share).

Questions or comments? Hit me up on [Twitter](https://twitter.com/nickytonline/status/878284255146557444).
