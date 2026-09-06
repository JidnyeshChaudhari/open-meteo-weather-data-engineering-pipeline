import sys
from datetime import datetime, timedelta

from weather_extractor import extract_weather_data, load_locations, save_raw_data


def backfill(start_date, end_date):

    print(
        f"Starting weather backfill | "
        f"start_date={start_date} | end_date={end_date}"
    )

    locations = load_locations()

    for location in locations:

        city = location["city"]

        print(f"Backfilling city | city={city}")

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

        print(f"Backfill completed | city={city}")

    print("Weather backfill completed successfully.")


if __name__ == "__main__":

    if len(sys.argv) != 3:
        print(
            "Usage: python weather_backfill.py "
            "<start_date> <end_date>"
        )
        sys.exit(1)

    start_date = sys.argv[1]
    end_date = sys.argv[2]

    try:
        datetime.strptime(start_date, "%Y-%m-%d")
        datetime.strptime(end_date, "%Y-%m-%d")
    except ValueError:
        print("Dates must use YYYY-MM-DD format.")
        sys.exit(1)

    if start_date > end_date:
        print("Start date cannot be after end date.")
        sys.exit(1)

    backfill(start_date, end_date)