import requests


TEST_URL = "https://archive-api.open-meteo.com/v1/invalid-endpoint"


try:
    response = requests.get(TEST_URL, timeout=30)
    response.raise_for_status()

except requests.exceptions.HTTPError as e:
    print(f"HTTP error handled successfully: {e}")
