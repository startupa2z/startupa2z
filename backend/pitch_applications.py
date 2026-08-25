async def ensure_pitch_application_schema(pool) -> None:
    """Create the additive member pitch-application table before serving traffic."""
    async with pool.acquire() as connection:
        async with connection.transaction():
            await connection.execute(
                """CREATE TABLE IF NOT EXISTS pitch_applications (
                       id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                       user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                       event_id UUID REFERENCES events(id) ON DELETE SET NULL,
                       event_slug TEXT,
                       event_title TEXT,
                       startup_name TEXT,
                       startup_website TEXT,
                       startup_summary TEXT,
                       talk_title TEXT,
                       problem TEXT,
                       solution TEXT,
                       monetization_challenge TEXT,
                       breakthrough TEXT,
                       lessons JSONB NOT NULL DEFAULT '[]'::jsonb,
                       ask_text TEXT,
                       offer_text TEXT,
                       milestone TEXT,
                       consent_to_review BOOLEAN NOT NULL DEFAULT false,
                       status TEXT NOT NULL DEFAULT 'draft' CHECK (
                           status IN ('draft', 'submitted', 'under_review', 'approved', 'declined', 'withdrawn')
                       ),
                       submitted_at TIMESTAMPTZ,
                       created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
                       updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
                   )"""
            )
            await connection.execute(
                """CREATE INDEX IF NOT EXISTS idx_pitch_applications_user_updated
                       ON pitch_applications(user_id, updated_at DESC)"""
            )
            await connection.execute(
                """CREATE INDEX IF NOT EXISTS idx_pitch_applications_status
                       ON pitch_applications(status, submitted_at DESC)"""
            )
            await connection.execute(
                """DROP TRIGGER IF EXISTS update_pitch_applications_updated_at
                       ON pitch_applications"""
            )
            await connection.execute(
                """CREATE TRIGGER update_pitch_applications_updated_at
                   BEFORE UPDATE ON pitch_applications
                   FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()"""
            )
