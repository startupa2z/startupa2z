-- Apply once to an existing StartupA2Z.org database before deploying the
-- database-backed business directory.
CREATE TABLE IF NOT EXISTS businesses (
  id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  slug           TEXT        NOT NULL,
  name           TEXT        NOT NULL,
  pitch          TEXT        NOT NULL,
  stage          TEXT        NOT NULL,
  location       TEXT        NOT NULL,
  category       TEXT        NOT NULL,
  tags           TEXT[]      NOT NULL DEFAULT '{}',
  website_url    TEXT,
  contact_name   TEXT,
  contact_email  TEXT,
  published      BOOLEAN     NOT NULL DEFAULT true,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT business_name_length CHECK (char_length(name) BETWEEN 2 AND 120),
  CONSTRAINT business_pitch_length CHECK (char_length(pitch) BETWEEN 20 AND 280),
  CONSTRAINT business_stage_length CHECK (char_length(stage) BETWEEN 2 AND 50),
  CONSTRAINT business_location_length CHECK (char_length(location) BETWEEN 2 AND 120),
  CONSTRAINT business_category_length CHECK (char_length(category) BETWEEN 2 AND 50),
  CONSTRAINT business_website_length CHECK (website_url IS NULL OR char_length(website_url) <= 500),
  CONSTRAINT business_contact_name_length CHECK (contact_name IS NULL OR char_length(contact_name) BETWEEN 2 AND 100),
  CONSTRAINT business_contact_email_length CHECK (contact_email IS NULL OR char_length(contact_email) BETWEEN 3 AND 255)
);

CREATE UNIQUE INDEX IF NOT EXISTS businesses_unique_name ON businesses (lower(name));
CREATE UNIQUE INDEX IF NOT EXISTS businesses_unique_slug ON businesses (slug);
CREATE INDEX IF NOT EXISTS idx_businesses_published_created ON businesses (published, created_at DESC);

DROP TRIGGER IF EXISTS update_businesses_updated_at ON businesses;
CREATE TRIGGER update_businesses_updated_at
BEFORE UPDATE ON businesses
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

INSERT INTO businesses (slug, name, pitch, stage, location, category, tags)
VALUES
  ('keyframe', 'Keyframe', 'Keyframe helps brands and creators turn ideas into launch-ready AI films—faster and more affordably than traditional video production, without compromising creative quality.', 'Series A', 'Mountain View, CA', 'AI', ARRAY['Generative AI', 'AI Video', 'Filmmaking', 'Advertising', 'Content Creation'])
ON CONFLICT DO NOTHING;
