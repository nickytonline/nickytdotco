import { marked } from 'marked';

/**
 * Configures the marked library with options matching the original markdown-it configuration.
 * - html: true - Allow HTML tags in markdown
 * - breaks: true - Convert \n in paragraphs to <br>
 *
 * Note: marked doesn't have a direct 'linkify' option like markdown-it,
 * but it automatically converts URLs to links by default.
 */
marked.setOptions({
  gfm: true,        // GitHub Flavored Markdown
  breaks: true,     // Convert \n to <br>
});

/**
 * Converts markdown text to HTML using the marked library.
 * This function replaces the original markdown-it based filter with marked,
 * maintaining similar functionality with HTML support and auto-linking.
 *
 * @param value - The markdown string to convert
 * @returns HTML string rendered from the markdown input
 */
export function markdownFilter(value: string): string {
  return marked.parse(value) as string;
}
