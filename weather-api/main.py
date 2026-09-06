from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from routes.health import router as health_router
from routes.weather import router as weather_router


# ============================================================
# FASTAPI APPLICATION
# ============================================================

app = FastAPI(
    title="Weather Analytics API",
    description="Backend API for the Open-Meteo Weather Analytics Dashboard",
    version="1.0.0",
)


# ============================================================
# CORS
# ============================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["GET"],
    allow_headers=["*"],
)


# ============================================================
# GLOBAL ERROR HANDLER
# ============================================================

@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    return JSONResponse(
        status_code=500,
        content={
            "status": "error",
            "message": "Internal server error.",
        },
    )


# ============================================================
# ROUTERS
# ============================================================

app.include_router(health_router)
app.include_router(weather_router)