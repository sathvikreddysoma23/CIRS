# CIRS Backend — FastAPI + MongoDB

**Campus Issue Resolution System** — Python backend powering the CIRS platform.

---

## 🗂️ Project Structure

```
backend/
├── app/
│   ├── main.py               # FastAPI app entry point
│   ├── config.py             # Settings from .env
│   ├── database.py           # MongoDB (Motor async) connection
│   ├── models/               # Pydantic schemas
│   │   ├── user.py
│   │   ├── complaint.py
│   │   └── operations.py     # Bus, Housekeeping, Healthcare
│   ├── routes/               # API endpoint definitions
│   │   ├── auth_routes.py
│   │   ├── complaint_routes.py
│   │   ├── admin_routes.py
│   │   ├── operations_routes.py
│   │   └── ai_routes.py
│   ├── controllers/          # Business logic
│   │   ├── auth_controller.py
│   │   ├── complaint_controller.py
│   │   ├── operations_controller.py
│   │   └── admin_controller.py
│   ├── middleware/
│   │   └── auth.py           # JWT Bearer + Role guards
│   ├── utils/
│   │   ├── jwt_handler.py    # Token creation/verification
│   │   ├── password.py       # Bcrypt hashing
│   │   ├── email_sender.py   # Notification emails
│   │   └── file_upload.py    # Cloudinary image upload
│   └── ai/
│       ├── classifier.py     # NLP classify entry point (ML + fallback)
│       └── train_model.py    # Training script (scikit-learn)
├── seed.py                   # One-time DB seeder
├── create_indexes.py         # DB index setup
├── run.py                    # Dev server launcher
├── requirements.txt
├── .env                      # ← fill in your credentials
└── .env.example
```

---

## ⚡ Quick Start

### 1. Create & activate virtual environment
```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# Mac/Linux
source venv/bin/activate
```

### 2. Install dependencies
```bash
pip install -r requirements.txt
```

### 3. Configure environment
Edit `.env` with your real credentials (MongoDB URI, JWT secret, email, Cloudinary).

### 4. Seed the database
```bash
python seed.py
```
This creates default users, sample complaints, buses, doctors, and medicines.

### 5. Create MongoDB indexes
```bash
python create_indexes.py
```

### 6. (Optional) Train the NLP model
```bash
python -m app.ai.train_model
```
Without this, the system uses the built-in keyword-based classifier.

### 7. Start the server
```bash
python run.py
```
Server runs at: **http://localhost:8000**
Interactive docs: **http://localhost:8000/docs**

---

## 🔐 Default Credentials (after seed)

| Role        | Email                    | Password      |
|-------------|--------------------------|---------------|
| Admin       | admin@cirs.edu           | Admin@1234    |
| Transport   | transport@cirs.edu       | Dept@1234     |
| Housekeeping| housekeeping@cirs.edu    | Dept@1234     |
| Healthcare  | healthcare@cirs.edu      | Dept@1234     |
| Student     | student@cirs.edu         | Student@1234  |

---

## 📡 API Endpoints Summary

All routes are prefixed with `/api/v1`

### Authentication
| Method | Route            | Access  | Description               |
|--------|------------------|---------|---------------------------|
| POST   | /auth/register   | Public  | Register new user         |
| POST   | /auth/login      | Public  | Login → JWT tokens        |
| POST   | /auth/refresh    | Public  | Refresh access token      |
| GET    | /auth/me         | Any     | Get own profile           |
| PUT    | /auth/me         | Any     | Update own profile        |

### Complaints
| Method | Route                          | Access           | Description              |
|--------|--------------------------------|------------------|--------------------------|
| POST   | /complaints/                   | Student          | Submit complaint         |
| GET    | /complaints/                   | Any (scoped)     | List complaints          |
| GET    | /complaints/stats              | Admin            | Stats overview           |
| GET    | /complaints/{id}               | Owner/Admin/Dept | View complaint           |
| PUT    | /complaints/{id}               | Student owner    | Edit (if pending)        |
| DELETE | /complaints/{id}               | Owner/Admin      | Delete complaint         |
| POST   | /complaints/{id}/assign        | Admin            | Assign to department     |
| POST   | /complaints/{id}/status        | Admin/Dept       | Update status            |

### Admin
| Method | Route                         | Access | Description              |
|--------|-------------------------------|--------|--------------------------|
| GET    | /admin/dashboard              | Admin  | System overview stats    |
| GET    | /admin/users                  | Admin  | List all users           |
| PATCH  | /admin/users/{id}/toggle      | Admin  | Activate/deactivate user |
| DELETE | /admin/users/{id}             | Admin  | Delete user              |

### Operations
| Method | Route                                  | Access         | Description           |
|--------|----------------------------------------|----------------|-----------------------|
| GET/POST/PUT/DELETE | /operations/buses/**       | Any/Admin-Dept | Bus management        |
| GET/POST/PUT/DELETE | /operations/housekeeping/staff/** | Any/Admin-Dept | Staff management  |
| GET/POST/PUT        | /operations/housekeeping/buildings/** | Any/Admin-Dept | Building cleanliness |
| GET/POST/PUT/DELETE | /operations/healthcare/doctors/** | Any/Admin-Dept | Doctor availability |
| GET/POST/PUT/DELETE | /operations/healthcare/medicines/** | Any/Admin-Dept | Medicine stock    |

### AI
| Method | Route         | Access | Description                   |
|--------|---------------|--------|-------------------------------|
| POST   | /ai/classify  | Any    | NLP classify complaint text   |

---

## 🤖 AI Classifier

The `/api/v1/ai/classify` endpoint accepts:
```json
{
  "title": "Bus always late",
  "description": "The 9:30 AM bus arrives 30 minutes late every day"
}
```
Returns:
```json
{
  "category": "transportation",
  "priority": "medium",
  "confidence": 0.91,
  "method": "rule_based"
}
```
Method will be `"ml_model"` after training with `python -m app.ai.train_model`.

---

## 🚀 Deployment (Render)

1. Push `backend/` to a GitHub repo
2. Create a new **Web Service** on [Render](https://render.com)
3. Set:
   - **Build command**: `pip install -r requirements.txt`
   - **Start command**: `uvicorn app.main:app --host 0.0.0.0 --port 8000`
4. Add all `.env` variables in Render's **Environment** tab
