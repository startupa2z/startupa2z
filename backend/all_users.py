from __future__ import annotations

from typing import Literal

import asyncpg


AllUserSource = Literal["member", "website_rsvp", "luma_csv", "lead_csv", "other_csv"]


async def ensure_all_users_schema(pool: asyncpg.Pool) -> None:
    """Create the shared contact index and safely seed it from existing local data."""
    async with pool.acquire() as conn:
        await conn.execute(
            """CREATE TABLE IF NOT EXISTS all_users (
                   id                     UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
                   email                  TEXT        NOT NULL,
                   normalized_email       TEXT        NOT NULL UNIQUE,
                   full_name              TEXT,
                   first_name             TEXT,
                   last_name              TEXT,
                   phone                  TEXT,
                   company                TEXT,
                   job_title              TEXT,
                   linkedin_url           TEXT,
                   member_user_id         UUID        UNIQUE REFERENCES users(id) ON DELETE SET NULL,
                   is_member              BOOLEAN     NOT NULL DEFAULT false,
                   is_website_registrant  BOOLEAN     NOT NULL DEFAULT false,
                   is_luma_attendee       BOOLEAN     NOT NULL DEFAULT false,
                   is_lead                BOOLEAN     NOT NULL DEFAULT false,
                   marketing_consent      BOOLEAN     NOT NULL DEFAULT false,
                   first_source           TEXT        NOT NULL,
                   last_source            TEXT        NOT NULL,
                   enrichment_status      TEXT        NOT NULL DEFAULT 'pending',
                   enrichment_sources     TEXT[]      NOT NULL DEFAULT '{}',
                   enriched_at            TIMESTAMPTZ,
                   created_at             TIMESTAMPTZ NOT NULL DEFAULT now(),
                   updated_at             TIMESTAMPTZ NOT NULL DEFAULT now(),
                   CHECK (normalized_email = lower(trim(email)))
               )"""
        )
        await conn.execute("ALTER TABLE all_users ADD COLUMN IF NOT EXISTS linkedin_url TEXT")
        await conn.execute("ALTER TABLE all_users ADD COLUMN IF NOT EXISTS enrichment_status TEXT NOT NULL DEFAULT 'pending'")
        await conn.execute("ALTER TABLE all_users ADD COLUMN IF NOT EXISTS enrichment_sources TEXT[] NOT NULL DEFAULT '{}'")
        await conn.execute("ALTER TABLE all_users ADD COLUMN IF NOT EXISTS enriched_at TIMESTAMPTZ")
        await conn.execute(
            "CREATE INDEX IF NOT EXISTS idx_all_users_updated_at ON all_users(updated_at DESC)"
        )
        await conn.execute(
            """CREATE TABLE IF NOT EXISTS all_user_imports (
                   id                 UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
                   filename           TEXT        NOT NULL,
                   source             TEXT        NOT NULL,
                   total_rows         INTEGER     NOT NULL,
                   created_rows       INTEGER     NOT NULL,
                   updated_rows       INTEGER     NOT NULL,
                   invalid_rows       INTEGER     NOT NULL,
                   duplicate_rows     INTEGER     NOT NULL,
                   enriched_rows      INTEGER     NOT NULL DEFAULT 0,
                   enrichment_matches INTEGER     NOT NULL DEFAULT 0,
                   fields_enriched    INTEGER     NOT NULL DEFAULT 0,
                   dedupe_verified    BOOLEAN     NOT NULL DEFAULT false,
                   completed_at       TIMESTAMPTZ,
                   created_by         UUID        REFERENCES users(id) ON DELETE SET NULL,
                   created_at         TIMESTAMPTZ NOT NULL DEFAULT now()
               )"""
        )
        await conn.execute("ALTER TABLE all_user_imports ADD COLUMN IF NOT EXISTS enriched_rows INTEGER NOT NULL DEFAULT 0")
        await conn.execute("ALTER TABLE all_user_imports ADD COLUMN IF NOT EXISTS enrichment_matches INTEGER NOT NULL DEFAULT 0")
        await conn.execute("ALTER TABLE all_user_imports ADD COLUMN IF NOT EXISTS fields_enriched INTEGER NOT NULL DEFAULT 0")
        await conn.execute("ALTER TABLE all_user_imports ADD COLUMN IF NOT EXISTS dedupe_verified BOOLEAN NOT NULL DEFAULT false")
        await conn.execute("ALTER TABLE all_user_imports ADD COLUMN IF NOT EXISTS completed_at TIMESTAMPTZ")

        # Existing verified accounts become members in the shared index.
        await conn.execute(
            """INSERT INTO all_users
                      (email, normalized_email, full_name, company, job_title,
                       member_user_id, is_member, first_source, last_source)
               SELECT u.email, lower(trim(u.email)), p.full_name, p.company, p.job_title,
                      u.id, true, 'member', 'member'
                 FROM users u
            LEFT JOIN member_profiles p ON p.user_id = u.id
                WHERE NULLIF(trim(u.email), '') IS NOT NULL
               ON CONFLICT (normalized_email) DO UPDATE
                     SET member_user_id = EXCLUDED.member_user_id,
                         is_member = true,
                         full_name = COALESCE(NULLIF(all_users.full_name, ''), EXCLUDED.full_name),
                         company = COALESCE(NULLIF(all_users.company, ''), EXCLUDED.company),
                         job_title = COALESCE(NULLIF(all_users.job_title, ''), EXCLUDED.job_title),
                         last_source = 'member',
                         updated_at = now()"""
        )

        # Existing website RSVPs are contacts, not automatically verified members.
        await conn.execute(
            """INSERT INTO all_users
                      (email, normalized_email, first_name, last_name, phone, company,
                       is_website_registrant, first_source, last_source)
               SELECT DISTINCT ON (lower(trim(r.email)))
                      r.email, lower(trim(r.email)), r.first_name, r.last_name, r.phone, r.company,
                      true, 'website_rsvp', 'website_rsvp'
                 FROM event_rsvps r
                WHERE NULLIF(trim(r.email), '') IS NOT NULL
             ORDER BY lower(trim(r.email)), r.created_at DESC
               ON CONFLICT (normalized_email) DO UPDATE
                     SET is_website_registrant = true,
                         first_name = COALESCE(NULLIF(all_users.first_name, ''), EXCLUDED.first_name),
                         last_name = COALESCE(NULLIF(all_users.last_name, ''), EXCLUDED.last_name),
                         phone = COALESCE(NULLIF(all_users.phone, ''), EXCLUDED.phone),
                         company = COALESCE(NULLIF(all_users.company, ''), EXCLUDED.company),
                         last_source = 'website_rsvp',
                         updated_at = now()"""
        )


