EVENT_LIFECYCLE_MIGRATION_KEY = "20260910_event_lifecycle_vivek_and_sep22_daniel"


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
                          long_description = 'A Masterclass on Business Lifecycle Economics & Valuation Realities. The playbook that secures your Seed round can actively derail your Series C, later growth rounds, and eventual public-market readiness. Join StartupA2Z and investor Vivek Somani for a practical deep dive into how investor expectations evolve from TAM and narrative to unit economics, capital allocation, cash flow, Rule of 40, operating leverage, ROIC, and public-market valuation realities.',
                          agenda = '[{"time":"5:00 PM","item":"Networking"},{"time":"5:30 PM","item":"Welcome and introduction by Satish"},{"time":"5:40 PM","item":"Masterclass with Vivek Somani"},{"time":"7:20 PM","item":"Closing remarks"},{"time":"7:30 PM","item":"Networking"}]'::jsonb,
                          speakers = '[{"name":"Vivek Somani","role":"Investor and former customer-focused technology leader","bio":"Vivek brings an investor''s perspective to startup economics, capital efficiency, and valuation. He also shares practical investing education through OptionGig and hosts a Bay Area community for DIY investors.","imageUrl":"/speakers/vivek-somani-linkedin.jpg","linkedinUrl":"https://www.linkedin.com/in/meetviveksomani/","websiteUrl":"https://optiongig.com/","xUrl":"https://x.com/VivekChirps"},{"name":"Satish Govindappa","role":"Host, StartupA2Z"}]'::jsonb,
                          image_url = '/event-covers/startupa2z-vivek-seed-to-series-c-luma-social-v2.png?v=20260909',
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
                """UPDATE events
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
                    WHERE slug = 'founders-pitch-mix-2026-09-22'"""
            )
            await conn.execute(
                """UPDATE event_rsvps
                      SET event_title = 'Special Session for Founders: The Wiz Story'
                    WHERE event_slug = 'founders-pitch-mix-2026-09-22'"""
            )
            await conn.execute(
                """UPDATE event_channels
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
                      AND channel IN ('website', 'luma')"""
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
