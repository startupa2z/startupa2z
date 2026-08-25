-- StartupA2Z.org PostgreSQL schema
-- StartupA2Z.org PostgreSQL schema for the Docker deployment.

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─── Users ──────────────────────────────────────────────────────────────────

CREATE TABLE users (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  email        TEXT        NOT NULL UNIQUE,
  linkedin_id  TEXT        UNIQUE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── Member Profiles ─────────────────────────────────────────────────────────

CREATE TABLE member_profiles (
  user_id         UUID        PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  full_name       TEXT,
  company         TEXT,
  job_title       TEXT,
  founder_status  TEXT CHECK (founder_status IS NULL OR founder_status IN ('founder', 'co_founder', 'aspiring_founder', 'not_founder')),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- One deduplicated contact index across members, website registrations, Luma imports, and leads.
-- Authentication and event-registration records remain in their own tables.
CREATE TABLE all_users (
  id                    UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  email                 TEXT        NOT NULL,
  normalized_email      TEXT        NOT NULL UNIQUE,
  full_name             TEXT,
  first_name            TEXT,
  last_name             TEXT,
  phone                 TEXT,
  company               TEXT,
  job_title             TEXT,
  linkedin_url          TEXT,
  member_user_id        UUID        UNIQUE REFERENCES users(id) ON DELETE SET NULL,
  is_member             BOOLEAN     NOT NULL DEFAULT false,
  is_website_registrant BOOLEAN     NOT NULL DEFAULT false,
  is_luma_attendee      BOOLEAN     NOT NULL DEFAULT false,
  is_lead               BOOLEAN     NOT NULL DEFAULT false,
  marketing_consent     BOOLEAN     NOT NULL DEFAULT false,
  first_source          TEXT        NOT NULL,
  last_source           TEXT        NOT NULL,
  enrichment_status     TEXT        NOT NULL DEFAULT 'pending',
  enrichment_sources    TEXT[]      NOT NULL DEFAULT '{}',
  enriched_at           TIMESTAMPTZ,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (normalized_email = lower(trim(email)))
);
CREATE INDEX idx_all_users_updated_at ON all_users(updated_at DESC);

CREATE TABLE all_user_imports (
  id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  filename       TEXT        NOT NULL,
  source         TEXT        NOT NULL,
  total_rows     INTEGER     NOT NULL,
  created_rows   INTEGER     NOT NULL,
  updated_rows   INTEGER     NOT NULL,
  invalid_rows   INTEGER     NOT NULL,
  duplicate_rows INTEGER     NOT NULL,
  enriched_rows  INTEGER     NOT NULL DEFAULT 0,
  enrichment_matches INTEGER NOT NULL DEFAULT 0,
  fields_enriched INTEGER    NOT NULL DEFAULT 0,
  dedupe_verified BOOLEAN    NOT NULL DEFAULT false,
  completed_at    TIMESTAMPTZ,
  created_by     UUID        REFERENCES users(id) ON DELETE SET NULL,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── OTP Tokens ─────────────────────────────────────────────────────────────

CREATE TABLE otp_tokens (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  email        TEXT        NOT NULL,
  token        TEXT        NOT NULL,
  mode         TEXT        NOT NULL CHECK (mode IN ('signin', 'signup')),
  expires_at   TIMESTAMPTZ NOT NULL,
  used         BOOLEAN     NOT NULL DEFAULT false,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_otp_tokens_email ON otp_tokens(email);

-- ─── First-party page visits ────────────────────────────────────────────────

CREATE TABLE page_views (
  id          UUID        PRIMARY KEY,
  visitor_id  UUID        NOT NULL,
  path        TEXT        NOT NULL CHECK (char_length(path) BETWEEN 1 AND 500),
  visited_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_page_views_visited_at ON page_views(visited_at DESC);
CREATE INDEX idx_page_views_path ON page_views(path);

CREATE TABLE home_stats_settings (
  singleton                       BOOLEAN     PRIMARY KEY DEFAULT true CHECK (singleton),
  page_visit_baseline             BIGINT      NOT NULL CHECK (page_visit_baseline >= 0),
  page_visit_tracking_started_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO home_stats_settings (singleton, page_visit_baseline)
VALUES (true, 1025);

-- ─── OAuth state and one-time login exchanges ────────────────────────────────────

CREATE TABLE oauth_states (
  state_hash    TEXT        PRIMARY KEY,
  redirect_path TEXT       NOT NULL DEFAULT '/',
  expires_at    TIMESTAMPTZ NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE auth_exchange_codes (
  code_hash  TEXT        PRIMARY KEY,
  user_id    UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

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

-- ─── Business Directory ─────────────────────────────────────────────────────

CREATE TABLE businesses (
  id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  slug           TEXT        NOT NULL,
  name           TEXT        NOT NULL,
  pitch          TEXT        NOT NULL,
  stage          TEXT        NOT NULL,
  location       TEXT        NOT NULL,
  category       TEXT        NOT NULL,
  tags           TEXT[]      NOT NULL DEFAULT '{}',
  website_url    TEXT,
  logo_url       TEXT,
  journey        TEXT,
  challenges     TEXT,
  challenge_solution TEXT,
  ask_text       TEXT,
  offer_text     TEXT,
  founded_year   INTEGER,
  team_size      INTEGER,
  company_status TEXT,
  channels       JSONB       NOT NULL DEFAULT '[]'::jsonb,
  status         TEXT        NOT NULL DEFAULT 'published' CHECK (status IN ('pending', 'published', 'hidden')),
  contact_name   TEXT,
  contact_email  TEXT,
  published      BOOLEAN     NOT NULL DEFAULT true,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT business_name_length CHECK (char_length(name) BETWEEN 2 AND 120),
  CONSTRAINT business_pitch_length CHECK (char_length(pitch) BETWEEN 20 AND 280),
  CONSTRAINT business_stage_length CHECK (char_length(stage) BETWEEN 2 AND 50),
  CONSTRAINT business_location_length CHECK (char_length(location) BETWEEN 2 AND 120),
  CONSTRAINT business_category_length CHECK (char_length(category) BETWEEN 2 AND 50),
  CONSTRAINT business_team_size_positive CHECK (team_size IS NULL OR team_size > 0),
  CONSTRAINT business_website_length CHECK (website_url IS NULL OR char_length(website_url) <= 500),
  CONSTRAINT business_contact_name_length CHECK (contact_name IS NULL OR char_length(contact_name) BETWEEN 2 AND 100),
  CONSTRAINT business_contact_email_length CHECK (contact_email IS NULL OR char_length(contact_email) BETWEEN 3 AND 255)
);

CREATE UNIQUE INDEX businesses_unique_name ON businesses (lower(name));
CREATE UNIQUE INDEX businesses_unique_slug ON businesses (slug);
CREATE INDEX idx_businesses_published_created ON businesses (published, created_at DESC);

CREATE TRIGGER update_businesses_updated_at
BEFORE UPDATE ON businesses
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE business_founders (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id   UUID        NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  slug          TEXT        NOT NULL,
  name          TEXT        NOT NULL,
  role          TEXT        NOT NULL,
  linkedin_url  TEXT,
  journey       TEXT,
  photo_url     TEXT,
  directory_visible BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER     NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT founder_name_length CHECK (char_length(name) BETWEEN 2 AND 100),
  CONSTRAINT founder_role_length CHECK (char_length(role) BETWEEN 2 AND 50)
);

CREATE INDEX idx_business_founders_business ON business_founders (business_id, display_order);
CREATE UNIQUE INDEX business_founders_unique_slug ON business_founders (slug);

CREATE TABLE business_media (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id   UUID        NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  media_type    TEXT        NOT NULL CHECK (media_type IN ('image', 'video')),
  url           TEXT        NOT NULL,
  caption       TEXT,
  display_order INTEGER     NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_business_media_business ON business_media (business_id, display_order);

INSERT INTO businesses (
  slug, name, pitch, stage, location, category, tags, website_url,
  contact_name, contact_email, journey, challenges, challenge_solution,
  ask_text, offer_text, founded_year, team_size, company_status, channels
)
VALUES (
  'keyframe',
  'keyframe.art',
  'Keyframe helps brands and creators turn ideas into launch-ready AI films—faster and more affordably than traditional video production, without compromising creative quality.',
  'Series A',
  'Mountain View, CA',
  'AI',
  ARRAY['Generative AI', 'AI Video', 'Filmmaking', 'Advertising', 'Content Creation'],
  'https://www.keyframe.art/',
  'digvijay',
  'digvijay@keyframe.ai',
  $copy$Keyframe emerged from a clear problem: producing high-quality brand video is traditionally expensive, slow and difficult to scale. Existing AI-video workflows also require creators to move between several tools, spend money experimenting with unusable generations and manually assemble the final output.

The founders began developing a simpler, production-focused workflow that combines AI generation with human creative direction. Their objective is not merely to generate isolated clips, but to make professional filmmaking accessible to smaller brands and creators without traditional production budgets.$copy$,
  $copy$Traditional video agencies require significant budgets and long timelines.
AI-video creators often need five or more disconnected tools.
Maintaining visual quality, creative consistency and storytelling across shots is difficult.
AI-generated footage frequently requires expensive experimentation and manual correction.
Brands need more content across launches, advertisements and social media than traditional production can support.$copy$,
  $copy$Keyframe combines creative professionals with structured AI-production workflows instead of relying on a single prompt. It offers an assisted agency service alongside an application and API, allowing customers to select the level of creative and technical involvement they need.

According to its website, one customer reported receiving a film within three days at substantially lower cost than traditional agency quotations. Treat performance claims as customer testimonials, not independently verified metrics.$copy$,
  $copy$Brands and startups needing launch-ready video
Early users for practical product feedback
Product teams exploring API integrations$copy$,
  $copy$Managed creative video production
Self-service AI video workspace
Embedded video workflow API$copy$,
  2025,
  2,
  'Active',
  '[]'::jsonb
);

INSERT INTO business_founders (business_id, slug, name, role, linkedin_url, journey, display_order)
SELECT id, 'digvijay-goswami', 'Digvijay Goswami', 'Founder & CEO', 'https://www.linkedin.com/in/digvijaygoswami/',
  $copy$Digvijay leads Keyframe’s business, customer and creative vision. His background combines economics, business development and community leadership. His work on Keyframe is driven by the belief that professional filmmaking should become as accessible as writing—allowing brands and creators to translate ideas into finished films without traditional production constraints.$copy$,
  0
FROM businesses WHERE slug = 'keyframe';

INSERT INTO business_founders (business_id, slug, name, role, linkedin_url, journey, display_order)
SELECT id, 'sidharth-raja', 'Sidharth Raja', 'Founder & CTO', 'https://www.linkedin.com/in/sidharthraja/',
  $copy$Sidharth leads Keyframe’s technology and product development. Before Keyframe, he worked at Google, where he helped develop early versions of Gemini Live and speech infrastructure used across Android products. Earlier, he was a founding engineer for Uber Lite, which reached more than ten million installations. He brings experience building large-scale AI, speech and consumer-product systems.$copy$,
  1
FROM businesses WHERE slug = 'keyframe';

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

-- ─── Member pitch applications ─────────────────────────────────────────────

CREATE TABLE pitch_applications (
  id                      UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                 UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  event_id                UUID        REFERENCES events(id) ON DELETE SET NULL,
  event_slug              TEXT,
  event_title             TEXT,
  startup_name            TEXT,
  startup_website         TEXT,
  startup_summary         TEXT,
  talk_title              TEXT,
  problem                 TEXT,
  solution                TEXT,
  monetization_challenge  TEXT,
  breakthrough            TEXT,
  lessons                 JSONB       NOT NULL DEFAULT '[]'::jsonb,
  ask_text                TEXT,
  offer_text              TEXT,
  milestone               TEXT,
  consent_to_review       BOOLEAN     NOT NULL DEFAULT false,
  status                  TEXT        NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'under_review', 'approved', 'declined', 'withdrawn')),
  submitted_at            TIMESTAMPTZ,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_pitch_applications_user_updated ON pitch_applications(user_id, updated_at DESC);
CREATE INDEX idx_pitch_applications_status ON pitch_applications(status, submitted_at DESC);

CREATE TRIGGER update_pitch_applications_updated_at
BEFORE UPDATE ON pitch_applications
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ─── Event publishing workflow ─────────────────────────────────────────────

CREATE TABLE event_channels (
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

CREATE INDEX idx_event_channels_event_id ON event_channels(event_id);
CREATE INDEX idx_event_channels_status ON event_channels(status);

CREATE TABLE event_content_items (
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

CREATE INDEX idx_event_content_event_id ON event_content_items(event_id);
CREATE INDEX idx_event_content_schedule ON event_content_items(scheduled_at) WHERE scheduled_at IS NOT NULL;

CREATE TRIGGER update_event_channels_updated_at
BEFORE UPDATE ON event_channels
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_event_content_updated_at
BEFORE UPDATE ON event_content_items
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ─── Event RSVPs ─────────────────────────────────────────────────────────────

CREATE TABLE event_rsvps (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID        REFERENCES users(id) ON DELETE SET NULL,
  event_id    UUID        REFERENCES events(id) ON DELETE CASCADE,
  event_slug  TEXT        NOT NULL,
  event_title TEXT        NOT NULL,
  first_name  TEXT        NOT NULL,
  last_name   TEXT        NOT NULL,
  email       TEXT        NOT NULL,
  phone       TEXT,
  company     TEXT,
  role        TEXT,
  pitch_interest BOOLEAN     NOT NULL DEFAULT false,
  whatsapp_opt_in BOOLEAN    NOT NULL DEFAULT false,
  attended   BOOLEAN     NOT NULL DEFAULT false,
  notes       TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_event_rsvps_event_id   ON event_rsvps(event_id);
CREATE INDEX idx_event_rsvps_event_slug ON event_rsvps(event_slug);
CREATE INDEX idx_event_rsvps_created_at ON event_rsvps(created_at DESC);

-- One RSVP per email per event
CREATE UNIQUE INDEX event_rsvps_unique_event_email ON event_rsvps (event_slug, lower(email));

-- First Startup A to Z session
INSERT INTO events (
  slug, title, date, time, venue, address, type, description,
  long_description, agenda, speakers, spots, capacity, price, featured
)
VALUES (
  'startup-a-to-z-hacker-dojo-august-12',
  'Bay Area Founders Pitch & Startup Networking',
  'August 12, 2026',
  '5:00 PM - 8:00 PM',
  'Hacker Dojo, Mountain View',
  '855 Maude Ave, Mountain View, CA 94043',
  'Founder Meetup',
  'A free Bay Area founder pitch and startup networking event at Hacker Dojo in Mountain View on August 12, 2026.',
  'Startup A to Z brings founders, operators, investors, mentors, and aspiring entrepreneurs together for practical learning and meaningful connections. The first session opens with a fast-paced Startup Basics from A to Z talk, followed by two organized founder pitches, two audience pitches, direct feedback, and networking. Founder speakers will be announced soon.',
  '[{"time":"5:00 PM","item":"Arrival, registration, and networking"},{"time":"5:30 PM","item":"Welcome + Startup Basics from A to Z with Satz"},{"time":"5:55 PM","item":"Founder pitch 1 + feedback"},{"time":"6:10 PM","item":"Founder pitch 2 + feedback"},{"time":"6:25 PM","item":"Audience pitch 1 + feedback"},{"time":"6:35 PM","item":"Audience pitch 2 + feedback"},{"time":"6:45 PM","item":"Key lessons and community announcements"},{"time":"6:55 PM","item":"Closing remarks"},{"time":"7:00 PM","item":"Post-session networking"}]'::jsonb,
  '[{"name":"Satz","role":"Host, Startup A to Z"}]'::jsonb,
  24,
  30,
  'Free',
  true
);

INSERT INTO event_channels (event_id, channel, status, external_url, published_at)
SELECT id, 'website', 'published', '/events/' || slug, now()
FROM events
ON CONFLICT (event_id, channel) DO NOTHING;

INSERT INTO event_channels (event_id, channel, status)
SELECT id, 'luma', 'draft'
FROM events
ON CONFLICT (event_id, channel) DO NOTHING;

UPDATE event_channels
SET status = 'published',
    external_url = 'https://luma.com/m0eu7bw9?utm_source=startupa2z&utm_medium=website&utm_campaign=founders_pitch_mix_aug12',
    published_at = COALESCE(published_at, now())
WHERE channel = 'luma'
  AND event_id = (
    SELECT id FROM events WHERE slug = 'startup-a-to-z-hacker-dojo-august-12'
  );

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
  stripe_payment_intent_id TEXT,
  stripe_customer_id TEXT,
  payment_status    TEXT        NOT NULL DEFAULT 'unpaid',
  fulfillment_status TEXT       NOT NULL DEFAULT 'pending'
                                   CHECK (fulfillment_status IN ('pending', 'contacted', 'fulfilled')),
  amount_total      INTEGER     NOT NULL DEFAULT 0 CHECK (amount_total >= 0),
  amount_refunded   INTEGER     NOT NULL DEFAULT 0 CHECK (amount_refunded >= 0),
  currency          TEXT        NOT NULL DEFAULT 'usd',
  customer_email    TEXT,
  customer_name     TEXT,
  package_id        TEXT,
  package_name      TEXT,
  livemode          BOOLEAN     NOT NULL DEFAULT false,
  paid_at           TIMESTAMPTZ,
  fulfilled_at      TIMESTAMPTZ,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX sponsor_payments_created_at_idx ON sponsor_payments (created_at DESC);
CREATE UNIQUE INDEX sponsor_payments_payment_intent_unique_idx
  ON sponsor_payments (stripe_payment_intent_id)
  WHERE stripe_payment_intent_id IS NOT NULL;

CREATE TABLE stripe_webhook_events (
  stripe_event_id TEXT        PRIMARY KEY,
  event_type      TEXT        NOT NULL,
  livemode        BOOLEAN     NOT NULL DEFAULT false,
  processed_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
