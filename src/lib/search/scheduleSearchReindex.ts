import { ENV } from "varlock/env";
import {
  SEARCH_REINDEX_COOLDOWN_SECONDS,
  SEARCH_REINDEX_GITHUB_REPO,
  SEARCH_REINDEX_LOCK_ID,
  SEARCH_REINDEX_LOCK_TABLE,
  SEARCH_REINDEX_MEMORY_COOLDOWN_MS,
  SEARCH_REINDEX_REF,
  SEARCH_REINDEX_WORKFLOW_FILE,
} from "./constants.ts";
import {
  triggerSearchReindex,
  type SearchReindexDeps,
  type SearchReindexResult,
} from "./triggerReindex.ts";
import { getSearchDb } from "./turso.ts";

type WaitUntilContext = {
  waitUntil: (promise: Promise<unknown>) => void;
};

let inFlight: Promise<SearchReindexResult> | undefined;
let nextAllowedAt = 0;

function readGithubToken(): string | undefined {
  try {
    return ENV.GITHUB_TOKEN || undefined;
  } catch {
    return process.env.GITHUB_TOKEN || undefined;
  }
}

async function claimTriggerSlot(
  nowSeconds: number,
  cooldownSeconds: number
): Promise<boolean> {
  const db = getSearchDb();
  await db.execute(`
    CREATE TABLE IF NOT EXISTS ${SEARCH_REINDEX_LOCK_TABLE} (
      id TEXT PRIMARY KEY,
      triggered_at INTEGER NOT NULL
    )
  `);
  const result = await db.execute({
    sql: `INSERT INTO ${SEARCH_REINDEX_LOCK_TABLE} (id, triggered_at)
          VALUES (?, ?)
          ON CONFLICT(id) DO UPDATE SET
            triggered_at = excluded.triggered_at
          WHERE excluded.triggered_at - triggered_at >= ?`,
    args: [SEARCH_REINDEX_LOCK_ID, nowSeconds, cooldownSeconds],
  });
  return result.rowsAffected > 0;
}

async function releaseTriggerSlot(): Promise<void> {
  const db = getSearchDb();
  await db.execute({
    sql: `UPDATE ${SEARCH_REINDEX_LOCK_TABLE}
          SET triggered_at = 0
          WHERE id = ?`,
    args: [SEARCH_REINDEX_LOCK_ID],
  });
}

function createProductionDeps(): SearchReindexDeps {
  return {
    netlifyContext: process.env.CONTEXT,
    githubToken: readGithubToken(),
    repo: SEARCH_REINDEX_GITHUB_REPO,
    workflowFile: SEARCH_REINDEX_WORKFLOW_FILE,
    ref: SEARCH_REINDEX_REF,
    cooldownSeconds: SEARCH_REINDEX_COOLDOWN_SECONDS,
    now: Date.now,
    fetch: globalThis.fetch.bind(globalThis),
    claimTriggerSlot,
    releaseTriggerSlot,
    log: console.log,
    error: console.error,
  };
}

/**
 * Fire-and-forget a search reindex when a cached SSR page is regenerated.
 * Origin only runs on a CDN miss, so calling this from those pages is the
 * cache-invalidation hook. Uses Netlify `waitUntil` so the GitHub dispatch
 * can finish after the response is sent. The Netlify `GITHUB_TOKEN` needs
 * permission to dispatch workflows (`actions:write` on a fine-grained PAT).
 */
export function scheduleSearchReindex(
  source: string,
  netlifyContext?: WaitUntilContext
): void {
  const waitUntil = netlifyContext?.waitUntil?.bind(netlifyContext);
  const now = Date.now();
  if (now < nextAllowedAt) {
    return;
  }
  if (inFlight) {
    waitUntil?.(inFlight);
    return;
  }

  inFlight = triggerSearchReindex(source, createProductionDeps())
    .catch((cause: unknown) => {
      console.error("[search-reindex] Unexpected failure", cause);
      return {
        status: "error",
        reason: "dispatch-failed",
      } satisfies SearchReindexResult;
    })
    .finally(() => {
      inFlight = undefined;
      nextAllowedAt = Date.now() + SEARCH_REINDEX_MEMORY_COOLDOWN_MS;
    });

  if (waitUntil) {
    waitUntil(inFlight);
    return;
  }
  void inFlight;
}
