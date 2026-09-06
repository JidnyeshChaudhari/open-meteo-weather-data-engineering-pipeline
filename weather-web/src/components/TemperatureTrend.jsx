import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

const RANGE_OPTIONS = [
  { label: "Last 7 Days", days: 7 },
  { label: "Last 15 Days", days: 15 },
  { label: "Last Month", days: 30 },
  { label: "Last 6 Months", days: 180 },
  { label: "Last Year", days: 365 },
]

function formatChartDate(timestamp) {
  const date = new Date(timestamp)

  if (Number.isNaN(date.getTime())) {
    return timestamp
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
  })
}

function TemperatureTrend({
  historicalWeather,
  loading,
  selectedRange,
  onRangeChange,
}) {
  const grouped = {}

  historicalWeather.forEach((item) => {
    if (!item.weather_timestamp) return

    const dateKey = item.weather_timestamp.split("T")[0]

    if (!grouped[dateKey]) {
      grouped[dateKey] = {
        date: dateKey,
        temperatures: [],
      }
    }

    if (
      item.temperature !== null &&
      item.temperature !== undefined
    ) {
      grouped[dateKey].temperatures.push(Number(item.temperature))
    }
  })

  const chartData = Object.values(grouped)
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((item) => ({
      date: item.date,
      label: formatChartDate(item.date),
      temperature:
        item.temperatures.length > 0
          ? Number(
              (
                item.temperatures.reduce((a, b) => a + b, 0) /
                item.temperatures.length
              ).toFixed(1)
            )
          : null,
    }))

  return (
    <section className="dashboard-section chart-section">
      <div className="section-title-row">
        <h2>Temperature Trend</h2>

        <div className="range-selector">
          {RANGE_OPTIONS.map((option) => (
            <button
              key={option.label}
              className={
                selectedRange.label === option.label
                  ? "active"
                  : ""
              }
              onClick={() => onRangeChange(option)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="chart-label">
        Temperature (°C)
      </div>

      <div className="chart-legend">
        <span className="legend-dot" />
        Avg Temperature (°C)
      </div>

      <div className="chart-container">
        {loading && historicalWeather.length === 0 ? (
          <div className="chart-empty">
            Loading temperature data...
          </div>
        ) : chartData.length === 0 ? (
          <div className="chart-empty">
            No historical data available for this period.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{
                top: 20,
                right: 20,
                left: 0,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 4" />

              <XAxis
                dataKey="label"
                tick={{ fontSize: 12 }}
                minTickGap={25}
              />

              <YAxis
                tick={{ fontSize: 12 }}
                domain={["auto", "auto"]}
              />

              <Tooltip
                formatter={(value) => [
                  `${value} °C`,
                  "Avg Temperature",
                ]}
              />

              <Line
                type="monotone"
                dataKey="temperature"
                strokeWidth={2.5}
                dot={{ r: 3.5 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </section>
  )
}

export default TemperatureTrend