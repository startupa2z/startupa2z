-- Remove any existing duplicates first (keep the earliest RSVP per event+email)
DELETE FROM public.event_rsvps a
USING public.event_rsvps b
WHERE a.id <> b.id
  AND a.event_slug = b.event_slug
  AND lower(a.email) = lower(b.email)
  AND a.created_at > b.created_at;

-- Unique constraint on (event_slug, lower(email))
CREATE UNIQUE INDEX IF NOT EXISTS event_rsvps_unique_event_email
ON public.event_rsvps (event_slug, lower(email));