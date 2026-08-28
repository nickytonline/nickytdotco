import { describe, expect, test } from "vitest";
import { queryHasNounOrVerb } from "./contentWords.ts";

describe("queryHasNounOrVerb", () => {
  test("skips closed-class-only queries", () => {
    expect(queryHasNounOrVerb("all")).toBe(false);
    expect(queryHasNounOrVerb("then they")).toBe(false);
    expect(queryHasNounOrVerb("the")).toBe(false);
  });

  test("allows a noun or verb", () => {
    expect(queryHasNounOrVerb("then they would")).toBe(true);
    expect(queryHasNounOrVerb("astro")).toBe(true);
  });
});
