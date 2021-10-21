---
stackbit_url_path: posts/i-built-my-first-dapp-3pbm
title: I built my first dApp!
date: '2021-10-19T20:00:48.196Z'
excerpt: >-
  This past weekend I completed a web3 project from the awesome folks at
  buildspace.  The project was...
thumb_img_path: >-
  https://res.cloudinary.com/practicaldev/image/fetch/s--0MpNYl1t--/c_imagga_scale,f_auto,fl_progressive,h_420,q_auto,w_1000/https://dev-to-uploads.s3.amazonaws.com/uploads/articles/vi2yi9st53f151flz189.png
comments_count: 7
positive_reactions_count: 88
tags:
  - dapp
  - web3
  - nextjs
  - react
canonical_url: 'https://dev.to/nickytonline/i-built-my-first-dapp-3pbm'
template: post
---
This past weekend I completed a [web3](https://www.freecodecamp.org/news/what-is-web3/) project from the awesome folks at [buildspace](https://buildspace.so).

The project was building out a [dapp](https://ethereum.org/en/developers/docs/dapps/) that allows you to send messages and store them on the blockchain. Under the hood, it was [Solidity](https://github.com/ethereum/solidity) for the [smart contract](https://ethereum.org/en/developers/docs/smart-contracts/), TypeScript, [NEXT.js](https://nextjs.org/), [Theme UI](https://theme-ui.com/), good old semantic markup, and a splash of ARIA in the frontend. Shoutout to the 
`<details />`
 element! Aside from that, some other web3 goodies like [hardhat](https://hardhat.org).

The buildspace projects have really straightforward instructions. I did go a bit rogue though. I recently created a web3 starter, and decided to use that as the base for my first foray into dapp development.


<iframe class="liquidTag" src="https://dev.to/embed/github?args=https%3A%2F%2Fgithub.com%2Fnickytonline%2Fweb3-starter" style="border: 0; width: 100%;"></iframe>


I also decided to make the project my own and made some modifications. For one, I added another field for the message in the smart contract for storing a URL. I was doing this quickly, so just opted to use images from a funny site I love, [http.cat](https://http.cat).

![An open message on pics.iamdeveloper.com showing a picture of a cat in the message](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/5en7a1fzcyrmikyjmj9k.png)
 
The code is still a bit scrappy as it really was a weekend project, but I'm still happy with how it turned out. I've made some tweaks since then, but there's still a bunch of refactoring to do. 😅

If you're into TypeScript, there's a couple examples of declaration merging [like this one to get the 
`<marquee />`
 element in JSX](https://github.com/nickytonline/picture-portal/blob/main/@types/global.d.ts# L3-L10).

The dapp is live running the contract off the [Rinkeby network](https://www.rinkeby.io/). Feel free to check out the dapp's source code.


<iframe class="liquidTag" src="https://dev.to/embed/github?args=https%3A%2F%2Fgithub.com%2Fnickytonline%2Fpicture-portal" style="border: 0; width: 100%;"></iframe>


And while you're here, check out the live dapp at [pics.iamdeveloper.com](https://pics.iamdeveloper.com)!

![The picture portal site](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/vsmhsmo18sfdtji14ydw.png)
 

*[This post is also available on DEV.](https://dev.to/nickytonline/i-built-my-first-dapp-3pbm)*


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
