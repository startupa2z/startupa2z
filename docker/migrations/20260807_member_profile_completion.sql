-- Separate authentication identity from the editable member profile. Profile
-- fields remain nullable so completeness is enforced by the application flow.
CREATE TABLE IF NOT EXISTS member_profiles (
  user_id         UUID        PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  full_name       TEXT,
  company         TEXT,
  job_title       TEXT,
  founder_status  TEXT CHECK (founder_status IS NULL OR founder_status IN ('founder', 'co_founder', 'aspiring_founder', 'not_founder')),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

DO $$
BEGIN
  INSERT INTO member_profiles (user_id)
  SELECT id FROM users
  ON CONFLICT (user_id) DO NOTHING;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
     WHERE table_name = 'users' AND column_name = 'full_name'
  ) THEN
    EXECUTE 'UPDATE member_profiles p SET full_name = u.full_name FROM users u WHERE p.user_id = u.id AND p.full_name IS NULL';
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
     WHERE table_name = 'users' AND column_name = 'organization'
  ) THEN
    EXECUTE 'UPDATE member_profiles p SET company = u.organization FROM users u WHERE p.user_id = u.id AND p.company IS NULL';
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
     WHERE table_name = 'users' AND column_name = 'job_title'
  ) THEN
    EXECUTE 'UPDATE member_profiles p SET job_title = u.job_title FROM users u WHERE p.user_id = u.id AND p.job_title IS NULL';
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
     WHERE table_name = 'users' AND column_name = 'founder_status'
  ) THEN
    EXECUTE 'UPDATE member_profiles p SET founder_status = u.founder_status FROM users u WHERE p.user_id = u.id AND p.founder_status IS NULL';
  END IF;
END $$;

-- Keep legacy columns during this release so the currently running backend
-- remains compatible while the new application containers roll out. They can
-- be removed in a later cleanup migration after production is stable.
