from fastapi import APIRouter
from pydantic import BaseModel, EmailStr, field_validator
from database import get_pool

router = APIRouter()


class ContactRequest(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    linkedin_url: str | None = None
    role: str | None = None
    inquiry_type: str
    message: str | None = None

    @field_validator("linkedin_url", mode="before")
    @classmethod
    def empty_str_to_none(cls, v):
        return v if v else None


@router.post("", status_code=201)
async def submit_contact(body: ContactRequest):
    pool = await get_pool()
    await pool.execute(
        """INSERT INTO contact_submissions
             (first_name, last_name, email, linkedin_url, role, inquiry_type, message)
           VALUES ($1, $2, $3, $4, $5, $6, $7)""",
        body.first_name, body.last_name, str(body.email),
        body.linkedin_url, body.role, body.inquiry_type, body.message,
    )
    return {"ok": True, "message": "Message sent successfully."}
