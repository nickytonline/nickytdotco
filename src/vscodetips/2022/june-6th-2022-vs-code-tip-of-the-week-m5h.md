---json
{
  "title": "VS Code Tip of the Week: New Tailwind CSS language mode for VS Code",
  "excerpt": "Tailwind uses a bunch of non-standard at-rules like @tailwind and @apply, so you get lint warnings...",
  "date": "2022-06-07T02:39:25.653Z",
  "tags": [
    "vscode",
    "vscodetips",
    "vscodeextension"
  ],
  "cover_image": "https://www.nickyt.co/images/posts/_cdn-cgi_image_width=1000,height=420,fit=cover,gravity=auto,format=auto_https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Fhpcporzgaefiuzx2bl2w.png",
  "canonical_url": "https://community.vscodetips.com/nickytonline/june-6th-2022-vs-code-tip-of-the-week-pf0",
  "reading_time_minutes": 1,
  "template": "post"
}
---

> Tailwind uses a bunch of non-standard at-rules like @tailwind and @apply, so you get lint warnings in VS Code if you use the regular CSS language mode.
>
>To get around this, we’ve always recommended people use the PostCSS Language Support plugin which gets rid of those warnings, but also removes all of the other CSS IntelliSense support.

You can read more about the [new Tailwind CSS language mode for VS Code](https://tailwindcss.com/blog/2022-05-23-headless-ui-v1-6-tailwind-ui-team-management?ck_subscriber_id=1238260793#new-tailwind-css-language-mode-for-vs-code)

Since that then, the Tailwind team has released [Tailwind CSS Intellisense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)

![Tailwind CSS Intellisense extension missing on one side showing lint errors and on the other side the Tailwind CSS Intellisense extension enabled with no errors](https://www.nickyt.co/images/posts/__next_static_media_tailwindcss-language-mode.743db867cce5edbd2a3d15d503609a45.png)

Once you have the extension installed, if you want to try it out choose “Tailwind CSS” as the language mode for your CSS files.

Thanks Tailwind team and happy VS Coding!
