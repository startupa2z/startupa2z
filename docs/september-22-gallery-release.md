# September 22 gallery

Status: local draft prepared September 23, 2026. Production deployment requires Satz's approval.

- Gallery route: `/gallery/founders-pitch-mix-2026-09-22`
- Recap route: `/events/founders-pitch-mix-2026-09-22`
- Twelve source photos and three source videos: `/Users/satz/myfiles/startupa2z-event-gallery/e5-sept22`
- Reproduce optimized photos: `python3 scripts/prepare-september-22-gallery.py` (requires Pillow).
- The closing group photo is first. Source photographs are untouched; published copies are resized and re-encoded without source metadata.
- Backend release assets: `backend/gallery_assets/2026-09-22/`.
- Frontend copies: `frontend/public/static/images/events/2026-09-22/` for local preview and prerendering.
- Production nginx routes `/static/` to the backend. Backend startup installs missing gallery assets into `/app/static/images/events/2026-09-22/` without overwriting existing files. Any replacement must use a new versioned filename.
- The recap uses the live production event record plus visible evidence in the photographs. It includes no invented quotations or attendance count.
- The three videos remain in the local source archive and are not included in this release or hosted on the VPS.
- Before production: deploy backend before or with frontend, confirm all 24 JPEG URLs, then verify homepage, gallery index, event recap, gallery detail, and mobile viewer.
