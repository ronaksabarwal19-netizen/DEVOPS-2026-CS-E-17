# Docker deployment

This setup runs the production-built Vite frontend behind Nginx and the Express API in a separate container. The frontend proxies `/api` requests to the backend, and the backend SQLite database is stored in the `backend-data` Docker volume.

## Start the application

1. Copy `.env.example` to `.env`.
2. Set `JWT_SECRET` to a private random value at least 24 characters long. Do not commit `.env`.
3. From the project root, build and start both services:

   ```bash
   docker compose up --build -d
   ```

4. Open `http://localhost:8080`. Check the API at `http://localhost:8080/api/health`.
5. To add the sample API users and records, run:

   ```bash
   docker compose exec backend npm run seed
   ```

   The seed script creates demo accounts with `user1`, `user2`, or `user3` and password `password123`. This is sample data for coursework only.

## Operations

```bash
docker compose logs -f
docker compose down
```

The named database volume is retained by `docker compose down`. To intentionally remove the persisted database too, use `docker compose down --volumes`.

The frontend currently uses its mock/localStorage data paths; running this API alongside it does not by itself migrate the UI to API-backed authentication or data. The API is available at the same origin under `/api` for frontend integration. This project is a coursework demo, not a production banking system.
