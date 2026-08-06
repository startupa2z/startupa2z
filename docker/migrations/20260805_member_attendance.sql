ALTER TABLE event_rsvps
  ADD COLUMN IF NOT EXISTS attended BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE event_rsvps
  ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES users(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_event_rsvps_user_id ON event_rsvps(user_id);
