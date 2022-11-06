---json
{
  "title": "How I Do Code Reviews",
  "excerpt": "Someone in my Virtual Coffee community asked about getting better at reviewing pull requests (PR)...",
  "date": "2021-12-09T00:57:44.993Z",
  "tags": [
    "career",
    "programming",
    "github",
    "git"
  ],
  "cover_image": "https://www.iamdeveloper.com/images/posts/_practicaldev_image_fetch_s--XuDzaAIL--_c_imagga_scale,f_auto,fl_progressive,h_420,q_auto,w_1000_https:__dev-to-uploads.s3.amazonaws.com_uploads_articles_iz97ilpuk9knd74mixxu.jpeg",
  "canonicalUrl": "https://www.iamdeveloper.com/posts/how-i-review-pull-requests-44nl/",
  "reading_time_minutes": 4,
  "template": "post"
}
---

Someone in my [Virtual Coffee](https://virtualcoffee.io) community asked about getting better at reviewing pull requests (PR) today, which prompted this post. Hopefully, you find something helpful here. I'd love to hear from you if you do! And if you don't, that's OK too. Suggestions to improve my process are welcome!

First, I read the title and description to see what this is all about. If there are issues or other PRs referenced, I check those out if I need more context. If there are user interface (UI) changes, I look for before and after screenshots. If there are no screenshots and UI changes are present, I ask the reviewer to include some. It makes it a lot easier to assess changes from a high-level glance.

Alright! Let's run the code to test this! Woah, not quite yet.

Next, I start skimming through all the changed files. If there are many changes to files, the PR review can become intimidating and unwieldy.

In general, PRs should be small for a couple of reasons:

* It's easier to review
* The fewer changes to code you have, the less potential for bugs. I say potential because even a one-liner can cause bugs.

Sometimes there is no choice but to have a significantly large PR. I've seen this mainly in UI work, but it applies to backend work as well, typically an all-or-nothing scenario.

If the above does not hold, these are the reasons I see why PRs get bloated:

* The person spots refactorings or bug fixes they can do, but they're not related to the PR. Ask them to put these into a separate PR and keep the PR to the task at hand.
* The work to be done is not broken down. Do work that moves the more extensive work forward. For example, a utility function used throughout the feature can be in a separate PR. Is the person building out a new UI? They can build the components independently and put up a different PR, potentially using a tool like [Storybook](https://virtualcoffee.io) to build them out. 

**Remember that an issue or feature does not need to map to one PR.**

Finally, I look at some code! I search for issues that stand out to me without pulling down the PR and running the code on my local. I'm not talking about formatting/coding style issues because nowadays, many projects have toolings like linters or code formatters.

Things I look for:
* logic errors
* a language feature the person might not be aware of that can be used in the PR
* leveraging existing utility functions in the codebase
* tests
* documentation
* accessibility issues

In some cases, coding style might come up, for example, returning early when a condition fails in a function or method. **If changes come up during a review that can be changed automatically, automate away! Do that in a separate PR, though. 😎**

After the first sweep of the code, I send the PR back to the reviewee if I have change requests. Wait a second? Haven't you even run the code yet? As a reviewer, I have my work to do as well, so I'll hold off on taking the PR for a test drive.

After the initial review, I check the changes made and feedback. I may provide more feedback. Once no changes are left (for the time being), I pull down the code and run it locally. Depending on the project's setup, it might have preview deploys for PRs on a host like Netlify or Vercel or some containerized environment to test. Regardless, now is the time to verify the PR's intentions.

At this point, there will most likely be review feedback still, so I continue the cycle of reviewing the changes and ensuring the PR's intentions. Depending on the work, the review process can take some time; time zone differences can exacerbate the review time. It's critical to **become great at async communication**, especially now that a lot of the tech industry is moving/has moved to a remote culture.

Lastly, the tone of a review matters. I've grown accustomed to using a framework for commenting called [Conventional Comments](https://conventionalcomments.org). If you're interested in learning more, I gave a [lightning talk on Conventional Comments](https://www.iamdeveloper.com/pages/talks/#heading-words-matter:-conventional-comments) last year. Netlify created a similar system called Feedback Ladders. Check out Leslie's Tweet to read more on that.

{% twitter "1420188172726771714" %}

UPDATE APRIL 2022: I work at Netlify now, so I've started to use Feedback Ladders. So far I'm enjoying it.

{% embed "https://twitter.com/nickytonline/status/1516859340728246276" %}

If you made it this far, your PR is approved! 😎

Thanks and until next time!

Photo by <a href="https://unsplash.com/@markuswinkler?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Markus Winkler</a> on <a href="https://unsplash.com/s/photos/review?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
