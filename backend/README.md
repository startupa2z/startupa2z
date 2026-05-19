# Startupa2z Backend API

Express server that handles auth (email OTP, LinkedIn OAuth URL), contact form, RSVPs, and public event reads via Supabase.

## Setup

1. Copy env file and fill in values from [Supabase Dashboard](https://supabase.com/dashboard) → Project Settings → API:

```bash
cp env.example .env
```

| Variable | Description |
|----------|-------------|
| `SUPABASE_URL` | Project URL |
| `SUPABASE_ANON_KEY` | anon / publishable key (OTP & OAuth) |
| `SUPABASE_SERVICE_ROLE_KEY` | Optional. Public routes work with anon key only. Add service_role for admin tooling. |
| `CORS_ORIGINS` | Frontend URL(s), e.g. `http://localhost:8080` |

2. Install and run:

```bash
cd backend
npm install
npm run dev
```

API listens on **http://localhost:3001** by default.

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Health check |
| POST | `/api/auth/otp/send` | Send email OTP (`email`, `mode`, optional `fullName`, `organization`) |
| POST | `/api/auth/otp/verify` | Verify OTP; returns session tokens |
| POST | `/api/auth/oauth/linkedin` | Get LinkedIn OAuth redirect URL |
| POST | `/api/contact` | Submit contact form |
| POST | `/api/rsvp` | Create event RSVP |
| GET | `/api/events` | List events |
| GET | `/api/events/:slug` | Get event by slug |

## Frontend

With the Vite dev server, `/api/*` is proxied to this backend. Run both:

```bash
# from repo root
npm run dev          # frontend
npm run dev:backend  # API
```

Admin panel and realtime features still use the Supabase client directly in the browser.
