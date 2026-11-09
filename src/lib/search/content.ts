import { createHash } from "node:crypto";
import {
  SEARCH_EMBEDDING_DIMENSIONS,
  SEARCH_EMBEDDING_MODEL,
} from "./constants.ts";
import { isObject, isString } from "../../utils/type-guards.ts";

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
export function portableTextToSearchText<T>(value: T): string {
  const parts: string[] = [];

  const visit = <Node>(node: Node) => {
    if (!isObject(node)) return;

    if (Array.isArray(node)) {
      for (const child of node) visit(child);

      return;
    }

    const fields = new Map(Object.entries(node));

    // Portable Text stores mark definitions before the spans that use them.
    const children = fields.get("children");

    if (Array.isArray(children)) visit(children);

    for (const key of ["text", "code", "alt", "href"]) {
      const value = fields.get(key);

      if (isString(value)) parts.push(value);
    }

    if (fields.get("_type") === "embed") {
      const id = fields.get("id");

      if (isString(id)) parts.push(id);
    }

    for (const [key, child] of fields) {
      if (key === "children") continue;

      if (isObject(child)) visit(child);
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
