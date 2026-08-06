CREATE TABLE IF NOT EXISTS event_channels (
  id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id          UUID        NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  channel           TEXT        NOT NULL CHECK (channel IN ('website', 'luma', 'eventbrite', 'linkedin', 'x')),
  status            TEXT        NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'ready', 'scheduled', 'published', 'failed', 'not_connected')),
  external_url      TEXT,
  external_event_id TEXT,
  scheduled_at      TIMESTAMPTZ,
  published_at      TIMESTAMPTZ,
  last_error        TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (event_id, channel)
);

CREATE INDEX IF NOT EXISTS idx_event_channels_event_id ON event_channels(event_id);
CREATE INDEX IF NOT EXISTS idx_event_channels_status ON event_channels(status);

CREATE TABLE IF NOT EXISTS event_content_items (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id     UUID        NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  channel      TEXT        NOT NULL CHECK (channel IN ('website', 'luma', 'eventbrite', 'linkedin', 'x')),
  content_type TEXT        NOT NULL DEFAULT 'announcement' CHECK (content_type IN ('announcement', 'reminder', 'follow_up')),
  title        TEXT        NOT NULL DEFAULT '',
  body         TEXT        NOT NULL,
  status       TEXT        NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'in_review', 'approved', 'scheduled', 'published')),
  scheduled_at TIMESTAMPTZ,
  published_at TIMESTAMPTZ,
  created_by   UUID        REFERENCES users(id),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_event_content_event_id ON event_content_items(event_id);
CREATE INDEX IF NOT EXISTS idx_event_content_schedule ON event_content_items(scheduled_at) WHERE scheduled_at IS NOT NULL;

DROP TRIGGER IF EXISTS update_event_channels_updated_at ON event_channels;
CREATE TRIGGER update_event_channels_updated_at
BEFORE UPDATE ON event_channels
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_event_content_updated_at ON event_content_items;
CREATE TRIGGER update_event_content_updated_at
BEFORE UPDATE ON event_content_items
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

INSERT INTO event_channels (event_id, channel, status, external_url, published_at)
SELECT id, 'website', 'published', '/events/' || slug, now()
FROM events
ON CONFLICT (event_id, channel) DO NOTHING;

INSERT INTO event_channels (event_id, channel, status)
SELECT id, 'luma', 'draft'
FROM events
ON CONFLICT (event_id, channel) DO NOTHING;
