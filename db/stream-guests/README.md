# Stream guests normalization (phase 1 scaffold)

Today every livestream row in Turso `stream_guests` embeds guest
identity (name, title, socials). Repeat guests are duplicated. Multi-guest
episodes currently cram names into a comma-separated `guest_name`.

This folder scaffolds a **guests** entity plus an **episode ↔ guest**
many-to-many join. Site loaders still read the flat `stream_guests` shape;
nothing here is applied to Turso yet.

## Target model

```text
guests 1───* stream_episode_guests *───1 stream_guests (episodes; rename later)
```

| Table                   | Role                                                           |
| ----------------------- | -------------------------------------------------------------- |
| `guests`                | One row per person. Identity, socials, future CMS fields.      |
| `stream_guests`         | One row per episode / scheduled stream. Keep the name for now. |
| `stream_episode_guests` | Join: which guests appear on which episode, with order.        |

Episode columns that stay on `stream_guests`: `type`, `date`, `title`,
`description`, `youtube_stream_link`, `linkedin_stream_link`,
`on_schedule`, plus the existing denormalized guest columns until cutover.

Guest columns that move to `guests` (and off the episode after cutover):
`guest_name` → `name`, `guest_title` → canonical `title`, and social
handles (`twitter`, `twitch`, `github`, `youtube`, `bluesky`, `website`,
`linkedin`).

## Files

| File                                         | Purpose                                                                      |
| -------------------------------------------- | ---------------------------------------------------------------------------- |
| `001_create_guests_and_appearances.sql`      | DDL for `guests` + join table. Safe to run; does not mutate `stream_guests`. |
| `002_backfill_guests_from_stream_guests.sql` | **Stub only.** Dedup + link rows once we have DB access.                     |
| `src/lib/stream-guests/`                     | Types + display helpers for the normalized shape.                            |

## Apply later (not this PR)

1. Run `001_…sql` against the stream Turso (`TURSO_DATABASE_URL`).
2. Inspect production duplicates, then fill in / run `002_…sql`.
3. Dual-read in loaders (join when present, else flat columns).
4. Rename `stream_guests` → `stream_episodes` and drop denormalized guest columns.
5. EmDash guest collection + public `/guests/[slug]` pages.

## EmDash (phase 2+)

Guest profile pages are **not** in this scaffold. Likely path:

- EmDash collection (or posts-like entries) for bio / OG / editable fields.
- `guests.emdash_slug` (or entry id) links Turso identity → CMS document.
- Public route `/guests/[slug]` reads CMS + joined appearances from Turso.

Keep schedule/video querying on Turso; use EmDash for editorial content.

## Open questions

See the PR description. Defaults baked into this scaffold are called out
there; reply on the PR to lock naming and cutover order.
