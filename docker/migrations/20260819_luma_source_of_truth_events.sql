BEGIN;

CREATE TEMP TABLE luma_event_truth (
  old_slug TEXT NOT NULL,
  new_slug TEXT NOT NULL,
  title TEXT NOT NULL,
  event_date TEXT NOT NULL,
  external_url TEXT NOT NULL,
  external_event_id TEXT NOT NULL
) ON COMMIT DROP;

INSERT INTO luma_event_truth (
  old_slug, new_slug, title, event_date, external_url, external_event_id
)
VALUES
  (
    'founders-pitch-mix-2026-08-26',
    'founders-pitch-mix-2026-08-25',
    'Bay Area Founders Pitch & Startup Networking',
    'August 25, 2026',
    'https://luma.com/mm8nnyc1',
    'evt-BEY9tuiAMU0yQt4'
  ),
  (
    'founders-pitch-mix-2026-08-19',
    'founder-networking-workshop-2026-09-01',
    'Bay Area Founder Networking & Startup Workshop | Mountain View',
    'September 1, 2026',
    'https://luma.com/txup8dqa',
    'evt-ZnDEgqWmIvhTp6A'
  ),
  (
    'founders-pitch-mix-2026-09-02',
    'founders-pitch-mix-2026-09-08',
    'Bay Area Founders Pitch & Startup Networking',
    'September 8, 2026',
    'https://luma.com/25odwnxl',
    'evt-erC1BEn1N9fA3dA'
  ),
  (
    'founders-pitch-mix-2026-09-09',
    'founders-pitch-mix-2026-09-15',
    'Bay Area Founders Pitch & Startup Networking',
    'September 15, 2026',
    'https://luma.com/hmvkxmas',
    'evt-Jbe7vvTVmwETmNT'
  ),
  (
    'founders-pitch-mix-2026-09-16',
    'founders-pitch-mix-2026-09-22',
    'Bay Area Founders Pitch & Startup Networking',
    'September 22, 2026',
    'https://luma.com/c7ebjedo',
    'evt-OuAFseC9EPMv3rm'
  ),
  (
    'founders-pitch-mix-2026-09-23',
    'founders-pitch-mix-2026-09-29',
    'Bay Area Founders Pitch & Startup Networking',
    'September 29, 2026',
    'https://luma.com/lxlrmvle',
    'evt-uNwxlk3dHeH5Bgb'
  );

UPDATE events AS event
SET
  slug = truth.new_slug,
  title = truth.title,
  date = truth.event_date,
  time = '5:00 PM - 8:00 PM',
  venue = 'Hacker Dojo, Mountain View',
  address = '855 Maude Ave, Mountain View, CA 94043',
  type = CASE
    WHEN truth.external_event_id = 'evt-ZnDEgqWmIvhTp6A' THEN 'Founder Workshop'
    ELSE 'Founder Meetup'
  END,
  description = CASE
    WHEN truth.external_event_id = 'evt-ZnDEgqWmIvhTp6A'
      THEN 'A free Bay Area founder networking event and practical startup workshop at Hacker Dojo in Mountain View on September 1, 2026.'
    ELSE 'A free Bay Area founder pitch and startup networking event at Hacker Dojo on ' || truth.event_date || '.'
  END,
  long_description = CASE
    WHEN truth.external_event_id = 'evt-ZnDEgqWmIvhTp6A'
      THEN 'Join StartupA2Z for a free Bay Area founder networking event at Hacker Dojo in Mountain View on September 1, 2026, from 5:00 PM to 8:00 PM. Designed for founders, aspiring entrepreneurs, builders, operators, investors, mentors, and GTM leaders, the event includes founder networking and Product''s Done. Where''s Revenue?, a hands-on go-to-market workshop led by Raj Badarinath, a four-time-exit CMO and Founder & CEO of Hivekind.ai.'
    ELSE 'Join StartupA2Z for Founders Pitch & Mix, an evening designed to bring founders, builders, investors, and startup ecosystem partners together to connect, learn, and exchange ideas. The program combines networking, startup fundamentals, founder showcases, short audience pitches, feedback, visibility, and meaningful collaboration.'
  END,
  agenda = CASE
    WHEN truth.external_event_id = 'evt-ZnDEgqWmIvhTp6A'
      THEN '[{"time":"5:00 PM","item":"Arrival and founder networking"},{"time":"5:30 PM","item":"Welcome and introduction by Satish Govindappa"},{"time":"5:40 PM","item":"Product''s Done. Where''s Revenue? — hands-on GTM workshop"},{"time":"7:15 PM","item":"Closing remarks and key takeaways"},{"time":"7:25 PM","item":"Post-session networking"}]'::jsonb
    ELSE '[{"time":"5:00 PM","item":"Networking"},{"time":"5:30 PM","item":"Welcome and introduction by Satish"},{"time":"5:40 PM","item":"Part 1: Startup Fundamentals"},{"time":"6:00 PM","item":"Part 2: Founder Pitches"},{"time":"6:30 PM","item":"Part 3: Audience Pitches"},{"time":"7:00 PM","item":"Closing remarks by Satish"},{"time":"7:15 PM","item":"Post-session networking"}]'::jsonb
  END,
  speakers = CASE
    WHEN truth.external_event_id = 'evt-ZnDEgqWmIvhTp6A'
      THEN '[{"name":"Satish Govindappa","role":"Host, StartupA2Z"},{"name":"Raj Badarinath","role":"Workshop facilitator; Founder & CEO, Hivekind.ai"}]'::jsonb
    ELSE '[{"name":"Satish Govindappa","role":"Host, StartupA2Z"}]'::jsonb
  END,
  spots = 0,
  capacity = 0,
  price = 'Free',
  featured = false,
  image_url = '/event-covers/startupa2z-founders-pitch-mix-every-wednesday.png',
  updated_at = now()
