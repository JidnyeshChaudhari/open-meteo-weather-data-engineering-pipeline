SELECT
    MAX(ingested_at) AS latest_ingestion_time
FROM {{ source('raw', 'raw_weather') }}
HAVING MAX(ingested_at) < NOW() - INTERVAL '2 hours'