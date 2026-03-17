# TaskBoard — React + NestJS

A full-stack task manager demonstrating React (Vite + TypeScript + React Query) on the frontend and NestJS (TypeORM) on the backend.

---

## Prerequisites

- Node.js 18+

---

## Quick Start

### 1. Backend (NestJS)

```bash
cd backend
npm install
cp .env.example .env
npm run start:dev
```

API runs at **http://localhost:3000**

By default, the backend uses a local persisted SQL.js database file at `backend/taskboard.sqlite`, so it starts without any external database setup.

#### Environment variables (optional)
| Variable   | Default           |
|------------|-------------------|
| DB_TYPE    | sqljs             |
| DB_FILE    | taskboard.sqlite  |

#### Optional: use PostgreSQL instead

Set `DB_TYPE=postgres` in `backend/.env`, then configure either the `DB_*` variables or `DATABASE_URL`.

Using Docker:
```bash
docker run --name taskboard-pg \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=taskboard \
  -p 5432:5432 -d postgres:15
```

If you see `password authentication failed for user "postgres"`, open `backend/.env` and set `DB_PASS` to your actual local PostgreSQL password.

TypeORM `synchronize: true` will auto-create the `tasks` table on first run.

---

### 2. Frontend (React + Vite)

```bash
cd frontend
npm install
npm run dev
```

App runs at **http://localhost:5173**

Vite proxies `/tasks` → `http://localhost:3000` so no CORS issues during development.

---

## API Endpoints

| Method | Path               | Description          |
|--------|--------------------|----------------------|
| GET    | /tasks             | List all tasks       |
| GET    | /tasks/:id         | Get one task         |
| POST   | /tasks             | Create a task        |
| PATCH  | /tasks/:id/status  | Update task status   |
| DELETE | /tasks/:id         | Delete a task        |

### Task statuses
`OPEN` → `IN_PROGRESS` → `DONE`

### Create task payload
```json
{ "title": "My task", "description": "Optional details" }
```

### Update status payload
```json
{ "status": "IN_PROGRESS" }
```

---

## Project Structure

```
taskboard/
├── backend/
│   └── src/
│       ├── main.ts
│       ├── app.module.ts
│       └── tasks/
│           ├── task.entity.ts
│           ├── tasks.service.ts
│           ├── tasks.controller.ts
│           ├── tasks.module.ts
│           └── dto/
│               ├── create-task.dto.ts
│               └── update-status.dto.ts
└── frontend/
    └── src/
        ├── main.tsx
        ├── App.tsx
        ├── api/tasks.ts          ← typed Axios client
        ├── hooks/useTasks.ts     ← React Query hooks
        ├── styles/global.css
        └── components/
            ├── TaskBoard.tsx
            ├── TaskBoard.module.css
            ├── TaskCard.tsx
            └── TaskCard.module.css
```
