from datetime import date

from fastapi import APIRouter, Query
from fastapi.responses import JSONResponse

from services.weather_service import (
    get_all_cities,
    get_current_weather,
    get_weather_history,
    get_weather_summary,
    compare_cities as compare_cities_service,
)


router = APIRouter()


# ============================================================
# CITIES
# ============================================================

@router.get("/weather/cities")
def cities():
    return get_all_cities()


# ============================================================
# CURRENT WEATHER
# ============================================================

@router.get("/weather/current")
def current_weather(
    city: str = Query(..., min_length=1)
):
    result = get_current_weather(city)

    if result is None:
        return JSONResponse(
            status_code=404,
            content={
                "status": "error",
                "message": "City not found.",
            },
        )

    return result


# ============================================================
# HISTORICAL WEATHER
# ============================================================

@router.get("/weather/history")
def weather_history(
    city: str = Query(..., min_length=1),
    start: date = Query(...),
    end: date = Query(...),
):
    if start > end:
        return JSONResponse(
            status_code=400,
            content={
                "status": "error",
                "message": "Start date cannot be after end date.",
            },
        )

    return get_weather_history(
        city,
        start,
        end,
    )


# ============================================================
# WEATHER SUMMARY
# ============================================================

@router.get("/weather/summary")
def weather_summary(
    city: str = Query(..., min_length=1),
    start: date = Query(...),
    end: date = Query(...),
):
    if start > end:
        return JSONResponse(
            status_code=400,
            content={
                "status": "error",
                "message": "Start date cannot be after end date.",
            },
        )

    return get_weather_summary(
        city,
        start,
        end,
    )


# ============================================================
# CITY COMPARISON
# ============================================================

@router.get("/weather/compare")
def compare_weather(
    start: date = Query(...),
    end: date = Query(...),
):
    if start > end:
        return JSONResponse(
            status_code=400,
            content={
                "status": "error",
                "message": "Start date cannot be after end date.",
            },
        )

    return compare_cities_service(
        start,
        end,
    )