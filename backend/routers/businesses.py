import os
import re
import uuid
from typing import Literal

from asyncpg import UniqueViolationError
from fastapi import APIRouter, File, HTTPException, UploadFile
from pydantic import BaseModel, EmailStr, Field, HttpUrl, field_validator

from database import get_pool


router = APIRouter()

BUSINESS_IMAGES_DIR = os.path.join(os.path.dirname(__file__), "..", "static", "images", "businesses")
ALLOWED_IMAGE_TYPES = {"image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp"}
MAX_IMAGE_BYTES = 5 * 1024 * 1024


def _slugify(value: str) -> str:
    slug = re.sub(r"[^a-z0-9]+", "-", value.lower()).strip("-")
    return slug[:80] or "startup"


def _clean_optional_text(value: str | None) -> str | None:
    if value is None:
        return None
    cleaned = value.strip()
    return cleaned or None


def _validate_media_url(value: str | None) -> str | None:
    value = _clean_optional_text(value)
    if value is None:
        return None
    if not (value.startswith("https://") or value.startswith("http://") or value.startswith("/static/")):
        raise ValueError("Use a complete media URL or an uploaded image.")
    return value


class FounderSubmission(BaseModel):
    name: str = Field(min_length=2, max_length=100)
    role: Literal["Founder", "Co-founder"]
    linkedin_url: HttpUrl | None = None
    journey: str | None = Field(default=None, max_length=2000)
    photo_url: str | None = Field(default=None, max_length=500)

    @field_validator("name")
    @classmethod
    def trim_name(cls, value: str) -> str:
        return value.strip()

    @field_validator("journey", mode="before")
    @classmethod
    def trim_journey(cls, value: str | None) -> str | None:
        return _clean_optional_text(value)

    @field_validator("photo_url", mode="before")
    @classmethod
    def validate_photo_url(cls, value: str | None) -> str | None:
        return _validate_media_url(value)


class MediaSubmission(BaseModel):
    media_type: Literal["image", "video"]
    url: str = Field(min_length=1, max_length=500)
    caption: str | None = Field(default=None, max_length=200)

    @field_validator("url", mode="before")
    @classmethod
    def validate_url(cls, value: str) -> str:
        cleaned = _validate_media_url(value)
        if cleaned is None:
            raise ValueError("Media URL is required.")
        return cleaned

    @field_validator("caption", mode="before")
    @classmethod
    def trim_caption(cls, value: str | None) -> str | None:
        return _clean_optional_text(value)


