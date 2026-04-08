import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.database import connect_db, close_db
from app.config import settings
from app.routes import auth_routes, complaint_routes, admin_routes, operations_routes, ai_routes

# ─── Logging ────────────────────────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(name)s | %(message)s",
)
logger = logging.getLogger(__name__)


# ─── Lifespan (startup / shutdown) ──────────────────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("🚀 Starting CIRS Backend...")
    await connect_db()
    yield
    logger.info("🛑 Shutting down CIRS Backend...")
    await close_db()


# ─── App Instance ────────────────────────────────────────────────────────────
app = FastAPI(
    title="CIRS – Campus Issue Resolution System",
    description=(
        "A role-based campus service management platform with complaint management, "
        "transportation monitoring, housekeeping, healthcare, and AI-powered NLP classification."
    ),
    version="1.0.0",
    contact={"name": "CIRS Team"},
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)


# ─── CORS ────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        settings.FRONTEND_URL,
        "http://localhost:3000",
        "http://localhost:5173",
        "http://localhost:5174",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ─── Routers ─────────────────────────────────────────────────────────────────
API_PREFIX = "/api/v1"

app.include_router(auth_routes.router,       prefix=API_PREFIX)
app.include_router(complaint_routes.router,  prefix=API_PREFIX)
app.include_router(admin_routes.router,      prefix=API_PREFIX)
app.include_router(operations_routes.router, prefix=API_PREFIX)
app.include_router(ai_routes.router,         prefix=API_PREFIX)


# ─── Root & Health ───────────────────────────────────────────────────────────
@app.get("/", tags=["Health"])
async def root():
    return {
        "message": "CIRS Backend is running ✅",
        "version": "1.0.0",
        "docs": "/docs",
    }


@app.get("/health", tags=["Health"])
async def health_check():
    return JSONResponse(content={"status": "ok"}, status_code=200)


# ─── Global Exception Handler ────────────────────────────────────────────────
from fastapi import Request
from fastapi.responses import JSONResponse as FR


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    return FR(
        status_code=500,
        content={"detail": "An unexpected server error occurred."},
    )
