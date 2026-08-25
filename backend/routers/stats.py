from uuid import UUID

from fastapi import APIRouter
from pydantic import BaseModel, Field, field_validator

from database import get_pool

router = APIRouter()


class PageViewPayload(BaseModel):
    visit_id: UUID
    visitor_id: UUID
    path: str = Field(min_length=1, max_length=500)

    @field_validator("path")
    @classmethod
    def validate_public_path(cls, value: str) -> str:
        path = value.strip()
        if not path.startswith("/") or path.startswith("/admin"):
            raise ValueError("Only public site paths can be recorded.")
        return path


@router.get("/home")
async def home_stats():
    pool = await get_pool()
    row = await pool.fetchrow(
        """SELECT
               (SELECT COUNT(*) FROM all_users) AS active_members,
               (SELECT COUNT(*) FROM events) AS events_hosted,
               (SELECT s.page_visit_baseline + COUNT(v.id)
                  FROM home_stats_settings s
                  LEFT JOIN page_views v
                    ON v.visited_at > s.page_visit_tracking_started_at
                 WHERE s.singleton = true
                 GROUP BY s.page_visit_baseline) AS page_visits,
               (SELECT COUNT(DISTINCT lower(trim(category)))
                  FROM businesses
                 WHERE published = true AND status = 'published') AS industries"""
    )
    return {"ok": True, "data": dict(row)}


@router.post("/page-view", status_code=202)
async def record_page_view(body: PageViewPayload):
    pool = await get_pool()
    await pool.execute(
        """INSERT INTO page_views (id, visitor_id, path)
           VALUES ($1, $2, $3)
           ON CONFLICT (id) DO NOTHING""",
        body.visit_id,
        body.visitor_id,
        body.path,
    )
    return {"ok": True}
