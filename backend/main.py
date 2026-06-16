import os
from contextlib import asynccontextmanager
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
from fastapi.staticfiles import StaticFiles

from config import settings
from database import close_pool, get_pool
from routers import auth, contact, events, rsvp, stripe_router
from routers import admin


@asynccontextmanager
async def lifespan(app: FastAPI):
    await get_pool()
    yield
    await close_pool()


app = FastAPI(title="StartupA2Z API", lifespan=lifespan, redirect_slashes=False)

origins = [o.strip() for o in settings.cors_origins.split(",") if o.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
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
app.include_router(events.router, prefix="/api/events")
app.include_router(rsvp.router, prefix="/api/rsvp")
app.include_router(contact.router, prefix="/api/contact")
app.include_router(stripe_router.router, prefix="/api/stripe")
app.include_router(admin.router, prefix="/api/admin")

static_dir = os.path.join(os.path.dirname(__file__), "static")
os.makedirs(static_dir, exist_ok=True)
app.mount("/static", StaticFiles(directory=static_dir), name="static")


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=settings.port, reload=True)
