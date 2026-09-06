import requests

url = "https://archive-api.open-meteo.com/v1/archive"

params = {
    "latitude": 18.52,
    "longitude": 73.85,
    "start_date": "2025-08-10",
    "end_date": "2025-08-12",
    "hourly": "temperature_2m",
    "timezone": "Asia/Kolkata"
}

response = requests.get(url, params=params)

print(response.status_code)

data = response.json()

hourly = data["hourly"]

times = hourly["time"]
temperatures = hourly["temperature_2m"]

print("First time:", times[0])
print("First temperature:", temperatures[0])

print("Second time:", times[1])
print("Second temperature:", temperatures[1])
for time, temperature in zip(times, temperatures):
    print({
    "timestamp": time,
    "temperature": temperature
})