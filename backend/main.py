import os
from contextlib import asynccontextmanager
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
from fastapi.staticfiles import StaticFiles

from config import settings
from database import close_pool, get_pool
from all_users import ensure_all_users_schema
from member_profile import ensure_member_profile_schema
from home_stats import ensure_home_stats_schema
from pitch_applications import ensure_pitch_application_schema
from routers import all_users, audience, auth, businesses, contact, events, pitch_applications, rsvp, stats, stripe_router
from routers import admin


@asynccontextmanager
async def lifespan(app: FastAPI):
    pool = await get_pool()
    await ensure_member_profile_schema(pool)
    await ensure_all_users_schema(pool)
    await ensure_home_stats_schema(pool)
    await ensure_pitch_application_schema(pool)
    yield
    await close_pool()


app = FastAPI(title="StartupA2Z.org API", lifespan=lifespan, redirect_slashes=False)

origins = [o.strip() for o in settings.cors_origins.split(",") if o.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization", "stripe-signature"],
    allow_credentials=True,
)


@app.get("/")
async def root():
    return RedirectResponse(url="/docs")


@app.get("/health")
async def health():
    return {"ok": True, "service": "startupa2z-backend"}


app.include_router(auth.router, prefix="/api/auth")
app.include_router(businesses.router, prefix="/api/businesses")
app.include_router(events.router, prefix="/api/events")
app.include_router(rsvp.router, prefix="/api/rsvp")
app.include_router(pitch_applications.router, prefix="/api/pitch-applications")
app.include_router(contact.router, prefix="/api/contact")
app.include_router(stripe_router.router, prefix="/api/stripe")
app.include_router(stats.router, prefix="/api/stats")
app.include_router(admin.router, prefix="/api/admin")
app.include_router(audience.router, prefix="/api/admin")
app.include_router(all_users.router, prefix="/api/admin")

static_dir = os.path.join(os.path.dirname(__file__), "static")
os.makedirs(static_dir, exist_ok=True)
app.mount("/static", StaticFiles(directory=static_dir), name="static")


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=settings.port, reload=True)
