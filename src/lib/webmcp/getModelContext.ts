/**
 * Returns the document ModelContext when WebMCP is available.
 * Feature-detect only — never throw in unsupported browsers.
 */
export function getModelContext(): WebMCP.ModelContext | undefined {
  if (typeof document === "undefined") {
    return undefined;
  }

  return document.modelContext;
}
