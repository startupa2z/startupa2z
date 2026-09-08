BEGIN;

ALTER TABLE events
  ADD COLUMN IF NOT EXISTS lifecycle_status TEXT NOT NULL DEFAULT 'published';

ALTER TABLE events
  DROP CONSTRAINT IF EXISTS events_lifecycle_status_check;

ALTER TABLE events
  ADD CONSTRAINT events_lifecycle_status_check
  CHECK (lifecycle_status IN ('draft', 'published', 'cancelled', 'completed'));

ALTER TABLE event_channels
  DROP CONSTRAINT IF EXISTS event_channels_status_check;

ALTER TABLE event_channels
  ADD CONSTRAINT event_channels_status_check
  CHECK (status IN ('draft', 'ready', 'scheduled', 'published', 'cancelled', 'failed', 'not_connected'));

UPDATE events
SET lifecycle_status = 'cancelled',
    featured = false,
    updated_at = now()
WHERE slug = 'founders-pitch-mix-2026-09-08';

UPDATE event_channels
SET status = 'cancelled',
    last_error = NULL,
    updated_at = now()
WHERE event_id = (
  SELECT id FROM events WHERE slug = 'founders-pitch-mix-2026-09-08'
)
  AND channel IN ('website', 'luma');

UPDATE events
SET title = 'What Raises Your Seed Round Will Sink Your Series C',
    type = 'Founder Finance Masterclass',
    description = $copy$A founder masterclass on how business lifecycle economics and valuation expectations change from Seed through Series C and public-market readiness.$copy$,
    long_description = $copy$A Masterclass on Business Lifecycle Economics & Valuation Realities. The playbook that secures your Seed round can actively derail your Series C, later growth rounds, and eventual public-market readiness. Join StartupA2Z and Vivek for a practical deep dive into how investor expectations evolve from TAM and narrative to unit economics, capital allocation, cash flow, Rule of 40, operating leverage, ROIC, and public-market valuation realities.$copy$,
    agenda = '[{"time":"5:00 PM","item":"Networking"},{"time":"5:30 PM","item":"Welcome and introduction by Satish"},{"time":"5:40 PM","item":"Masterclass with Vivek"},{"time":"7:20 PM","item":"Closing remarks"},{"time":"7:30 PM","item":"Networking"}]'::jsonb,
    speakers = '[{"name":"Vivek","role":"Masterclass speaker"},{"name":"Satish Govindappa","role":"Host, StartupA2Z"}]'::jsonb,
    image_url = '/event-covers/startupa2z-vivek-seed-to-series-c-luma-social-v1.png?v=20260908',
    featured = true,
    lifecycle_status = 'published',
    updated_at = now()
WHERE slug = 'founders-pitch-mix-2026-09-15';

UPDATE event_rsvps
SET event_title = 'What Raises Your Seed Round Will Sink Your Series C'
WHERE event_slug = 'founders-pitch-mix-2026-09-15';

UPDATE event_channels
SET status = 'published',
    external_url = CASE
      WHEN channel = 'luma' THEN 'https://luma.com/hmvkxmas'
      WHEN channel = 'website' THEN '/events/founders-pitch-mix-2026-09-15'
      ELSE external_url
    END,
    published_at = COALESCE(published_at, now()),
    last_error = NULL,
    updated_at = now()
WHERE event_id = (
  SELECT id FROM events WHERE slug = 'founders-pitch-mix-2026-09-15'
)
  AND channel IN ('website', 'luma');

COMMIT;
