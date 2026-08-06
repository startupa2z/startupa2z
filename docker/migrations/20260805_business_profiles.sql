ALTER TABLE businesses
  ADD COLUMN IF NOT EXISTS slug TEXT,
  ADD COLUMN IF NOT EXISTS logo_url TEXT,
  ADD COLUMN IF NOT EXISTS journey TEXT,
  ADD COLUMN IF NOT EXISTS challenges TEXT,
  ADD COLUMN IF NOT EXISTS challenge_solution TEXT,
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'published';

ALTER TABLE businesses DROP CONSTRAINT IF EXISTS businesses_status_check;
ALTER TABLE businesses ADD CONSTRAINT businesses_status_check
  CHECK (status IN ('pending', 'published', 'hidden'));

UPDATE businesses
SET slug = trim(both '-' FROM regexp_replace(lower(name), '[^a-z0-9]+', '-', 'g'))
WHERE slug IS NULL;

ALTER TABLE businesses ALTER COLUMN slug SET NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS businesses_unique_slug ON businesses (slug);

CREATE TABLE IF NOT EXISTS business_founders (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id   UUID        NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  name          TEXT        NOT NULL,
  role          TEXT        NOT NULL,
  linkedin_url  TEXT,
  journey       TEXT,
  photo_url     TEXT,
  display_order INTEGER     NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT founder_name_length CHECK (char_length(name) BETWEEN 2 AND 100),
  CONSTRAINT founder_role_length CHECK (char_length(role) BETWEEN 2 AND 50)
);

CREATE INDEX IF NOT EXISTS idx_business_founders_business
  ON business_founders (business_id, display_order);

CREATE TABLE IF NOT EXISTS business_media (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id   UUID        NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  media_type    TEXT        NOT NULL CHECK (media_type IN ('image', 'video')),
  url           TEXT        NOT NULL,
  caption       TEXT,
  display_order INTEGER     NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_business_media_business
  ON business_media (business_id, display_order);
