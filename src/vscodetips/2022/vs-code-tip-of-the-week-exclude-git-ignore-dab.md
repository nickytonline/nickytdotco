---json
{
  "title": "VS Code Tip of the Week: Exclude Git Ignore",
  "excerpt": "This week's tip is the Exclude Git Ignore user setting. This is a great feature to declutter the tree...",
  "date": "2022-08-29T03:10:00.000Z",
  "tags": [
    "vscode",
    "vscodetips",
    "git"
  ],
  "cover_image": "https://www.iamdeveloper.com/images/posts/_practicaldev_image_fetch_s--vlLTsfLm--_c_imagga_scale,f_auto,fl_progressive,h_420,q_auto,w_1000_https:__dev-to-uploads.s3.amazonaws.com_uploads_articles_ha0okdab6znxnov8v5o5.jpeg",
  "canonicalUrl": "https://community.vscodetips.com/nickytonline/vs-code-tip-of-the-week-exclude-git-ignore-54bn",
  "reading_time_minutes": 1,
  "template": "post"
}
---

This week's tip is the Exclude Git Ignore user setting. This is a great feature to declutter the tree explorer of VS Code with files your project ignores via its `.gitignore` file.

The setting can be enabled/disabled in your user settings for VS Code. You can open the settings starting the command palette and searching for settings.

![VS Code command palette open with the search term settings entered](https://www.iamdeveloper.com/images/posts/_uploads_articles_joetfhq6eij4ikvh0jjv.png)

The user settings window opens. Search for `gitignore` and press the <kbd>ENTER</kbd> key or use the filter button. Ensure the Explorer: Exclude Git Ignore option is checked.

![VS Code user settings user interface open and filtered on the word gitignore](https://www.iamdeveloper.com/images/posts/_uploads_articles_cdmc4fiaxbnpyyclmize.png)
 
You can also change the settings in `settings.json`. Open the command palette again and search for settings. This time select Settings (JSON).

![VS Code command palette open with the search term settings entered and Settings (JSON) is selected](https://www.iamdeveloper.com/images/posts/_uploads_articles_i4stn97fb36eqvheamry.png)
 
In the settings.json file, add the following key/value pair:

`"explorer.excludeGitIgnore": true`

And that's it!

{% embed "https://youtu.be/WKkkgK4FqvM" %}

Happy VS Coding!
