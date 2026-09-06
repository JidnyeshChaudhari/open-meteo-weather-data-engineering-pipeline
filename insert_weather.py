import json
import os
from pathlib import Path

import psycopg
from dotenv import load_dotenv


load_dotenv()

RAW_DATA_DIR = Path("data/raw")


connection = psycopg.connect(
    host=os.getenv("DB_HOST"),
    port=os.getenv("DB_PORT"),
    dbname=os.getenv("DB_NAME"),
    user=os.getenv("DB_USER"),
    password=os.getenv("DB_PASSWORD"),
)


insert_query = """
    INSERT INTO raw.raw_weather (
        city,
        country,
        latitude,
        longitude,
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
    )
    VALUES (
        %(city)s,
        %(country)s,
        %(latitude)s,
        %(longitude)s,
        %(weather_timestamp)s,
        %(temperature)s,
        %(relative_humidity)s,
        %(precipitation)s,
        %(rain)s,
        %(weather_code)s,
        %(wind_speed)s,
        %(wind_direction)s,
        %(surface_pressure)s,
        %(cloud_cover)s,
        NOW()
    )
    ON CONFLICT (city, weather_timestamp)
    DO NOTHING;
"""


def load_weather_file(file_path):
    with open(file_path, "r") as file:
        data = json.load(file)

    city = file_path.stem.split("_")[0].title()

    hourly = data["hourly"]

    times = hourly["time"]
    temperatures = hourly["temperature_2m"]
    humidities = hourly["relative_humidity_2m"]
    precipitations = hourly["precipitation"]
    rains = hourly["rain"]
    weather_codes = hourly["weather_code"]
    wind_speeds = hourly["wind_speed_10m"]
    wind_directions = hourly["wind_direction_10m"]

    latitude = data["latitude"]
    longitude = data["longitude"]

    country = "India"

    records = []

    for i in range(len(times)):
        record = {
            "city": city,
            "country": country,
            "latitude": latitude,
            "longitude": longitude,
            "weather_timestamp": times[i],
            "temperature": temperatures[i],
            "relative_humidity": humidities[i],
            "precipitation": precipitations[i],
            "rain": rains[i],
            "weather_code": weather_codes[i],
            "wind_speed": wind_speeds[i],
            "wind_direction": wind_directions[i],
            "surface_pressure": data.get("hourly", {}).get(
                "surface_pressure", [None] * len(times)
            )[i],
            "cloud_cover": data.get("hourly", {}).get(
                "cloud_cover", [None] * len(times)
            )[i],
        }

        records.append(record)

    return records


total_records = 0

with connection.cursor() as cursor:

    for file_path in sorted(RAW_DATA_DIR.glob("*.json")):

        print(f"Loading: {file_path.name}")

        records = load_weather_file(file_path)

        for record in records:
            cursor.execute(insert_query, record)

        total_records += len(records)

        print(f"Records processed: {len(records)}")


connection.commit()

print()
print(f"Total records processed: {total_records}")
print("PostgreSQL loading completed successfully.")

connection.close()