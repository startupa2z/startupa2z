import json
import os
import re
import uuid

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from pydantic import BaseModel

from auth_middleware import require_admin
from database import get_pool

router = APIRouter()

IMAGES_DIR = os.path.join(os.path.dirname(__file__), "..", "static", "images")
ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png", "image/webp", "image/gif"}
MAX_IMAGE_BYTES = 5 * 1024 * 1024


def _slugify(s: str) -> str:
    s = s.lower().strip()
    s = re.sub(r"[^a-z0-9\s-]", "", s)
    s = re.sub(r"\s+", "-", s)
    return re.sub(r"-+", "-", s)[:80]


# ——— Submissions ——————————————————————————————————————————————————————————————

@router.get("/submissions")
async def list_submissions(user: dict = Depends(require_admin)):
    pool = await get_pool()
    rows = await pool.fetch("SELECT * FROM contact_submissions ORDER BY created_at DESC")
    return {"ok": True, "data": [dict(r) for r in rows]}


# ——— RSVPs ————————————————————————————————————————————————————————————————————

@router.get("/rsvps")
async def list_rsvps(user: dict = Depends(require_admin)):
    pool = await get_pool()
    rows = await pool.fetch("SELECT * FROM event_rsvps ORDER BY created_at DESC")
    return {"ok": True, "data": [dict(r) for r in rows]}


@router.delete("/rsvps/{rsvp_id}")
async def delete_rsvp(rsvp_id: str, user: dict = Depends(require_admin)):
    pool = await get_pool()
    await pool.execute("DELETE FROM event_rsvps WHERE id = $1", rsvp_id)
    return {"ok": True}


# ——— Events ———————————————————————————————————————————————————————————————————

@router.get("/events/{event_id}")
async def get_event_by_id(event_id: str, user: dict = Depends(require_admin)):
    pool = await get_pool()
    row = await pool.fetchrow("SELECT * FROM events WHERE id = $1", event_id)
    if not row:
        raise HTTPException(404, "Event not found.")
    return {"ok": True, "data": dict(row)}


class EventCreatePayload(BaseModel):
    title: str
    date: str
    time: str
    venue: str
    address: str | None = None
    type: str
    description: str | None = None
    long_description: str | None = None
    spots: int = 0
    capacity: int = 0
    price: str = "Free"
    featured: bool = False
    agenda: list | None = None
    speakers: list | None = None
    image_url: str | None = None


@router.post("/events")
async def create_event(body: EventCreatePayload, user: dict = Depends(require_admin)):
    pool = await get_pool()
    event_id = str(uuid.uuid4())
    slug = _slugify(body.title) + "-" + event_id[:4]
    await pool.execute(
        """INSERT INTO events
             (id, slug, title, date, time, venue, address, type, description,
              long_description, spots, capacity, price, featured, agenda, speakers,
              image_url, created_by)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15::jsonb,$16::jsonb,$17,$18)""",
        event_id, slug, body.title, body.date, body.time, body.venue, body.address,
        body.type, body.description, body.long_description, body.spots, body.capacity,
        body.price, body.featured,
        json.dumps(body.agenda or []), json.dumps(body.speakers or []),
        body.image_url, user.get("sub"),
    )
    return {"ok": True, "id": event_id, "slug": slug}


class EventUpdatePayload(BaseModel):
    title: str | None = None
    date: str | None = None
    time: str | None = None
    venue: str | None = None
    address: str | None = None
    type: str | None = None
    description: str | None = None
    long_description: str | None = None
    spots: int | None = None
    capacity: int | None = None
    price: str | None = None
    featured: bool | None = None
    agenda: list | None = None
    speakers: list | None = None
    image_url: str | None = None
    remove_image: bool = False


@router.put("/events/{event_id}")
async def update_event(event_id: str, body: EventUpdatePayload, user: dict = Depends(require_admin)):
    pool = await get_pool()
    sets: list[str] = []
    vals: list = []
    i = 1

    for field in ("title", "date", "time", "venue", "address", "type",
                  "description", "long_description", "spots", "capacity",
                  "price", "featured"):
        val = getattr(body, field)
        if val is not None:
            sets.append(f"{field} = ${i}")
            vals.append(val)
            i += 1

    if body.agenda is not None:
        sets.append(f"agenda = ${i}::jsonb")
        vals.append(json.dumps(body.agenda))
        i += 1

    if body.speakers is not None:
        sets.append(f"speakers = ${i}::jsonb")
        vals.append(json.dumps(body.speakers))
        i += 1

    if body.remove_image:
        sets.append("image_url = NULL")
    elif body.image_url is not None:
        sets.append(f"image_url = ${i}")
        vals.append(body.image_url)
        i += 1

    if not sets:
        raise HTTPException(400, "No fields to update.")

    sets.append(f"updated_at = now()")
    vals.append(event_id)
    await pool.execute(
        f"UPDATE events SET {', '.join(sets)} WHERE id = ${i}",
        *vals,
    )
    return {"ok": True}


@router.delete("/events/{event_id}")
async def delete_event(event_id: str, user: dict = Depends(require_admin)):
    pool = await get_pool()
    await pool.execute("DELETE FROM events WHERE id = $1", event_id)
    return {"ok": True}


# ——— Image upload ————————————————————————————————————————————————————————————

@router.post("/upload-image")
async def upload_image(file: UploadFile = File(...), user: dict = Depends(require_admin)):
    if not file.content_type or file.content_type not in ALLOWED_IMAGE_TYPES:
        raise HTTPException(400, "File must be a JPG, PNG, WebP, or GIF.")
    content = await file.read()
    if len(content) > MAX_IMAGE_BYTES:
        raise HTTPException(400, "Image must be under 5 MB.")

    ext = (file.filename or "image.jpg").rsplit(".", 1)[-1].lower()
    filename = f"{uuid.uuid4()}.{ext}"
    os.makedirs(IMAGES_DIR, exist_ok=True)
    with open(os.path.join(IMAGES_DIR, filename), "wb") as f:
        f.write(content)

    return {"ok": True, "url": f"/static/images/{filename}"}
