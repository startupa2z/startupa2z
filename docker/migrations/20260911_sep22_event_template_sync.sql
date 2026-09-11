BEGIN;

UPDATE events
SET long_description = 'Too many founders build before validating a real requirement. Daniel Slayton will share his background, the Wiz business story, and the challenges encountered during the journey, followed by a focused discussion of partnership opportunities and the growing demand for security and cloud partner services.',
    agenda = '[{"time":"5:00 PM","item":"Arrival and founder networking"},{"time":"5:30 PM","item":"Welcome and introduction by Satish"},{"time":"5:40 PM","item":"Daniel''s background, the Wiz business story, and challenges along the journey"},{"time":"6:20 PM","item":"Partnership opportunities, partner-service demand, and founder discussion"},{"time":"7:00 PM","item":"Networking and one-to-one conversations"}]'::jsonb,
    updated_at = now()
WHERE slug = 'founders-pitch-mix-2026-09-22';

COMMIT;
