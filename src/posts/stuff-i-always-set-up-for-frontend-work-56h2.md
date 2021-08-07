---
stackbit_url_path: posts/stuff-i-always-set-up-for-frontend-work-56h2
title: Stuff I always Set Up for Frontend Work
date: '2020-10-18T04:20:19.736Z'
excerpt: >-
  There's a few things I always set up when working on a frontend project:
  ESLint, Prettier, husky and...
thumb_img_path: >-
  https://res.cloudinary.com/practicaldev/image/fetch/s--aq5cDtoo--/c_imagga_scale,f_auto,fl_progressive,h_420,q_auto,w_1000/https://dev-to-uploads.s3.amazonaws.com/i/olzaevg5khtiad835vke.png
comments_count: 6
positive_reactions_count: 245
tags:
  - javascript
  - webdev
  - beginners
  - productivity
canonical_url: >-
  https://www.iamdeveloper.com/posts/stuff-i-always-set-up-for-frontend-work-56h2/
template: post
---
There's a few things I always set up when working on a frontend project: ESLint, Prettier, husky and lint-staged.

## ESLint

[ESLint](https://eslint.org) for linting frontend files: JavaScript, JSX and TypeScript (if the project uses [TypeScript](https://dev.to/nickytonline/why-you-might-want-to-consider-using-typescript-6j3)). There are all kinds of [rules](https://eslint.org/docs/rules/) and [plugins](https://eslint.org/docs/developer-guide/working-with-plugins) for this, but the gist of using a linter is to keep your code adhering to a project's standards/styles.

![A screen shot of a lint error](https://dev-to-uploads.s3.amazonaws.com/i/nyu8r5kj3mu5arl37mns.png)

## Prettier

[Prettier](https://prettier.io) is for formatting your code. It is opinionated and offers some configuration but it is minimal, for example single quotes vs. double quotes.

![prettier code formatting tool in action formatting some code](https://dev-to-uploads.s3.amazonaws.com/i/1b5cv01xqxhzn9w0jdhi.gif)

## stylelint

[stylelint](https://stylelint.io) as the package name implies, is a linter for Cascading Style Sheets (CSS).

## Side Effect: Improving Code Reviews

ESLint, stylelint and Prettier enable you to remove any discussion of what they do from a code review, because the rules are already set in place. This is great because it allows you to focus on the actual code review which is the bug you're trying to fix or a feature you're implementing.

## husky

[husky](https://github.com/typicode/husky) is a node package that makes creating [Git hooks](https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks) a joy. What's a Git hook? It's a script that runs during an event in a repository. For example, before a commit. Once the husky package is installed, all that is required is a configuration to decide which Git hooks to use and what to run for that particular hook.

Here is a sample configuration.


```json
"husky": {
  "hooks": {
    "pre-commit": "echo 'hi'"
  }
}
```


When a file is being committed to the repository, the above configuration will run 
`echo 'hi'`
 before the file is committed.

![A Git pre-commit hook running in a terminal before a commit](https://dev-to-uploads.s3.amazonaws.com/i/x64xahqayl7uj5xiqapb.png)  

## lint-staged

[lint-staged](https://github.com/okonet/lint-staged) is a node package that makes it easier to run tasks for staged files in a Git repository. If we go back to our example above that echo's hi, we can change that command to 
`lint-staged`
.


```json
"husky": {
  "hooks": {
    "pre-commit": "lint-staged"
  }
}
```


If we commit a file, the Git pre-commit hook will run lint-staged, but nothing will happen. We need to let lint-staged know what we want to do during the pre-commit. Let's get a configuration set up for lint-staged.


```json
"lint-staged": {
  "*.{js}": [
    "prettier --write"
  ]
}
```


Now if we commit a file, the pre-commit hook will run and if any JavaScript files are being committed, the pre-commit hook, thanks to lint-staged will run prettier on the file and update the file with any formatting changes and then commit the file.

![A Git pre-commit hook running lint-staged tasks](https://dev-to-uploads.s3.amazonaws.com/i/27q7nzts52vzyym5pmpg.png)

## Putting it All Together

All these tools together make for a great automated workflow in regards to coding standards/style guidelines for a project.

Now let's bring it all together so you can use this in your own project.

You'll need to install all the dependencies mentioned above plus a few more. I'll explain why in a minute.


```bash
npm install -D eslint prettier eslint-config-prettier eslint-plugin-prettier husky lint-staged stylelint stylelint-config-standard
```


`eslint-config-prettier`
 and 
`eslint-plugin-prettier stylelint stylelint-config-standard`
 are required so that eslint is only in charge of rules that do not related to formatting as prettier handles formatting.

If you're wondering what the 
`-D`
 is for, that's so they get installed as 
`devDependencies`
 instead of 
`dependencies`
 in the package.json. For more on that, see [Specifying dependencies and devDependencies in a package.json file](https://docs.npmjs.com/specifying-dependencies-and-devdependencies-in-a-package-json-file).

In the root of your project, create a file called 
`.eslintrc.js`
. This will house the eslint configuration that we want. We'll go with the eslint recommended rules.


```javascript
/* eslint-env node */
module.exports = {
  extends: ['eslint:recommended', 'prettier'],
  plugins: ['prettier'],
  parserOptions: {
    ecmaVersion: 2018, // Put whatever version you want here
  },
  env: {
    browser: true,
  }, 
};
```


Note: 
`/* eslint-env node */`
 is being used as it's a frontend project and the .eslintrc.js file is Node.js. It allows us to say, "This file is a Node.js file". Thanks to [Rafi](https://dev.to/rafi993) for [pointing this out to me](https://github.com/forem/forem/pull/10767# pullrequestreview-507865219).

This is a base eslint configuration. If you were for example using React in your project, there would be additional configuration for React eslint rules.

In the root of your project, create a file called 
`.stylelintrc.json`
. This will house the stylelint configuration that we want. We'll go with the stylelint recommended rules.


```json
{
  "extends": "stylelint-config-standard"
}
```


This is a base stylelint configuration. Feel free to expand on these standard stylelint rules.

Next up we need to our husky and lint-staged configurations. In your package.json file add these two configuration sections.


```json
"lint-staged": {
    "*.js": [
        "eslint —-fix",
        "prettier --write"
    ],

    "*.{css,scss}": [
        "stylelint"
    ]
},
"prettier": {
    "singleQuote": true,
    "trailingComma": "all",
    "printWidth": 80,
    "tabWidth": 4
}
```


If you don’t trust the robots for fixing your code, remove the 
`—-fix`
 argument off of the eslint command.

The [prettier configuration](https://prettier.io/docs/en/configuration.html) above is what I use, but feel free to tweak it to your liking.

All the moving parts are running now. If you end up using a boilerplate these tools might already be included. For example the [Create React App](https://reactjs.org/docs/create-a-new-react-app.html) toolchain comes with eslint.

### Bonus: Run jest Tests

I added this as a bonus tip, because not all projects use jest.

But... if your project uses [jest](https://jestjs.io), you can also run tests related to files that are being committed.


```json
"lint-staged": {
    "*.js": [
        "eslint —-fix",
        "prettier --write",
        "jest --findRelatedTests"
    ]
}
```


## Learn More About Your Tools

I strongly encourage you to dig further into all the tools discussed. Knowing your tools really well is a super power.

ESLint, prettier, stylelint, husky and lint-staged are great tools for the frontend, now go make something great with this setup!

Until next time folks!

![Character in a film saying "Yes! That is awesome](https://media.giphy.com/media/Z6f7vzq3iP6Mw/giphy.gif)



*[This post is also available on DEV.](https://dev.to/nickytonline/stuff-i-always-set-up-for-frontend-work-56h2)*


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
