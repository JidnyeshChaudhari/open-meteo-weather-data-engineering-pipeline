import json
from pathlib import Path


RAW_DATA_DIR = Path("data/raw")

REQUIRED_FIELDS = [
    "time",
    "temperature_2m",
    "relative_humidity_2m",
    "precipitation",
    "rain",
    "weather_code",
    "wind_speed_10m",
    "wind_direction_10m"
]


def validate_file(file_path):
    with open(file_path, "r") as file:
        data = json.load(file)

    print(f"\nValidating: {file_path.name}")

    if "hourly" not in data:
        print("ERROR: 'hourly' section missing.")
        return

    hourly_data = data["hourly"]

    for field in REQUIRED_FIELDS:
        if field not in hourly_data:
            print(f"ERROR: Missing field: {field}")
        else:
            print(f"OK: {field}")

    record_count = len(hourly_data["time"])

    print(f"Number of hourly records: {record_count}")

    if record_count == 168:
        print("OK: Expected 168 hourly records.")
    else:
        print("WARNING: Record count is not 168.")


if __name__ == "__main__":
    files = RAW_DATA_DIR.glob("*.json")

    for file_path in files:
        validate_file(file_path)