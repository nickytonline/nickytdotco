import { describe, expect, it } from "vitest";
import {
  contentTokens,
  documentMatchesQueryPhrase,
  filterWeakVectorHits,
  hasConsecutivePhrase,
  phraseTokens,
  selectSearchHits,
} from "./rank.ts";

function hit(url: string, distance: number) {
  return { url, distance };
}

const ROXY_BLURB =
  "Roxy Rodriguez-Becker, Developer Community Manager, joins Nick Taylor to recap Commit Your Code";

describe("phraseTokens", () => {
  it("keeps the typed words in order, including typos", () => {
    expect(phraseTokens("roxy")).toEqual(["roxy"]);
    expect(phraseTokens("roxy joing nick")).toEqual(["roxy", "joing", "nick"]);
    expect(phraseTokens("Nick Taylor")).toEqual(["nick", "taylor"]);
  });
});

describe("documentMatchesQueryPhrase", () => {
  it("matches roxy as a whole word, not inside proxy", () => {
    expect(documentMatchesQueryPhrase(ROXY_BLURB, "roxy")).toBe(true);
    expect(
      documentMatchesQueryPhrase(
        "How to configure an HTTP reverse proxy in production",
        "roxy"
      )
    ).toBe(false);
  });

  it("requires the full query as consecutive words before embeddings", () => {
    expect(documentMatchesQueryPhrase(ROXY_BLURB, "nick taylor")).toBe(true);
    expect(documentMatchesQueryPhrase(ROXY_BLURB, "roxy joing nick")).toBe(
      false
    );
    expect(documentMatchesQueryPhrase(ROXY_BLURB, "roxy nick")).toBe(false);
  });
});

describe("hasConsecutivePhrase", () => {
  it("does not treat scattered words as a phrase", () => {
    const tokens = contentTokens(ROXY_BLURB);
    expect(hasConsecutivePhrase(tokens, phraseTokens("nick taylor"))).toBe(
      true
    );
    expect(hasConsecutivePhrase(tokens, phraseTokens("roxy nick"))).toBe(false);
  });
});

describe("selectSearchHits", () => {
  it("returns textual phrase hits and does not pad with vector neighbors", () => {
    const results = selectSearchHits(
      [hit("/roxy", 0.41)],
      [hit("/roxy", 0.41), hit("/proxy", 0.48), hit("/cypress", 0.5)],
      8,
      0.5,
      0.12
    );

    expect(results.map((result) => result.url)).toEqual(["/roxy"]);
  });

  it("uses nearby embeddings when the typed phrase is not in the text", () => {
    const results = selectSearchHits(
      [],
      [
        hit("/roxy-stream", 0.22),
        hit("/communities", 0.28),
        hit("/unrelated", 0.61),
      ],
      8,
      0.5,
      0.12
    );

    expect(results.map((result) => result.url)).toEqual([
      "/roxy-stream",
      "/communities",
    ]);
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
