---json
{
  "title": "Advent of AI - Day 10: Understanding Arguments in Goose Recipes",
  "excerpt": "I've edited this post, but AI helped. These are meant to be quick posts related to the Advent of AI....",
  "date": "2025-12-14T05:56:41.653Z",
  "tags": [
    "automation",
    "ai",
    "goose"
  ],
  "cover_image": "https://www.nickyt.co/images/posts/_dynamic_image_width=1000,height=420,fit=cover,gravity=auto,format=auto_https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Fyiep87c899gtgoh8jxmh.jpg",
  "canonical_url": "https://www.nickyt.co/blog/advent-of-ai-day-10-understanding-arguments-in-goose-recipes-2obg/",
  "reading_time_minutes": 6,
  "template": "post"
}
---

I've edited this post, but AI helped. These are meant to be quick posts related to the Advent of AI. I don't have time if I'm doing one of these each day to spend a couple hours on a post.

For [Advent of AI Day 10](https://adventofai.dev/challenges/10), I built a festival poster generator using Goose recipes. But this post isn't really about making posters. It's about understanding how recipe arguments and conditional logic turn static prompts into reusable AI workflows.

Up until now in the Advent of AI challenges, I'd been using recipes pretty simply. Pass in some parameters, get output.

{% embed "https://dev.to/nickytonline/advent-of-ai-2025-day-7-goose-recipes-5d1c" %}

But Day 10 made me dig deeper into what's actually happening under the hood with arguments and Jinja templating.

The [advent of AI](https://adventofai.dev) series leverages Goose, an open source AI agent. If you've never heard of it, check it out!

{% embed "https://github.com/block/goose" %}

## The Problem I Was Solving

The Day 10 challenge asks you to generate festival posters. Not just one poster, but posters for different event types. Food events need warm, cozy vibes. Kids events need bright, playful energy. Performance events need elegant styling.

Without parameters, you're writing separate prompts for each type. That's tedious and doesn't scale. With parameters and conditional logic, you write one recipe that handles all of them.

## How Recipe Parameters Work

Goose recipes let you define inputs just like function parameters. You specify what can change, and users provide those values when they run the recipe.

Here's the basic setup:

```yaml
{% raw %}
version: 1.0.0
title: Festival Poster Generator
description: Generate themed HTML posters with conditional styling

parameters:
  - key: event_name
    input_type: string
    requirement: required
    description: Name of the festival event

  - key: event_type
    input_type: select
    requirement: required
    description: Type of event - determines theme and styling
    options:
      - food
      - kids
      - performance
      - competition
      - workshop

  - key: tagline
    input_type: string
    requirement: optional
    description: Optional tagline or subtitle
    default: ""
{% endraw %}
```

### Required vs Optional

Required parameters are non-negotiable. You can't generate a poster without knowing the event name, date, location, and type. The recipe won't run if these are missing.

Optional parameters add flexibility. A tagline is nice to have, but if you don't provide one, the recipe still works. Setting `default: ""` means optional parameters become empty strings when not provided, which is perfect for conditional logic later.

## Conditional Logic with Jinja

This is where it gets really good. The instructions section of a recipe supports [Jinja2 templating](https://jinja.palletsprojects.com/). That means you can write logic that changes what the AI actually sees based on the parameters you pass in.

For the poster generator, the entire styling instructions change based on `event_type`:

```yaml
{% raw %}
instructions: |
  You are a festival poster generator.
  
  **Event Details:**
  - Event Name: {{ event_name }}
  - Date & Time: {{ event_datetime }}
  - Location: {{ location }}
  - Event Type: {{ event_type }}
  {% if "tagline" %}- Tagline: {{ tagline }}{%  "endif" %}
  {% if "description" %}- Description: {{ description }}{%  "endif" %}
  
  {% if event_type == "food" %}
  ## Food Event Theme
  - Use warm, inviting colors (burgundy, warm orange, cream)
  - Typography: Friendly, rounded fonts
  - Mood: Cozy, appetizing, welcoming
  {%  "endif" %}
  
  {% if event_type == "kids" %}
  ## Kids Event Theme
  - Use bright, playful colors (rainbow palette, pastels)
  - Typography: Playful, bold, easy-to-read fonts
  - Mood: Fun, energetic, joyful
  {%  "endif" %}
{% endraw %}
```

![Hot Cocoa Tasting poster](https://www.nickyt.co/images/posts/_uploads_articles_6onpd9nhbtxztimgcjbh.png)

Same recipe, completely different instructions sent to the AI depending on what `event_type` you provide. That's the power of this approach.

![Kids Storytelling poster](https://www.nickyt.co/images/posts/_uploads_articles_9blfx5xusm6jn2lu4gqg.png)

### What This Actually Does

When you run the recipe with `event_type: food`, the AI gets instructions about warm colors and cozy vibes. Run it with `event_type: kids`, and it gets instructions about bright colors and playful energy.

The AI doesn't see both sets of instructions. It only sees the one that matches your event type. That's way better than trying to cram all the logic into a single prompt and hoping the AI picks the right path.

## Useful Jinja Patterns

### Variable Interpolation

The basic `{{ variable_name }}` syntax injects parameter values:

```yaml
{% raw %}
instructions: |
  Create a poster for {{ event_name }} on {{ event_datetime }}.
{% endraw %}
```

### Conditional Blocks

{% raw %}`{% if "condition" %}`{% endraw %} lets you include or skip entire sections:

```yaml
{% raw %}
{% if "tagline" %}
Make the tagline prominent: {{ tagline }}
{%  "endif" %}

{% if not description %}
Since no description was provided, create a brief one.
{%  "endif" %}
{% endraw %}
```

I used this a lot for optional parameters. If someone provides a tagline, include it. If not, skip that section entirely.

### String Manipulation

Jinja filters let you transform values on the fly:

```yaml
{% raw %}
Save to: poster_{{ event_type }}_{{ event_name | lower | replace(" ", "_") }}.html
{% endraw %}
```

This converts "Hot Cocoa Tasting" to "hot_cocoa_tasting" automatically. Super useful for file names.

### Combining Conditions

You can get fancy with multiple conditions:

```yaml
{% raw %}
{% if event_type == "performance" and ticket_info %}
Display ticket info with elegant styling: {{ ticket_info }}
{% elif event_type == "kids" and not ticket_info %}
Add "Free admission - all families welcome!"
{%  "endif" %}
{% endraw %}
```

## Why This Matters

With parameters and conditional logic, you write once and reuse forever.

For the Day 10 challenge, I can generate posters for all the different festival events just by changing the parameters:

```bash
{% raw %}
# CLI
goose run festival-poster-generator \
  --event_name "Hot Cocoa Tasting" \
  --event_datetime "December 15, 2pm–4pm" \
  --location "Main Plaza" \
  --event_type food
{% endraw %}
```

Want a kids event? Same recipe, different parameters:

```bash
{% raw %}
goose run festival-poster-generator \
  --event_name "Storytelling Hour" \
  --event_datetime "December 17, 3pm–4pm" \
  --location "Story Tent" \
  --event_type kids
{% endraw %}
```

In Goose Desktop, you get a form UI with dropdowns for the event type and text inputs for everything else. Way nicer than typing command-line args.

The real win is consistency. All the posters follow the same structure and quality standards because they're coming from the same recipe. The only thing that changes is the data and the conditional styling.

## Beyond Posters

The [Day 10 challenge](https://adventofai.dev/challenges/10) is about posters, but these patterns work for any repetitive AI task.

I've been using Goose recipes for all sorts of stuff during Advent of AI:
- Data transformation (Day 8: messy vendor data to structured JSON)
- GitHub automation (Day 6: issue triage and labeling)
- UI generation (Day 4: festival website with theme switching)

Each one follows the same pattern. Define what varies (parameters), write conditional logic for different paths (Jinja), run it as many times as you need.

For work at [Pomerium](https://www.pomerium.com/), I could see this being useful for generating security policies or MCP server configurations with different auth providers and policy levels. Same recipe, different security postures based on parameters.

## Things I Learned

### Start Simple

Don't try to make everything configurable on day one. Figure out the 3-5 things that actually need to vary, make those parameters, and ship it. You can always add more later.

### Use Select Types When You Can

For the event type, I used `input_type: select` instead of a freeform string. This prevents typos and makes the conditional logic reliable. If someone can only pick from "food", "kids", "performance", etc., you don't have to worry about handling "Food" vs "food" vs "FOOD".

### Provide Defaults for Optional Stuff

For optional parameters, think about what makes sense when nothing is provided:

```yaml
{% raw %}
- key: output_format
  input_type: select
  requirement: optional
  default: html
  options:
    - html
    - markdown
{% endraw %}
```

Most people probably want HTML, so default to that.

### Test All the Paths

With conditional logic, you're creating multiple execution paths. I made sure to test:
- All five event types to confirm each conditional branch works
- Optional parameters both provided and omitted
- Edge cases like really long event names

### Check the Docs

The [Recipe Parameters docs](https://block.github.io/goose/docs/recipes/parameters) list all the input types and validation options. Reference these when you're setting up parameters instead of guessing.

## Reference Docs

Everything here is documented officially:

- [Recipe Guide](https://block.github.io/goose/docs/recipes/) - Overview of how recipes work
- [Recipe Reference](https://block.github.io/goose/docs/recipes/reference) - Complete spec
- [Recipe Parameters](https://block.github.io/goose/docs/recipes/parameters) - All parameter types
- [Jinja2 Docs](https://jinja.palletsprojects.com/) - Full templating syntax

I referenced these docs a lot while building the poster recipe.

## Wrapping Up

Parameters and conditional logic turn recipes from one-off tools into reusable workflows.

Instead of "make me a poster", it becomes "here's a poster recipe that adapts based on what you need". Run it once, run it a hundred times, same quality every time.

The Day 10 challenge is a good intro to these concepts. You get to see how the same recipe generates five completely different poster themes just by changing one parameter. But the real learning is recognizing when you could apply this pattern to your own work.

What repetitive tasks are you doing with AI right now? What parts change each time? Those changing parts are your parameters. The logic that decides what to do with those parameters? That's your Jinja conditionals.

Check out the [Day 10 challenge](https://adventofai.dev/challenges/10) if you want to try building one yourself.

If you want to stay in touch, all my socials are on [nickyt.online](https://nickyt.online).

Until the next one!

---

Resources:
- [Advent of AI - Day 10 Challenge](https://adventofai.dev/challenges/10)
- [Goose Recipe Guide](https://block.github.io/goose/docs/recipes/)
- [Recipe Parameters Documentation](https://block.github.io/goose/docs/recipes/parameters)
- [Jinja2 Templating](https://jinja.palletsprojects.com/)

Photo by <a href="https://unsplash.com/@sxoxm?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Sven Mieke</a> on <a href="https://unsplash.com/photos/brown-pencil-on-white-printing-paper-fteR0e2BzKo?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
