import cloudinary
import cloudinary.uploader
from fastapi import UploadFile, HTTPException
from app.config import settings
import logging
import asyncio

logger = logging.getLogger(__name__)

_cloudinary_enabled = bool(
    settings.CLOUDINARY_CLOUD_NAME
    and settings.CLOUDINARY_API_KEY
    and settings.CLOUDINARY_API_SECRET
)

if _cloudinary_enabled:
    cloudinary.config(
        cloud_name=settings.CLOUDINARY_CLOUD_NAME,
        api_key=settings.CLOUDINARY_API_KEY,
        api_secret=settings.CLOUDINARY_API_SECRET,
        secure=True,
    )

ALLOWED_TYPES = {"image/jpeg", "image/png", "image/webp"}
MAX_SIZE_MB = 10


async def upload_image(file: UploadFile, folder: str = "cirs_complaints") -> str:
    """Upload an image to Cloudinary and return the secure URL."""
    if not _cloudinary_enabled:
        raise HTTPException(
            status_code=503,
            detail="Image upload service not configured. Please set Cloudinary credentials.",
        )
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(status_code=400, detail="Only JPEG, PNG, and WebP images are allowed.")

    contents = await file.read()
    if len(contents) > MAX_SIZE_MB * 1024 * 1024:
        raise HTTPException(status_code=400, detail=f"File size must be under {MAX_SIZE_MB}MB.")

    try:
        loop = asyncio.get_event_loop()
        result = await loop.run_in_executor(
            None,
            lambda: cloudinary.uploader.upload(
                contents,
                folder=folder,
                resource_type="image",
            )
        )
        return result["secure_url"]
    except Exception as e:
        logger.error(f"Cloudinary upload failed: {e}")
        raise HTTPException(status_code=500, detail="Image upload failed.")


async def delete_image(public_id: str) -> bool:
    """Delete an image from Cloudinary by public_id."""
    if not _cloudinary_enabled:
        return False
    try:
        loop = asyncio.get_event_loop()
        await loop.run_in_executor(
            None,
            lambda: cloudinary.uploader.destroy(public_id)
        )
        return True
    except Exception as e:
        logger.error(f"Cloudinary delete failed: {e}")
        return False
