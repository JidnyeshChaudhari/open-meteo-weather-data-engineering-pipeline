SELECT DISTINCT
    weather_timestamp,
    weather_timestamp::date AS date,
    EXTRACT(YEAR FROM weather_timestamp)::integer AS year,
    EXTRACT(MONTH FROM weather_timestamp)::integer AS month,
    EXTRACT(DAY FROM weather_timestamp)::integer AS day,
    EXTRACT(HOUR FROM weather_timestamp)::integer AS hour,
    EXTRACT(DOW FROM weather_timestamp)::integer AS day_of_week
FROM {{ ref('int_weather') }}
WHERE weather_timestamp IS NOT NULL