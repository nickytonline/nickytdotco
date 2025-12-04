---json
{
  "title": "Advent of AI 2025 - Day 3: Building Data Visualizations with Goose",
  "excerpt": "I've edited this post, but AI helped. These are meant to be quick posts related to the Advent of AI....",
  "date": "2025-12-04T02:36:01.561Z",
  "tags": [
    "goose",
    "adventofai",
    "dataviz",
    "ai"
  ],
  "cover_image": "https://www.nickyt.co/images/posts/_dynamic_image_width=1000,height=420,fit=cover,gravity=auto,format=auto_https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Fncqhhxwcpzzny4944438.jpg",
  "canonical_url": "https://www.nickyt.co/blog/advent-of-ai-2025-day-1-building-data-visualizations-with-goose-g7f",
  "reading_time_minutes": 4,
  "template": "post"
}
---

I've edited this post, but AI helped. These are meant to be quick posts related to the Advent of AI. I don't have time if I'm doing one of these each day to spend a couple hours on a post. 😅

I've been working through the [Advent of AI challenges](https://adventofai.dev/), and [Day 3 was all about building data visualizations](https://adventofai.dev/3). It seemed like the perfect opportunity to see how well Goose could handle a project with specific requirements and multiple visualization needs.

## Starting with the PRD

Before jumping into code, I asked Goose to create a product requirements document (PRD) based on the challenge description at https://adventofai.dev/challenges/3. I've found this approach really useful in general when working with AI coding tools. Having a structured document upfront gives both you and the AI a clear roadmap to follow. From there you can break the plan down in todos.

Goose pulled the challenge details and generated a [comprehensive PRD](https://github.com/nickytonline/advent-of-ai-2025/blob/main/day-3/PRD.md) that included:

- Executive summary with the problem statement
- Stakeholder identification
- User stories aligned with the challenge tiers
- Functional requirements for each visualization type
- Technical architecture recommendations

I made one tweak to the PRD. Goose initially suggested using Mermaid diagrams for some visualizations, but I wanted everything in Vega Lite/Vega specs for consistency (what they mention in the [Goose autovisualizer extension docs](https://block.github.io/goose/blog/2025/08/27/autovisualiser-with-mcp-ui/). A quick instruction to update that, and we were ready to go.

## Implementation Time

With the PRD in hand, I got Goose to start implementing things. And of course I hit a snag.

### The Auto-Visualizer Extension Issue

Goose started trying to use the autovisualizer tools, but kept running into deserialization errors. The tools were receiving JSON strings instead of structured objects, which caused every visualization attempt to fail.

At one point Goose outputted that Claude Sonnet 4.5 was what was causing the issue, so they battled it out, and eventually it outputted the correct visualization, but in browser. For some reason, I could only get the autovisualizer to output Mermaid charts and graphs only in the MCP-UI widget. Maybe I was holding it wrong, but I might follow up with the goose team.

### Troubleshooting the Visualization Tools

Even with the extension enabled, there were some issues with the auto-visualizer. Goose kept hitting JSON parameter deserialization errors when trying to use the Vega-Lite visualization tools. It seemed like a bug in either Goose or the extension itself where the tools weren't properly handling the JSON specs.

Eventually, Goose fell back to generating Mermaid charts, which worked but wasn't what I specified in the PRD. The visualizations got created and displayed properly in the Goose GUI, just not using the Vega-Lite specs I'd requested. It did output the better looking charts in HTML pages it generated. For a time-boxed challenge, I decided to move forward with what was working rather than spending more time debugging the tooling.

## The Results

Once I got past the initial tooling issues, implementation moved quickly. Goose worked through the requirements systematically, creating:

- Tournament bracket visualizations showing progression from quarterfinals to championship
- Vote distribution charts using multiple complementary views (bar charts, pie/donut charts)
- Recipe attribute comparisons using radar charts
- What-if scenario analysis
- Synthetic tournament generation
- Responsive design for all visualization pages

The approach of using multiple chart types to tell different aspects of the same story worked well. Instead of one massive visualization trying to do everything, we had focused charts that each answered specific questions about the tournament data.

## Polish and Refactoring

After getting all the visualizations working, I took some time for slight  polish the project. Since we weren't using a framework, I wanted at least some consistency across pages, so back buttons on all the pages, consolidation of common CSS on all the pages into a CSS file that was imported in all the pages.

## What I'd Change

The challenge project doesn't use a framework, which meant we couldn't have a full navigation component or shared layout system. If this were a real project, I'd bring in something like React or Vue so we could have proper component composition and routing. But for a challenge that's specifically about data visualization, adding a framework felt like overkill.

## Give It a Try

If you're working through the Advent of AI challenges or any project that involves data visualization, Goose with the auto-visualizer extension is worth checking out. Just make sure you're using the GUI version and have the extension enabled.

You can check out the [Advent of AI challenges](https://adventofai.dev/) if you want to give them a shot yourself, and learn more about Goose's auto-visualizer in [their blog post](https://block.github.io/goose/blog/2025/08/27/autovisualiser-with-mcp-ui/).

Photo by <a href="https://unsplash.com/@meganwatson?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Megan Watson</a> on <a href="https://unsplash.com/photos/white-ceramic-mug-with-chocolate-and-candy-cane-wSJ1FRezDjw?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
