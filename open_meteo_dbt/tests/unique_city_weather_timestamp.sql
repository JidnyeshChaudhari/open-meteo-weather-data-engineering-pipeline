SELECT
    city,
    weather_timestamp,
    COUNT(*) AS record_count
FROM {{ source('raw', 'raw_weather') }}
GROUP BY
    city,
    weather_timestamp
HAVING COUNT(*) > 1