async def upsert_all_user(
    db,
    *,
    email: str,
    source: AllUserSource,
    full_name: str | None = None,
    first_name: str | None = None,
    last_name: str | None = None,
    phone: str | None = None,
    company: str | None = None,
    job_title: str | None = None,
    linkedin_url: str | None = None,
    member_user_id=None,
) -> None:
    normalized_email = email.strip().lower()
    if not normalized_email:
        return

    source_flags = {
        "member": (True, False, False, False),
        "website_rsvp": (False, True, False, False),
        "luma_csv": (False, False, True, False),
        "lead_csv": (False, False, False, True),
        "other_csv": (False, False, False, False),
    }
    is_member, is_website, is_luma, is_lead = source_flags[source]
    await db.execute(
        """INSERT INTO all_users
                  (email, normalized_email, full_name, first_name, last_name, phone,
                   company, job_title, linkedin_url, member_user_id, is_member,
                   is_website_registrant, is_luma_attendee, is_lead,
                   first_source, last_source)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $15)
           ON CONFLICT (normalized_email) DO UPDATE
                 SET email = EXCLUDED.email,
                     full_name = COALESCE(NULLIF(EXCLUDED.full_name, ''), all_users.full_name),
                     first_name = COALESCE(NULLIF(EXCLUDED.first_name, ''), all_users.first_name),
                     last_name = COALESCE(NULLIF(EXCLUDED.last_name, ''), all_users.last_name),
                     phone = COALESCE(NULLIF(EXCLUDED.phone, ''), all_users.phone),
                     company = COALESCE(NULLIF(EXCLUDED.company, ''), all_users.company),
                     job_title = COALESCE(NULLIF(EXCLUDED.job_title, ''), all_users.job_title),
                     linkedin_url = COALESCE(NULLIF(EXCLUDED.linkedin_url, ''), all_users.linkedin_url),
                     member_user_id = COALESCE(EXCLUDED.member_user_id, all_users.member_user_id),
                     is_member = all_users.is_member OR EXCLUDED.is_member,
                     is_website_registrant = all_users.is_website_registrant OR EXCLUDED.is_website_registrant,
                     is_luma_attendee = all_users.is_luma_attendee OR EXCLUDED.is_luma_attendee,
                     is_lead = all_users.is_lead OR EXCLUDED.is_lead,
                     last_source = EXCLUDED.last_source,
                     updated_at = now()""",
        normalized_email,
        normalized_email,
        full_name,
        first_name,
        last_name,
        phone,
        company,
        job_title,
        linkedin_url,
        member_user_id,
        is_member,
        is_website,
        is_luma,
        is_lead,
        source,
    )


