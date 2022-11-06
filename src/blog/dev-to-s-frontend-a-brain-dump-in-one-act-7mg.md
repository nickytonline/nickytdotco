---json
{
  "title": "dev.to’s Frontend: a brain dump in one act",
  "excerpt": "An explanation to the best of my knowledge on all things front-end in the dev.to codebase",
  "date": "2019-04-23T04:27:39.487Z",
  "tags": [
    "javascript",
    "preact",
    "webpack"
  ],
  "cover_image": "https://www.iamdeveloper.com/images/posts/_practicaldev_image_fetch_s--EtbkTn3s--_c_imagga_scale,f_auto,fl_progressive,h_420,q_auto,w_1000_https:__dev-to-uploads.s3.amazonaws.com_uploads_articles_6k8d3qedhotdzvk8qesq.jpeg",
  "canonicalUrl": "https://www.iamdeveloper.com/posts/dev-to-s-frontend-a-brain-dump-in-one-act-7mg/",
  "reading_time_minutes": 8,
  "template": "post"
}
---

There is currently an issue open to improve the frontend documentation (see [Frontend · DEV Docs](https://docs.dev.to/frontend/)) to get people onboarded quicker in the frontend. Big shout out to @rhymes for opening this issue!

{% github "https://github.com/thepracticaldev/dev.to/issues/2507" %}

I decided to write this post because I’ll be contributing to this documentation issue and thought it would be beneficial for everyone, including myself. I’m hoping people will ask questions in the comments and/or fill in missing gaps in the post.

## [Vanilla JS](#vanilla-js)
There is a lot of the frontend code base in the `app/assets/javascripts` folder. This part of the code base does not use [ES modules](https://hacks.mozilla.org/2018/03/es-modules-a-cartoon-deep-dive/). It loads scripts, runs stuff once the DOM has loaded, has stuff in the global scope and provides a lot of the functionality on the client-side for dev.to.

The assets are loaded through standard [rails](https://rubyonrails.org/)/[fastly](https://github.com/fastly/fastly-ruby) methods that add the `<script />` tags to load the front-end code. Most, if not all of these scripts are deferred (See the `defer` attribute in [&lt;script&gt;: The Script element - HTML](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script)).

## [Preact, webpacker & webpack](#preact-webpack-webpacker)
There is a more modern JavaScript portion of the application as well, but it is not a [Single Page Application](https://en.wikipedia.org/wiki/Single-page_application) (SPA). It is a set of components that are dispersed in key locations, e.g. search, v2 editor, onboarding etc.

Preact components are managed using the [webpacker gem](https://github.com/rails/webpacker) and [webpack](https://webpack.js.org/). If you're curious about webpacker, @maestromac on the team is a great person to speak to.

Scripts for webpack entry points are added to Ruby ERB templates, but they use the webpacker `javascript_pack_tag` to add the script server-side. There is a webpack configuration file, but it is in yaml format. In that config, there are settings that determine where the code is and how entry points are defined.

[dev.to/webpacker.yml at master · thepracticaldev/dev.to · GitHub](https://github.com/thepracticaldev/dev.to/blob/master/config/webpacker.yml)

``` yaml
{% raw %}
...
default: &default
  source_path: app/javascript
  source_entry_path: packs
...
{% endraw %}
```

Looking at the configuration above, this part of the frontend code base can be found in the `app/javascript` folder with webpack entry points found in the `app/javascript/packs` folder.

This represents the base configuration for webpack. If additional configuration is required for an environment, webpacker allows you to enhance the configuration via webpack configuration export.

[dev.to/development.js at master · thepracticaldev/dev.to · GitHub](https://github.com/thepracticaldev/dev.to/blob/master/config/webpack/development.js)

``` javascript
{% raw %}
const environment = require('./environment');
const config = environment.toWebpackConfig();

// For more information, see https://webpack.js.org/configuration/devtool/#devtool
config.devtool = 'eval-source-map';

module.exports = config;
{% endraw %}
```

As the project continues to move forward, expect to see some more things client side becoming preactitized (I just made that up, boom!).

{% github "https://github.com/thepracticaldev/dev.to/issues/354" %}

### An example of how Preact works in the frontend codebase

1. The Search entry point script is loaded via webpacker’s `javascript_pack_tag`, e.g. `<%= javascript_pack_tag "Search", defer: true %>`.

[dev.to/application.html.erb at master · thepracticaldev/dev.to · GitHub](https://github.com/thepracticaldev/dev.to/blob/master/app/views/layouts/application.html.erb#L38)

``` html
{% raw %}
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <% title = yield(:title) %>
    <title><%= title || "#{ApplicationConfig['COMMUNITY_NAME']} Community" %></title>
    <% if internal_navigation? %>
      <style>
			...
      </style>
    <% else %>
      ...
      <style>
        ..
      </style>
      ...
      <%= javascript_pack_tag "Search", defer: true %>
...
{% endraw %}
```

2. The search bar is rendered server-side as well on initial page load. This is what I currently call ghetto server-side rendering (SSR) for Preact. I know that @ben wanted to add preact SSR at some point, but it wasn't that high a priority at the time. Maybe now it will rank higher as more components are created with preact.

[dev.to/_top_bar.html.erb at master · thepracticaldev/dev.to · GitHub](https://github.com/thepracticaldev/dev.to/blob/master/app/views/layouts/_top_bar.html.erb#L12)

``` html
{% raw %}
...
    <div id="nav-search-form-root">
      <div class="nav-search-form">
        <form acceptCharset="UTF-8" method="get">
          <input class="nav-search-form__input" type="text" name="q" id="nav-search" placeholder="search" autoComplete="off" />
        </form>
      </div>
    </div>
...
{% endraw %}
```

3. On the client-side once the DOM content has loaded, Preact takes over.

[dev.to/Search.jsx at master · thepracticaldev/dev.to · GitHub](https://github.com/thepracticaldev/dev.to/blob/master/app/javascript/packs/Search.jsx#L5)

``` javascript
{% raw %}
import { h, render } from ‘preact’;
import { Search } from ‘../src/components/Search’;

document.addEventListener(‘DOMContentLoaded’, () => {
  const root = document.getElementById(‘nav-search-form-root’);

  render(<Search />, root, root.firstElementChild);
});
{% endraw %}
```

4. From there on in, all interactions with the Search box are client-side.

## [InstantClick](#instant-click)
Like the tag line says, “[InstantClick](http://instantclick.io) is a JavaScript library that dramatically speeds up your website, making navigation effectively instant in most cases.”. Basically the way it works is if a user hovers over a hyperlink, chances are their intentions are to click on it. InstantClick will start prefetching the page while a user is hovering over a hyperlink, so that by the time they do click on it, it's instantaneous. Note, on mobile devices, preloading starts on "[touchstart](https://developer.mozilla.org/en-US/docs/Web/API/Element/touchstart_event)".

Aside from prefetching pages, InstantClick also allows you to customize what happens when an InstantClick page changes.

[dev.to/githubRepos.jsx at master · thepracticaldev/dev.to · GitHub](https://github.com/thepracticaldev/dev.to/blob/master/app/javascript/packs/githubRepos.jsx#L11)

``` javascript
{% raw %}
...
window.InstantClick.on('change', () => {
  loadElement();
});
...
{% endraw %}
```

You can also decide whether or not to reevaluate a script in an InstantClick loaded page via the `data-no-instant` attribute. I don’t believe there are any examples in the code base that blacklist script reevaluation. You can also blacklist a link. Here is an example from the codebase.

[dev.to/buildCommentHTML.js.erb at master · thepracticaldev/dev.to · GitHub](https://github.com/thepracticaldev/dev.to/blob/master/app/assets/javascripts/utilities/buildCommentHTML.js.erb#L80)

``` html
{% raw %}
...

function actions(comment) {
  if (comment.newly_created) {
    return '<div class="actions" data-comment-id="'+comment.id+'" data-path="'+comment.url+'">\
              <span class="current-user-actions" style="display: '+ (comment.newly_created ? 'inline-block' : 'none') +';">\
                <a data-no-instant="" href="'+comment.url+'/delete_confirm" class="edit-butt" rel="nofollow">DELETE</a>\
                <a href="'+comment.url+'/edit" class="edit-butt" rel="nofollow">EDIT</a>\
              </span>\
                <a href="#" class="toggle-reply-form" rel="nofollow">REPLY</a>\
            </div>';
  } else {
...
{% endraw %}
```

For more information on this, see the [Events and script re-evaluation in InstantClick](http://instantclick.io/scripts) documentation.

## [Linting / Code Formatting](#linting-formatting)
### eslint & prettier

The project uses eslint with the Prettier plugin. This means that all eslint rules related to code formatting are handled by prettier. For the most part we use the out of the box rules provided by the configurations that we extend but there are some tweaks.

As well, as mentioned above, there are some objects that live in the global scope, e.g. `Pusher`. We need to tell eslint that it is defined otherwise it will complain that it is not defined. This is where the eslint `globals` section comes in handy.

``` javascript
{% raw %}
...
  globals: {
    InstantClick: false,
    filterXSS: false,
    Pusher: false,
    algoliasearch: false,
  }
...
{% endraw %}
```


### Husky, lint-staged
The code base comes with pre-commit hooks that allow us to do things like run eslint before things are committed. If there are listing issues that can be fixed, they will get auto fixed and committed. If there are issues that cannot be resolved, the commit fails and the changes need to be handled manually.

## [Storybook](#storybook)
The dev.to frontend codebase uses [Storybook](https://storybook.js.org/). This is used to develop/showcase components. There is custom configuration for it that can be found in [dev.to/app/javascript/.storybook at master · thepracticaldev/dev.to · GitHub](https://github.com/thepracticaldev/dev.to/tree/master/app/javascript/.storybook).

### Writing a Storybook Story

The Storybook documentation is quite good, but if you're looking for some examples, see [dev.to/app/javascript/src/components/__stories__ at master · thepracticaldev/dev.to · GitHub](https://github.com/thepracticaldev/dev.to/tree/master/app/javascript/src/components/__stories__).

### Stuff to do for Storybook

This is currently not deployed to Netlify, but there is an issue open for it.

{% github "https://github.com/thepracticaldev/dev.to/issues/338" %}

This part of the code base probably needs some love. There is probably a lot of low hanging fruit in here for frontends interested in contributing as I believe there are several components that are not in Storybook.

# Theming
{% link "https://dev.to/devteam/contributors-wanted-night-mode-themes-on-dev-i8n" %}

I was not a part of this initiative, but I know it uses CSS variables heavily for theming, with fallbacks. A great way to do modern theming.

So all that is themeable always applies the CSS variables with whatever their current value is (unless all you have is the fallback because your browser doesn’t support CSS variables).

![CSS code snapshot](https://www.iamdeveloper.com/images/posts/_i_mbpdyjirntq3aoefp2m3.png)

The magic of theme toggling can be seen in action in the user configuration. Here we can see some style being applied if it’s the night theme or if it’s the pink theme.

[dev.to/_user_config.html.erb at master · thepracticaldev/dev.to · GitHub](https://github.com/thepracticaldev/dev.to/blob/master/app/views/layouts/_user_config.html.erb#L8)

``` php
{% raw %}
<script>
  try {
    var bodyClass = localStorage.getItem('config_body_class');
    document.body.className = bodyClass;
    if (bodyClass.includes('night-theme')) {
            document.getElementById('body-styles').innerHTML = '<style>\
              :root {\
        --theme-background: #0d1219;\
        --theme-color: #fff;\
        --theme-logo-background: #0a0a0a;\
			...
        --theme-social-icon-invert: invert(100)</style>'
    } else if (bodyClass.includes('pink-theme')) {
      document.getElementById('body-styles').innerHTML = '<style>\
      :root {\
      --theme-background: #FFF7F9;\
      --theme-color: #333;\
      --theme-logo-background: #fff7f9;\
			...
      --theme-social-icon-invert: invert(0)</style>'
    }
  } catch(e) {
      console.log(e)
  }
</script>
{% endraw %}
```

So if you’re contributing to anything CSS related in the project, keep in the back of your head if you need theming applied to what you’re working on. Don't be shy, just ask if it's not obvious in the issue. @venarius has worked a lot on this, so he’s probably a good person to talk to about theming.


## [Unknowns](#unknowns)
### Service worker
I haven’t worked at all on anything service worker related in the codebase, so if someone can chime in on it’s usage, that’d be awesome 😺. I know it supports the offline page which is a lot of fun to draw on. Shout out to @aspittel for her great work on the off-line page! As well, I’m sure it also does a lot of caching, but again, I don’t know all the details in regards to this part of the code base.

### Edge Caching and the frontend

I have not done any work in regards to edge caching, but I know that dev.to uses [Fastly](https://www.fastly.com/). I imagine all the frontend is heavily cached on a CDN worldwide. @ben I feel like you could probably elaborate more on this part. 😺

<center>

![I know kungfu](https://media.giphy.com/media/3o7btNhMBytxAM6YBa/giphy.gif)
</center>

Hopefully this sheds some more light on the dev.to frontend for folks. 👋

Additional resources:

* [Frontend · DEV Docs](https://docs.dev.to/frontend/)
* [ESLint - Pluggable JavaScript linter](https://eslint.org/)
* [Prettier · Opinionated Code Formatter](https://prettier.io/)
* [GitHub - rails/webpacker: Use Webpack to manage app-like JavaScript modules in Rails](https://github.com/rails/webpacker)
* [webpack](https://webpack.js.org/)
* [GitHub - typicode/husky: 🐶 Git hooks made easy](https://github.com/typicode/husky)
* [GitHub - okonet/lint-staged: 🚫💩 — Run linters on git staged files](https://github.com/okonet/lint-staged)
* [Storybook: UI component workshop for frontend developers](https://storybook.js.org/)
* [InstantClick — JS library to make your website instant](http://instantclick.io/)

Photo by <a href="https://unsplash.com/@fakurian?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Milad Fakurian</a> on <a href="https://unsplash.com/s/photos/brain?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
