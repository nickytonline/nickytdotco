# TODO: Implement Netlify API-based e2e gating (#967)

## Status

On hold. This file is a placeholder reminder. Remove it once issue #967 is implemented.

## Goal

Replace the GitHub commit-status polling in `.github/workflows/e2e.yml` with direct Netlify API polling so e2e tests can run on both PR deploy previews **and** production deploys from `main`.

## Why

Netlify only posts a `deploy/netlify` GitHub commit status for PR deploy previews, not for direct pushes to `main`. The current workflow therefore only runs on PRs. Querying the Netlify API directly works for every deploy uniformly.

## What needs to change

### `.github/workflows/e2e.yml`

- Add `push: branches: [main]` to the `on:` trigger.
- Remove `statuses: read` permission (no longer reading GitHub statuses).
- Replace the `gh api .../commits/$sha/status` polling step with a Netlify API call:
  - Endpoint: `GET https://api.netlify.com/api/v1/sites/{site_id}/deploys?branch={branch}`
  - Auth header: `Authorization: Bearer ${{ secrets.NETLIFY_AUTH_TOKEN }}`
  - Site identifier: `www-nickyt-co`
  - Filter returned deploys by `commit_ref` matching the current SHA.
  - Poll until `.state` is `ready` (success) or `error` (fail).
  - Output `.deploy_ssl_url` as `PLAYWRIGHT_BASE_URL`.
- Branch/SHA mapping:
  - PRs: `sha = github.event.pull_request.head.sha`, `branch = github.event.pull_request.head.ref`
  - `main` push: `sha = github.sha`, `branch = github.ref_name`

### `AGENTS.md`

- Update the **Testing (E2E)** section to describe the new Netlify API polling mechanism.
- Document the required `NETLIFY_AUTH_TOKEN` secret.
- Remove this `todo.md` reference.

## Tradeoffs

- Requires creating and rotating a `NETLIFY_AUTH_TOKEN` repo secret.
- The `main` check is post-deploy: it catches a bad production deploy but does not block or roll it back automatically.
- The PR-time check remains the primary merge gate.

## References

- Issue: https://github.com/nickytonline/nickytdotco/issues/967
- Astro TS 7 guard PR context (related discussion on CI/tooling): https://github.com/withastro/astro/pull/17345
