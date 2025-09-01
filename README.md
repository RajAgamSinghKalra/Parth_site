# Parth Site

This repository contains a Next.js front‑end and a small FastAPI back‑end that share a local SQLite database.

## Prerequisites

- Node.js 18+ and [pnpm](https://pnpm.io)
- Python 3.10+
- SQLite (bundled with Node.js/Python)

## Initial setup

1. Install Node dependencies:

   ```bash
   pnpm install
   ```

2. Create an `.env` file in the project root with the database location:

   ```dotenv
   DATABASE_URL="file:./prisma/dev.db"
   ```

3. Create the SQLite database using Prisma:

   ```bash
   pnpx prisma migrate dev --name init
   ```

   The database file will be created at `prisma/dev.db`.

## Running the Next.js website

```bash
pnpm dev
```

The site will be available at <http://localhost:3000>.

## Running the FastAPI back‑end

1. (Optional) create and activate a virtual environment:

   ```bash
   python -m venv .venv
   source .venv/bin/activate
   ```

2. Install Python dependencies:

   ```bash
   pip install -r backend/requirements.txt
   ```

3. Start the API server:

   ```bash
   uvicorn backend.main:app --reload
   ```

   The API will be available at <http://localhost:8000>. Useful endpoints:

   - `GET /` – health check
   - `GET /colleges` – list colleges stored in the database

Both services read and write to the same local SQLite database (`prisma/dev.db`), so all code and data remain on your laptop.
