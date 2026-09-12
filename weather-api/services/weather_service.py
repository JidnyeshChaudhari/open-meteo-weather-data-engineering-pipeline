from datetime import date

from database.connection import get_connection
from external.open_meteo import (
    fetch_open_meteo_current,
    fetch_open_meteo_multiple_current,
)


# ============================================================
# CITIES
# ============================================================

def get_all_cities():
    connection = None

    try:
        connection = get_connection()

        with connection.cursor() as cursor:
            cursor.execute(
                """
                SELECT
                    city,
                    country,
                    latitude,
                    longitude
                FROM raw.dim_city
                ORDER BY city
                """
            )

            rows = cursor.fetchall()

        cities = []

        for row in rows:
            cities.append(
                {
                    "city": row[0],
                    "country": row[1],
                    "latitude": float(row[2]),
                    "longitude": float(row[3]),
                }
            )

        return {
            "count": len(cities),
            "cities": cities,
        }

    finally:
        if connection:
            connection.close()


# ============================================================
# CURRENT WEATHER
# ============================================================

def get_current_weather(city):
    connection = None

    try:
        connection = get_connection()

        with connection.cursor() as cursor:
            cursor.execute(
                """
                SELECT
                    city,
                    country,
                    latitude,
                    longitude
                FROM raw.dim_city
                WHERE LOWER(city) = LOWER(%s)
                LIMIT 1
                """,
                (city,),
            )

            row = cursor.fetchone()

        if row is None:
            return None

        city_name = row[0]
        country = row[1]
        latitude = float(row[2])
        longitude = float(row[3])

        weather = fetch_open_meteo_current(
            latitude,
            longitude,
        )

        current = weather.get("current", {})
        current_units = weather.get(
            "current_units",
            {},
        )

        return {
            "city": city_name,
            "country": country,
            "latitude": latitude,
            "longitude": longitude,
            "current": {
                "weather_timestamp": current.get("time"),
                "temperature": current.get(
                    "temperature_2m"
                ),
                "relative_humidity": current.get(
                    "relative_humidity_2m"
                ),
                "apparent_temperature": current.get(
                    "apparent_temperature"
                ),
                "precipitation": current.get(
                    "precipitation"
                ),
                "rain": current.get("rain"),
                "weather_code": current.get(
                    "weather_code"
                ),
                "wind_speed": current.get(
                    "wind_speed_10m"
                ),
                "wind_direction": current.get(
                    "wind_direction_10m"
                ),
                "surface_pressure": current.get(
                    "surface_pressure"
                ),
                "cloud_cover": current.get(
                    "cloud_cover"
                ),
                "visibility": current.get(
                    "visibility"
                ),
                "ingested_at": current.get("time"),
            },
            "units": {
                "temperature": current_units.get(
                    "temperature_2m"
                ),
                "relative_humidity": current_units.get(
                    "relative_humidity_2m"
                ),
                "apparent_temperature": current_units.get(
                    "apparent_temperature"
                ),
                "precipitation": current_units.get(
                    "precipitation"
                ),
                "rain": current_units.get("rain"),
                "wind_speed": current_units.get(
                    "wind_speed_10m"
                ),
                "wind_direction": current_units.get(
                    "wind_direction_10m"
                ),
                "surface_pressure": current_units.get(
                    "surface_pressure"
                ),
                "cloud_cover": current_units.get(
                    "cloud_cover"
                ),
                "visibility": current_units.get(
                    "visibility"
                ),
            },
        }

    finally:
        if connection:
            connection.close()


# ============================================================
# HISTORICAL WEATHER
# ============================================================

def get_weather_history(city, start: date, end: date):
    connection = None

    try:
        connection = get_connection()

        with connection.cursor() as cursor:
            cursor.execute(
                """
                SELECT
                    city,
                    country,
                    weather_timestamp,
                    temperature,
                    relative_humidity,
                    precipitation,
                    rain,
                    weather_code,
                    wind_speed,
                    wind_direction,
                    surface_pressure,
                    cloud_cover,
                    ingested_at
                FROM raw.raw_weather
                WHERE LOWER(city) = LOWER(%s)
                  AND weather_timestamp::date
                      BETWEEN %s AND %s
                ORDER BY weather_timestamp
                """,
                (
                    city,
                    start,
                    end,
                ),
            )

            rows = cursor.fetchall()

        data = []

        for row in rows:
            data.append(
                {
                    "city": row[0],
                    "country": row[1],
                    "weather_timestamp": (
                        row[2].isoformat()
                        if row[2]
                        else None
                    ),
                    "temperature": (
                        float(row[3])
                        if row[3] is not None
                        else None
                    ),
                    "relative_humidity": (
                        float(row[4])
                        if row[4] is not None
                        else None
                    ),
                    "precipitation": (
                        float(row[5])
                        if row[5] is not None
                        else None
                    ),
                    "rain": (
                        float(row[6])
                        if row[6] is not None
                        else None
                    ),
                    "weather_code": row[7],
                    "wind_speed": (
                        float(row[8])
                        if row[8] is not None
                        else None
                    ),
                    "wind_direction": (
                        float(row[9])
                        if row[9] is not None
                        else None
                    ),
                    "surface_pressure": (
                        float(row[10])
                        if row[10] is not None
                        else None
                    ),
                    "cloud_cover": (
                        float(row[11])
                        if row[11] is not None
                        else None
                    ),
                    "ingested_at": (
                        row[12].isoformat()
                        if row[12]
                        else None
                    ),
                }
            )

        return {
            "city": city,
            "start": start.isoformat(),
            "end": end.isoformat(),
            "count": len(data),
            "data": data,
        }

    finally:
        if connection:
            connection.close()


