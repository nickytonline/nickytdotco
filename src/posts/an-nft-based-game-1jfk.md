---
stackbit_url_path: posts/an-nft-based-game-1jfk
title: An NFT based game
date: '2021-10-28T02:29:29.209Z'
excerpt: >-
  The project   So this past week I built out my second dApp with the current
  cohort in the...
thumb_img_path: >-
  https://res.cloudinary.com/practicaldev/image/fetch/s--WS9QK_wT--/c_imagga_scale,f_auto,fl_progressive,h_420,q_auto,w_1000/https://dev-to-uploads.s3.amazonaws.com/uploads/articles/iezxljfb8pspnqkmea00.jpg
comments_count: 6
positive_reactions_count: 29
tags:
  - web3
  - dapp
  - nextjs
  - react
canonical_url: 'https://www.iamdeveloper.com/posts/an-nft-based-game-1jfk/'
template: post
---
## The project
So this past week I built out my second dApp with the current cohort in the [Buildspace](https://buildspace.so) community. This time round, the project was to create an NFT based game. The goal was to make a game where you could attack a big boss via a transaction on the blockchain that would use a game smart contract.

So like the previous dApp, this required some knowledge of Solidity to build out our smart contact, [Hardhat](https://hardhat.org/) to help us develop our dApp with ETH, and some frontend skills (React and JavaScript).

The project provides a template for the frontend part, but once again I used my [web3 starter project](https://github.com/nickytonline/web3-starter). The benefit of building out with the web3 starter is I'm improving the starter project. 😎

## Going off script

Like the first dApp I built, I made it my own. Here's some fun screenshots from the game I made.

### Select your player

<center>

![Mint your player in Terrible Characters](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/n5apna2gthcp2uzp67vd.gif)

</center>

### Mint your player

<center>

![Player being minted](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/uh00c3pltuxe2gexjzk3.gif)

 </center>

### Attack the big boss

<center>

![A player with a minted NFT attacking a big boss in Terrible Characters](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/n1w4w5ypmaa2bazttn66.gif)

</center>

### When your player is dead

<center>

![When your player is dead](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/c5ask849iqilo3r53uw0.png)
 

</center>

If you're interested in how it's all built, I've open sourced it. I’m sure there’s some refactoring to do, but I’m really happy hour it turned out.


<iframe class="liquidTag" src="https://dev.to/embed/github?args=https%3A%2F%2Fgithub.com%2Fnickytonline%2Fterrible-characters" style="border: 0; width: 100%;"></iframe>


If you want to just check out the game, head on over to [nftgame.iamdeveloper.com](https://nftgame.iamdeveloper.com). Note that it's only on the Rinkeby test network so no real coin will be used.

Until next time!

*[This post is also available on DEV.](https://dev.to/nickytonline/an-nft-based-game-1jfk)*


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
