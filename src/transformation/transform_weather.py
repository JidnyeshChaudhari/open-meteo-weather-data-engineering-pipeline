import json
from pathlib import Path

import pandas as pd


RAW_DATA_DIR = Path("data/raw")
PROCESSED_DATA_DIR = Path("data/processed")


def transform_weather_file(file_path):
    with open(file_path, "r") as file:
        data = json.load(file)

    hourly_data = data["hourly"]

    df = pd.DataFrame(hourly_data)

    # Extract city name from filename
    city = file_path.stem.split("_")[0].title()

    # Add location metadata
    df["city"] = city
    df["country"] = "India"
    df["latitude"] = data["latitude"]
    df["longitude"] = data["longitude"]

    # Convert timestamp to datetime
    df["time"] = pd.to_datetime(df["time"])

    # Rename timestamp column
    df.rename(columns={"time": "timestamp"}, inplace=True)

    return df


if __name__ == "__main__":
    files = RAW_DATA_DIR.glob("*.json")

    for file_path in files:
        print(f"Transforming: {file_path.name}")

        df = transform_weather_file(file_path)

        print(df.head())
        print()
        print(f"Rows: {len(df)}")
        print(f"Columns: {list(df.columns)}")
        print()