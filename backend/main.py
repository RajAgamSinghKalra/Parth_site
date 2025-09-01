from fastapi import FastAPI
import sqlite3
import os
from pathlib import Path

app = FastAPI()

# Resolve database path from DATABASE_URL (e.g. 'file:./prisma/dev.db')
def get_db_path() -> Path:
    database_url = os.getenv("DATABASE_URL", "file:./prisma/dev.db")
    db_relative = database_url.replace("file:", "", 1)
    return (Path(__file__).resolve().parent.parent / db_relative).resolve()

DB_PATH = get_db_path()


def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


@app.get("/")
async def read_root():
    return {"status": "ok"}


@app.get("/colleges")
async def list_colleges():
    conn = get_connection()
    rows = conn.execute("SELECT id, name, slug, location, logoUrl FROM College").fetchall()
    conn.close()
    return [dict(row) for row in rows]
