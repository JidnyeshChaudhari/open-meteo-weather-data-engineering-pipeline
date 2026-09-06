SELECT
    id,
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
FROM {{ source('raw', 'raw_weather') }}