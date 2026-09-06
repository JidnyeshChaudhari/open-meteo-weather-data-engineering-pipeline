import json
from urllib.parse import urlencode
from urllib.request import urlopen, Request
from urllib.error import URLError, HTTPError


# ============================================================
# OPEN-METEO CONFIGURATION
# ============================================================

OPEN_METEO_BASE_URL = "https://api.open-meteo.com/v1/forecast"

OPEN_METEO_USER_AGENT = "Weather-Analytics-API/1.0"


CURRENT_VARIABLES = ",".join(
    [
        "temperature_2m",
        "relative_humidity_2m",
        "apparent_temperature",
        "precipitation",
        "rain",
        "weather_code",
        "cloud_cover",
        "wind_speed_10m",
        "wind_direction_10m",
        "surface_pressure",
        "visibility",
    ]
)


# ============================================================
# SINGLE LOCATION
# ============================================================

def fetch_open_meteo_current(latitude, longitude):
    """
    Fetch current weather data from Open-Meteo.
    """

    params = urlencode(
        {
            "latitude": latitude,
            "longitude": longitude,
            "current": CURRENT_VARIABLES,
            "timezone": "auto",
        }
    )

    url = f"{OPEN_METEO_BASE_URL}?{params}"

    request = Request(
        url,
        headers={
            "User-Agent": OPEN_METEO_USER_AGENT
        },
    )

    try:
        with urlopen(request, timeout=10) as response:
            return json.loads(
                response.read().decode("utf-8")
            )

    except HTTPError as exc:
        raise RuntimeError(
            f"Open-Meteo request failed with status {exc.code}."
        )

    except URLError:
        raise RuntimeError(
            "Unable to connect to Open-Meteo."
        )

    except Exception:
        raise RuntimeError(
            "Unable to fetch current weather from Open-Meteo."
        )


# ============================================================
# MULTIPLE LOCATIONS
# ============================================================

def fetch_open_meteo_multiple_current(locations):
    """
    Fetch current weather for multiple cities using one
    Open-Meteo request.

    locations:
        [
            {
                "city": "Pune",
                "latitude": 18.52,
                "longitude": 73.86
            }
        ]
    """

    if not locations:
        return []

    latitudes = ",".join(
        str(location["latitude"])
        for location in locations
    )

    longitudes = ",".join(
        str(location["longitude"])
        for location in locations
    )

    params = urlencode(
        {
            "latitude": latitudes,
            "longitude": longitudes,
            "current": CURRENT_VARIABLES,
            "timezone": "auto",
        }
    )

    url = f"{OPEN_METEO_BASE_URL}?{params}"

    request = Request(
        url,
        headers={
            "User-Agent": OPEN_METEO_USER_AGENT
        },
    )

    try:
        with urlopen(request, timeout=10) as response:
            data = json.loads(
                response.read().decode("utf-8")
            )

    except HTTPError as exc:
        raise RuntimeError(
            f"Open-Meteo request failed with status {exc.code}."
        )

    except URLError:
        raise RuntimeError(
            "Unable to connect to Open-Meteo."
        )

    except Exception:
        raise RuntimeError(
            "Unable to fetch current weather from Open-Meteo."
        )

    # Open-Meteo returns a dictionary for one location
    # and a list for multiple locations.
    if isinstance(data, dict):
        return [data]

    return data