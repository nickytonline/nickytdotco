import markdownIt from "markdown-it";

const markdownInstance = markdownIt({
  html: true,
  breaks: true,
  linkify: true,
});

export default function markdown(value) {
  return markdownInstance.render(value);
}