# ============================================================
# TEMPERATURE TREND
# ============================================================

def get_temperature_trend(city, range_name):
    connection = None

    try:
        connection = get_connection()

        # ----------------------------------------------------
        # Daily aggregation
        #
        # Used for:
        # 7d
        # 15d
        # month
        # ----------------------------------------------------

        if range_name in {
            "7d",
            "15d",
            "month",
        }:

            with connection.cursor() as cursor:
                cursor.execute(
                    """
                    SELECT
                        weather_date,
                        avg_temperature
                    FROM raw.fact_weather_daily
                    WHERE LOWER(city) = LOWER(%s)
                       AND weather_date BETWEEN %s AND %s
                    ORDER BY weather_date
                    """,
                    (city,),

                    
                )

                rows = cursor.fetchall()

            data = []

            for row in rows:
                data.append(
                    {
                        "weather_date": (
                            row[0].isoformat()
                            if row[0]
                            else None
                        ),
                        "avg_temperature": (
                            float(row[1])
                            if row[1] is not None
                            else None
                        ),
                    }
                )

            return {
                "city": city,
                "range": range_name,
                "count": len(data),
                "data": data,
            }


        # ----------------------------------------------------
        # Monthly aggregation
        #
        # Used for:
        # 6m
        # 1y
        # ----------------------------------------------------

        if range_name in {
            "6m",
            "1y",
        }:

            with connection.cursor() as cursor:
                cursor.execute(
                    """
                    SELECT
                        weather_month,
                        avg_temperature
                    FROM raw.fact_weather_monthly
                    WHERE LOWER(city) = LOWER(%s)
                    ORDER BY weather_month
                    """,
                    (city,),
                )

                rows = cursor.fetchall()

            data = []

            for row in rows:
                data.append(
                    {
                        "weather_month": (
                            row[0].strftime("%Y-%m")
                            if row[0]
                            else None
                        ),
                        "avg_temperature": (
                            float(row[1])
                            if row[1] is not None
                            else None
                        ),
                    }
                )

            return {
                "city": city,
                "range": range_name,
                "count": len(data),
                "data": data,
            }


        # ----------------------------------------------------
        # Invalid range
        # ----------------------------------------------------

        return {
            "city": city,
            "range": range_name,
            "count": 0,
            "data": [],
        }

    finally:
        if connection:
            connection.close()


# ============================================================
# WEATHER SUMMARY
# ============================================================

def get_weather_summary(city, start: date, end: date):
    connection = None

    try:
        connection = get_connection()

        with connection.cursor() as cursor:
            cursor.execute(
                """
                SELECT
                    AVG(temperature) AS avg_temperature,
                    MAX(temperature) AS max_temperature,
                    MIN(temperature) AS min_temperature,
                    COALESCE(SUM(rain), 0) AS total_rainfall,
                    COUNT(
                        DISTINCT weather_timestamp::date
                    ) FILTER (
                        WHERE rain > 0
                    ) AS rainy_days,
                    AVG(relative_humidity) AS avg_humidity,
                    COUNT(*) AS observation_count
                FROM raw.raw_weather
                WHERE LOWER(city) = LOWER(%s)
                  AND weather_timestamp::date
                      BETWEEN %s AND %s
                """,
                (
                    city,
                    start,
                    end,
                ),
            )

            row = cursor.fetchone()

        if row is None or row[6] == 0:
            return {
                "city": city,
                "start": start.isoformat(),
                "end": end.isoformat(),
                "has_data": False,
                "summary": None,
            }

        summary = {
            "avg_temperature": (
                round(float(row[0]), 2)
                if row[0] is not None
                else None
            ),
            "max_temperature": (
                round(float(row[1]), 2)
                if row[1] is not None
                else None
            ),
            "min_temperature": (
                round(float(row[2]), 2)
                if row[2] is not None
                else None
            ),
            "total_rainfall": (
                round(float(row[3]), 2)
                if row[3] is not None
                else 0
            ),
            "rainy_days": (
                int(row[4])
                if row[4] is not None
                else 0
            ),
            "avg_humidity": (
                round(float(row[5]), 2)
                if row[5] is not None
                else None
            ),
            "observation_count": int(row[6]),
        }

        return {
            "city": city,
            "start": start.isoformat(),
            "end": end.isoformat(),
            "has_data": True,
            "summary": summary,
        }

    finally:
        if connection:
            connection.close()


