---json
{
  "title": "VS Code Tip of the week: Live Share",
  "excerpt": "I hinted at this week's tip a few weeks ago.                                                        ...",
  "date": "2022-09-28T03:07:47.667Z",
  "tags": [
    "vscodetips",
    "vscodeextensions"
  ],
  "cover_image": "https://www.nickyt.co/images/posts/_cdn-cgi_image_width=1000,height=420,fit=cover,gravity=auto,format=auto_https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Fepf2x8v0nsyemdtcdstd.png",
  "canonical_url": "https://www.nickyt.co/vscodetips/2022/vs-code-tip-of-the-week-live-share-24b2/",
  "reading_time_minutes": 2,
  "template": "post"
}
---

I hinted at this week's tip a few weeks ago.

{% embed "https://dev.to/vscodetips/vs-code-tip-of-the-week-vscodedev-2gcc" %}

This week's VS Code tip is the [Live Share](https://code.visualstudio.com/learn/collaboration/live-share) extension pack!

![Live Share commands displayed in VS Code's command palette](https://www.nickyt.co/images/posts/_uploads_articles_jrk6gl11vsobh70klosb.png)

This is an excellent collaborative tool if you want to pair with others. If you've never used it, think Google Docs collaborative mode meets your editor.

![Notification in VS Code stating a Live Share session is beginning](https://www.nickyt.co/images/posts/_uploads_articles_217w2oh27z64neynkprl.png)

Some notable features:

* All participants being able to modify code
* The person that initiated the Live Share session can also share their local web server. For example, suppose I start an app on http://localhost:3000 while Live Share is running. Participants can navigate to http://localhost:3000 on their machine and see the app we're building out in real-time.
* You can follow where another participant is navigating code
* You can share a terminal session. This is, by default, disabled, so only allow participants access to your terminal session if you trust them.

And [vscode.dev](https://vscode.dev), which I mentioned at the beginning, can be used with Live Share, so someone anywhere on the planet with a browser can collaborate with you.

If you have access to GitHub Codespaces, it'll work there too. I'm not positive, but if you use Gitpod but run it in a container locally in VS Code, you can also use Live Share.

Now go collaborate!
