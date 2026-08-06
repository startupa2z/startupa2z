-- Apply once to an existing StartupA2Z production database before deploying
-- code that records event pitch interest and WhatsApp consent.
ALTER TABLE event_rsvps
  ADD COLUMN IF NOT EXISTS pitch_interest BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS whatsapp_opt_in BOOLEAN NOT NULL DEFAULT false;

INSERT INTO events (
  slug, title, date, time, venue, address, type, description,
  long_description, agenda, speakers, spots, capacity, price, featured
)
VALUES (
  'startup-a-to-z-hacker-dojo-august-12',
  'Startup A to Z: Founders Mix & Pitch',
  'August 12, 2026',
  '5:00 PM - 8:00 PM',
  'Hacker Dojo, Mountain View',
  '855 Maude Ave, Mountain View, CA 94043',
  'Founder Meetup',
  'A practical evening for founders and startup builders to learn the fundamentals, hear real pitches, exchange feedback, and build useful relationships.',
  'Startup A to Z brings founders, operators, investors, mentors, and aspiring entrepreneurs together for practical learning and meaningful connections. The first session opens with a fast-paced Startup Basics from A to Z talk, followed by two organized founder pitches, two audience pitches, direct feedback, and networking. Founder speakers will be announced soon.',
  '[{"time":"5:00 PM","item":"Arrival, registration, and networking"},{"time":"5:30 PM","item":"Welcome + Startup Basics from A to Z with Satz"},{"time":"5:55 PM","item":"Founder pitch 1 + feedback"},{"time":"6:10 PM","item":"Founder pitch 2 + feedback"},{"time":"6:25 PM","item":"Audience pitch 1 + feedback"},{"time":"6:35 PM","item":"Audience pitch 2 + feedback"},{"time":"6:45 PM","item":"Key lessons and community announcements"},{"time":"6:55 PM","item":"Closing remarks"},{"time":"7:00 PM","item":"Post-session networking"}]'::jsonb,
  '[{"name":"Satz","role":"Host, Startup A to Z"}]'::jsonb,
  60,
  60,
  'Free',
  true
)
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
  capacity = EXCLUDED.capacity,
  price = EXCLUDED.price,
  featured = EXCLUDED.featured,
  updated_at = now();
