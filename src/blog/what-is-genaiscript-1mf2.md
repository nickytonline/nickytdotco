---json
{
  "title": "What is GenAIScript?",
  "excerpt": "I recently got to hang with Peli de Halleux (@pelikhan) to discuss the GenAIScript project.          ...",
  "date": "2024-09-27T04:01:00.000Z",
  "tags": [
    "genai",
    "typescript",
    "javascript",
    "productivity"
  ],
  "cover_image": null,
  "canonical_url": "https://www.nickyt.co/blog/what-is-genaiscript-1mf2/",
  "reading_time_minutes": 2,
  "template": "post"
}
---

I recently got to hang with Peli de Halleux (@pelikhan) to discuss the GenAIScript project.

{% embed "https://dev.to/pelikhan/unlocking-the-power-of-prompts-a-gentle-introduction-to-genaiscript-34nn" %}

Here’s a transcript of an excerpt from our conversation.

## Transcript

Nick Taylor: What's the thesis for the project? Or how did this come about? 

Peli: So the thesis for the project is that we want to build automatable, we want to build, we want to have build scripts. But using AI, you know, think about all the little you have in your project. You want to have reusable, automatable, useful scripts that use AI is kind of the main technology.

And we also wanted it to be as smooth as possible. So we use JavaScript because. We've got a runtime and, you know, we've got a good language, but we wanted to have programs, not just string template expansion, not mustache or ginger, but. Actually start building stuff from like programmatically when things get more complicated, interesting, you run out of options with template engines.

Whereas if you use JavaScript or Python, well, you've got a whole language. So, but. At the, at the start, you know, that was one of the dreams was like, Oh, you know, it's, you don't really need to know that it's JavaScript. 

Nick Taylor: Yeah. 

Peli: there's a minimal syntax at the start to get started. I don't know if we managed to, you know, pull that up.

Um, but if you think about JavaScript and the runtimes, they've been designed for the browser or for the backend with node. Yeah, so we have now, it ships with a runtime that's also designed for doing gen AI tasks, like cracking open the PDF and reading the text out of it, or parsing all kinds of formats that you find in the wild, like a docx file,  YAML file, which are not native to JavaScript.

And you have to do quite a bit of research to figure out which one is a good library and so forth. Whereas. 

Nick Taylor: Yeah. 

Peli: it kind of gets in your way when trying to prototype. Um, so the, that's kind of the, the story behind it. It's like, can you rethink the JavaScript and runtime environment experience? 

Nick Taylor: Okay.

Peli: Around using LLMs as a first class citizen.

You can also catch the full conversation 👇

{% embed "https://www.youtube.com/watch?v=aeXQ2MJ0Ye0" %}
