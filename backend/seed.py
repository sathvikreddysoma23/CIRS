"""
Database seeder — run once to populate initial data:
  - Default admin user
  - Sample department users
  - Sample buses, doctors, medicines
  - Sample complaints

Usage:
    cd backend
    python seed.py
"""

import asyncio
import sys
from motor.motor_asyncio import AsyncIOMotorClient
from passlib.context import CryptContext
from datetime import datetime, timedelta

# ── Load .env ───────────────────────────────────────────────────────────────
from dotenv import load_dotenv
load_dotenv()

import os

MONGO_URI     = os.getenv("MONGO_URI", "mongodb://localhost:27017")
DATABASE_NAME = os.getenv("DATABASE_NAME", "cirs_db")

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def h(p): return pwd_context.hash(p)
def now(): return datetime.utcnow()


# ─── Seed Data ────────────────────────────────────────────────────────────────

USERS = [
    {
        "name": "Super Admin",
        "email": "admin@cirs.edu",
        "role": "admin",
        "department": None,
        "phone": "9000000001",
        "hashed_password": h("Admin@1234"),
        "is_active": True,
        "created_at": now(), "updated_at": now(),
    },
    {
        "name": "Transport Dept",
        "email": "transport@cirs.edu",
        "role": "department",
        "department": "transportation",
        "phone": "9000000002",
        "hashed_password": h("Dept@1234"),
        "is_active": True,
        "created_at": now(), "updated_at": now(),
    },
    {
        "name": "Housekeeping Dept",
        "email": "housekeeping@cirs.edu",
        "role": "department",
        "department": "housekeeping",
        "phone": "9000000003",
        "hashed_password": h("Dept@1234"),
        "is_active": True,
        "created_at": now(), "updated_at": now(),
    },
    {
        "name": "Healthcare Dept",
        "email": "healthcare@cirs.edu",
        "role": "department",
        "department": "healthcare",
        "phone": "9000000004",
        "hashed_password": h("Dept@1234"),
        "is_active": True,
        "created_at": now(), "updated_at": now(),
    },
    {
        "name": "Anil Student",
        "email": "student@cirs.edu",
        "role": "student",
        "department": None,
        "phone": "9001001001",
        "hashed_password": h("Student@1234"),
        "is_active": True,
        "created_at": now(), "updated_at": now(),
    },
]

BUSES = [
    {
        "bus_number": "TN-01-BUS-101",
        "route": "Campus → City Central",
        "driver_name": "Rajan Kumar",
        "driver_contact": "9876543210",
        "capacity": 45,
        "status": "operational",
        "departure_time": "08:00 AM",
        "arrival_time": "09:00 AM",
        "current_location": "Campus Gate A",
        "notes": None,
        "created_at": now(), "updated_at": now(),
    },
    {
        "bus_number": "TN-01-BUS-102",
        "route": "Campus → Railway Station",
        "driver_name": "Suresh Babu",
        "driver_contact": "9876543211",
        "capacity": 50,
        "status": "under_maintenance",
        "departure_time": "09:30 AM",
        "arrival_time": "10:15 AM",
        "current_location": "Maintenance Yard",
        "notes": "Engine checkup scheduled",
        "created_at": now(), "updated_at": now(),
    },
    {
        "bus_number": "TN-01-BUS-103",
        "route": "Campus → North Campus",
        "driver_name": "Mohan Das",
        "driver_contact": "9876543212",
        "capacity": 40,
        "status": "operational",
        "departure_time": "07:45 AM",
        "arrival_time": "08:20 AM",
        "current_location": "North Gate",
        "notes": None,
        "created_at": now(), "updated_at": now(),
    },
]

DOCTORS = [
    {
        "name": "Dr. Priya Sharma",
        "specialization": "General Physician",
        "contact": "9800000001",
        "availability": "available",
        "consultation_hours": "9:00 AM – 1:00 PM",
        "notes": None,
        "created_at": now(), "updated_at": now(),
    },
    {
        "name": "Dr. Ramesh Iyer",
        "specialization": "Dentist",
        "contact": "9800000002",
        "availability": "on_leave",
        "consultation_hours": "2:00 PM – 5:00 PM",
        "notes": "On leave till April 10",
        "created_at": now(), "updated_at": now(),
    },
    {
        "name": "Dr. Meena Patel",
        "specialization": "Psychiatrist / Counselor",
        "contact": "9800000003",
        "availability": "available",
        "consultation_hours": "10:00 AM – 12:00 PM",
        "notes": "Walk-ins welcome",
        "created_at": now(), "updated_at": now(),
    },
]

MEDICINES = [
    {
        "name": "Paracetamol 500mg",
        "category": "Analgesic",
        "quantity": 200,
        "unit": "tablets",
        "minimum_threshold": 50,
        "expiry_date": datetime(2026, 12, 31),
        "is_low_stock": False,
        "notes": None,
        "created_at": now(), "updated_at": now(),
    },
    {
        "name": "ORS Sachets",
        "category": "Rehydration",
        "quantity": 8,
        "unit": "sachets",
        "minimum_threshold": 20,
        "expiry_date": datetime(2026, 8, 31),
        "is_low_stock": True,
        "notes": "⚠️ Low stock — reorder soon",
        "created_at": now(), "updated_at": now(),
    },
    {
        "name": "Antacid Syrup",
        "category": "Gastrointestinal",
        "quantity": 15,
        "unit": "bottles",
        "minimum_threshold": 5,
        "expiry_date": datetime(2026, 6, 30),
        "is_low_stock": False,
        "notes": None,
        "created_at": now(), "updated_at": now(),
    },
    {
        "name": "Ibuprofen 400mg",
        "category": "Anti-inflammatory",
        "quantity": 3,
        "unit": "strips",
        "minimum_threshold": 10,
        "expiry_date": datetime(2026, 5, 15),
        "is_low_stock": True,
        "notes": "⚠️ Low stock",
        "created_at": now(), "updated_at": now(),
    },
]

