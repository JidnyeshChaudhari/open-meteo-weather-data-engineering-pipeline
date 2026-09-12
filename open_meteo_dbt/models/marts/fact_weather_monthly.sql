SELECT
    city,
    country,
    DATE_TRUNC('month', weather_timestamp)::date AS weather_month,

    AVG(temperature) AS avg_temperature,
    MIN(temperature) AS min_temperature,
    MAX(temperature) AS max_temperature,

    AVG(relative_humidity) AS avg_humidity,

    COALESCE(SUM(rain), 0) AS total_rainfall,

    COUNT(*) AS observation_count

FROM {{ source('raw', 'raw_weather') }}

WHERE city IS NOT NULL
  AND weather_timestamp IS NOT NULL

GROUP BY
    city,
    country,
    DATE_TRUNC('month', weather_timestamp)