# ============================================================
# CITY COMPARISON
# ============================================================

def compare_cities(start: date, end: date):
    connection = None

    try:
        connection = get_connection()

        # ----------------------------------------------------
        # Get city list and coordinates
        # ----------------------------------------------------

        with connection.cursor() as cursor:
            cursor.execute(
                """
                SELECT
                    city,
                    country,
                    MIN(latitude) AS latitude,
                    MIN(longitude) AS longitude
                FROM raw.dim_city
                WHERE city IS NOT NULL
                GROUP BY
                    city,
                    country
                ORDER BY city
                """
            )

            city_rows = cursor.fetchall()

        locations = []

        for row in city_rows:
            locations.append(
                {
                    "city": row[0],
                    "country": row[1],
                    "latitude": float(row[2]),
                    "longitude": float(row[3]),
                }
            )

        if not locations:
            return {
                "start": start.isoformat(),
                "end": end.isoformat(),
                "count": 0,
                "cities": [],
            }

        # ----------------------------------------------------
        # Historical comparison query
        # ----------------------------------------------------

        with connection.cursor() as cursor:
            cursor.execute(
                """
                SELECT
                    city,
                    country,
                    AVG(temperature) AS avg_temperature,
                    MIN(temperature) AS min_temperature,
                    MAX(temperature) AS max_temperature,
                    COALESCE(SUM(rain), 0)
                        AS total_rainfall,
                    AVG(relative_humidity)
                        AS avg_humidity,
                    COUNT(*) AS observation_count
                FROM raw.raw_weather
                WHERE weather_timestamp::date
                      BETWEEN %s AND %s
                GROUP BY
                    city,
                    country
                ORDER BY city
                """,
                (
                    start,
                    end,
                ),
            )

            historical_rows = cursor.fetchall()

        historical = {}

        for row in historical_rows:
            key = (
                row[0].lower(),
                row[1].lower(),
            )

            historical[key] = {
                "avg_temperature": (
                    round(float(row[2]), 2)
                    if row[2] is not None
                    else None
                ),
                "min_temperature": (
                    round(float(row[3]), 2)
                    if row[3] is not None
                    else None
                ),
                "max_temperature": (
                    round(float(row[4]), 2)
                    if row[4] is not None
                    else None
                ),
                "total_rainfall": (
                    round(float(row[5]), 2)
                    if row[5] is not None
                    else 0
                ),
                "avg_humidity": (
                    round(float(row[6]), 2)
                    if row[6] is not None
                    else None
                ),
                "observation_count": int(row[7]),
            }

        # ----------------------------------------------------
        # Fetch all current temperatures in ONE API request
        # ----------------------------------------------------

        current_weather = fetch_open_meteo_multiple_current(
            locations
        )

        # ----------------------------------------------------
        # Build response
        # ----------------------------------------------------

        comparison = []

        for index, location in enumerate(locations):

            current_temperature = None

            if index < len(current_weather):
                current_data = current_weather[index]

                current = current_data.get(
                    "current",
                    {},
                )

                current_temperature = current.get(
                    "temperature_2m"
                )

            key = (
                location["city"].lower(),
                location["country"].lower(),
            )

            historical_data = historical.get(key)

            if historical_data:
                comparison.append(
                    {
                        "city": location["city"],
                        "country": location["country"],
                        "has_data": True,
                        "current_temperature": (
                            round(
                                float(current_temperature),
                                2,
                            )
                            if current_temperature is not None
                            else None
                        ),
                        "avg_temperature": historical_data[
                            "avg_temperature"
                        ],
                        "min_temperature": historical_data[
                            "min_temperature"
                        ],
                        "max_temperature": historical_data[
                            "max_temperature"
                        ],
                        "total_rainfall": historical_data[
                            "total_rainfall"
                        ],
                        "avg_humidity": historical_data[
                            "avg_humidity"
                        ],
                    }
                )

            else:
                comparison.append(
                    {
                        "city": location["city"],
                        "country": location["country"],
                        "has_data": False,
                        "current_temperature": (
                            round(
                                float(current_temperature),
                                2,
                            )
                            if current_temperature is not None
                            else None
                        ),
                        "avg_temperature": None,
                        "min_temperature": None,
                        "max_temperature": None,
                        "total_rainfall": 0,
                        "avg_humidity": None,
                    }
                )

        return {
            "start": start.isoformat(),
            "end": end.isoformat(),
            "count": len(comparison),
            "cities": comparison,
        }

    finally:
        if connection:
            connection.close()