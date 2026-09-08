DEFAULT_EVENT_PLAYBOOK_KEY = "event-operations"
DEFAULT_EVENT_PLAYBOOK_TITLE = "StartupA2Z Event Operations Prompt"
DEFAULT_EVENT_PLAYBOOK_CONTENT = """# StartupA2Z Event Operations Prompt

## Purpose
Turn a confirmed event idea into one accurate, consistent, reviewable experience across Luma and StartupA2Z. Work locally first. Treat every external publication or message as a separate approval-gated action.

## Non-negotiable operating rules
- Production members, registrations, and event records are authoritative. Never overwrite production from stale local data.
- Inspect the current Luma event and live StartupA2Z pages before drafting changes.
- Keep the existing event URL when practical so registered guests, shared links, and search indexing do not break.
- Use the official StartupA2Z logo without redrawing, recoloring, distorting, or substituting it.
- Do not publish to Luma, deploy production, send attendee messages, post socially, spend money, or change accounts without Satz's explicit action-time approval.
- Distinguish clearly between drafted locally, saved locally, deployed, and verified live.
- Never store passwords, access tokens, private attendee data, or other secrets in this playbook.

## Event intake checklist
Confirm or explicitly mark unknown: event title, promise, audience, date, time, venue, capacity, price, registration URL, speaker full name, speaker title/company, biography, headshot permission, session length, agenda, founder-pitch format, CTA, and attendee communication plan.

## Event production workflow
1. Audit the live Luma listing, live StartupA2Z event page, repository fallback data, production event record, banner, metadata, agenda, speakers, and registration path.
2. Propose one synchronized change scope and identify missing decisions before editing external systems.
3. Prepare concise event copy: title, subtitle, short summary, full description, learning outcomes, audience fit, speaker details, agenda, CTA, and attendee-update draft.
4. Create coordinated Luma and 16:9 website/social banner assets. Verify text legibility on mobile and preserve the official logo.
5. Update local code and the controlled database migration for only the intended event. Update homepage feature, event listing, detail page, Open Graph image, structured Event data, sitemap/prerender coverage, and SEO verification where applicable.
6. Run local build, tests, responsive review, link checks, and stale-copy searches. Show Satz the local result and remaining unknowns.
7. After explicit approval, update Luma and separately confirm before any attendee message. Deploy only after explicit approval, then verify the exact live URLs and rendered content.
8. Record verified outcomes, failures, and reusable improvements as a new playbook revision. Do not turn assumptions into permanent rules.

## Quality bar
- The first screen must answer: what is this, who is it for, why attend, when, where, who is speaking, and how to register.
- Copy must explain practical founder value, not merely repeat speaker terminology.
- Luma, homepage, events listing, detail page, social preview, and structured data must agree.
- An HTTP 200 is not sufficient verification; inspect rendered title, description, banner, speaker, agenda, registration link, and metadata.

## Current working event: September 15, 2026
- Luma event: https://luma.com/hmvkxmas
- StartupA2Z route: /events/founders-pitch-mix-2026-09-15
- Date/time: Tuesday, September 15, 2026, 5:00 PM-8:00 PM Pacific
- Venue: Hacker Dojo, 855 Maude Ave, Mountain View, CA 94043
- Speaker: Vivek; full name, title/company, biography, and headshot are not yet confirmed.
- Confirmed topic: What raises your Seed round will sink your Series C.
- Subtitle: A Masterclass on Business Lifecycle Economics & Valuation Realities.
- Core sections: Lifecycle Shift; Metric Migration; Avoiding the Multiple Trap.
- Open decision: whether founder pitches and audience pitches remain, and the final time allocation for the masterclass and Q&A.
- Current state: Luma title, description, and agenda have been updated for the masterclass. The coordinated StartupA2Z website update is implemented locally and awaiting explicit deployment approval. The Luma banner remains a manual upload by Satz unless later verified otherwise.

## Learning log
- 2026-09-08: A Luma cancellation is not enough by itself. Mark the event lifecycle as cancelled, mark its website/Luma channels cancelled, exclude it from public APIs and frontend fallbacks, and remove its prerender and sitemap routes. Keep a temporary slug denylist during schema rollout so an older API cannot resurrect the event.
Add only verified, reusable lessons here. For each lesson, state the evidence, what decision it changes, and the date learned.
"""


async def ensure_event_playbook_schema(pool) -> None:
    async with pool.acquire() as conn:
        await conn.execute(
            """CREATE TABLE IF NOT EXISTS admin_playbooks (
                 key          TEXT        PRIMARY KEY,
                 title        TEXT        NOT NULL,
                 content      TEXT        NOT NULL,
                 revision     INTEGER     NOT NULL DEFAULT 1 CHECK (revision >= 1),
                 updated_by   UUID        REFERENCES users(id) ON DELETE SET NULL,
                 created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
                 updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
               )"""
        )
        await conn.execute(
            """CREATE TABLE IF NOT EXISTS admin_playbook_revisions (
                 id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
                 playbook_key TEXT        NOT NULL REFERENCES admin_playbooks(key) ON DELETE CASCADE,
                 revision     INTEGER     NOT NULL CHECK (revision >= 1),
                 title        TEXT        NOT NULL,
                 content      TEXT        NOT NULL,
                 created_by   UUID        REFERENCES users(id) ON DELETE SET NULL,
                 created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
                 UNIQUE (playbook_key, revision)
               )"""
        )
        await conn.execute(
            """CREATE INDEX IF NOT EXISTS idx_admin_playbook_revisions_key_created
               ON admin_playbook_revisions(playbook_key, created_at DESC)"""
        )
        await conn.execute(
            """INSERT INTO admin_playbooks (key, title, content)
               VALUES ($1, $2, $3)
               ON CONFLICT (key) DO NOTHING""",
            DEFAULT_EVENT_PLAYBOOK_KEY,
            DEFAULT_EVENT_PLAYBOOK_TITLE,
            DEFAULT_EVENT_PLAYBOOK_CONTENT,
        )
        await conn.execute(
            """INSERT INTO admin_playbook_revisions
                 (playbook_key, revision, title, content)
               SELECT key, revision, title, content
                 FROM admin_playbooks
                WHERE key = $1
               ON CONFLICT (playbook_key, revision) DO NOTHING""",
            DEFAULT_EVENT_PLAYBOOK_KEY,
        )
