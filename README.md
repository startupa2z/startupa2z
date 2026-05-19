# Startupa2z

Monorepo for the Startupa2z community site.

## Structure

```
├── frontend/   # Vite + React app (port 8080)
├── backend/    # Express API (port 3001)
└── supabase/   # Database migrations & config
```

## Setup

1. Add a repo root `.env` with Supabase keys (see `backend/env.example`):

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-or-publishable-key
```

2. Install dependencies:

```bash
cd frontend && npm install
cd ../backend && npm install
cd .. && npm install
```

## Run locally

**One command** (recommended — starts frontend **and** backend):

```bash
npm run dev
```

- Frontend: http://localhost:8080  
- API: http://localhost:3001 (proxied at `/api` from the frontend)

Or run separately:

```bash
npm run dev:frontend   # port 8080 only
npm run dev:backend    # port 3001 only — required for /api/* routes
```

If you only start the frontend, `/api/events` returns **500** because nothing is listening on port 3001.

## Build

```bash
npm run build
```

Output: `frontend/dist/`
