# StartupA2Z.org

Monorepo for the StartupA2Z.org community website.

## Architecture

- `frontend/` — React, Vite, TypeScript, and TailwindCSS
- `backend/` — FastAPI and asyncpg
- `docker/` — PostgreSQL schema and production migrations
- `docker-compose.yml` — PostgreSQL, backend, and frontend services

## Local Docker setup

```bash
cp .env.example .env
docker compose up -d --build
```

Open `http://localhost:8081`.

## Frontend checks

```bash
npm ci --prefix frontend
npm run lint
npm run build
```

## Deployment

Coolify builds the Docker Compose application from GitHub. Updating `main`
can trigger production deployment, so merge only after review and approval.
