SELECT *
FROM {{ source('raw', 'raw_weather') }}
WHERE
       temperature < -90
    OR temperature > 60

    OR relative_humidity < 0
    OR relative_humidity > 100

    OR precipitation < 0

    OR rain < 0

    OR weather_code < 0
    OR weather_code > 99

    OR wind_speed < 0

    OR wind_direction < 0
    OR wind_direction > 360

    OR surface_pressure < 800
    OR surface_pressure > 1100

    OR cloud_cover < 0
    OR cloud_cover > 100