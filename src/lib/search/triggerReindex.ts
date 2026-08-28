export type SearchReindexSkipReason =
  | "not-production"
  | "missing-token"
  | "cooldown";

export type SearchReindexErrorReason = "lock-failed" | "dispatch-failed";

export type SearchReindexResult =
  | { status: "triggered" }
  | { status: "skipped"; reason: SearchReindexSkipReason }
  | { status: "error"; reason: SearchReindexErrorReason };

export interface SearchReindexDeps {
  netlifyContext: string | undefined;
  githubToken: string | undefined;
  repo: string;
  workflowFile: string;
  ref: string;
  cooldownSeconds: number;
  now: () => number;
  fetch: (url: string, init?: RequestInit) => Promise<Response>;
  claimTriggerSlot: (
    nowSeconds: number,
    cooldownSeconds: number
  ) => Promise<boolean>;
  releaseTriggerSlot: () => Promise<void>;
  log: (message: string) => void;
  error: (message: string, cause?: unknown) => void;
}

export function githubWorkflowDispatchUrl(
  repo: string,
  workflowFile: string
): string {
  return `https://api.github.com/repos/${repo}/actions/workflows/${workflowFile}/dispatches`;
}

/**
 * Prefer the request-scoped Netlify deploy context. `process.env.CONTEXT` is
 * not in the Varlock schema, so it is often `undefined` in the SSR bundle
 * even on production origin renders.
 */
export function resolveNetlifyDeployContext(
  netlifyContext?: { deploy?: { context?: string } },
  envContext?: string
): string | undefined {
  return netlifyContext?.deploy?.context || envContext || undefined;
}

export async function triggerSearchReindex(
  source: string,
  deps: SearchReindexDeps
): Promise<SearchReindexResult> {
  if (deps.netlifyContext !== "production") {
    deps.log(
      `[search-reindex] Skipping from ${source}: not production (context=${deps.netlifyContext ?? "unset"})`
    );
    return { status: "skipped", reason: "not-production" };
  }

  if (!deps.githubToken) {
    deps.error(
      "[search-reindex] Missing GITHUB_TOKEN; cannot dispatch workflow"
    );
    return { status: "skipped", reason: "missing-token" };
  }

  const nowSeconds = Math.floor(deps.now() / 1000);
  let claimed = false;
  try {
    claimed = await deps.claimTriggerSlot(nowSeconds, deps.cooldownSeconds);
  } catch (cause) {
    deps.error("[search-reindex] Failed to claim reindex lock", cause);
    return { status: "error", reason: "lock-failed" };
  }

  if (!claimed) {
    deps.log(`[search-reindex] Skipping from ${source}: cooldown`);
    return { status: "skipped", reason: "cooldown" };
  }

  try {
    const response = await deps.fetch(
      githubWorkflowDispatchUrl(deps.repo, deps.workflowFile),
      {
        method: "POST",
        headers: {
          Accept: "application/vnd.github+json",
          Authorization: `Bearer ${deps.githubToken}`,
          "X-GitHub-Api-Version": "2022-11-28",
          "User-Agent": "nickyt.co-search-reindex",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ref: deps.ref,
          inputs: { reason: `cdn-cache:${source}` },
        }),
      }
    );

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`GitHub dispatch failed: ${response.status} ${body}`);
    }

    deps.log(
      `[search-reindex] Kicked off GitHub Action ${deps.workflowFile} from ${source}`
    );
    return { status: "triggered" };
  } catch (cause) {
    try {
      await deps.releaseTriggerSlot();
    } catch (releaseCause) {
      deps.error(
        "[search-reindex] Failed to release reindex lock",
        releaseCause
      );
    }
    deps.error(
      "[search-reindex] Failed to dispatch index-search workflow",
      cause
    );
    return { status: "error", reason: "dispatch-failed" };
  }
}
