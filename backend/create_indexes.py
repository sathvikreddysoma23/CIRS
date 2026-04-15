"""
MongoDB index creation script.

Run once after first deployment to ensure optimal query performance.

Usage:
    cd backend
    python create_indexes.py
"""

import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from pymongo import IndexModel, ASCENDING, DESCENDING, TEXT
from dotenv import load_dotenv
import os

load_dotenv()

MONGO_URI     = os.getenv("MONGO_URI", "mongodb://localhost:27017")
DATABASE_NAME = os.getenv("DATABASE_NAME", "cirs_db")


async def create_indexes():
    client = AsyncIOMotorClient(MONGO_URI)
    db = client[DATABASE_NAME]

    print(f"\nCreating indexes on '{DATABASE_NAME}'...")

    # ── Users ──────────────────────────────────────────────────────
    await db["users"].create_indexes([
        IndexModel([("email", ASCENDING)], unique=True),
        IndexModel([("role", ASCENDING)]),
        IndexModel([("is_active", ASCENDING)]),
    ])
    print("  OK: users: email (unique), role, is_active")

    # ── Complaints ─────────────────────────────────────────────────
    await db["complaints"].create_indexes([
        IndexModel([("student_id", ASCENDING)]),
        IndexModel([("status", ASCENDING)]),
        IndexModel([("category", ASCENDING)]),
        IndexModel([("priority", ASCENDING)]),
        IndexModel([("assigned_to", ASCENDING)]),
        IndexModel([("created_at", DESCENDING)]),
        IndexModel([("title", TEXT), ("description", TEXT)]),   # full-text search
    ])
    print("  OK: complaints: student_id, status, category, priority, assigned_to, created_at, text-search")

    # ── Buses ──────────────────────────────────────────────────────
    await db["buses"].create_indexes([
        IndexModel([("bus_number", ASCENDING)], unique=True),
        IndexModel([("status", ASCENDING)]),
    ])
    print("  OK: buses: bus_number (unique), status")

    # ── Doctors ────────────────────────────────────────────────────
    await db["doctors"].create_indexes([
        IndexModel([("availability", ASCENDING)]),
    ])
    print("  OK: doctors: availability")

    # ── Medicines ──────────────────────────────────────────────────
    await db["medicines"].create_indexes([
        IndexModel([("is_low_stock", ASCENDING)]),
        IndexModel([("expiry_date", ASCENDING)]),
    ])
    print("  OK: medicines: is_low_stock, expiry_date")

    # ── Buildings ──────────────────────────────────────────────────
    await db["buildings"].create_indexes([
        IndexModel([("status", ASCENDING)]),
        IndexModel([("building_name", ASCENDING)]),
    ])
    print("  OK: buildings: status, building_name")

    # ── Housekeeping Staff ─────────────────────────────────────────
    await db["housekeeping_staff"].create_indexes([
        IndexModel([("assigned_building", ASCENDING)]),
        IndexModel([("employee_id", ASCENDING)], unique=True),
    ])
    print("  OK: housekeeping_staff: assigned_building, employee_id (unique)")

    print("\nAll indexes created successfully!\n")
    client.close()


if __name__ == "__main__":
    asyncio.run(create_indexes())
