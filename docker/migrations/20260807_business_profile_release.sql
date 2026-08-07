-- Apply once to an existing StartupA2Z.org database before deploying the
-- finalized startup and founder profile experience. Safe to run repeatedly.
ALTER TABLE businesses
  ADD COLUMN IF NOT EXISTS ask_text TEXT,
  ADD COLUMN IF NOT EXISTS offer_text TEXT,
  ADD COLUMN IF NOT EXISTS founded_year INTEGER,
  ADD COLUMN IF NOT EXISTS team_size INTEGER,
  ADD COLUMN IF NOT EXISTS company_status TEXT,
  ADD COLUMN IF NOT EXISTS channels JSONB NOT NULL DEFAULT '[]'::jsonb;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'business_team_size_positive'
  ) THEN
    ALTER TABLE businesses
      ADD CONSTRAINT business_team_size_positive
      CHECK (team_size IS NULL OR team_size > 0);
  END IF;
END $$;

ALTER TABLE business_founders
  ADD COLUMN IF NOT EXISTS slug TEXT,
  ADD COLUMN IF NOT EXISTS directory_visible BOOLEAN NOT NULL DEFAULT true;

WITH ranked AS (
  SELECT id,
         trim(both '-' FROM regexp_replace(lower(name), '[^a-z0-9]+', '-', 'g')) AS base_slug,
         row_number() OVER (
           PARTITION BY trim(both '-' FROM regexp_replace(lower(name), '[^a-z0-9]+', '-', 'g'))
           ORDER BY created_at, id
         ) AS duplicate_number
    FROM business_founders
   WHERE slug IS NULL
)
UPDATE business_founders AS founder
   SET slug = CASE
     WHEN ranked.duplicate_number = 1 THEN ranked.base_slug
     ELSE ranked.base_slug || '-' || ranked.duplicate_number
   END
  FROM ranked
 WHERE founder.id = ranked.id;

ALTER TABLE business_founders ALTER COLUMN slug SET NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS business_founders_unique_slug
  ON business_founders (slug);

UPDATE businesses
SET name = 'keyframe.art',
    ask_text = $copy$Brands and startups needing launch-ready video
Early users for practical product feedback
Product teams exploring API integrations$copy$,
    offer_text = $copy$Managed creative video production
Self-service AI video workspace
Embedded video workflow API$copy$,
    founded_year = 2025,
    team_size = 2,
    company_status = 'Active',
    channels = '[]'::jsonb,
    updated_at = now()
WHERE slug = 'keyframe';

UPDATE business_founders
SET role = 'Founder & CEO',
    linkedin_url = 'https://www.linkedin.com/in/digvijaygoswami/'
WHERE slug = 'digvijay-goswami';

UPDATE business_founders
SET role = 'Founder & CTO',
    linkedin_url = 'https://www.linkedin.com/in/sidharthraja/'
WHERE slug = 'sidharth-raja';
