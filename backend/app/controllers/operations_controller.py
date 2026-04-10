from fastapi import HTTPException
from app.database import get_db
from bson import ObjectId
from datetime import datetime
from typing import Optional


def _s(doc):
    if doc and "_id" in doc:
        doc["_id"] = str(doc["_id"])
    return doc


# ─── BUS MANAGEMENT ────────────────────────────────────────────────

async def add_bus(data: dict) -> dict:
    db = get_db()
    data["created_at"] = datetime.utcnow()
    data["updated_at"] = datetime.utcnow()
    result = await db["buses"].insert_one(data)
    data["_id"] = str(result.inserted_id)
    return data


async def get_all_buses(status: Optional[str] = None) -> list:
    db = get_db()
    query = {}
    if status:
        query["status"] = status
    cursor = db["buses"].find(query).sort("bus_number", 1)
    return [_s(doc) async for doc in cursor]


async def get_bus(bus_id: str) -> dict:
    db = get_db()
    doc = await db["buses"].find_one({"_id": ObjectId(bus_id)})
    if not doc:
        raise HTTPException(status_code=404, detail="Bus not found.")
    return _s(doc)


async def update_bus(bus_id: str, data: dict) -> dict:
    db = get_db()
    data = {k: v for k, v in data.items() if v is not None}
    data["updated_at"] = datetime.utcnow()
    result = await db["buses"].update_one({"_id": ObjectId(bus_id)}, {"$set": data})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Bus not found.")
    return await get_bus(bus_id)


