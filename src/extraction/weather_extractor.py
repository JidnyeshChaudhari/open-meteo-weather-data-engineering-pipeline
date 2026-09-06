import json
import logging
import time
from datetime import datetime, timedelta

import requests


API_URL = "https://archive-api.open-meteo.com/v1/archive"

MAX_RETRIES = 3
RETRY_DELAY = 5


logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(message)s"
)

logger = logging.getLogger(__name__)


def load_locations():
    logger.info("Loading location configuration.")

    with open("config/locations.json", "r") as file:
        locations = json.load(file)

    logger.info("Loaded %d locations.", len(locations))

    return locations


def save_raw_data(city, start_date, end_date, data):
    filename = f"data/raw/{city.lower()}_{start_date}_{end_date}.json"

    with open(filename, "w") as file:
        json.dump(data, file, indent=4)

    logger.info(
        "Raw data saved | city=%s | file=%s",
        city,
        filename
    )


def extract_weather_data(
    city,
    latitude,
    longitude,
    start_date,
    end_date,
    timezone
):
    params = {
        "latitude": latitude,
        "longitude": longitude,
        "start_date": start_date,
        "end_date": end_date,
        "hourly": [
            "temperature_2m",
            "relative_humidity_2m",
            "precipitation",
            "rain",
            "weather_code",
            "wind_speed_10m",
            "wind_direction_10m"
        ],
        "timezone": timezone
    }

    start_time = datetime.now()

    logger.info(
        "API extraction started | city=%s | start_date=%s | end_date=%s",
        city,
        start_date,
        end_date
    )

    for attempt in range(1, MAX_RETRIES + 1):

        try:
            logger.info(
                "Sending API request | city=%s | attempt=%d/%d",
                city,
                attempt,
                MAX_RETRIES
            )

            response = requests.get(
                API_URL,
                params=params,
                timeout=30
            )

            logger.info(
                "API response received | city=%s | status_code=%s",
                city,
                response.status_code
            )

            response.raise_for_status()

            data = response.json()

            if "hourly" not in data:
                raise ValueError(
                    "Unexpected API response: 'hourly' field is missing."
                )

            record_count = len(data["hourly"].get("time", []))

            end_time = datetime.now()
            duration = end_time - start_time

            logger.info(
                "API extraction successful | city=%s | records=%d | duration=%s",
                city,
                record_count,
                duration
            )

            return data

        except requests.exceptions.HTTPError as e:

            status_code = e.response.status_code if e.response else None

            if status_code is not None and 500 <= status_code < 600:
                if attempt < MAX_RETRIES:
                    logger.warning(
                        "Temporary HTTP error | city=%s | status_code=%s | "
                        "retrying in %d seconds",
                        city,
                        status_code,
                        RETRY_DELAY
                    )
                    time.sleep(RETRY_DELAY)
                    continue

            logger.error(
                "HTTP error | city=%s | status_code=%s | error=%s",
                city,
                status_code,
                e
            )
            raise

        except requests.exceptions.Timeout as e:

            if attempt < MAX_RETRIES:
                logger.warning(
                    "API timeout | city=%s | retrying in %d seconds",
                    city,
                    RETRY_DELAY
                )
                time.sleep(RETRY_DELAY)
                continue

            logger.error(
                "API timeout after %d attempts | city=%s | error=%s",
                MAX_RETRIES,
                city,
                e
            )
            raise

        except requests.exceptions.ConnectionError as e:

            if attempt < MAX_RETRIES:
                logger.warning(
                    "API connection failure | city=%s | "
                    "retrying in %d seconds",
                    city,
                    RETRY_DELAY
                )
                time.sleep(RETRY_DELAY)
                continue

            logger.error(
                "API connection failure after %d attempts | city=%s | error=%s",
                MAX_RETRIES,
                city,
                e
            )
            raise

        except requests.exceptions.JSONDecodeError as e:
            logger.error(
                "Invalid JSON response | city=%s | error=%s",
                city,
                e
            )
            raise

        except ValueError as e:
            logger.error(
                "Invalid API response structure | city=%s | error=%s",
                city,
                e
            )
            raise


if __name__ == "__main__":
    pipeline_start = datetime.now()

    end_date = (datetime.now() - timedelta(days=1)).strftime("%Y-%m-%d")
    start_date = end_date

    logger.info("Weather extraction pipeline started.")

    locations = load_locations()

    for location in locations:
        city = location["city"]

        logger.info(
            "Processing city | city=%s",
            city
        )

        data = extract_weather_data(
            city=city,
            latitude=location["latitude"],
            longitude=location["longitude"],
            start_date=start_date,
            end_date=end_date,
            timezone=location["timezone"]
        )

        save_raw_data(
            city=city,
            start_date=start_date,
            end_date=end_date,
            data=data
        )

        logger.info(
            "City processing completed | city=%s",
            city
        )

    pipeline_end = datetime.now()
    pipeline_duration = pipeline_end - pipeline_start

    logger.info(
        "Weather extraction pipeline completed | duration=%s",
        pipeline_duration
    )

