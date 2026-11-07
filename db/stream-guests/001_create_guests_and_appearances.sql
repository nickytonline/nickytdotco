-- Phase 1: add normalized guest identity + episode appearances.
-- Does NOT rename stream_guests or drop denormalized guest_* columns.
-- Safe to run against empty or populated Turso; no data migration here.

PRAGMA foreign_keys = ON;

-- Canonical person. One row even if they appear on many episodes.
CREATE TABLE IF NOT EXISTS guests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  -- URL-safe id for future /guests/[slug] (and EmDash linkage).
  slug TEXT NOT NULL UNIQUE COLLATE NOCASE,
  name TEXT NOT NULL,
  -- Canonical / current title. Per-appearance override lives on the join.
  title TEXT,
  bio TEXT,
  twitter TEXT,
  twitch TEXT,
  github TEXT,
  youtube TEXT,
  bluesky TEXT,
  website TEXT,
  linkedin TEXT,
  avatar_url TEXT,
  -- Optional EmDash entry slug or id once CMS guest pages exist.
  emdash_slug TEXT UNIQUE COLLATE NOCASE,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS guests_name_idx ON guests (name COLLATE NOCASE);

-- Many-to-many: episode (stream_guests.id) ↔ guest.
-- stream_guests stays the episode table until a later rename to stream_episodes.
CREATE TABLE IF NOT EXISTS stream_episode_guests (
  episode_id INTEGER NOT NULL,
  guest_id INTEGER NOT NULL,
  -- Title at the time of the appearance; falls back to guests.title in app code.
  guest_title TEXT,
  -- Lower = listed first. Matches today's "primary guest" used in video slugs.
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  PRIMARY KEY (episode_id, guest_id),
  FOREIGN KEY (episode_id) REFERENCES stream_guests (id) ON DELETE CASCADE,
  FOREIGN KEY (guest_id) REFERENCES guests (id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS stream_episode_guests_guest_idx
  ON stream_episode_guests (guest_id);

CREATE INDEX IF NOT EXISTS stream_episode_guests_episode_order_idx
  ON stream_episode_guests (episode_id, sort_order);
