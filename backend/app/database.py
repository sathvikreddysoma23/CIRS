from motor.motor_asyncio import AsyncIOMotorClient
from app.config import settings
import logging

logger = logging.getLogger(__name__)

client: AsyncIOMotorClient = None
db = None


async def connect_db():
    """Connect to MongoDB Atlas using Motor async driver."""
    global client, db
    try:
        client = AsyncIOMotorClient(
            settings.MONGO_URI,
            minPoolSize=10,
            maxPoolSize=100,
            retryWrites=True,
            serverSelectionTimeoutMS=5000
        )
        db = client[settings.DATABASE_NAME]
        # Verify connection
        await client.admin.command("ping")
        logger.info(f"✅ Connected to MongoDB Atlas — database: '{settings.DATABASE_NAME}'")
    except Exception as e:
        logger.error(f"❌ MongoDB connection failed: {e}")
        raise e


async def close_db():
    """Close MongoDB connection."""
    global client
    if client:
        client.close()
        logger.info("MongoDB connection closed.")


def get_db():
    """Return the active database instance."""
    if db is None:
        logger.error("Database connection missing when trying to get_db()")
        from fastapi import HTTPException
        raise HTTPException(status_code=503, detail="Database connection not established")
    return db
