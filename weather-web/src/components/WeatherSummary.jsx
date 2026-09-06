import {
  CloudRain,
  Droplets,
  Gauge,
  Sun,
  Umbrella,
} from "lucide-react"

import SummaryCard from "./SummaryCard"

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

function WeatherSummary({
  summary,
  selectedRange,
}) {
  return (
    <section className="dashboard-section summary-section">
      <div className="section-title-row">
        <h2>
          Weather Summary ({selectedRange.label})
        </h2>
      </div>

      <div className="summary-grid">
        <SummaryCard
          icon={<Gauge size={19} />}
          label="Avg Temperature"
          value={formatNumber(summary?.avg_temperature)}
          suffix="°C"
          subtext="Selected period"
        />

        <SummaryCard
          icon={<Sun size={19} />}
          label="Max Temperature"
          value={formatNumber(summary?.max_temperature)}
          suffix="°C"
          subtext="Maximum"
        />

        <SummaryCard
          icon={<CloudRain size={19} />}
          label="Min Temperature"
          value={formatNumber(summary?.min_temperature)}
          suffix="°C"
          subtext="Minimum"
        />

        <SummaryCard
          icon={<Umbrella size={19} />}
          label="Total Rainfall"
          value={formatNumber(summary?.total_rainfall)}
          suffix=" mm"
          subtext="Selected period"
        />

        <SummaryCard
          icon={<CloudRain size={19} />}
          label="Rainy Days"
          value={
            summary?.rainy_days !== undefined
              ? summary.rainy_days
              : "—"
          }
          subtext={`${selectedRange.days} days`}
        />

        <SummaryCard
          icon={<Droplets size={19} />}
          label="Avg Humidity"
          value={formatNumber(summary?.avg_humidity, 0)}
          suffix="%"
          subtext="Selected period"
        />
      </div>
    </section>
  )
}

export default WeatherSummary