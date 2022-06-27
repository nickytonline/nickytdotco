---json
{
  "title": "I built my first dApp!",
  "excerpt": "This past weekend I completed a web3 project from the awesome folks at buildspace.  The project was...",
  "date": "2021-10-19T20:00:48.196Z",
  "tags": [
    "dapp",
    "web3",
    "react"
  ],
  "cover_image": "https://www.iamdeveloper.com/images/posts/_practicaldev_image_fetch_s--0MpNYl1t--_c_imagga_scale,f_auto,fl_progressive,h_420,q_auto,w_1000_https:__dev-to-uploads.s3.amazonaws.com_uploads_articles_vi2yi9st53f151flz189.png",
  "canonicalUrl": "https://www.iamdeveloper.com/posts/i-built-my-first-dapp-3pbm/",
  "reading_time_minutes": 2,
  "template": "post"
}
---

This past weekend I completed a [web3](https://www.freecodecamp.org/news/what-is-web3/) project from the awesome folks at [buildspace](https://buildspace.so).

The project was building out a [dapp](https://ethereum.org/en/developers/docs/dapps/) that allows you to send messages and store them on the blockchain. Under the hood, it was [Solidity](https://github.com/ethereum/solidity) for the [smart contract](https://ethereum.org/en/developers/docs/smart-contracts/), TypeScript, [NEXT.js](https://nextjs.org/), [Theme UI](https://theme-ui.com/), good old semantic markup, and a splash of ARIA in the frontend. Shoutout to the `<details />` element! Aside from that, some other web3 goodies like [hardhat](https://hardhat.org).

The buildspace projects have really straightforward instructions. I did go a bit rogue though. I recently created a web3 starter, and decided to use that as the base for my first foray into dapp development.

{% github "https://github.com/nickytonline/web3-starter" %}

I also decided to make the project my own and made some modifications. For one, I added another field for the message in the smart contract for storing a URL. I was doing this quickly, so just opted to use images from a funny site I love, [http.cat](https://http.cat).

![An open message on pics.iamdeveloper.com showing a picture of a cat in the message](https://www.iamdeveloper.com/images/posts/_uploads_articles_5en7a1fzcyrmikyjmj9k.png)
 
The code is still a bit scrappy as it really was a weekend project, but I'm still happy with how it turned out. I've made some tweaks since then, but there's still a bunch of refactoring to do. 😅

If you're into TypeScript, there's a couple examples of declaration merging [like this one to get the `<marquee />` element in JSX](https://github.com/nickytonline/picture-portal/blob/main/@types/global.d.ts#L3-L10).

The dapp is live running the contract off the [Rinkeby network](https://www.rinkeby.io/). Feel free to check out the dapp's source code.

{% github "https://github.com/nickytonline/picture-portal" %}

And while you're here, check out the live dapp at [pics.iamdeveloper.com](https://pics.iamdeveloper.com)!

![The picture portal site](https://www.iamdeveloper.com/images/posts/_uploads_articles_vsmhsmo18sfdtji14ydw.png)
