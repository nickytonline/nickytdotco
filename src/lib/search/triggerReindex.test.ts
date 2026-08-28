import { afterEach, describe, expect, it, vi } from "vitest";
import {
  githubWorkflowDispatchUrl,
  triggerSearchReindex,
  type SearchReindexDeps,
} from "./triggerReindex.ts";

type SearchReindexTestOverrides = Partial<
  Omit<
    SearchReindexDeps,
    "fetch" | "claimTriggerSlot" | "releaseTriggerSlot" | "log" | "error"
  >
> & {
  fetch?: ReturnType<typeof vi.fn<SearchReindexDeps["fetch"]>>;
  claimTriggerSlot?: ReturnType<
    typeof vi.fn<SearchReindexDeps["claimTriggerSlot"]>
  >;
  releaseTriggerSlot?: ReturnType<
    typeof vi.fn<SearchReindexDeps["releaseTriggerSlot"]>
  >;
  log?: ReturnType<typeof vi.fn<SearchReindexDeps["log"]>>;
  error?: ReturnType<typeof vi.fn<SearchReindexDeps["error"]>>;
};

function createDeps(overrides: SearchReindexTestOverrides = {}) {
  return {
    netlifyContext: overrides.netlifyContext ?? "production",
    githubToken:
      "githubToken" in overrides ? overrides.githubToken : "ghp_test_token",
    repo: overrides.repo ?? "nickytonline/nickytdotco",
    workflowFile: overrides.workflowFile ?? "index-search.yml",
    ref: overrides.ref ?? "main",
    cooldownSeconds: overrides.cooldownSeconds ?? 3600,
    now: overrides.now ?? (() => 1_700_000_000_000),
    fetch:
      overrides.fetch ??
      vi.fn<SearchReindexDeps["fetch"]>(
        async () => new Response(null, { status: 204 })
      ),
    claimTriggerSlot:
      overrides.claimTriggerSlot ??
      vi.fn<SearchReindexDeps["claimTriggerSlot"]>(async () => true),
    releaseTriggerSlot:
      overrides.releaseTriggerSlot ??
      vi.fn<SearchReindexDeps["releaseTriggerSlot"]>(async () => undefined),
    log: overrides.log ?? vi.fn<SearchReindexDeps["log"]>(),
    error: overrides.error ?? vi.fn<SearchReindexDeps["error"]>(),
  } satisfies SearchReindexDeps;
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
      claimTriggerSlot: vi.fn<SearchReindexDeps["claimTriggerSlot"]>(
        async () => false
      ),
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
      claimTriggerSlot: vi.fn<SearchReindexDeps["claimTriggerSlot"]>(
        async () => {
          throw new Error("turso unavailable");
        }
      ),
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
      fetch: vi.fn<SearchReindexDeps["fetch"]>(
        async () => new Response("Forbidden", { status: 403 })
      ),
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
