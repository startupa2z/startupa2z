# September 15 gallery

Status: production deployment approved by Satz on September 16, 2026; verify the deployed revision and live pages after release.

- Route: `/gallery/founders-pitch-mix-2026-09-15`
- Four source photos: `/Users/satz/myfiles/startupa2z-event-gallery/e4-sept15`
- Reproduce optimized files: `python3 scripts/prepare-september-15-gallery.py` (requires Pillow).
- The speaker photo is first. No faces, colors, or scene content were altered; files are resized and re-encoded without source metadata.
- Backend release assets: `backend/gallery_assets/2026-09-15/`.
- Frontend copies under `frontend/public/static/images/events/2026-09-15/` support local preview and standalone prerendering.
- Production nginx routes `/static/` to the backend. Backend startup installs missing gallery assets into `/app/static/images/events/2026-09-15/` on the existing persistent image volume, without overwriting existing files. Changes to a published photo must use a new versioned filename.
- Approve deployment before publishing. Deploy the backend before or together with the frontend; confirm all eight image URLs return JPEGs and render correctly, then verify homepage, gallery index, event page, gallery detail, and mobile viewer.
- A transcript-based recap now replaces the September 15 event detail at its existing URL. The gallery links to the recap. Recording is linked externally through VideoToBe; the downloaded original stays in the local event archive and is not included in this release or hosted on the VPS.
- Existing galleries retain their current storage and URLs.
