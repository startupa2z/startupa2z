-- Apply once to the production database before verifying the August 12 event.
-- The public events API uses this URL as the external registration destination.
UPDATE events
SET title = 'Bay Area Founders Pitch & Startup Networking',
    description = 'A free Bay Area founder pitch and startup networking event at Hacker Dojo in Mountain View on August 12, 2026.',
    updated_at = now()
WHERE slug = 'startup-a-to-z-hacker-dojo-august-12';

UPDATE event_channels
SET status = 'published',
    external_url = 'https://luma.com/m0eu7bw9',
    published_at = COALESCE(published_at, now()),
    last_error = NULL
WHERE channel = 'luma'
  AND event_id = (
    SELECT id FROM events WHERE slug = 'startup-a-to-z-hacker-dojo-august-12'
  );
