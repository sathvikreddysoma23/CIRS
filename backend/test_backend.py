import httpx
import json
import asyncio

BASE_URL = "http://localhost:8000/api/v1"

async def test_backend():
    print("\n🔍 --- Starting Comprehensive CIRS Backend Test --- 🔍\n")
    
    async with httpx.AsyncClient(timeout=10.0) as client:
        # 1. Health check
        try:
            health = await client.get("http://localhost:8000/health")
            print(f"✅ [Test 1] Health Endpoint: {health.status_code} {health.json()}")
        except Exception as e:
            print("❌ [Test 1] Health Endpoint failed. Is the server running? ")
            return

        # 2. Student Login (Auth & JWT)
        login_data = {"email": "student@cirs.edu", "password": "Student@1234"}
        login_res = await client.post(f"{BASE_URL}/auth/login", json=login_data)
        if login_res.status_code == 200:
            print(f"✅ [Test 2] Student Login: Success (Status 200)")
            token = login_res.json()["access_token"]
            headers = {"Authorization": f"Bearer {token}"}
        else:
            print(f"❌ [Test 2] Student Login: Failed (Status {login_res.status_code}) {login_res.text}")
            return

        # 3. Create Complaint (MongoDB & AI classification)
        complaint_form = {
            "title": "Water leak in Hostel B",
            "description": "Room 304 has a serious ceiling leak. Need urgent plumbing repair.",
            "location": "Hostel B, Room 304",
            "category": "infrastructure",
            "priority": "high"
        }
        # Note: endpoint expects Form data (multipart/form-data) because of image upload support
        create_res = await client.post(f"{BASE_URL}/complaints/", data=complaint_form, headers=headers)
        if create_res.status_code == 200:
            print(f"✅ [Test 3] Create Complaint: Success (Status 200)")
            c_data = create_res.json()
            print(f"      - AI Categorized: {c_data.get('ai_category')} (Confidence: {c_data.get('ai_confidence')})")
        else:
            print(f"❌ [Test 3] Create Complaint: Failed (Status {create_res.status_code}) {create_res.text}")

        # 4. View Own Complaints
        list_res = await client.get(f"{BASE_URL}/complaints/", headers=headers)
        if list_res.status_code == 200:
            print(f"✅ [Test 4] List Complaints (Student View): Success ({len(list_res.json()['complaints'])} items)")
        else:
            print(f"❌ [Test 4] List Complaints: Failed (Status {list_res.status_code})")

        # 5. Admin Dashboard (Admin role check)
        admin_login = {"email": "admin@cirs.edu", "password": "Admin@1234"}
        admin_res = await client.post(f"{BASE_URL}/auth/login", json=admin_login)
        if admin_res.status_code == 200:
            print(f"✅ [Test 5] Admin Login: Success")
            admin_token = admin_res.json()["access_token"]
            admin_headers = {"Authorization": f"Bearer {admin_token}"}
            dash_res = await client.get(f"{BASE_URL}/admin/dashboard", headers=admin_headers)
            if dash_res.status_code == 200:
                print(f"✅ [Test 6] Admin Dashboard Access: Success")
                print(f"      - System Statistics: {json.dumps(dash_res.json()['complaints'], indent=12)}")
            else:
                 print(f"❌ [Test 6] Admin Dashboard: Failed (Status {dash_res.status_code})")
        else:
            print(f"❌ [Test 5] Admin Login: Failed (Status {admin_res.status_code})")

        # 6. Operations (Buses & Medicines)
        bus_res = await client.get(f"{BASE_URL}/operations/buses", headers=headers)
        med_res = await client.get(f"{BASE_URL}/operations/healthcare/medicines", headers=headers)
        if bus_res.status_code == 200 and med_res.status_code == 200:
            print(f"✅ [Test 7] Operations/Buses API: Success")
            print(f"✅ [Test 8] Operations/Healthcare API: Success")
            low_stock = [m['name'] for m in med_res.json() if m.get('is_low_stock')]
            print(f"      - Low stock alert found for: {', '.join(low_stock) if low_stock else 'None'}")
        else:
            print(f"❌ [Test 7/8] Operations API check: Failed")

    print("\n🚀 --- Backend Verification Complete! --- 🚀\n")

if __name__ == "__main__":
    asyncio.run(test_backend())