async def enrich_all_users(db, normalized_emails: list[str]) -> dict[str, int]:
    """Fill missing contact fields from trusted first-party StartupA2Z records."""
    if not normalized_emails:
        return {"enriched_rows": 0, "enrichment_matches": 0, "fields_enriched": 0}

    rows = await db.fetch(
        """WITH members AS (
               SELECT DISTINCT ON (lower(trim(u.email)))
                      lower(trim(u.email)) AS email_key,
                      u.id AS member_user_id, p.full_name, p.company, p.job_title
                 FROM users u
            LEFT JOIN member_profiles p ON p.user_id = u.id
                WHERE lower(trim(u.email)) = ANY($1::text[])
             ORDER BY lower(trim(u.email)), u.updated_at DESC
           ), rsvps AS (
               SELECT DISTINCT ON (lower(trim(email)))
                      lower(trim(email)) AS email_key,
                      first_name, last_name, phone, company, role
                 FROM event_rsvps
                WHERE lower(trim(email)) = ANY($1::text[])
             ORDER BY lower(trim(email)), created_at DESC
           ), enquiries AS (
               SELECT DISTINCT ON (lower(trim(email)))
                      lower(trim(email)) AS email_key,
                      first_name, last_name, linkedin_url, role
                 FROM contact_submissions
                WHERE lower(trim(email)) = ANY($1::text[])
             ORDER BY lower(trim(email)), created_at DESC
           ), directory AS (
               SELECT DISTINCT ON (lower(trim(contact_email)))
                      lower(trim(contact_email)) AS email_key,
                      contact_name, name AS company
                 FROM businesses
                WHERE contact_email IS NOT NULL
                  AND lower(trim(contact_email)) = ANY($1::text[])
             ORDER BY lower(trim(contact_email)), updated_at DESC
           ), candidates AS (
               SELECT a.id,
                      COALESCE(NULLIF(a.full_name, ''), NULLIF(m.full_name, ''),
                               NULLIF(concat_ws(' ', e.first_name, e.last_name), ''),
                               NULLIF(concat_ws(' ', r.first_name, r.last_name), ''),
                               NULLIF(d.contact_name, '')) AS full_name,
                      COALESCE(NULLIF(a.first_name, ''), NULLIF(e.first_name, ''),
                               NULLIF(r.first_name, ''),
                               NULLIF(split_part(COALESCE(m.full_name, d.contact_name), ' ', 1), '')) AS first_name,
                      COALESCE(NULLIF(a.last_name, ''), NULLIF(e.last_name, ''),
                               NULLIF(r.last_name, ''),
                               NULLIF(regexp_replace(COALESCE(m.full_name, d.contact_name), '^\\S+\\s*', ''), '')) AS last_name,
                      COALESCE(NULLIF(a.phone, ''), NULLIF(r.phone, '')) AS phone,
                      COALESCE(NULLIF(a.company, ''), NULLIF(m.company, ''),
                               NULLIF(r.company, ''), NULLIF(d.company, '')) AS company,
                      COALESCE(NULLIF(a.job_title, ''), NULLIF(m.job_title, ''),
                               NULLIF(e.role, ''), NULLIF(r.role, '')) AS job_title,
                      COALESCE(NULLIF(a.linkedin_url, ''), NULLIF(e.linkedin_url, '')) AS linkedin_url,
                      COALESCE(a.member_user_id, m.member_user_id) AS member_user_id,
                      a.is_member OR m.member_user_id IS NOT NULL AS is_member,
                      a.is_website_registrant OR r.email_key IS NOT NULL AS is_website_registrant,
                      ARRAY_REMOVE(ARRAY[
                          CASE WHEN m.email_key IS NOT NULL THEN 'member_profile' END,
                          CASE WHEN r.email_key IS NOT NULL THEN 'website_rsvp' END,
                          CASE WHEN e.email_key IS NOT NULL THEN 'enquiry' END,
                          CASE WHEN d.email_key IS NOT NULL THEN 'business_directory' END
                      ], NULL) AS sources,
                      (m.email_key IS NOT NULL OR r.email_key IS NOT NULL OR
                       e.email_key IS NOT NULL OR d.email_key IS NOT NULL) AS matched,
                      (CASE WHEN NULLIF(a.full_name, '') IS NULL AND COALESCE(NULLIF(m.full_name, ''), NULLIF(concat_ws(' ', e.first_name, e.last_name), ''), NULLIF(concat_ws(' ', r.first_name, r.last_name), ''), NULLIF(d.contact_name, '')) IS NOT NULL THEN 1 ELSE 0 END +
                       CASE WHEN NULLIF(a.first_name, '') IS NULL AND COALESCE(NULLIF(e.first_name, ''), NULLIF(r.first_name, ''), NULLIF(split_part(COALESCE(m.full_name, d.contact_name), ' ', 1), '')) IS NOT NULL THEN 1 ELSE 0 END +
                       CASE WHEN NULLIF(a.last_name, '') IS NULL AND COALESCE(NULLIF(e.last_name, ''), NULLIF(r.last_name, ''), NULLIF(regexp_replace(COALESCE(m.full_name, d.contact_name), '^\\S+\\s*', ''), '')) IS NOT NULL THEN 1 ELSE 0 END +
                       CASE WHEN NULLIF(a.phone, '') IS NULL AND NULLIF(r.phone, '') IS NOT NULL THEN 1 ELSE 0 END +
                       CASE WHEN NULLIF(a.company, '') IS NULL AND COALESCE(NULLIF(m.company, ''), NULLIF(r.company, ''), NULLIF(d.company, '')) IS NOT NULL THEN 1 ELSE 0 END +
                       CASE WHEN NULLIF(a.job_title, '') IS NULL AND COALESCE(NULLIF(m.job_title, ''), NULLIF(e.role, ''), NULLIF(r.role, '')) IS NOT NULL THEN 1 ELSE 0 END +
                       CASE WHEN NULLIF(a.linkedin_url, '') IS NULL AND NULLIF(e.linkedin_url, '') IS NOT NULL THEN 1 ELSE 0 END) AS fields_enriched
                 FROM all_users a
            LEFT JOIN members m ON m.email_key = a.normalized_email
            LEFT JOIN rsvps r ON r.email_key = a.normalized_email
            LEFT JOIN enquiries e ON e.email_key = a.normalized_email
            LEFT JOIN directory d ON d.email_key = a.normalized_email
                WHERE a.normalized_email = ANY($1::text[])
           )
           UPDATE all_users a
              SET full_name = c.full_name,
                  first_name = c.first_name,
                  last_name = c.last_name,
                  phone = c.phone,
                  company = c.company,
                  job_title = c.job_title,
                  linkedin_url = c.linkedin_url,
                  member_user_id = c.member_user_id,
                  is_member = c.is_member,
                  is_website_registrant = c.is_website_registrant,
                  enrichment_status = 'completed',
                  enrichment_sources = c.sources,
                  enriched_at = now(),
                  updated_at = now()
             FROM candidates c
            WHERE a.id = c.id
        RETURNING c.matched, c.fields_enriched""",
        normalized_emails,
    )
    return {
        "enriched_rows": len(rows),
        "enrichment_matches": sum(1 for row in rows if row["matched"]),
        "fields_enriched": sum(row["fields_enriched"] for row in rows),
    }
