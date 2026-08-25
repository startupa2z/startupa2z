from fastapi import APIRouter, Depends, Query

from auth_middleware import require_admin
from database import get_pool


router = APIRouter()


@router.get("/audience-preview")
async def preview_invitation_audience(
    event_slug: str = Query(min_length=1, max_length=160),
    user: dict = Depends(require_admin),
):
    """Return aggregate audience counts. This endpoint never queues or sends email."""
    pool = await get_pool()
    row = await pool.fetchrow(
        """
        WITH candidate_rows AS (
            SELECT lower(trim(u.email)) AS email,
                   'member'::text AS source,
                   EXISTS (
                       SELECT 1
                         FROM user_roles ur
                        WHERE ur.user_id = u.id AND ur.role = 'admin'
                   ) AS is_admin
              FROM users u
            UNION ALL
            SELECT lower(trim(r.email)) AS email,
                   'rsvp'::text AS source,
                   false AS is_admin
              FROM event_rsvps r
        ),
        deduped AS (
            SELECT email,
                   bool_or(source = 'member') AS from_members,
                   bool_or(source = 'rsvp') AS from_rsvps,
                   bool_or(is_admin) AS is_admin
              FROM candidate_rows
             WHERE email IS NOT NULL AND email <> ''
             GROUP BY email
        ),
        classified AS (
            SELECT d.*,
                   d.email !~* '^[A-Z0-9._%+\\-]+@[A-Z0-9.\\-]+\\.[A-Z]{2,}$' AS invalid_email,
                   (
                       d.is_admin
                       OR d.email LIKE '%@example.com'
                       OR d.email LIKE '%@test.com'
                       OR d.email LIKE '%@localhost'
                       OR d.email LIKE 'test+%@%'
                       OR d.email LIKE 'noreply@%'
                       OR d.email LIKE 'no-reply@%'
                   ) AS internal_or_test,
                   EXISTS (
                       SELECT 1
                         FROM event_rsvps target
                        WHERE target.event_slug = $1
                          AND lower(trim(target.email)) = d.email
                   ) AS already_registered
              FROM deduped d
        )
        SELECT
            (SELECT count(*) FROM candidate_rows) AS raw_rows,
            count(*) AS unique_contacts,
            count(*) FILTER (WHERE from_members) AS member_contacts,
            count(*) FILTER (WHERE from_rsvps) AS rsvp_contacts,
            count(*) FILTER (WHERE already_registered) AS already_registered,
            count(*) FILTER (WHERE invalid_email) AS invalid_email,
            count(*) FILTER (WHERE internal_or_test) AS internal_or_test,
            count(*) FILTER (
                WHERE NOT already_registered
                  AND NOT invalid_email
                  AND NOT internal_or_test
            ) AS eligible_before_suppression
          FROM classified
        """,
        event_slug,
    )

    counts = dict(row)
    counts["duplicates_removed"] = max(counts["raw_rows"] - counts["unique_contacts"], 0)
    return {
        "ok": True,
        "data": {
            "event_slug": event_slug,
            "counts": counts,
            "suppression": {
                "available": False,
                "count": None,
                "reason": "Unsubscribe, bounce, and complaint suppression is not implemented yet.",
            },
            "ready_to_send": False,
            "send_capability": False,
            "notice": "Read-only preview. No recipient addresses are returned and no email can be sent.",
        },
    }
