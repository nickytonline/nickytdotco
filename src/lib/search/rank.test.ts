import { describe, expect, it } from "vitest";
import {
  documentMatchesTokens,
  filterWeakVectorHits,
  searchTokens,
  selectSearchHits,
} from "./rank.ts";

function hit(url: string, distance: number) {
  return { url, distance };
}

describe("searchTokens", () => {
  it("keeps a unique name as a single token", () => {
    expect(searchTokens("roxy")).toEqual(["roxy"]);
  });

  it("splits a personal name and lowercases it", () => {
    expect(searchTokens("Nick Taylor")).toEqual(["nick", "taylor"]);
  });

  it("drops short stopwords so topic phrases stay meaningful", () => {
    expect(searchTokens("the future of identity")).toEqual([
      "future",
      "identity",
    ]);
  });
});

describe("documentMatchesTokens", () => {
  it("requires every token to appear in the document text", () => {
    const text =
      "Roxy Rodriguez-Becker, Developer Community Manager, joins Nick Taylor";
    expect(documentMatchesTokens(text, ["roxy"])).toBe(true);
    expect(documentMatchesTokens(text, ["roxy", "cypress"])).toBe(false);
  });
});

describe("selectSearchHits", () => {
  it("ranks keyword matches by embedding distance and drops unrelated neighbors", () => {
    const results = selectSearchHits(
      [hit("/roxy", 0.41), hit("/also-roxy", 0.33)],
      [
        hit("/roxy", 0.41),
        hit("/web5", 0.48),
        hit("/cypress", 0.5),
        hit("/opensauced", 0.52),
      ],
      8,
      0.5,
      0.12
    );

    expect(results.map((result) => result.url)).toEqual([
      "/also-roxy",
      "/roxy",
    ]);
  });

  it("uses nearby embeddings when the typed words do not appear", () => {
    const results = selectSearchHits(
      [],
      [
        hit("/cypress", 0.22),
        hit("/playwright", 0.28),
        hit("/unrelated", 0.61),
      ],
      8,
      0.5,
      0.12
    );

    expect(results.map((result) => result.url)).toEqual([
      "/cypress",
      "/playwright",
    ]);
  });

  it("returns nothing when vector neighbors are all far from the query", () => {
    const results = selectSearchHits(
      [],
      [hit("/a", 0.62), hit("/b", 0.65), hit("/c", 0.7)],
      8,
      0.5,
      0.12
    );

    expect(results).toEqual([]);
  });
});

describe("filterWeakVectorHits", () => {
  it("keeps a close cluster and drops the long tail", () => {
    const kept = filterWeakVectorHits(
      [hit("/a", 0.2), hit("/b", 0.26), hit("/c", 0.55)],
      0.5,
      0.12
    );
    expect(kept.map((result) => result.url)).toEqual(["/a", "/b"]);
  });
});
