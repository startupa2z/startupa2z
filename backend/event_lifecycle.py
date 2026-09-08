EVENT_LIFECYCLE_MIGRATION_KEY = "20260908_event_lifecycle_and_sep15_masterclass"


async def ensure_event_lifecycle_schema(pool) -> None:
    """Apply the additive event lifecycle migration once on existing databases."""
    async with pool.acquire() as conn:
        async with conn.transaction():
            await conn.execute(
                """CREATE TABLE IF NOT EXISTS app_schema_migrations (
                     key        TEXT PRIMARY KEY,
                     applied_at TIMESTAMPTZ NOT NULL DEFAULT now()
                   )"""
            )
            applied = await conn.fetchval(
                "SELECT 1 FROM app_schema_migrations WHERE key = $1 FOR UPDATE",
                EVENT_LIFECYCLE_MIGRATION_KEY,
            )
            if applied:
                return

            await conn.execute(
                """ALTER TABLE events
                     ADD COLUMN IF NOT EXISTS lifecycle_status TEXT NOT NULL DEFAULT 'published'"""
            )
            await conn.execute(
                "ALTER TABLE events DROP CONSTRAINT IF EXISTS events_lifecycle_status_check"
            )
            await conn.execute(
                """ALTER TABLE events
                     ADD CONSTRAINT events_lifecycle_status_check
                     CHECK (lifecycle_status IN ('draft', 'published', 'cancelled', 'completed'))"""
            )
            await conn.execute(
                "ALTER TABLE event_channels DROP CONSTRAINT IF EXISTS event_channels_status_check"
            )
            await conn.execute(
                """ALTER TABLE event_channels
                     ADD CONSTRAINT event_channels_status_check
                     CHECK (status IN ('draft', 'ready', 'scheduled', 'published', 'cancelled', 'failed', 'not_connected'))"""
            )

            await conn.execute(
                """UPDATE events
                      SET lifecycle_status = 'cancelled', featured = false, updated_at = now()
                    WHERE slug = 'founders-pitch-mix-2026-09-08'"""
            )
            await conn.execute(
                """UPDATE event_channels
                      SET status = 'cancelled', last_error = NULL, updated_at = now()
                    WHERE event_id = (
                      SELECT id FROM events WHERE slug = 'founders-pitch-mix-2026-09-08'
                    )
                      AND channel IN ('website', 'luma')"""
            )

            await conn.execute(
                """UPDATE events
                      SET title = 'What Raises Your Seed Round Will Sink Your Series C',
                          type = 'Founder Finance Masterclass',
                          description = 'A founder masterclass on how business lifecycle economics and valuation expectations change from Seed through Series C and public-market readiness.',
                          long_description = 'A Masterclass on Business Lifecycle Economics & Valuation Realities. The playbook that secures your Seed round can actively derail your Series C, later growth rounds, and eventual public-market readiness. Join StartupA2Z and Vivek for a practical deep dive into how investor expectations evolve from TAM and narrative to unit economics, capital allocation, cash flow, Rule of 40, operating leverage, ROIC, and public-market valuation realities.',
                          agenda = '[{"time":"5:00 PM","item":"Networking"},{"time":"5:30 PM","item":"Welcome and introduction by Satish"},{"time":"5:40 PM","item":"Masterclass with Vivek"},{"time":"7:20 PM","item":"Closing remarks"},{"time":"7:30 PM","item":"Networking"}]'::jsonb,
                          speakers = '[{"name":"Vivek","role":"Masterclass speaker"},{"name":"Satish Govindappa","role":"Host, StartupA2Z"}]'::jsonb,
                          image_url = '/event-covers/startupa2z-vivek-seed-to-series-c-luma-social-v1.png?v=20260908',
                          featured = true,
                          lifecycle_status = 'published',
                          updated_at = now()
                    WHERE slug = 'founders-pitch-mix-2026-09-15'"""
            )
            await conn.execute(
                """UPDATE event_rsvps
                      SET event_title = 'What Raises Your Seed Round Will Sink Your Series C'
                    WHERE event_slug = 'founders-pitch-mix-2026-09-15'"""
            )
            await conn.execute(
                """UPDATE event_channels
                      SET status = 'published',
                          external_url = CASE
                            WHEN channel = 'luma' THEN 'https://luma.com/hmvkxmas'
                            WHEN channel = 'website' THEN '/events/founders-pitch-mix-2026-09-15'
                            ELSE external_url
                          END,
                          published_at = COALESCE(published_at, now()),
                          last_error = NULL,
                          updated_at = now()
                    WHERE event_id = (
                      SELECT id FROM events WHERE slug = 'founders-pitch-mix-2026-09-15'
                    )
                      AND channel IN ('website', 'luma')"""
            )
            await conn.execute(
                "INSERT INTO app_schema_migrations (key) VALUES ($1)",
                EVENT_LIFECYCLE_MIGRATION_KEY,
            )
