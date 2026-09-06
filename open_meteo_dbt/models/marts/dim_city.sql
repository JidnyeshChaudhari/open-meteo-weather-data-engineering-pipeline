SELECT
    city,
    country,
    MIN(latitude) AS latitude,
    MIN(longitude) AS longitude
FROM {{ ref('int_weather') }}
WHERE city IS NOT NULL
GROUP BY
    city,
    country