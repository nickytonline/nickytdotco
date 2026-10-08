import { describe, expect, it, vi } from "vitest";
import type { SearchResponse } from "../search/types.ts";
import {
  executeSearchSiteTool,
  SEARCH_SITE_TOOL_ERROR,
} from "./searchSiteTool.ts";

function webpackHits(): SearchResponse {
  return {
    query: "webpack",
    results: [
      {
        url: "/blog/webpack",
        title: "Webpack",
        excerpt: "A bundler",
        type: "Post",
      },
    ],
  };
}

function abortError(): DOMException {
  return new DOMException("The operation was aborted.", "AbortError");
}

describe("executeSearchSiteTool", () => {
  it("calls searchSite with the query, limit, and abort signal", async () => {
    const search = vi.fn(async () => webpackHits());
    const controller = new AbortController();

    const payload = JSON.parse(
      await executeSearchSiteTool(
        { query: "webpack", limit: 20 },
        { signal: controller.signal },
        search
      )
    );

    expect(search).toHaveBeenCalledOnce();
    expect(search).toHaveBeenCalledWith("webpack", 20, controller.signal);
    expect(payload).toEqual({
      query: "webpack",
      count: 1,
      results: webpackHits().results,
    });
  });

  it("does not call searchSite for a query that is too short", async () => {
    const search = vi.fn(async () => webpackHits());

    const payload = JSON.parse(
      await executeSearchSiteTool(
        { query: "w" },
        { signal: new AbortController().signal },
        search
      )
    );

    expect(search).not.toHaveBeenCalled();
    expect(payload).toEqual({
      error: "Query must be at least 2 characters.",
    });
  });

  it("does not call searchSite for a query that is too long", async () => {
    const search = vi.fn(async () => webpackHits());

    const payload = JSON.parse(
      await executeSearchSiteTool(
        { query: "w".repeat(201) },
        { signal: new AbortController().signal },
        search
      )
    );

    expect(search).not.toHaveBeenCalled();
    expect(payload).toEqual({
      error: "Query must be at most 200 characters.",
    });
  });

  it("maps a 429 from searchSite to a rate-limit error", async () => {
    const error = new Error(
      "Search request failed with status 429"
    ) as Error & {
      status: number;
    };
    error.status = 429;
    const search = vi.fn(async () => {
      throw error;
    });

    const payload = JSON.parse(
      await executeSearchSiteTool(
        { query: "webpack" },
        { signal: new AbortController().signal },
        search
      )
    );

    expect(payload).toEqual({
      error: SEARCH_SITE_TOOL_ERROR["rate-limit"],
    });
  });

  it("maps other searchSite failures to an unavailable error", async () => {
    const error = new Error(
      "Search request failed with status 503"
    ) as Error & {
      status: number;
    };
    error.status = 503;
    const search = vi.fn(async () => {
      throw error;
    });

    const payload = JSON.parse(
      await executeSearchSiteTool(
        { query: "webpack" },
        { signal: new AbortController().signal },
        search
      )
    );

    expect(payload).toEqual({
      error: SEARCH_SITE_TOOL_ERROR.unavailable,
    });
  });

  it("rejects when searchSite aborts", async () => {
    const search = vi.fn(async () => {
      throw abortError();
    });

    await expect(
      executeSearchSiteTool(
        { query: "webpack" },
        { signal: new AbortController().signal },
        search
      )
    ).rejects.toMatchObject({ name: "AbortError" });
  });

  it("forwards the tool abort signal and rejects when it fires", async () => {
    const controller = new AbortController();
    const search = vi.fn(
      async (
        _query: string,
        _limit: number | undefined,
        signal?: AbortSignal
      ) => {
        return await new Promise<SearchResponse>((_resolve, reject) => {
          signal?.addEventListener("abort", () => {
            reject(abortError());
          });
        });
      }
    );

    const pending = executeSearchSiteTool(
      { query: "webpack", limit: 20 },
      { signal: controller.signal },
      search
    );

    controller.abort();

    await expect(pending).rejects.toMatchObject({ name: "AbortError" });
    expect(search.mock.calls[0]?.[2]).toBe(controller.signal);
  });
});
