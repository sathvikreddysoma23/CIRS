import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Response, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError

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
    lifespan=lifespan,
)


# ─── CORS ────────────────────────────────────────────────────────────────────
# Origins list with common variations
origins = [
    "https://cirs-ochre.vercel.app",
    "https://cirs-ochre.vercel.app/",
    "http://localhost:3000",
    "http://localhost:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5173",
]

# Add dynamic frontend URL from settings if not already present
if settings.FRONTEND_URL:
    url = settings.FRONTEND_URL.rstrip("/")
    if url not in origins:
        origins.append(url)
    if f"{url}/" not in origins:
        origins.append(f"{url}/")

# ─── Nuclear CORS & Request Logging ──────────────────────────────────────────
@app.middleware("http")
async def nuclear_cors_middleware(request: Request, call_next):
    origin = request.headers.get("Origin") or "*"
    
    # Handle preflight (OPTIONS)
    if request.method == "OPTIONS":
        response = Response(status_code=204)
        response.headers["Access-Control-Allow-Origin"] = origin
        response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS, PATCH"
        response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization, Accept, X-Requested-With"
        response.headers["Access-Control-Allow-Credentials"] = "true"
        return response
        
    # Process the request
    try:
        response = await call_next(request)
    except Exception as e:
        logger.error(f"Middleware Error: {e}", exc_info=True)
        response = JSONResponse(
            status_code=500,
            content={"detail": "An unexpected server error occurred."}
        )

    # ALWAYS inject headers into the final response
    response.headers["Access-Control-Allow-Origin"] = origin
    response.headers["Access-Control-Allow-Credentials"] = "true"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS, PATCH"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization, Accept, X-Requested-With"

    return response


# ─── Exception Handlers ──────────────────────────────────────────────────────
@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail},
    )

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    logger.error(f"Validation error: {exc.errors()}")
    return JSONResponse(
        status_code=422,
        content={"detail": "Validation error", "errors": exc.errors()},
    )

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": f"Server Error: {str(exc)}"},
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
    return {"status": "ok", "environment": settings.APP_ENV}


@app.get("/favicon.ico", include_in_schema=False)
async def favicon():
    return Response(status_code=204)
