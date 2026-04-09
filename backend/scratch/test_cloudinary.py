import cloudinary
import cloudinary.uploader
import os
from dotenv import load_dotenv

load_dotenv()

cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET"),
    secure=True
)

def test_upload():
    print("Testing Cloudinary upload...")
    try:
        # Upload a tiny dummy image (base64 or just small bytes)
        # Using a public image URL as a source to avoid needing a local file
        result = cloudinary.uploader.upload("https://res.cloudinary.com/demo/image/upload/sample.jpg", folder="test")
        print(f"Success! URL: {result['secure_url']}")
    except Exception as e:
        print(f"Failed: {e}")

if __name__ == "__main__":
    test_upload()
