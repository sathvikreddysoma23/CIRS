
import httpx
import asyncio
import io

async def reproduce_with_image():
    async with httpx.AsyncClient() as client:
        # Login
        login_res = await client.post("http://localhost:8000/api/v1/auth/login", json={
            "email": "student@cirs.edu",
            "password": "Student@1234"
        })
        if login_res.status_code != 200:
            print(f"Login failed: {login_res.text}")
            return
        
        token = login_res.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        
        # Create a tiny valid GIF image
        img_content = b'GIF89a\x01\x00\x01\x00\x00\x00\x00\x21\xf9\x04\x01\x00\x00\x00\x00\x2c\x00\x00\x00\x00\x01\x00\x01\x00\x00\x02\x02\x44\x01\x00\x3b'
        img_file = io.BytesIO(img_content)
        
        # Create complaint (multipart/form-data)
        data = {
            "title": "fan not working",
            "description": "from past two days throughout the day",
            "location": "cf20",
            "category": "infrastructure",
            "priority": "medium"
        }
        
        files = [
            ("images", ("test.jpg", img_file, "image/jpeg"))
        ]
        
        print("Submitting complaint with image...")
        res = await client.post("http://localhost:8000/api/v1/complaints/", data=data, files=files, headers=headers)
        print(f"Status: {res.status_code}")
        print(f"Response: {res.text}")

if __name__ == "__main__":
    asyncio.run(reproduce_with_image())
