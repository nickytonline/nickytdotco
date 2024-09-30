---json
{
  "title": "Creating a GitHub Copilot Extension: A Step-by-Step Guide",
  "excerpt": "GitHub Copilot, the AI-powered coding assistant, has recently introduced Copilot Extensions to...",
  "date": "2024-09-30T05:00:00.000Z",
  "tags": [
    "github",
    "githubcopilot",
    "ai",
    "genai"
  ],
  "cover_image": "https://www.nickyt.co/images/posts/_cdn-cgi_image_width=1000,height=420,fit=cover,gravity=auto,format=auto_https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Fhkxr62oih47ls0qrzx3i.jpeg",
  "canonical_url": "https://dev.to/nickytonline/creating-your-first-github-copilot-extension-a-step-by-step-guide-28g0",
  "reading_time_minutes": 8,
  "template": "post"
}
---

GitHub Copilot, the AI-powered coding assistant, has recently introduced [Copilot Extensions](https://github.com/features/copilot/extensions) to enhance its ecosystem. This feature, now in [public beta](https://github.blog/news-insights/product-news/enhancing-the-github-copilot-ecosystem-with-copilot-extensions-now-in-public-beta/), allows developers to create custom extensions that integrate with Copilot. In this blog post, we'll walk through the process of creating your first GitHub Copilot extension.

Before we begin, it's important to note that you need to have an active GitHub Copilot subscription to create and use Copilot extensions.

## Creating the Endpoint for Your Copilot Extension

A Copilot extension is essentially a GitHub app with a specific endpoint. Let's set up the project and create this endpoint, which together will form your Copilot extension.

### Setting Up Your Project

In this guide, we're using [Hono.js](https://hono.dev/) as our web framework, but you can use any web framework or web server of your choice. The core concepts will remain the same regardless of the framework you choose. The only thing to be aware of about the SDK is, for the moment, the only languages supported are TypeScript and JavaScript.

1. Create a new Hono project using the Hono CLI:

    ```bash
{% raw %}
    npm create hono@latest
    ```

    Follow the prompts to set up your project. This will create a new TypeScript project using [Hono.js](https://hono.dev/), a lightweight and fast web framework.

2. Install the preview SDK for Copilot extensions and Octokit's core package:

    ```bash
    npm install @copilot-extensions/preview-sdk @octokit/core
    ```

    {% embed "https://github.com/copilot-extensions/preview-sdk.js" %}

3. Open your main file (e.g., `src/index.ts`) and let's start by importing the necessary dependencies:

    ```typescript
    import { Hono } from 'hono'
    import { Octokit } from "@octokit/core";
    import {
      createAckEvent,
      createDoneEvent,
      createErrorsEvent,
      createTextEvent,
      getUserMessage,
      verifyAndParseRequest,
    } from "@copilot-extensions/preview-sdk";

    const app = new Hono();
    ```

### Implementing the Endpoint

Now, let's implement the endpoint that will handle requests from GitHub Copilot:

1. Create a root route that receives a form post, `/`. This is the endpoint that Copilot will interact with:

    ```typescript
    app.post("/", async (c) => {
      // ... (we'll fill this in next)
    });
    ```

2. When a message comes in, you need to verify the request and parse the payload:

    ```typescript
    const body = await c.req.text();
    const signature = c.req.header("github-public-key-signature") ?? "";
    const keyID = c.req.header("github-public-key-identifier") ?? "";

    const { isValidRequest, payload } = await verifyAndParseRequest(
      body,
      signature,
      keyID,
      {
        token: tokenForUser,
      }
    );

    if (!isValidRequest) {
      console.error("Request verification failed");
      c.header("Content-Type", "text/plain");
      c.status(401);
      c.text("Request could not be verified");
      return;
    }
    ```

3. After verifying the request, process the message and create a response. Here's a simple example that greets the user:

    ```typescript
    const octokit = new Octokit({ auth: tokenForUser });
    const user = await octokit.request("GET /user");
    const prompt = getUserMessage(payload);

    return c.text(
      createAckEvent() +
        createTextEvent(
          `Welcome ${user.data.login}! It looks like you asked the following question, "${prompt}". This is a GitHub Copilot extension template, so it's up to you to decide what you want to implement to answer prompts.`
        ) +
        createDoneEvent()
    );
    ```

This example uses the GitHub Octokit package to get the user's login name and greets them. The `createTextEvent` function is used to create the response that GitHub Copilot will display.

## Exposing Your Extension

To test your Copilot extension, you need to make it publicly accessible:

1. If using Visual Studio Code (VS Code), enable [port forwarding](https://code.visualstudio.com/docs/editor/port-forwarding). Note that the port is private by default, a good thing, but for our use case, we need to set it to public.

    ![Port forwarding tab in the bottom dock of VS Code](https://www.nickyt.co/images/posts/_uploads_articles_qacy00wwwnnlp82gb3p1.png)

1. Alternatively, use tools like [cloudflared](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/get-started/create-local-tunnel/) or [ngrok](https://ngrok.com) to expose a public URL.

In the provided code, the server is set up to run on port 3000:

{% endraw %}
```typescript
const port = 3000;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
```

It's worth mentioning that this setup is great for testing, but once you're ready to make your extension public, you'll need to deploy the web app (which acts as the GitHub app) to a publicly accessible location.

## Creating a GitHub App

Create a new GitHub app on your personal account for testing purposes. Head to your settings page on GitHub, and at the bottom, to the left, click on the Developer Settings link. This will bring you to your GitHub apps. You can also directly navigate to your GitHub apps page at [https://github.com/settings/apps](https://github.com/settings/apps).

### General settings

1. Enter a GitHub App name, e.g. my copilot extension
1. Enter a URL for the homepage. This can be the same as the test URL for now.
1. Set the Callback URL (currently required). This can be the same as the test URL for now. Even if you're not using OAuth you still need to put a URL here. I'm told in future this may no longer be required.

    ![A new GitHub app's settings page](https://www.nickyt.co/images/posts/_uploads_articles_a0xtzyphncdddesh4aoj.png)

1. Disable webhooks if they're enabled.

    ![Webhooks settings section](https://www.nickyt.co/images/posts/_uploads_articles_7lwy83g0ranuuwkhkwt5.png)

1. Make sure the app is initially accessible only to you. You can enable it for everyone when you're ready to make your GitHub Copilot extension publicly available.

    ![GitHub app visibility setting of just you or everyone](https://www.nickyt.co/images/posts/_uploads_articles_gs52bzu3wx6or4824tdv.png)

1. Click the **Create GitHub App** button to create the GitHub app.

### Permissions & events settings

Next up, we'll need to configure permissions. We want to provide the bare minimum permissions for a Copilot extension to work.

![Permissions settings for a GitHub app](https://www.nickyt.co/images/posts/_uploads_articles_pcve43shvpcf3f29nb8h.png)

1. Expand the **Account permissions** sections and set the **Copilot Chat** permission to _read-only_. The default is _No access_.

    ![Account permissions section of a GitHub app](https://www.nickyt.co/images/posts/_uploads_articles_dy8k3t9hu2yeu1bhny0z.png)

1. Click **Save changes**. Don't be alarmed by the _Are you sure you want to update permissions?_ message.

    ![Save changes button](https://www.nickyt.co/images/posts/_uploads_articles_z84spjnhh0u8l793hgyx.png)

### Copilot settings

1. Set the **App Type** to _Agent_. It's set to _Disabled_ by default.
1. Set the **URL** to the root of the public URL you exposed via tunneling/port forwarding.

    ![A GitHub App's Copilot settings section](https://www.nickyt.co/images/posts/_uploads_articles_nsohzqzw3w6j8sjuv3ht.png)

1. Click Save.

Congratulations! You've configured your first Copilot extension!

![GitHub apps section of developer settings on GitHub](https://www.nickyt.co/images/posts/_uploads_articles_05qv1m77z54uupzvb4ca.png)

## Install Your Copilot Extension

Before we can use the extension, it has to be installed.

1. Navigate to your [GitHub apps in your developer settings](https://github.com/settings/apps).

    ![The GitHub apps section of GitHub developer settings](https://www.nickyt.co/images/posts/_uploads_articles_kmuqlkjfeu45q94hdo9v.png)

1. Click the **Edit** button to edit the app.

1. Go to the **Install App** section of the GitHub app's settings.

    ![GitHub App's Install App settings panel](https://www.nickyt.co/images/posts/_uploads_articles_6er5kn46pgvm6g49aa3b.png)

1. Click the **Install** button to install the application

1. You're brought to an intermediary page to confirm the installation of the GitHub app. Click the **Install** button.

    ![GitHub app installation confirmation step](https://www.nickyt.co/images/posts/_uploads_articles_jcm1daw29l1xuqjq4opu.png)

1. Your Copilot extension is installed for your GitHub account.

    ![Post GitHub app installation screen showing the app installed](https://www.nickyt.co/images/posts/_uploads_articles_2b7en5u28wxg07unicgb.png)

## Testing Your Extension

You can test your Copilot extension in a few environments:

1. GitHub.com's Copilot chat
1. [VS Code's Copilot Chat](https://marketplace.visualstudio.com/items?itemName=VisualStudioExptTeam.VSGitHubCopilot)
1. [Visual Studio's Copilot Chat](https://learn.microsoft.com/en-us/visualstudio/ide/visual-studio-github-copilot-chat?view=vs-2022)

For these environments, follow these steps:

1. In the GitHub Copilot chat, type "@" to see available extensions.

1. Your extension should appear as, e.g. "@my-copilot-extension".

    ![Copilot chat on GitHub.com displaying the available Copilot extensions](https://www.nickyt.co/images/posts/_uploads_articles_jjya7he52fm0gjf12e21.png)

    ![Copilot chat in Visual Studio Code displaying the available Copilot extensions](https://www.nickyt.co/images/posts/_uploads_articles_zgoskatjirgnercam1gk.png)

1. Select your extension and ask a question or perform an operation.

1. The Copilot extension will return a response of _Welcome your_github_username! It looks like you asked the following question, "your_question". This is a GitHub Copilot extension template, so it's up to you to decide what you want to implement to answer prompts._

    ![Copilot chat responding, "Welcome nickytonline! It looks like you asked the following question, "What is the most used programming language?". This is a GitHub Copilot extension template, so it's up to you to decide what you want to implement to answer prompts."](https://www.nickyt.co/images/posts/_uploads_articles_l5hcwm6zkx05iynjhp1x.png)

It won't respond to your specific question as that functionality has not been implemented. This is where you can explore the preview SDK or integrate with a third-party service to provide more meaningful responses.

## A Real-World Example

I've created a proof-of-concept (POC) Copilot extension for OpenSauced, where I work, that demonstrates these principles in action.

{% embed "https://github.com/nickytonline/open-sauced-copilot-ext-poc" %}

This extension utilizes [OpenSauced's StarSearch](https://opensauced.pizza/blog/open-source-insights-with-starsearch) feature to provide open-source insights directly within Copilot.

Curious about StarSearch? 👇

{% embed "https://dev.to/bekahhw/creating-open-source-connections-1ai2" %}

This example showcases how you can leverage external APIs and services to create powerful, context-aware extensions that enhance the Copilot experience.

{% embed "https://www.youtube.com/watch?v=3HdFMLmNN64" %}

## Grab the GitHub Copilot Extension Template

If you're interested in starting your own GitHub Copilot Extension, I've created a template to help you get started quickly:

{% embed "https://github.com/nickytonline/copilot-extension-template" %}

This template provides a solid foundation for building your extension, incorporating best practices and a basic structure to build upon. The template uses the Hono.js Node.js server, but it's worth noting that Hono.js offers various adapters for different deployment environments. You can use adapters for platforms like Netlify, Vercel, Cloudflare Workers, and more. For more information on Hono.js and its adapters, check out their [Getting Started guide](https://hono.dev/docs/getting-started/basic).

I also encourage you to take a peek at the examples in the copilot-extensions organization on GitHub, including some examples in the preview SDK:

{% embed "https://github.com/copilot-extensions" %}

These examples can provide inspiration and guidance as you develop your own extensions.

## Take a deep dive into Copilot extensions and the preview SDK

For a deeper dive into the preview SDK and Copilot extensions in general, check out this video: "Let's build a Copilot extension!" Shout out to Gregor Martynus (@gr2m) and Francis Batac (@francisfuzz) for hanging with me!

{% embed "https://www.youtube.com/watch?v=j-2wex4saUI" %}

This video provides valuable insights into the development process and can help you understand the nuances of working with Copilot extensions.

I also encourage you to check out the [official GitHub Copilot documentation](https://docs.github.com/en/copilot).

## Wrapping up

Creating a GitHub Copilot extension opens up new possibilities for enhancing your development workflow. By following this guide, you can start building custom extensions that leverage the power of Copilot while adding your own unique functionality.

Remember, the Copilot Extensions feature is still in beta, so keep an eye out for updates and improvements as the ecosystem evolves. This is an exciting time to get involved and potentially shape the future of AI-assisted coding!

Until the next one!
