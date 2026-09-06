SELECT
    city,
    country,
    latitude,
    longitude,
    weather_timestamp,
    temperature
FROM {{ ref('stg_weather') }}