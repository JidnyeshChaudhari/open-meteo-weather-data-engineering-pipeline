import requests

url = "https://api.open-meteo.com/v1/forecast"

params = {
    "latitude": 18.52,
    "longitude": 73.85,
    "hourly":  "temperature_2m,relative_humidity_2m,wind_speed_10m,precipitation",
    "timezone": "Asia/Kolkata"
}

response = requests.get(url, params=params)

print(response.status_code)

data = response.json()

print("Timezone:", data["timezone"])
print("UTC offset:", data["utc_offset_seconds"])
print("First timestamp:", data["hourly"]["time"][0])
