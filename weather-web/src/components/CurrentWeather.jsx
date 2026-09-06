import {
  Cloud,
  CloudRain,
  CloudSun,
  Droplets,
  Eye,
  Gauge,
  RefreshCw,
  Sun,
  Umbrella,
  Wind,
} from "lucide-react"

import MetricCard from "./MetricCard"

function getWeatherDescription(code) {
  const weatherCodes = {
    0: "Clear Sky",
    1: "Mainly Clear",
    2: "Partly Cloudy",
    3: "Overcast",
    45: "Foggy",
    48: "Foggy",
    51: "Light Drizzle",
    53: "Drizzle",
    55: "Heavy Drizzle",
    56: "Freezing Drizzle",
    57: "Freezing Drizzle",
    61: "Light Rain",
    63: "Rain",
    65: "Heavy Rain",
    66: "Freezing Rain",
    67: "Freezing Rain",
    71: "Light Snow",
    73: "Snow",
    75: "Heavy Snow",
    77: "Snow Grains",
    80: "Rain Showers",
    81: "Rain Showers",
    82: "Heavy Rain Showers",
    85: "Snow Showers",
    86: "Heavy Snow Showers",
    95: "Thunderstorm",
    96: "Thunderstorm",
    99: "Thunderstorm",
  }

  return weatherCodes[code] || "Unknown"
}

function WeatherIcon({ code, size = 32 }) {
  if (code === undefined || code === null) {
    return <Cloud size={size} />
  }

  if (code === 0) {
    return <Sun size={size} />
  }

  if ([1, 2].includes(code)) {
    return <CloudSun size={size} />
  }

  if (
    [51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(
      code
    )
  ) {
    return <CloudRain size={size} />
  }

  return <Cloud size={size} />
}

function formatNumber(value, decimals = 1) {
  if (
    value === null ||
    value === undefined ||
    Number.isNaN(Number(value))
  ) {
    return "—"
  }

  return Number(value).toFixed(decimals)
}

function formatCurrentTime(timestamp) {
  if (!timestamp) return "—"

  const date = new Date(timestamp)

  if (Number.isNaN(date.getTime())) {
    return timestamp
  }

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function CurrentWeather({ currentWeather }) {
  const currentTemperature = currentWeather?.temperature
  const currentHumidity = currentWeather?.relative_humidity
  const currentWind = currentWeather?.wind_speed
  const currentRain = currentWeather?.rain
  const currentPressure = currentWeather?.surface_pressure
  const currentCloud = currentWeather?.cloud_cover
  const currentVisibility = currentWeather?.visibility
  const currentFeelsLike = currentWeather?.apparent_temperature

  return (
    <section className="dashboard-section current-section">
      <h2>Current Weather</h2>

      <div className="current-weather-grid">
        {/* Main temperature */}
        <div className="temperature-card">
          <div className="temperature-icon">
            <WeatherIcon
              code={currentWeather?.weather_code}
              size={48}
            />
          </div>

          <div className="main-temperature">
            {formatNumber(currentTemperature)}
            <span>°C</span>
          </div>

          <div className="weather-description">
            {getWeatherDescription(currentWeather?.weather_code)}
          </div>

          <div className="feels-like">
            Feels like {formatNumber(currentFeelsLike)}°C
          </div>
        </div>

        <MetricCard
          icon={<Droplets size={18} />}
          label="Humidity"
          value={formatNumber(currentHumidity, 0)}
          suffix="%"
        />

        <MetricCard
          icon={<Wind size={18} />}
          label="Wind Speed"
          value={formatNumber(currentWind)}
          suffix=" km/h"
          subtext={
            currentWeather?.wind_direction !== undefined
              ? `${currentWeather.wind_direction}°`
              : ""
          }
        />

        <MetricCard
          icon={<Umbrella size={18} />}
          label="Rain"
          value={formatNumber(currentRain)}
          suffix=" mm"
          subtext="Today"
        />

        <MetricCard
          icon={<Gauge size={18} />}
          label="Pressure"
          value={formatNumber(currentPressure)}
          suffix=" hPa"
        />

        <MetricCard
          icon={<Cloud size={18} />}
          label="Cloud Cover"
          value={formatNumber(currentCloud, 0)}
          suffix="%"
        />

        <MetricCard
          icon={<Eye size={18} />}
          label="Visibility"
          value={
            currentVisibility !== null &&
            currentVisibility !== undefined
              ? formatNumber(Number(currentVisibility) / 1000, 0)
              : "—"
          }
          suffix={currentVisibility ? " km" : ""}
        />
      </div>

      <div className="section-updated">
        <RefreshCw size={14} />
        Last Updated: {formatCurrentTime(currentWeather?.ingested_at)}
      </div>
    </section>
  )
}

export default CurrentWeather