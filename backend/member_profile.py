FOUNDER_STATUSES = ("founder", "co_founder", "aspiring_founder", "not_founder")

LEGACY_PROFILE_COLUMNS = {
    "full_name": "full_name",
    "organization": "company",
    "job_title": "job_title",
    "founder_status": "founder_status",
}

MEMBER_SELECT = """SELECT u.id, u.email, u.linkedin_id, u.created_at,
                          p.full_name, p.company, p.job_title, p.founder_status
                     FROM users u
                LEFT JOIN member_profiles p ON p.user_id = u.id"""


async def ensure_member_profile_schema(pool) -> None:
    """Create and backfill the additive profile table before serving traffic."""
    async with pool.acquire() as connection:
        async with connection.transaction():
            await connection.execute(
                """CREATE TABLE IF NOT EXISTS member_profiles (
                       user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
                       full_name TEXT,
                       company TEXT,
                       job_title TEXT,
                       founder_status TEXT CHECK (
                           founder_status IS NULL OR founder_status IN (
                               'founder', 'co_founder', 'aspiring_founder', 'not_founder'
                           )
                       ),
                       created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
                       updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
                   )"""
            )
            await connection.execute(
                """INSERT INTO member_profiles (user_id)
                   SELECT id FROM users
                   ON CONFLICT (user_id) DO NOTHING"""
            )
            rows = await connection.fetch(
                """SELECT column_name
                     FROM information_schema.columns
                    WHERE table_schema = 'public' AND table_name = 'users'"""
            )
            available_columns = {row["column_name"] for row in rows}
            for legacy_column, profile_column in LEGACY_PROFILE_COLUMNS.items():
                if legacy_column not in available_columns:
                    continue
                await connection.execute(
                    f"""UPDATE member_profiles p
                           SET {profile_column} = u.{legacy_column}
                          FROM users u
                         WHERE p.user_id = u.id
                           AND p.{profile_column} IS NULL"""
                )


async def fetch_member_profile(pool, user_id):
    return await pool.fetchrow(f"{MEMBER_SELECT} WHERE u.id = $1", user_id)


def is_member_profile_complete(user) -> bool:
    return all(
        isinstance(user[field], str) and bool(user[field].strip())
        for field in ("full_name", "company", "job_title", "founder_status")
    ) and user["founder_status"] in FOUNDER_STATUSES


def member_profile_payload(user) -> dict:
    return {
        "id": str(user["id"]),
        "email": user["email"],
        "full_name": user["full_name"],
        "company": user["company"],
        "job_title": user["job_title"],
        "founder_status": user["founder_status"],
        "linkedin_connected": bool(user["linkedin_id"]),
        "profile_complete": is_member_profile_complete(user),
        "created_at": user["created_at"].isoformat(),
    }
