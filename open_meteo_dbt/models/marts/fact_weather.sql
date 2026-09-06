SELECT
    city,
    country,
    weather_timestamp,
    temperature
FROM {{ ref('int_weather') }}
WHERE weather_timestamp IS NOT NULL