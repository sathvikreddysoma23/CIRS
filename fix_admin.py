import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv

async def fix_admin():
    load_dotenv()
    mongo_uri = os.getenv("MONGO_URI", "mongodb://localhost:27017")
    db_name = os.getenv("DATABASE_NAME", "cirs_db")
    
    client = AsyncIOMotorClient(mongo_uri)
    db = client[db_name]
    
    print(f"Fixing admin for database: {db_name}")
    
    # 1. Check admin account if it exists
    admin = await db["users"].find_one({"email": "admin@cirs.edu"})
    
    if admin:
        print(f"User Found: {admin['name']} | Role: {admin['role']} | Active: {admin.get('is_active')}")
        
        # Fixing it to be active and have correct role name
        result = await db["users"].update_one(
            {"email": "admin@cirs.edu"},
            {"$set": {"is_active": True, "role": "admin"}}
        )
        print(f"Update results: {result.modified_count} admin document updated.")
    else:
        print("Admin user not found. Did you run seed.py?")

    # 2. Check other key accounts just in case
    for email in ["student@cirs.edu", "transport@cirs.edu"]:
        user = await db["users"].find_one({"email": email})
        if user:
            print(f"User check: {email} | Role: {user['role']} | Active: {user.get('is_active')}")
            await db["users"].update_one({"email": email}, {"$set": {"is_active": True}})

    client.close()

if __name__ == "__main__":
    asyncio.run(fix_admin())
