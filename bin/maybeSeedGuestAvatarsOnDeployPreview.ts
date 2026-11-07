#!/usr/bin/env node
/**
 * TEMPORARY one-off: run guest avatar seed during Netlify deploy-preview builds.
 *
 * Wired as npm `prebuild`. No-ops everywhere except:
 *   CONTEXT=deploy-preview (Netlify DP builds)
 *
 * Requires NETLIFY_AUTH_TOKEN in Netlify env (builds do not inject Blobs
 * context; SITE_ID is automatic). Kill switch: SEED_GUEST_AVATARS=0.
 * Remove this hook + script after avatars are seeded.
 */
import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const seedScript = path.join(__dirname, "seedGuestAvatars.ts");

function main(): void {
  if (process.env.SEED_GUEST_AVATARS === "0") {
    console.log("[guest-avatars] skip (SEED_GUEST_AVATARS=0)");
    return;
  }

  if (process.env.CONTEXT !== "deploy-preview") {
    console.log(
      `[guest-avatars] skip (CONTEXT=${process.env.CONTEXT ?? "unset"}, want deploy-preview)`
    );
    return;
  }

  console.log(
    "[guest-avatars] deploy-preview prebuild: seeding empty guest avatars → Netlify Blobs"
  );

  const child = spawn(process.execPath, [seedScript, "--apply"], {
    stdio: "inherit",
    env: process.env,
  });

  child.on("exit", (code, signal) => {
    if (signal) {
      console.error(`[guest-avatars] killed by ${signal}`);
      process.exit(1);
    }
    process.exit(code ?? 1);
  });
}

main();