BUILDINGS = [
    {
        "building_name": "Block A – Engineering",
        "floor": "All Floors",
        "status": "clean",
        "last_cleaned": now() - timedelta(hours=3),
        "assigned_staff_id": None,
        "notes": None,
        "updated_at": now(),
    },
    {
        "building_name": "Block B – Sciences",
        "floor": "Ground Floor",
        "status": "needs_cleaning",
        "last_cleaned": now() - timedelta(hours=18),
        "assigned_staff_id": None,
        "notes": "Reported by warden",
        "updated_at": now(),
    },
    {
        "building_name": "Hostel C – Boys",
        "floor": "Floor 2",
        "status": "in_progress",
        "last_cleaned": now() - timedelta(hours=1),
        "assigned_staff_id": None,
        "notes": "Cleaning in progress",
        "updated_at": now(),
    },
]

HOUSEKEEPING_STAFF = [
    {
        "name": "Murugan S",
        "employee_id": "HK-001",
        "assigned_building": "Block A – Engineering",
        "shift": "Morning 6:00 AM – 2:00 PM",
        "contact": "9700000001",
        "is_available": True,
        "created_at": now(),
    },
    {
        "name": "Lakshmi R",
        "employee_id": "HK-002",
        "assigned_building": "Hostel C – Boys",
        "shift": "Evening 2:00 PM – 10:00 PM",
        "contact": "9700000002",
        "is_available": True,
        "created_at": now(),
    },
]


# ─── Seeder Logic ────────────────────────────────────────────────────────────

async def seed():
    client = AsyncIOMotorClient(MONGO_URI)
    db = client[DATABASE_NAME]

    print(f"\n🌱 Seeding database: '{DATABASE_NAME}'")
    print("=" * 50)

    # Clear existing data (fresh seed)
    for col in ["users", "buses", "doctors", "medicines", "buildings", "housekeeping_staff", "complaints"]:
        await db[col].delete_many({})
        print(f"  🗑️  Cleared: {col}")

    # Insert users
    result = await db["users"].insert_many(USERS)
    print(f"\n  👤 Users inserted: {len(result.inserted_ids)}")
    print("     admin@cirs.edu          → password: Admin@1234")
    print("     transport@cirs.edu      → password: Dept@1234")
    print("     housekeeping@cirs.edu   → password: Dept@1234")
    print("     healthcare@cirs.edu     → password: Dept@1234")
    print("     student@cirs.edu        → password: Student@1234")

    # Get student id for sample complaints
    student = await db["users"].find_one({"role": "student"})
    student_id = str(student["_id"])

    # Sample complaints
    COMPLAINTS = [
        {
            "title": "Classroom Fan Not Working",
            "description": "The ceiling fan in Room 204, Block A has not been working for 3 days. It is very hot.",
            "location": "Block A, Room 204",
            "category": "infrastructure",
            "priority": "high",
            "student_id": student_id,
            "student_name": student["name"],
            "status": "pending",
            "image_urls": [],
            "ai_category": "infrastructure",
            "ai_priority": "high",
            "ai_confidence": 0.87,
            "assigned_to": None,
            "assigned_department": None,
            "status_history": [],
            "resolution_note": None,
            "created_at": now(), "updated_at": now(),
        },
        {
            "title": "Bus TN-01-BUS-102 Always Late",
            "description": "The 9:30 AM bus to the railway station is consistently arriving 30 minutes late.",
            "location": "Campus Main Gate",
            "category": "transportation",
            "priority": "medium",
            "student_id": student_id,
            "student_name": student["name"],
            "status": "pending",
            "image_urls": [],
            "ai_category": "transportation",
            "ai_priority": "medium",
            "ai_confidence": 0.91,
            "assigned_to": None,
            "assigned_department": None,
            "status_history": [],
            "resolution_note": None,
            "created_at": now(), "updated_at": now(),
        },
        {
            "title": "Garbage Overflow Near Hostel B",
            "description": "The garbage bins near Hostel B entrance have been overflowing for 2 days. Foul smell.",
            "location": "Hostel B Entrance",
            "category": "sanitation",
            "priority": "high",
            "student_id": student_id,
            "student_name": student["name"],
            "status": "pending",
            "image_urls": [],
            "ai_category": "sanitation",
            "ai_priority": "high",
            "ai_confidence": 0.82,
            "assigned_to": None,
            "assigned_department": None,
            "status_history": [],
            "resolution_note": None,
            "created_at": now(), "updated_at": now(),
        },
    ]

    result = await db["complaints"].insert_many(COMPLAINTS)
    print(f"\n  📋 Complaints inserted: {len(result.inserted_ids)}")

    result = await db["buses"].insert_many(BUSES)
    print(f"  🚌 Buses inserted: {len(result.inserted_ids)}")

    result = await db["doctors"].insert_many(DOCTORS)
    print(f"  🩺 Doctors inserted: {len(result.inserted_ids)}")

    result = await db["medicines"].insert_many(MEDICINES)
    print(f"  💊 Medicines inserted: {len(result.inserted_ids)}")

    result = await db["buildings"].insert_many(BUILDINGS)
    print(f"  🏢 Buildings inserted: {len(result.inserted_ids)}")

    result = await db["housekeeping_staff"].insert_many(HOUSEKEEPING_STAFF)
    print(f"  🧹 Housekeeping staff inserted: {len(result.inserted_ids)}")

    print("\n✅ Seeding complete!\n")
    client.close()


if __name__ == "__main__":
    asyncio.run(seed())