async def delete_bus(bus_id: str) -> dict:
    db = get_db()
    result = await db["buses"].delete_one({"_id": ObjectId(bus_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Bus not found.")
    return {"message": "Bus removed successfully."}


# ─── HOUSEKEEPING – STAFF ──────────────────────────────────────────

async def add_staff(data: dict) -> dict:
    db = get_db()
    data["created_at"] = datetime.utcnow()
    result = await db["housekeeping_staff"].insert_one(data)
    data["_id"] = str(result.inserted_id)
    return data


async def get_all_staff(building: Optional[str] = None) -> list:
    db = get_db()
    query = {}
    if building:
        query["assigned_building"] = {"$regex": building, "$options": "i"}
    cursor = db["housekeeping_staff"].find(query).sort("name", 1)
    return [_s(doc) async for doc in cursor]


async def update_staff(staff_id: str, data: dict) -> dict:
    db = get_db()
    data = {k: v for k, v in data.items() if v is not None}
    result = await db["housekeeping_staff"].update_one({"_id": ObjectId(staff_id)}, {"$set": data})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Staff member not found.")
    doc = await db["housekeeping_staff"].find_one({"_id": ObjectId(staff_id)})
    return _s(doc)


async def delete_staff(staff_id: str) -> dict:
    db = get_db()
    result = await db["housekeeping_staff"].delete_one({"_id": ObjectId(staff_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Staff member not found.")
    return {"message": "Staff member removed successfully."}


# ─── HOUSEKEEPING – BUILDING CLEANLINESS ──────────────────────────

async def add_building(data: dict) -> dict:
    db = get_db()
    data["updated_at"] = datetime.utcnow()
    result = await db["buildings"].insert_one(data)
    data["_id"] = str(result.inserted_id)
    return data


async def get_all_buildings(status: Optional[str] = None) -> list:
    db = get_db()
    query = {}
    if status:
        query["status"] = status
    cursor = db["buildings"].find(query).sort("building_name", 1)
    return [_s(doc) async for doc in cursor]


async def update_building(building_id: str, data: dict) -> dict:
    db = get_db()
    data = {k: v for k, v in data.items() if v is not None}
    data["updated_at"] = datetime.utcnow()
    result = await db["buildings"].update_one({"_id": ObjectId(building_id)}, {"$set": data})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Building record not found.")
    doc = await db["buildings"].find_one({"_id": ObjectId(building_id)})
    return _s(doc)


# ─── HEALTHCARE – DOCTOR ─────────────────────────────────────────

async def add_doctor(data: dict) -> dict:
    db = get_db()
    data["created_at"] = datetime.utcnow()
    data["updated_at"] = datetime.utcnow()
    result = await db["doctors"].insert_one(data)
    data["_id"] = str(result.inserted_id)
    return data


async def get_all_doctors(availability: Optional[str] = None) -> list:
    db = get_db()
    query = {}
    if availability:
        query["availability"] = availability
    cursor = db["doctors"].find(query).sort("name", 1)
    return [_s(doc) async for doc in cursor]


async def update_doctor(doctor_id: str, data: dict) -> dict:
    db = get_db()
    data = {k: v for k, v in data.items() if v is not None}
    data["updated_at"] = datetime.utcnow()
    result = await db["doctors"].update_one({"_id": ObjectId(doctor_id)}, {"$set": data})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Doctor not found.")
    doc = await db["doctors"].find_one({"_id": ObjectId(doctor_id)})
    return _s(doc)


async def delete_doctor(doctor_id: str) -> dict:
    db = get_db()
    result = await db["doctors"].delete_one({"_id": ObjectId(doctor_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Doctor not found.")
    return {"message": "Doctor record removed."}


# ─── HEALTHCARE – MEDICINE ───────────────────────────────────────

async def add_medicine(data: dict) -> dict:
    db = get_db()
    data["is_low_stock"] = data.get("quantity", 0) < data.get("minimum_threshold", 10)
    data["created_at"] = datetime.utcnow()
    data["updated_at"] = datetime.utcnow()
    result = await db["medicines"].insert_one(data)
    data["_id"] = str(result.inserted_id)
    return data


async def get_all_medicines(low_stock_only: bool = False) -> list:
    db = get_db()
    query = {"is_low_stock": True} if low_stock_only else {}
    cursor = db["medicines"].find(query).sort("name", 1)
    return [_s(doc) async for doc in cursor]


async def update_medicine(medicine_id: str, data: dict) -> dict:
    db = get_db()
    doc = await db["medicines"].find_one({"_id": ObjectId(medicine_id)})
    if not doc:
        raise HTTPException(status_code=404, detail="Medicine not found.")

    data = {k: v for k, v in data.items() if v is not None}
    new_qty = data.get("quantity", doc.get("quantity", 0))
    threshold = doc.get("minimum_threshold", 10)
    data["is_low_stock"] = new_qty < threshold
    data["updated_at"] = datetime.utcnow()

    await db["medicines"].update_one({"_id": ObjectId(medicine_id)}, {"$set": data})
    updated = await db["medicines"].find_one({"_id": ObjectId(medicine_id)})
    return _s(updated)


async def delete_medicine(medicine_id: str) -> dict:
    db = get_db()
    result = await db["medicines"].delete_one({"_id": ObjectId(medicine_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Medicine not found.")
    return {"message": "Medicine record removed."}


# ─── BUS REPORTS ───────────────────────────────────────────────────

async def submit_bus_report(data: dict) -> dict:
    db = get_db()
    data["created_at"] = datetime.utcnow()
    
    # 1. Insert report into history
    result = await db["bus_reports"].insert_one(data)
    data["_id"] = str(result.inserted_id)
    
    # 2. Update the bus status in the 'buses' collection
    status = "active" if data.get("condition") == "good" else "maintenance"
    await db["buses"].update_one(
        {"bus_number": data.get("bus_number")},
        {"$set": {"status": status, "updated_at": datetime.utcnow()}}
    )

    # 3. If condition is 'bad', auto-create a system complaint for the admin
    if data.get("condition") == "bad":
        # Fetch driver details for the complaint
        driver_id = data.get("driver_id")
        driver = await db["users"].find_one({"_id": ObjectId(driver_id)})
        
        new_complaint = {
            "title": f"BUS MAINTENANCE: {data.get('bus_number')}",
            "description": f"DRIVER REPORT: {data.get('issue_description')}\nReport ID: {data['_id']}",
            "location": f"Bus {data.get('bus_number')}",
            "category": "transportation",
            "priority": "high",
            "student_id": driver_id,
            "student_name": driver.get("name") if driver else "Driver",
            "status": "pending",
            "image_urls": [],
            "status_history": [],
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
            "is_auto_generated": True
        }
        await db["complaints"].insert_one(new_complaint)
    
    return data


async def get_bus_reports(bus_number: Optional[str] = None) -> list:
    db = get_db()
    query = {}
    if bus_number:
        query["bus_number"] = bus_number
    
    # We want to join with users to get the driver names
    pipeline = [
        {"$match": query},
        {"$sort": {"created_at": -1}},
        {
            "$addFields": {
                "driver_object_id": {"$toObjectId": "$driver_id"}
            }
        },
        {
            "$lookup": {
                "from": "users",
                "localField": "driver_object_id",
                "foreignField": "_id",
                "as": "driver_info"
            }
        },
        {
            "$unwind": {
                "path": "$driver_info",
                "preserveNullAndEmptyArrays": True
            }
        },
        {
            "$addFields": {
                "driver_name": "$driver_info.name"
            }
        },
        {"$project": {"driver_info": 0, "driver_object_id": 0}}
    ]
    
    cursor = db["bus_reports"].aggregate(pipeline)
    return [_s(doc) async for doc in cursor]
