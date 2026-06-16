-- StartupA2Z PostgreSQL schema
-- Replaces Supabase migrations (no RLS, no auth.users, no storage, no realtime)

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─── Users ──────────────────────────────────────────────────────────────────

CREATE TABLE users (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  email        TEXT        NOT NULL UNIQUE,
  full_name    TEXT,
  organization TEXT,
  linkedin_id  TEXT        UNIQUE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── OTP Tokens ─────────────────────────────────────────────────────────────

CREATE TABLE otp_tokens (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  email        TEXT        NOT NULL,
  token        TEXT        NOT NULL,
  mode         TEXT        NOT NULL CHECK (mode IN ('signin', 'signup')),
  full_name    TEXT,
  organization TEXT,
  expires_at   TIMESTAMPTZ NOT NULL,
  used         BOOLEAN     NOT NULL DEFAULT false,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_otp_tokens_email ON otp_tokens(email);

-- ─── Roles ──────────────────────────────────────────────────────────────────

CREATE TYPE app_role AS ENUM ('admin', 'user');

CREATE TABLE user_roles (
  id         UUID      PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID      NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role       app_role  NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- ─── Contact Submissions ─────────────────────────────────────────────────────

CREATE TABLE contact_submissions (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  first_name   TEXT        NOT NULL,
  last_name    TEXT        NOT NULL,
  email        TEXT        NOT NULL,
  linkedin_url TEXT,
  role         TEXT,
  inquiry_type TEXT        NOT NULL,
  message      TEXT,

  CONSTRAINT first_name_length    CHECK (char_length(first_name) BETWEEN 1 AND 100),
  CONSTRAINT last_name_length     CHECK (char_length(last_name) BETWEEN 1 AND 100),
  CONSTRAINT email_length         CHECK (char_length(email) BETWEEN 3 AND 255),
  CONSTRAINT email_format         CHECK (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  CONSTRAINT linkedin_length      CHECK (linkedin_url IS NULL OR char_length(linkedin_url) <= 500),
  CONSTRAINT role_length          CHECK (role IS NULL OR char_length(role) <= 50),
  CONSTRAINT inquiry_type_length  CHECK (char_length(inquiry_type) BETWEEN 1 AND 50),
  CONSTRAINT message_length       CHECK (message IS NULL OR char_length(message) <= 2000)
);

-- ─── updated_at helper ──────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ─── Events ─────────────────────────────────────────────────────────────────

CREATE TABLE events (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  slug             TEXT        NOT NULL UNIQUE,
  title            TEXT        NOT NULL,
  date             TEXT        NOT NULL,
  time             TEXT        NOT NULL,
  venue            TEXT        NOT NULL,
  address          TEXT        NOT NULL DEFAULT '',
  type             TEXT        NOT NULL DEFAULT 'Networking',
  description      TEXT        NOT NULL DEFAULT '',
  long_description TEXT        NOT NULL DEFAULT '',
  agenda           JSONB       NOT NULL DEFAULT '[]',
  speakers         JSONB       NOT NULL DEFAULT '[]',
  spots            INTEGER     NOT NULL DEFAULT 0,
  capacity         INTEGER     NOT NULL DEFAULT 0,
  price            TEXT        NOT NULL DEFAULT 'Free',
  featured         BOOLEAN     NOT NULL DEFAULT false,
  image_url        TEXT,
  created_by       UUID        REFERENCES users(id),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_events_created_at ON events(created_at DESC);

CREATE TRIGGER update_events_updated_at
BEFORE UPDATE ON events
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ─── Event RSVPs ─────────────────────────────────────────────────────────────

CREATE TABLE event_rsvps (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id    UUID        REFERENCES events(id) ON DELETE CASCADE,
  event_slug  TEXT        NOT NULL,
  event_title TEXT        NOT NULL,
  first_name  TEXT        NOT NULL,
  last_name   TEXT        NOT NULL,
  email       TEXT        NOT NULL,
  phone       TEXT,
  company     TEXT,
  role        TEXT,
  notes       TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_event_rsvps_event_id   ON event_rsvps(event_id);
CREATE INDEX idx_event_rsvps_event_slug ON event_rsvps(event_slug);
CREATE INDEX idx_event_rsvps_created_at ON event_rsvps(created_at DESC);

-- One RSVP per email per event
CREATE UNIQUE INDEX event_rsvps_unique_event_email ON event_rsvps (event_slug, lower(email));

-- Decrement spots on RSVP insert
CREATE OR REPLACE FUNCTION decrement_event_spots()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.event_id IS NOT NULL THEN
    UPDATE events SET spots = GREATEST(spots - 1, 0) WHERE id = NEW.event_id;
  ELSE
    UPDATE events SET spots = GREATEST(spots - 1, 0) WHERE slug = NEW.event_slug;
  END IF;
  RETURN NEW;
END;
$$;

-- Increment spots on RSVP delete
CREATE OR REPLACE FUNCTION increment_event_spots()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF OLD.event_id IS NOT NULL THEN
    UPDATE events SET spots = LEAST(spots + 1, capacity) WHERE id = OLD.event_id;
  ELSE
    UPDATE events SET spots = LEAST(spots + 1, capacity) WHERE slug = OLD.event_slug;
  END IF;
  RETURN OLD;
END;
$$;

CREATE TRIGGER trg_decrement_spots_after_rsvp
AFTER INSERT ON event_rsvps
FOR EACH ROW EXECUTE FUNCTION decrement_event_spots();

CREATE TRIGGER trg_increment_spots_after_rsvp_delete
AFTER DELETE ON event_rsvps
FOR EACH ROW EXECUTE FUNCTION increment_event_spots();

-- ─── Sponsor Payments ────────────────────────────────────────────────────────

CREATE TABLE sponsor_payments (
  id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  stripe_session_id TEXT        NOT NULL UNIQUE,
  payment_status    TEXT,
  amount_total      INTEGER,
  currency          TEXT,
  customer_email    TEXT,
  customer_name     TEXT,
  package_id        TEXT,
  package_name      TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);
