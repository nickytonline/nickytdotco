---json
{
  "title": "VS Code Tip of the Week: The Thunder Client Extension",
  "excerpt": "This week's VS Code Tip off the Week is the Thunder Client extension.   Thunder Client is a...",
  "date": "2022-07-04T12:55:57.789Z",
  "tags": [
    "vscode",
    "vscodextension",
    "webdev",
    "vscodetips"
  ],
  "cover_image": "https://www.iamdeveloper.com/images/posts/_practicaldev_image_fetch_s--UuAd6xhj--_c_imagga_scale,f_auto,fl_progressive,h_420,q_auto,w_1000_https:__dev-to-uploads.s3.amazonaws.com_uploads_articles_xb7x118t57bx4xnr45ob.png",
  "canonicalUrl": "https://community.vscodetips.com/nickytonline/vs-code-tip-of-the-week-the-thunder-client-extension-1k3p",
  "reading_time_minutes": 2,
  "template": "post"
}
---

This week's VS Code Tip off the Week is the [Thunder Client](https://marketplace.visualstudio.com/items?itemName=rangav.vscode-thunder-client) extension.

> Thunder Client is a lightweight Rest API Client Extension for Visual Studio Code

There's amazing tools out there like [Postman](https://www.postman.com/), [Postwoman](https://dev.to/liyasthomas/postwoman-is-changing-name-igp) (now [Hoppscotch](https://hoppscotch.io/)), etc. but I like the fact that I can use this directly within VS Code.

![Typing thund in the VS Code Command Palette](https://www.iamdeveloper.com/images/posts/_uploads_articles_w3v74xjb4da0pyeixmcq.png)
 
Select **Thunder Client New Request** from the available items in the list.

![The Thunder Client New Request window open in VS Code](https://www.iamdeveloper.com/images/posts/_uploads_articles_ampt9xmx8rrm6036eg1a.png)

The New Request window opens with a test [GET request](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/GET) to https://www.thunderclient.com/welcome.

Click the *SEND* button to make the GET request. A response from thunderclient.com is returned.

![The response from the GET request to https://www.thunderclient.com/welcome. The value is the following JSON: {
  "message": "Welcome to Thunder Client",
  "about": "Thunder Client is a hand-crafted lightweight Rest API Client extension for VS Code.",
  "createdBy": "Ranga Vadhineni",
  "github": "github.com/rangav/thunder-client-support",
  "twitter": "twitter.com/thunder_client",
  "auth": "Supported Authentication methods Basic Auth, Bearer Token & OAuth 2.0",
  "graphql": "The client supports Graphql Query & Variables",
  "support": "For Bugs & Feature requests please submit on github",
  "share": "Please spread the word about Thunder Client"
}](https://community.vscodetips.com/uploads/articles/ic9loinj56tpmh56mj6g.png)

There's a lot more you can do with the extension, so I encourage you to check out their repository on GitHub!

{% embed "https://github.com/rangav/thunder-client-support" %}

Happy VS Coding!
