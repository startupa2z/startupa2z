from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
from asyncpg import UniqueViolationError
from database import get_pool

router = APIRouter()


class RsvpRequest(BaseModel):
    event_id: str | None = None
    event_slug: str
    event_title: str
    first_name: str
    last_name: str
    email: EmailStr
    phone: str | None = None
    company: str | None = None
    role: str
    notes: str | None = None


@router.post("", status_code=201)
async def submit_rsvp(body: RsvpRequest):
    pool = await get_pool()
    try:
        await pool.execute(
            """INSERT INTO event_rsvps
                 (event_id, event_slug, event_title, first_name, last_name,
                  email, phone, company, role, notes)
               VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)""",
            body.event_id, body.event_slug, body.event_title,
            body.first_name, body.last_name, str(body.email),
            body.phone, body.company, body.role, body.notes,
        )
    except UniqueViolationError:
        raise HTTPException(409, "You've already RSVP'd to this event with this email address.")
    return {"ok": True, "message": "RSVP confirmed."}
