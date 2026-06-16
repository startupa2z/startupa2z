from fastapi import APIRouter, HTTPException
from database import get_pool

router = APIRouter()


@router.get("")
async def list_events():
    pool = await get_pool()
    rows = await pool.fetch("SELECT * FROM events ORDER BY created_at DESC")
    return {"ok": True, "data": [dict(r) for r in rows]}


@router.get("/{slug}")
async def get_event(slug: str):
    pool = await get_pool()
    row = await pool.fetchrow("SELECT * FROM events WHERE slug = $1", slug)
    return {"ok": True, "data": dict(row) if row else None}
