import { createHash } from "node:crypto";
import {
  SEARCH_EMBEDDING_DIMENSIONS,
  SEARCH_EMBEDDING_MODEL,
} from "./constants";

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
