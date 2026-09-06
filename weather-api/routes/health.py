from fastapi import APIRouter
from fastapi.responses import JSONResponse

from database.connection import get_connection


router = APIRouter()


# ============================================================
# HEALTH
# ============================================================

@router.get("/health")
def health():
    return {
        "status": "ok",
        "service": "weather-api",
    }


# ============================================================
# DATABASE HEALTH
# ============================================================

@router.get("/health/database")
def database_health():
    connection = None

    try:
        connection = get_connection()

        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
            cursor.fetchone()

        return {
            "status": "ok",
            "database": "connected",
        }

    except Exception:
        return JSONResponse(
            status_code=503,
            content={
                "status": "error",
                "database": "unavailable",
            },
        )

    finally:
        if connection:
            connection.close()