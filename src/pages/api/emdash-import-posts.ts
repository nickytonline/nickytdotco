import type { APIRoute } from "astro";
import { importPostsWithin } from "../../emdash/import-posts";
import { isAuthorizedScheduleRequest } from "../../../packages/emdash-netlify/src/schedule-auth.ts";
import type { SeedFile } from "emdash/seed";

export const prerender = false;

const IMPORT_BUDGET_MS = 8_000;
const MAX_HOPS = 60;

type SeedDb = Parameters<typeof import("emdash/seed").applySeed>[0];

function databaseFrom(locals: App.Locals): SeedDb | undefined {
  return (locals as { emdash?: { db?: SeedDb } }).emdash?.db;
}

function chainImport(request: Request, locals: App.Locals, hops: number): void {
  if (hops >= MAX_HOPS) return;
  const secret = process.env.EMDASH_SCHEDULE_SECRET;
  if (!secret) return;
  const next = fetch(new URL("/api/emdash-import-posts", request.url), {
    method: "POST",
    headers: {
      authorization: `Bearer ${secret}`,
      "x-import-hops": String(hops + 1),
    },
  }).catch((error: unknown) => {
    console.error("[emdash-import] follow-up failed", error);
  });
  const context = locals.netlify?.context as
    | { waitUntil?: (promise: Promise<unknown>) => void }
    | undefined;
  if (context?.waitUntil) context.waitUntil(next);
}

export const GET: APIRoute = async () => {
  const [{ getEmDashCollection }, seedModule] = await Promise.all([
    import("emdash"),
    import("../../../.emdash/seed.json"),
  ]);
  const seed = seedModule.default as SeedFile;
  const total = seed.content?.posts?.length ?? 0;
  const loaded = await getEmDashCollection("posts", { limit: 1000 });
  if (loaded.error) {
    const message =
      "message" in loaded.error && loaded.error.message
        ? loaded.error.message
        : "Could not read posts";
    return Response.json({ total, error: message }, { status: 500 });
  }
  return Response.json({
    total,
    present: loaded.entries.length,
    complete: loaded.entries.length >= total,
  });
};

export const POST: APIRoute = async ({ request, locals }) => {
  const secret = process.env.EMDASH_SCHEDULE_SECRET;
  if (!isAuthorizedScheduleRequest(request, secret)) {
    return new Response("Unauthorized", { status: 401 });
  }
  const db = databaseFrom(locals);
  if (!db) {
    return Response.json(
      { error: "EmDash is not initialized" },
      { status: 500 }
    );
  }
  const hops = Number(request.headers.get("x-import-hops") ?? "0");
  try {
    const imported = await importPostsWithin(db, IMPORT_BUDGET_MS);
    if (!imported.complete) chainImport(request, locals, hops);
    return Response.json(imported);
  } catch (error) {
    console.error("[emdash-import]", error);
    chainImport(request, locals, hops);
    return Response.json(
      {
        error: error instanceof Error ? error.message : "Import failed",
      },
      { status: 500 }
    );
  }
};
