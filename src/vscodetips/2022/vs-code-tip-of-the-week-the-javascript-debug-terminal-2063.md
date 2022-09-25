---json
{
  "title": "VS Code Tip of the week: The JavaScript Debug Terminal",
  "excerpt": "I skipped last week's VS Code tip of the week, but for a great reason. I was in Hawaii for my work...",
  "date": "2022-09-21T02:42:12.906Z",
  "tags": [
    "vscodetips",
    "javascript",
    "node"
  ],
  "cover_image": "https://www.iamdeveloper.com/images/posts/_practicaldev_image_fetch_s--uMMGKugW--_c_imagga_scale,f_auto,fl_progressive,h_420,q_auto,w_1000_https:__dev-to-uploads.s3.amazonaws.com_uploads_articles_5uhh2kbhn8jky3yuck8d.png",
  "canonicalUrl": "https://www.iamdeveloper.com/vscodetips/2022/vs-code-tip-of-the-week-the-javascript-debug-terminal-2063/",
  "reading_time_minutes": 1,
  "template": "post"
}
---

I skipped last week's VS Code tip of the week, but for a great reason. I was in Hawaii for my work offsite!

{% embed "https://twitter.com/nickytonline/status/1570632307383627776" %}

VS Code has an integrated terminal. You can open it and use it like you would an external terminal. One cool thing though in VS Code is you can choose different terminals. One terminal you can select is the JavaScript Debug Terminal.


![Context menu to decide which terminal you want to load in VS Code](https://www.iamdeveloper.com/images/posts/_uploads_articles_xoejxm8bl2ra8trws3ej.png)

It's a terminal that loads your regular shell, but if you run anything that is Node.js, it will allow you to debug it. This is super powerful and convenient.

You can start an npm script, a node process, anything that starts Node.js and you're able to add breakpoints in VS Code and debug right away.

I always use to run `node --inspect-brk ./some-node-process.js` but now that is no longer required in a lot of cases.

![Debugging JavaScript in VS Code](https://www.iamdeveloper.com/images/posts/_uploads_articles_5ei14x4k40q0xm7aksey.png)

If you'd like to learn more about the JavaScript debug terminal, check out [the official documenation](https://code.visualstudio.com/docs/nodejs/nodejs-debugging#_javascript-debug-terminal).