class BusinessSubmission(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    pitch: str = Field(min_length=20, max_length=280)
    stage: str = Field(min_length=2, max_length=50)
    location: str = Field(min_length=2, max_length=120)
    category: str = Field(min_length=2, max_length=50)
    tags: list[str] = Field(default_factory=list, max_length=5)
    website_url: HttpUrl | None = None
    logo_url: str | None = Field(default=None, max_length=500)
    journey: str = Field(min_length=20, max_length=4000)
    challenges: str | None = Field(default=None, max_length=3000)
    challenge_solution: str | None = Field(default=None, max_length=3000)
    founders: list[FounderSubmission] = Field(min_length=1, max_length=5)
    media: list[MediaSubmission] = Field(default_factory=list, max_length=10)
    contact_name: str = Field(min_length=2, max_length=100)
    contact_email: EmailStr
    consent_to_publish: bool

    @field_validator("name", "pitch", "stage", "location", "category", "journey", "contact_name")
    @classmethod
    def trim_text(cls, value: str) -> str:
        return value.strip()

    @field_validator("challenges", "challenge_solution", mode="before")
    @classmethod
    def trim_optional_text(cls, value: str | None) -> str | None:
        return _clean_optional_text(value)

    @field_validator("logo_url", mode="before")
    @classmethod
    def validate_logo_url(cls, value: str | None) -> str | None:
        return _validate_media_url(value)

    @field_validator("tags")
    @classmethod
    def clean_tags(cls, values: list[str]) -> list[str]:
        cleaned: list[str] = []
        for value in values:
            tag = value.strip()
            if not tag or tag in cleaned:
                continue
            if len(tag) > 30:
                raise ValueError("Each tag must be 30 characters or fewer.")
            cleaned.append(tag)
        return cleaned


PUBLIC_COLUMNS = """
    id, slug, name, pitch, stage, location, category, tags, website_url,
    logo_url, journey, challenges, challenge_solution, created_at
"""


async def _related_records(pool, business_ids: list[uuid.UUID]):
    if not business_ids:
        return {}, {}
    founder_rows = await pool.fetch(
        """SELECT id, business_id, name, role, linkedin_url, journey, photo_url, display_order
             FROM business_founders WHERE business_id = ANY($1::uuid[])
             ORDER BY display_order, created_at""",
        business_ids,
    )
    media_rows = await pool.fetch(
        """SELECT id, business_id, media_type, url, caption, display_order
             FROM business_media WHERE business_id = ANY($1::uuid[])
             ORDER BY display_order, created_at""",
        business_ids,
    )
    founders: dict[uuid.UUID, list[dict]] = {}
    media: dict[uuid.UUID, list[dict]] = {}
    for row in founder_rows:
        founders.setdefault(row["business_id"], []).append(dict(row))
    for row in media_rows:
        media.setdefault(row["business_id"], []).append(dict(row))
    return founders, media


def _public_business(row, founders: dict, media: dict) -> dict:
    item = dict(row)
    business_id = row["id"]
    item["founders"] = founders.get(business_id, [])
    item["media"] = media.get(business_id, [])
    return item


@router.post("/media/upload", status_code=201)
async def upload_business_image(file: UploadFile = File(...)):
    extension = ALLOWED_IMAGE_TYPES.get(file.content_type or "")
    if not extension:
        raise HTTPException(415, "Upload a JPG, PNG, or WebP image.")
    content = await file.read(MAX_IMAGE_BYTES + 1)
    if len(content) > MAX_IMAGE_BYTES:
        raise HTTPException(413, "Images must be 5 MB or smaller.")
    if not content:
        raise HTTPException(422, "The uploaded image is empty.")

    os.makedirs(BUSINESS_IMAGES_DIR, exist_ok=True)
    filename = f"{uuid.uuid4().hex}{extension}"
    with open(os.path.join(BUSINESS_IMAGES_DIR, filename), "wb") as output:
        output.write(content)
    return {"ok": True, "url": f"/static/images/businesses/{filename}"}


@router.get("")
async def list_businesses():
    pool = await get_pool()
    rows = await pool.fetch(
        f"""SELECT {PUBLIC_COLUMNS}
              FROM businesses
             WHERE published = true
             ORDER BY created_at DESC"""
    )
    founders, media = await _related_records(pool, [row["id"] for row in rows])
    return {"ok": True, "data": [_public_business(row, founders, media) for row in rows]}


@router.get("/{slug}")
async def get_business(slug: str):
    pool = await get_pool()
    row = await pool.fetchrow(
        f"SELECT {PUBLIC_COLUMNS} FROM businesses WHERE slug = $1 AND published = true",
        slug,
    )
    if not row:
        raise HTTPException(404, "Business not found.")
    founders, media = await _related_records(pool, [row["id"]])
    return {"ok": True, "data": _public_business(row, founders, media)}


@router.post("", status_code=201)
async def submit_business(body: BusinessSubmission):
    if not body.consent_to_publish:
        raise HTTPException(422, "You must confirm that this information can be published.")

    pool = await get_pool()
    base_slug = _slugify(body.name)
    slug = base_slug
    suffix = 2
    while await pool.fetchval("SELECT 1 FROM businesses WHERE slug = $1", slug):
        slug = f"{base_slug}-{suffix}"
        suffix += 1

    try:
        async with pool.acquire() as connection:
            async with connection.transaction():
                row = await connection.fetchrow(
                    f"""INSERT INTO businesses
                           (slug, name, pitch, stage, location, category, tags, website_url,
                            logo_url, journey, challenges, challenge_solution,
                            contact_name, contact_email, published, status)
                         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, false, 'pending')
                         RETURNING {PUBLIC_COLUMNS}""",
                    slug,
                    body.name,
                    body.pitch,
                    body.stage,
                    body.location,
                    body.category,
                    body.tags,
                    str(body.website_url) if body.website_url else None,
                    body.logo_url,
                    body.journey,
                    body.challenges,
                    body.challenge_solution,
                    body.contact_name,
                    str(body.contact_email),
                )
                for index, founder in enumerate(body.founders):
                    await connection.execute(
                        """INSERT INTO business_founders
                               (business_id, name, role, linkedin_url, journey, photo_url, display_order)
                             VALUES ($1, $2, $3, $4, $5, $6, $7)""",
                        row["id"], founder.name, founder.role,
                        str(founder.linkedin_url) if founder.linkedin_url else None,
                        founder.journey, founder.photo_url, index,
                    )
                for index, media_item in enumerate(body.media):
                    await connection.execute(
                        """INSERT INTO business_media
                               (business_id, media_type, url, caption, display_order)
                             VALUES ($1, $2, $3, $4, $5)""",
                        row["id"], media_item.media_type, media_item.url, media_item.caption, index,
                    )
    except UniqueViolationError:
        raise HTTPException(409, "A business with this name is already submitted.")

    return {
        "ok": True,
        "message": "Your business was submitted for review.",
        "data": {**dict(row), "founders": [founder.model_dump(mode="json") for founder in body.founders], "media": [item.model_dump() for item in body.media]},
    }
