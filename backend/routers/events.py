import json

from fastapi import APIRouter, HTTPException
from database import get_pool

router = APIRouter()


def _event_dict(row) -> dict:
    data = dict(row)
    for field in ("agenda", "speakers"):
        if isinstance(data.get(field), str):
            data[field] = json.loads(data[field])
    return data


@router.get("")
async def list_events():
    pool = await get_pool()
    rows = await pool.fetch(
        """SELECT e.*, channels.registration_url
           FROM events e
           LEFT JOIN LATERAL (
             SELECT external_url AS registration_url
             FROM event_channels
             WHERE event_id = e.id AND channel IN ('luma', 'eventbrite')
                   AND external_url IS NOT NULL
             ORDER BY CASE channel WHEN 'luma' THEN 0 ELSE 1 END
             LIMIT 1
           ) channels ON true
           ORDER BY e.created_at DESC"""
    )
    return {"ok": True, "data": [_event_dict(r) for r in rows]}


@router.get("/{slug}")
async def get_event(slug: str):
    pool = await get_pool()
    row = await pool.fetchrow(
        """SELECT e.*, channels.registration_url
           FROM events e
           LEFT JOIN LATERAL (
             SELECT external_url AS registration_url
             FROM event_channels
             WHERE event_id = e.id AND channel IN ('luma', 'eventbrite')
                   AND external_url IS NOT NULL
             ORDER BY CASE channel WHEN 'luma' THEN 0 ELSE 1 END
             LIMIT 1
           ) channels ON true
           WHERE e.slug = $1""",
        slug,
    )
    if not row:
        raise HTTPException(404, "Event not found.")
    return {"ok": True, "data": _event_dict(row)}
