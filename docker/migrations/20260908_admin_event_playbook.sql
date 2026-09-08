BEGIN;

CREATE TABLE IF NOT EXISTS admin_playbooks (
  key          TEXT        PRIMARY KEY,
  title        TEXT        NOT NULL,
  content      TEXT        NOT NULL,
  revision     INTEGER     NOT NULL DEFAULT 1 CHECK (revision >= 1),
  updated_by   UUID        REFERENCES users(id) ON DELETE SET NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS admin_playbook_revisions (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  playbook_key TEXT        NOT NULL REFERENCES admin_playbooks(key) ON DELETE CASCADE,
  revision     INTEGER     NOT NULL CHECK (revision >= 1),
  title        TEXT        NOT NULL,
  content      TEXT        NOT NULL,
  created_by   UUID        REFERENCES users(id) ON DELETE SET NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (playbook_key, revision)
);

CREATE INDEX IF NOT EXISTS idx_admin_playbook_revisions_key_created
  ON admin_playbook_revisions(playbook_key, created_at DESC);

COMMIT;
