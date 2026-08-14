BEGIN;

WITH recurring_events(slug, date, description, featured) AS (
  VALUES
    ('founders-pitch-mix-2026-08-19', 'August 19, 2026', 'A free Bay Area founder pitch and startup networking event at Hacker Dojo on August 19, 2026.', true),
    ('founders-pitch-mix-2026-08-26', 'August 26, 2026', 'A free Bay Area founder pitch and startup networking event at Hacker Dojo on August 26, 2026.', false),
    ('founders-pitch-mix-2026-09-02', 'September 2, 2026', 'A free Bay Area founder pitch and startup networking event at Hacker Dojo on September 2, 2026.', false),
    ('founders-pitch-mix-2026-09-09', 'September 9, 2026', 'A free Bay Area founder pitch and startup networking event at Hacker Dojo on September 9, 2026.', false),
    ('founders-pitch-mix-2026-09-16', 'September 16, 2026', 'A free Bay Area founder pitch and startup networking event at Hacker Dojo on September 16, 2026.', false),
    ('founders-pitch-mix-2026-09-23', 'September 23, 2026', 'A free Bay Area founder pitch and startup networking event at Hacker Dojo on September 23, 2026.', false),
    ('founders-pitch-mix-2026-09-30', 'September 30, 2026', 'A free Bay Area founder pitch and startup networking event at Hacker Dojo on September 30, 2026.', false)
)
INSERT INTO events (
  slug, title, date, time, venue, address, type, description,
  long_description, agenda, speakers, spots, capacity, price, featured, image_url
)
SELECT
  slug,
  'Bay Area Founders Pitch & Startup Networking',
  date,
  '5:00 PM - 8:00 PM',
  'Hacker Dojo, Mountain View',
  '855 Maude Ave, Mountain View, CA 94043',
  'Founder Meetup',
  description,
  'Join StartupA2Z for Founders Pitch & Mix, an evening for founders, builders, investors, and startup ecosystem partners to connect, learn, exchange ideas, share founder pitches, and receive practical community feedback.',
  '[{"time":"5:00 PM","item":"Networking"},{"time":"5:30 PM","item":"Welcome and introduction by Satish"},{"time":"5:40 PM","item":"Part 1: Startup Fundamentals"},{"time":"6:00 PM","item":"Part 2: Founder Pitches"},{"time":"6:30 PM","item":"Part 3: Audience Pitches"},{"time":"7:00 PM","item":"Closing remarks by Satish"},{"time":"7:15 PM","item":"Post-session networking"}]'::jsonb,
  '[{"name":"Satish Govindappa","role":"Host, StartupA2Z"},{"name":"Raj Badarinath","role":"Co-host"}]'::jsonb,
  0,
  0,
  'Free',
  featured,
  '/event-covers/startupa2z-founders-pitch-mix-every-wednesday.png'
FROM recurring_events
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  date = EXCLUDED.date,
  time = EXCLUDED.time,
  venue = EXCLUDED.venue,
  address = EXCLUDED.address,
  type = EXCLUDED.type,
  description = EXCLUDED.description,
  long_description = EXCLUDED.long_description,
  agenda = EXCLUDED.agenda,
  speakers = EXCLUDED.speakers,
  spots = EXCLUDED.spots,
  capacity = EXCLUDED.capacity,
  price = EXCLUDED.price,
  featured = EXCLUDED.featured,
  image_url = EXCLUDED.image_url,
  updated_at = now();

INSERT INTO event_channels (event_id, channel, status, external_url, published_at)
SELECT id, 'website', 'published', '/events/' || slug, now()
FROM events
WHERE slug ~ '^founders-pitch-mix-2026-(08-(19|26)|09-(02|09|16|23|30))$'
ON CONFLICT (event_id, channel) DO UPDATE SET
  status = 'published',
  external_url = EXCLUDED.external_url,
  published_at = COALESCE(event_channels.published_at, now());

WITH luma_events(slug, external_url, external_event_id) AS (
  VALUES
    ('founders-pitch-mix-2026-08-19', 'https://luma.com/txup8dqa', 'evt-ZnDEgqWmIvhTp6A'),
    ('founders-pitch-mix-2026-08-26', 'https://luma.com/mm8nnyc1', 'evt-BEY9tuiAMU0yQt4'),
    ('founders-pitch-mix-2026-09-02', 'https://luma.com/25odwnxl', 'evt-erC1BEn1N9fA3dA'),
    ('founders-pitch-mix-2026-09-09', 'https://luma.com/hmvkxmas', 'evt-Jbe7vvTVmwETmNT'),
    ('founders-pitch-mix-2026-09-16', 'https://luma.com/c7ebjedo', 'evt-OuAFseC9EPMv3rm'),
    ('founders-pitch-mix-2026-09-23', 'https://luma.com/lxlrmvle', 'evt-uNwxlk3dHeH5Bgb'),
    ('founders-pitch-mix-2026-09-30', 'https://luma.com/fv14ki83', 'evt-QNKqI0gMAXykIWS')
)
INSERT INTO event_channels (event_id, channel, status, external_url, external_event_id, published_at)
SELECT
  events.id,
  'luma',
  'published',
  luma_events.external_url,
  luma_events.external_event_id,
  now()
FROM events
JOIN luma_events USING (slug)
ON CONFLICT (event_id, channel) DO UPDATE SET
  status = EXCLUDED.status,
  external_url = EXCLUDED.external_url,
  external_event_id = EXCLUDED.external_event_id,
  published_at = EXCLUDED.published_at;

COMMIT;
