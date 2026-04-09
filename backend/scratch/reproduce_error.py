
import httpx
import asyncio

async def reproduce():
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
        
        # Create complaint (multipart/form-data)
        files = {
            "title": (None, "fan not working"),
            "description": (None, "from past two days throughout the day"),
            "location": (None, "cf20"),
            "category": (None, "Infrastructure"),
            "priority": (None, "Medium")
        }
        
        print("Submitting complaint...")
        res = await client.post("http://localhost:8000/api/v1/complaints/", data=files, headers=headers)
        print(f"Status: {res.status_code}")
        print(f"Response: {res.text}")

if __name__ == "__main__":
    asyncio.run(reproduce())
