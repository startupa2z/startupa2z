-- Apply once to align the August 12 event with the Hacker Dojo room limit.
-- Capacity is 30; six external Luma RSVPs leave 24 available spots.
UPDATE events
SET spots = 24,
    capacity = 30,
    updated_at = now()
WHERE slug = 'startup-a-to-z-hacker-dojo-august-12';
