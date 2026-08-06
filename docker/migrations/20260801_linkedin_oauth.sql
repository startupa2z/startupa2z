-- Apply once to an existing StartupA2Z.org database before enabling LinkedIn join.
CREATE TABLE IF NOT EXISTS oauth_states (
  state_hash     TEXT        PRIMARY KEY,
  redirect_path TEXT        NOT NULL DEFAULT '/',
  expires_at     TIMESTAMPTZ NOT NULL,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS auth_exchange_codes (
  code_hash  TEXT        PRIMARY KEY,
  user_id    UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
