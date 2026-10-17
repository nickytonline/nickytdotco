import { createHash } from "node:crypto";
import {
  SEARCH_EMBEDDING_DIMENSIONS,
  SEARCH_EMBEDDING_MODEL,
} from "./constants.ts";

export function hashSearchContent(textToEmbed: string): string {
  return createHash("sha256")
    .update(SEARCH_EMBEDDING_MODEL)
    .update("\0")
    .update(String(SEARCH_EMBEDDING_DIMENSIONS))
    .update("\0")
    .update(textToEmbed)
    .digest("hex");
}

export function truncateForEmbedding(text: string, maxChars: number): string {
  if (text.length <= maxChars) {
    return text;
  }
  return text.slice(0, maxChars);
}

export function stripMdxImports(body: string): string {
  return body
    .split("\n")
    .filter((line) => !/^\s*import\s/.test(line))
    .join("\n")
    .trim();
}

/** Plain text from an EmDash Portable Text tree, for search embeddings. */
export function portableTextToSearchText(value: unknown): string {
  const parts: string[] = [];

  const visit = (node: unknown) => {
    if (!node || typeof node !== "object") return;
    if (Array.isArray(node)) {
      for (const child of node) visit(child);
      return;
    }
    const block = node as Record<string, unknown>;
    // Portable Text stores mark definitions before the spans that use them.
    if (Array.isArray(block.children)) visit(block.children);
    if (typeof block.text === "string") parts.push(block.text);
    if (typeof block.code === "string") parts.push(block.code);
    if (typeof block.alt === "string") parts.push(block.alt);
    if (typeof block.href === "string") parts.push(block.href);
    if (block._type === "embed" && typeof block.id === "string") {
      parts.push(block.id);
    }
    for (const [key, child] of Object.entries(block)) {
      if (key === "children") continue;
      if (child && typeof child === "object") visit(child);
    }
  };

  visit(value);
  return parts.join("\n").trim();
}

export function excerptFromText(text: string, maxLength = 220): string {
  const collapsed = text.replace(/\s+/g, " ").trim();
  if (collapsed.length <= maxLength) {
    return collapsed;
  }
  return `${collapsed.slice(0, maxLength - 1).trimEnd()}…`;
}

export function rewriteSearchResultUrl(
  storedUrl: string,
  requestOrigin: string
): string {
  const parsed = new URL(storedUrl);
  return new URL(
    `${parsed.pathname}${parsed.search}${parsed.hash}`,
    requestOrigin
  ).toString();
}
