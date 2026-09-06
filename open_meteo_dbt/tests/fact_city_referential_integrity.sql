SELECT
    f.city,
    f.country
FROM {{ ref('fact_weather') }} f
LEFT JOIN {{ ref('dim_city') }} d
    ON f.city = d.city
    AND f.country = d.country
WHERE d.city IS NULL