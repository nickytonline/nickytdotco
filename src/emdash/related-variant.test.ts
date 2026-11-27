import { describe, expect, it } from "vitest";
import { resolveRelatedVariant } from "./related-variant.ts";

describe("resolveRelatedVariant", () => {
  it("forces a variant from the query even when the test is off", () => {
    expect(
      resolveRelatedVariant({
        testEnabled: false,
        query: "link",
        cookie: "mixed",
      })
    ).toEqual({ variant: "link", persist: true });
  });

  it("keeps the mixed section when the test is off", () => {
    expect(
      resolveRelatedVariant({
        testEnabled: false,
        query: null,
        cookie: "link",
      })
    ).toEqual({ variant: "mixed", persist: false });
  });

  it("reuses a valid cookie while the test is on", () => {
    expect(
      resolveRelatedVariant({
        testEnabled: true,
        query: null,
        cookie: "link",
        random: 0,
      })
    ).toEqual({ variant: "link", persist: false });
  });

  it("assigns from the roll when the test is on and no cookie is set", () => {
    expect(
      resolveRelatedVariant({
        testEnabled: true,
        query: "nope",
        cookie: null,
        random: 0.1,
      }).variant
    ).toBe("mixed");

    expect(
      resolveRelatedVariant({
        testEnabled: true,
        query: null,
        cookie: null,
        random: 0.8,
      })
    ).toEqual({ variant: "link", persist: true });
  });
});
