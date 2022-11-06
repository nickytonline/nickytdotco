---json
{
  "title": "Changelog: DEV upgraded to Webpacker 4/Babel 7",
  "excerpt": "This week brought a major upgrade to the frontend infrastructure for DEV. We've been on webpacker 3.x...",
  "date": "2020-03-20T11:51:52.851Z",
  "tags": [
    "rails",
    "webpack",
    "javascript",
    "changelog"
  ],
  "cover_image": "https://www.iamdeveloper.com/images/posts/_practicaldev_image_fetch_s--S1-vDujY--_c_imagga_scale,f_auto,fl_progressive,h_420,q_auto,w_1000_https:__dev-to-uploads.s3.amazonaws.com_i_cc61ssp14pyl9of3i37y.jpg",
  "canonicalUrl": "https://www.iamdeveloper.com/posts/changelog-dev-upgraded-to-webpacker-4-babel-7-1mm4/",
  "reading_time_minutes": 2,
  "template": "post"
}
---

This week brought a major upgrade to the frontend infrastructure for DEV. We've been on webpacker 3.x and Babel 6.x for quite a while now. There were several attempts, including a couple of my own prior to working at DEV that were unsuccessful. However, this week during the last week of our cool-down period before we start our next cycle of development, I had time to perform the upgrade successfully. We are now using webpacker 4.22 and Babel 7.x.

If you're not familiar with webpacker, I encourage you to check out the project. The TLDR though is that it's a Ruby gem that makes integrating webpack bundles into a Rails app very easy.

{% github "https://github.com/rails/webpacker" %}

The upgrade opens up a lot of things that were being held back by the webpacker 4 upgrade. With the upgrade, we can now do the following:

* Upgrade to the latest Storybook. We're currently on a very old version that is missing a lot of the new awesome features.
* It moves us one more step closer to upgrading to Rails 6

Another benefit of the upgrade is faster builds in the frontend.

I won't bore you with the details of the upgrade process as [they are documented](https://github.com/rails/webpacker/blob/master/docs/v4-upgrade.md) already in the webpacker repository.

The issues that I ran in to during my initial attempts were false negatives. DEV, for those who aren't aware, uses [Preact](https://preactjs.com/) in the frontend, not [React](https://reactjs.org/). Why do I bring this up? One, for awareness, but also because the issues I ran into were related to running an older version of Preact (we [have a blocker for upgrading](https://github.com/thepracticaldev/dev.to/pull/5639) to Preact X) that was not compatible with the [React DevTools](https://github.com/facebook/react-devtools).

Because the tooling was not compatible, it was creating weird UI issues when the React Devtools were running. In some cases I saw components twice, in other cases I received errors about root something something. In the end, with a clear head this week, I realized that was the issue and was able to get it all sorted.

For those interested, here is the [merged PR](https://github.com/thepracticaldev/dev.to/pull/6664).

That's all for now peeps!

Photo by [Sebastian Herrmann](https://unsplash.com/@herrherrmann?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/s/photos/boxes?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)