FROM luma_event_truth AS truth
WHERE event.slug IN (truth.old_slug, truth.new_slug)
   OR EXISTS (
     SELECT 1
     FROM event_channels AS channel
     WHERE channel.event_id = event.id
       AND channel.channel = 'luma'
       AND channel.external_event_id = truth.external_event_id
   );

UPDATE event_rsvps AS rsvp
SET
  event_slug = truth.new_slug,
  event_title = truth.title
FROM events AS event
JOIN luma_event_truth AS truth ON event.slug = truth.new_slug
WHERE rsvp.event_id = event.id
  AND (rsvp.event_slug, rsvp.event_title) IS DISTINCT FROM (truth.new_slug, truth.title);

INSERT INTO event_channels (
  event_id, channel, status, external_url, external_event_id, published_at
)
SELECT
  event.id,
  'luma',
  'published',
  truth.external_url,
  truth.external_event_id,
  now()
FROM events AS event
JOIN luma_event_truth AS truth ON event.slug = truth.new_slug
ON CONFLICT (event_id, channel) DO UPDATE SET
  status = EXCLUDED.status,
  external_url = EXCLUDED.external_url,
  external_event_id = EXCLUDED.external_event_id,
  published_at = COALESCE(event_channels.published_at, EXCLUDED.published_at),
  last_error = NULL;

INSERT INTO event_channels (event_id, channel, status, external_url, published_at)
SELECT
  event.id,
  'website',
  'published',
  '/events/' || event.slug,
  now()
FROM events AS event
JOIN luma_event_truth AS truth ON event.slug = truth.new_slug
ON CONFLICT (event_id, channel) DO UPDATE SET
  status = EXCLUDED.status,
  external_url = EXCLUDED.external_url,
  published_at = COALESCE(event_channels.published_at, EXCLUDED.published_at),
  last_error = NULL;

DO $$
DECLARE
  canceled_event_id UUID;
BEGIN
  SELECT event.id
  INTO canceled_event_id
  FROM events AS event
  LEFT JOIN event_channels AS channel
    ON channel.event_id = event.id
   AND channel.channel = 'luma'
  WHERE event.slug = 'founders-pitch-mix-2026-09-30'
     OR channel.external_event_id = 'evt-QNKqI0gMAXykIWS'
  LIMIT 1;

  IF canceled_event_id IS NOT NULL THEN
    IF EXISTS (
      SELECT 1 FROM event_rsvps WHERE event_id = canceled_event_id
    ) THEN
      RAISE EXCEPTION 'Refusing to remove the canceled September 30 event because website RSVPs exist';
    END IF;

    DELETE FROM events WHERE id = canceled_event_id;
  END IF;
END $$;

COMMIT;
