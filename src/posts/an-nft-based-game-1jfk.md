---json
{
  "title": "An NFT based game",
  "excerpt": "The project   So this past week I built out my second dApp with the current cohort in the...",
  "date": "2021-10-28T02:29:29.209Z",
  "tags": [
    "web3",
    "dapp",
    "react"
  ],
  "cover_image": "https://www.iamdeveloper.com/images/posts/_practicaldev_image_fetch_s--WS9QK_wT--_c_imagga_scale,f_auto,fl_progressive,h_420,q_auto,w_1000_https:__dev-to-uploads.s3.amazonaws.com_uploads_articles_iezxljfb8pspnqkmea00.jpg",
  "canonicalUrl": "https://www.iamdeveloper.com/posts/an-nft-based-game-1jfk/",
  "reading_time_minutes": 2,
  "template": "post"
}
---

## The project
So this past week I built out my second dApp with the current cohort in the [Buildspace](https://buildspace.so) community. This time round, the project was to create an NFT based game. The goal was to make a game where you could attack a big boss via a transaction on the blockchain that would use a game smart contract.

So like the previous dApp, this required some knowledge of Solidity to build out our smart contact, [Hardhat](https://hardhat.org/) to help us develop our dApp with ETH, and some frontend skills (React and JavaScript).

The project provides a template for the frontend part, but once again I used my [web3 starter project](https://github.com/nickytonline/web3-starter). The benefit of building out with the web3 starter is I'm improving the starter project. 😎

## Going off script

Like the first dApp I built, I made it my own. Here's some fun screenshots from the game I made.

### Select your player

<center>

![Mint your player in Terrible Characters](https://www.iamdeveloper.com/images/posts/_uploads_articles_n5apna2gthcp2uzp67vd.gif)

</center>

### Mint your player

<center>

![Player being minted](https://www.iamdeveloper.com/images/posts/_uploads_articles_uh00c3pltuxe2gexjzk3.gif)

 </center>

### Attack the big boss

<center>

![A player with a minted NFT attacking a big boss in Terrible Characters](https://www.iamdeveloper.com/images/posts/_uploads_articles_n1w4w5ypmaa2bazttn66.gif)

</center>

### When your player is dead

<center>

![When your player is dead](https://www.iamdeveloper.com/images/posts/_uploads_articles_c5ask849iqilo3r53uw0.png)
 

</center>

If you're interested in how it's all built, I've open sourced it. I’m sure there’s some refactoring to do, but I’m really happy hour it turned out.

{% github "https://github.com/nickytonline/terrible-characters" %}

If you want to just check out the game, head on over to [nftgame.iamdeveloper.com](https://nftgame.iamdeveloper.com). Note that it's only on the Rinkeby test network so no real coin will be used.

Until next time!
