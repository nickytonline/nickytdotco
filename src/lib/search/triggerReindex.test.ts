import { afterEach, describe, expect, it, vi } from "vitest";
import {
  githubWorkflowDispatchUrl,
  triggerSearchReindex,
  type SearchReindexDeps,
} from "./triggerReindex.ts";

function createDeps(
  overrides: Partial<SearchReindexDeps> = {}
): SearchReindexDeps & {
  log: ReturnType<typeof vi.fn>;
  error: ReturnType<typeof vi.fn>;
  fetch: ReturnType<typeof vi.fn>;
  claimTriggerSlot: ReturnType<typeof vi.fn>;
  releaseTriggerSlot: ReturnType<typeof vi.fn>;
} {
  const fetch = vi.fn(async () => new Response(null, { status: 204 }));
  const claimTriggerSlot = vi.fn(async () => true);
  const releaseTriggerSlot = vi.fn(async () => undefined);
  const log = vi.fn();
  const error = vi.fn();

  return {
    netlifyContext: "production",
    githubToken: "ghp_test_token",
    repo: "nickytonline/nickytdotco",
    workflowFile: "index-search.yml",
    ref: "main",
    cooldownSeconds: 3600,
    now: () => 1_700_000_000_000,
    fetch,
    claimTriggerSlot,
    releaseTriggerSlot,
    log,
    error,
    ...overrides,
  };
}

describe("githubWorkflowDispatchUrl", () => {
  it("builds the workflow_dispatch API URL", () => {
    expect(
      githubWorkflowDispatchUrl("nickytonline/nickytdotco", "index-search.yml")
    ).toBe(
      "https://api.github.com/repos/nickytonline/nickytdotco/actions/workflows/index-search.yml/dispatches"
    );
  });
});

describe("triggerSearchReindex", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("does not dispatch outside production", async () => {
    const deps = createDeps({ netlifyContext: "deploy-preview" });
    await expect(triggerSearchReindex("/watch", deps)).resolves.toEqual({
      status: "skipped",
      reason: "not-production",
    });
    expect(deps.fetch).not.toHaveBeenCalled();
    expect(deps.log).not.toHaveBeenCalled();
  });

  it("logs and skips when the GitHub token is missing", async () => {
    const deps = createDeps({ githubToken: undefined });
    await expect(triggerSearchReindex("/watch", deps)).resolves.toEqual({
      status: "skipped",
      reason: "missing-token",
    });
    expect(deps.error).toHaveBeenCalledWith(
      "[search-reindex] Missing GITHUB_TOKEN; cannot dispatch workflow"
    );
    expect(deps.fetch).not.toHaveBeenCalled();
  });

  it("skips GitHub when the cooldown lock is held", async () => {
    const deps = createDeps({
      claimTriggerSlot: vi.fn(async () => false),
    });
    await expect(triggerSearchReindex("/watch", deps)).resolves.toEqual({
      status: "skipped",
      reason: "cooldown",
    });
    expect(deps.fetch).not.toHaveBeenCalled();
    expect(deps.log).not.toHaveBeenCalled();
  });

  it("does not dispatch when claiming the lock throws", async () => {
    const deps = createDeps({
      claimTriggerSlot: vi.fn(async () => {
        throw new Error("turso unavailable");
      }),
    });
    await expect(triggerSearchReindex("/watch", deps)).resolves.toEqual({
      status: "error",
      reason: "lock-failed",
    });
    expect(deps.fetch).not.toHaveBeenCalled();
    expect(deps.error).toHaveBeenCalledWith(
      "[search-reindex] Failed to claim reindex lock",
      expect.any(Error)
    );
  });

  it("dispatches the workflow and logs that it kicked off", async () => {
    const deps = createDeps();
    await expect(triggerSearchReindex("/watch", deps)).resolves.toEqual({
      status: "triggered",
    });

    expect(deps.fetch).toHaveBeenCalledTimes(1);
    const [url, init] = deps.fetch.mock.calls[0] as [string, RequestInit];
    expect(url).toBe(
      "https://api.github.com/repos/nickytonline/nickytdotco/actions/workflows/index-search.yml/dispatches"
    );
    expect(init.method).toBe("POST");
    expect(init.headers).toMatchObject({
      Authorization: "Bearer ghp_test_token",
    });
    expect(JSON.parse(String(init.body))).toEqual({
      ref: "main",
      inputs: { reason: "cdn-cache:/watch" },
    });
    expect(deps.log).toHaveBeenCalledWith(
      "[search-reindex] Kicked off GitHub Action index-search.yml from /watch"
    );
    expect(deps.releaseTriggerSlot).not.toHaveBeenCalled();
  });

  it("releases the lock and logs when GitHub dispatch fails", async () => {
    const deps = createDeps({
      fetch: vi.fn(async () => new Response("Forbidden", { status: 403 })),
    });

    await expect(triggerSearchReindex("/", deps)).resolves.toEqual({
      status: "error",
      reason: "dispatch-failed",
    });
    expect(deps.releaseTriggerSlot).toHaveBeenCalledTimes(1);
    expect(deps.log).not.toHaveBeenCalled();
    expect(deps.error).toHaveBeenCalledWith(
      "[search-reindex] Failed to dispatch index-search workflow",
      expect.any(Error)
    );
  });
});
