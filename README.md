# Aurevia Bank — Full-Stack Coursework Project

A React/Vite banking dashboard with a Node.js/Express API. This is a coursework demo only; it does not connect to a real bank, handle real money, or provide production-grade financial services.

## Structure

- `front-end/` — React/Vite application and UI.
- `back-end/` — Express API, JWT authentication, bcrypt password hashing, and sql.js persistence.
- `.github/workflows/` and `Jenkinsfile` — existing weekly-report automation and CI infrastructure, retained with Jenkins frontend build paths updated.
- `weekly_reports/` — coursework progress report archives, preserved.

## Run locally

Use separate terminals.

### Backend

```powershell
cd back-end
npm ci
Copy-Item .env.example .env
```

Set a private `JWT_SECRET` of at least 24 characters in `back-end/.env`. Do not commit `.env`.

```powershell
npm run seed
npm run dev
```

API health check: `http://localhost:4000/api/health`.

### Frontend

```powershell
cd front-end
npm ci
npm run dev
```

Open `http://localhost:5173`. The default API URL is `http://localhost:4000/api`; set `VITE_API_URL` in a local frontend `.env` if needed.

Demo login after seeding: `user1` / `password123`.

The frontend registration/login use the API. Other banking data and actions are simulated coursework features. See `back-end/README.md` for API details.
