import requests


TEST_URL = "https://httpbin.org/delay/5"


try:
    response = requests.get(TEST_URL, timeout=0.001)
    response.raise_for_status()

except requests.exceptions.Timeout as e:
    print(f"Timeout handled successfully: {e}")
