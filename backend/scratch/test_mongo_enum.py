
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from enum import Enum
import os
from dotenv import load_dotenv

load_dotenv()

class MyStatus(str, Enum):
    pending = "pending"

async def test():
    client = AsyncIOMotorClient(os.getenv("MONGO_URI"))
    db = client[os.getenv("DATABASE_NAME", "cirs_db")]
    
    doc = {
        "title": "Test",
        "status": MyStatus.pending
    }
    
    try:
        result = await db["test_col"].insert_one(doc)
        print(f"Success! Inserted ID: {result.inserted_id}")
    except Exception as e:
        print(f"Failed! Error: {e}")
    finally:
        await db["test_col"].delete_many({"title": "Test"})
        client.close()

if __name__ == "__main__":
    asyncio.run(test())
