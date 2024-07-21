---json
{
  "title": "How to debug a Firefox add-on (extension)",
  "excerpt": "Before we get started   Firefox supports browser extensions like Chromium-based browsers...",
  "date": "2023-08-17T00:31:41.803Z",
  "tags": [
    "webdev",
    "extensions",
    "browser",
    "javascript"
  ],
  "cover_image": "https://www.nickyt.co/images/posts/_cdn-cgi_image_width=1000,height=420,fit=cover,gravity=auto,format=auto_https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Fj7chuu52qfs62xbyeopo.png",
  "canonical_url": "https://www.nickyt.co/blog/how-to-debug-a-firefox-add-on-extension-489f/",
  "reading_time_minutes": 3,
  "template": "post"
}
---

## Before we get started

Firefox supports browser extensions like Chromium-based browsers (Chrome, Arc, Brave, Edge etc.). Sometimes they’re referred to as add-ons in Firefox land.

This post assumes that you are debugging a browser extension you are building, i.e. have the source code for and can build it locally.

It’s also assumed that the Firefox add-on has been built, i.e. generated the files, including a manifest for the add-on to work.

The following instructions work for [Firefox](https://www.mozilla.org/firefox/new/) and [Firefox Deveoper Edition](https://www.mozilla.org/en-CA/firefox/developer/).

## Setup Firefox for debugging an add-on

1. Open the browser DevTools and click on the three dots button, then select settings.

    ![CleanShot 2023-08-07 at 22 06 39](https://www.nickyt.co/images/posts/_open-sauced_ai_assets_833231_25871029-29b0-4c49-86a3-174014e97076)

1. Scroll down to the Advanced Settings section and ensure _Enable browser chrome and add-on debugging toolboxes_ is checked.

    ![CleanShot 2023-08-07 at 22 08 32](https://www.nickyt.co/images/posts/_uploads_articles_jqzi6ldp2t3ns7dnzc6i.png)

1. Load the add-on by clicking on the puzzle icon in the top right of Firefox or via the application menu, _Tools -> Add-ons and Themes_

    ![CleanShot 2023-08-07 at 22 11 39](https://www.nickyt.co/images/posts/_open-sauced_ai_assets_833231_fa5a3994-2415-4ba8-a156-7b54a467016b)

    ![CleanShot 2023-08-07 at 22 10 35](https://www.nickyt.co/images/posts/_open-sauced_ai_assets_833231_45e479cd-c8e5-4f22-b7e6-575651a5f94b)

1. Click on the cog icon to open the menu and select _Debug Add-ons_

    ![CleanShot 2023-08-07 at 22 12 16](https://www.nickyt.co/images/posts/_open-sauced_ai_assets_833231_c7b2c5ee-f0ba-48ad-b440-ee9e747be2d5)

1. Ensure you built the extension with the changes in my branch by running `npm run build`

1. Click on the _Load Temporary Add-on.._. button

    ![CleanShot 2023-08-07 at 22 13 00](https://www.nickyt.co/images/posts/_open-sauced_ai_assets_833231_f5aa56b3-9303-4d5b-99c4-6381fcb4c980)

1. Select the manifest file of the add-on from the OS file menu and click the _Open_ button.

    ![CleanShot 2023-08-07 at 22 14 23](https://www.nickyt.co/images/posts/_open-sauced_ai_assets_833231_6ff9b4e7-3ca1-4201-b9d4-e72c82183e4b)

1. The extension is now ready for use.

    ![CleanShot 2023-08-07 at 22 15 24](https://www.nickyt.co/images/posts/_open-sauced_ai_assets_833231_6c681751-ec7d-44e5-90ec-3f6cee39edfa)

1. Navigate to a page where you’re using your extension.

1. If you want to debug or inspect the extension, click the _Inspect_ button from the Temporary Extensions section where the extension was just loaded.

    ![CleanShot 2023-08-07 at 22 16 54](https://www.nickyt.co/images/posts/_open-sauced_ai_assets_833231_05b10da1-4a33-4090-8f30-88ca08d15bcc)

1. You now have access to all the same browser dev tools you’re used to for debugging a web site, i.e. Inspect Element, CSS styles inspector, JavaScript debugger, etc.

And that’s it!

Photo by <a href="https://unsplash.com/@bist31?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Birger Strahl</a> on <a href="https://unsplash.com/photos/fOV7nWWIwRk?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
