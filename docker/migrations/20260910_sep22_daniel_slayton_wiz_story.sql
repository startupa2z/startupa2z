BEGIN;

UPDATE events
SET title = 'Special Session for Founders: The Wiz Story',
    type = 'Special Session for Founders',
    description = 'A special StartupA2Z session with Daniel Slayton on the Wiz story, cloud and AI security, product security, and enterprise growth.',
    long_description = 'StartupA2Z brings founders, CTOs, heads of engineering, and technical leaders together for a special session for founders: The Wiz Story. Daniel Slayton will share the company journey and lead an open discussion on modern cloud architecture, building security into the product from code to cloud, protecting engineering velocity, the ROI of early security investments, and how stronger security can accelerate enterprise sales.',
    agenda = '[{"time":"5:00 PM","item":"Arrival and founder networking"},{"time":"5:30 PM","item":"Welcome and introduction by Satish"},{"time":"5:40 PM","item":"The Wiz story and modern cloud architecture"},{"time":"6:00 PM","item":"Securing the cloud without slowing velocity"},{"time":"6:20 PM","item":"Injecting security directly into the product: code to cloud"},{"time":"6:40 PM","item":"Startup ROI and accelerating enterprise sales"},{"time":"6:55 PM","item":"Interactive founder discussion and open Q&A"},{"time":"7:10 PM","item":"Post-session networking"}]'::jsonb,
    speakers = '[{"name":"Daniel Slayton","role":"From Wiz","bio":"Daniel works in cybersecurity at Google and joined Wiz before it became part of Google. He also serves as a captain in the U.S. Army.","linkedinUrl":"https://www.linkedin.com/in/daniel-slayton/"},{"name":"Satish Govindappa","role":"Host, StartupA2Z"}]'::jsonb,
    image_url = '/event-covers/startupa2z-daniel-slayton-wiz-story-september-22-2026-square-v2.png?v=20260910',
    featured = true,
    lifecycle_status = 'published',
    updated_at = now()
WHERE slug = 'founders-pitch-mix-2026-09-22';

UPDATE event_rsvps
SET event_title = 'Special Session for Founders: The Wiz Story'
WHERE event_slug = 'founders-pitch-mix-2026-09-22';

UPDATE event_channels
SET status = 'published',
    external_url = CASE
      WHEN channel = 'luma' THEN 'https://luma.com/c7ebjedo'
      WHEN channel = 'website' THEN '/events/founders-pitch-mix-2026-09-22'
      ELSE external_url
    END,
    published_at = COALESCE(published_at, now()),
    last_error = NULL,
    updated_at = now()
WHERE event_id = (
  SELECT id FROM events WHERE slug = 'founders-pitch-mix-2026-09-22'
)
  AND channel IN ('website', 'luma');

COMMIT;
