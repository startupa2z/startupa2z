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
    rows = await pool.fetch("SELECT * FROM events ORDER BY created_at DESC")
    return {"ok": True, "data": [_event_dict(r) for r in rows]}


@router.get("/{slug}")
async def get_event(slug: str):
    pool = await get_pool()
    row = await pool.fetchrow("SELECT * FROM events WHERE slug = $1", slug)
    if not row:
        raise HTTPException(404, "Event not found.")
    return {"ok": True, "data": _event_dict(row)}
