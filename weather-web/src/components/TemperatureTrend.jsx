import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import {
  RANGE_OPTIONS,
} from "../utils/dateUtils"


// ============================================================
// DATE FORMATTING
// ============================================================

function formatChartDate(dateKey) {
  const date = new Date(`${dateKey}T00:00:00`)

  if (Number.isNaN(date.getTime())) {
    return dateKey
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
  })
}


function formatChartMonth(monthKey) {
  const date = new Date(`${monthKey}-01T00:00:00`)

  if (Number.isNaN(date.getTime())) {
    return monthKey
  }

  return date.toLocaleDateString("en-IN", {
    month: "short",
    year: "numeric",
  })
}


// ============================================================
// FILTER TREND DATA
// ============================================================

function filterTrendData(temperatureTrend, selectedRange) {

  if (!Array.isArray(temperatureTrend)) {
    return []
  }


  if (!selectedRange) {
    return temperatureTrend
  }


  let numberOfPoints = null


  switch (selectedRange.label) {

    case "Last 7 Days":
      numberOfPoints = 7
      break


    case "Last 15 Days":
      numberOfPoints = 15
      break


    case "Last Month":
      numberOfPoints = 31
      break


    case "Last 6 Months":
      numberOfPoints = 6
      break


    case "Last Year":
      numberOfPoints = 12
      break


    default:
      return temperatureTrend
  }


  /*
    Keep only the latest required points.

    Example:

    Backend returns:
    [01 Aug, 02 Aug, 03 Aug, ... 30 Aug, 01 Sept, 02 Sept]

    Last 7 Days:
    → only the final 7 points

    Last 15 Days:
    → only the final 15 points

    Last 6 Months:
    → only the final 6 monthly points

    Last Year:
    → only the final 12 monthly points
  */

  if (temperatureTrend.length <= numberOfPoints) {
    return temperatureTrend
  }


  return temperatureTrend.slice(
    -numberOfPoints
  )
}


// ============================================================
// FORMAT BACKEND TREND DATA
// ============================================================

function formatTrendData(temperatureTrend) {

  if (!Array.isArray(temperatureTrend)) {
    return []
  }

  return temperatureTrend
    .map((item) => {

      /*
        Daily model:

        weather_date
        avg_temperature

        Monthly model:

        weather_month
        avg_temperature
      */

      const dateKey =
        item.weather_date ||
        item.weather_month ||
        item.date

      if (!dateKey) {
        return null
      }


      const temperature =
        Number(
          item.avg_temperature ??
          item.temperature
        )


      return {
        date: dateKey,

        label:
          dateKey.length === 7
            ? formatChartMonth(dateKey)
            : formatChartDate(dateKey),

        temperature:
          Number.isFinite(temperature)
            ? Number(temperature.toFixed(1))
            : null,
      }
    })
    .filter(Boolean)
}


// ============================================================
// TEMPERATURE SCALE
// ============================================================

function getTemperatureScale(chartData) {

  const temperatures = chartData
    .map((item) => item.temperature)
    .filter(
      (value) =>
        value !== null &&
        value !== undefined &&
        Number.isFinite(value)
    )


  if (temperatures.length === 0) {
    return {
      min: 0,
      max: 40,
    }
  }


  const dataMin =
    Math.min(...temperatures)


  const dataMax =
    Math.max(...temperatures)


  let min =
    Math.floor(dataMin)


  let max =
    Math.ceil(dataMax)


  min -= 1
  max += 1


  if (max - min < 4) {

    const center =
      (min + max) / 2


    min =
      Math.floor(center - 2)


    max =
      Math.ceil(center + 2)
  }


  return {
    min,
    max,
  }
}


// ============================================================
// TEMPERATURE TREND COMPONENT
// ============================================================

function TemperatureTrend({
  temperatureTrend,
  loading,
  selectedRange,
  onRangeChange,
}) {

  // ----------------------------------------------------------
  // FILTER DATA ACCORDING TO SELECTED RANGE
  // ----------------------------------------------------------

  /*
    The backend may return more aggregated points
    than the chart currently needs.

    We therefore keep only the latest points
    required by the selected filter.

    Last 7 Days   → latest 7 daily points
    Last 15 Days  → latest 15 daily points
    Last Month    → latest 31 daily points
    Last 6 Months → latest 6 monthly points
    Last Year     → latest 12 monthly points
  */

  const filteredTrendData =
    filterTrendData(
      temperatureTrend,
      selectedRange
    )


  // ----------------------------------------------------------
  // FORMAT CHART DATA
  // ----------------------------------------------------------

  const chartData =
    formatTrendData(
      filteredTrendData
    )


  // ----------------------------------------------------------
  // Y-AXIS SCALE
  // ----------------------------------------------------------

  const temperatureScale =
    getTemperatureScale(
      chartData
    )


  // ----------------------------------------------------------
  // X-AXIS LABEL DENSITY
  // ----------------------------------------------------------

  let minTickGap = 25


  if (
    selectedRange.type === "months"
  ) {

    if (
      selectedRange.value === 1
    ) {
      minTickGap = 25
    }


    if (
      selectedRange.value === 6
    ) {
      minTickGap = 35
    }


    if (
      selectedRange.value === 12
    ) {
      minTickGap = 45
    }
  }


  // ----------------------------------------------------------
  // RENDER
  // ----------------------------------------------------------

  return (
    <section className="dashboard-section chart-section">

      <div className="section-title-row">

        <h2>
          Temperature Trend
        </h2>


        <div className="range-selector">

          {RANGE_OPTIONS.map(
            (option) => (
              <button
                key={option.label}

                className={
                  selectedRange.label ===
                  option.label
                    ? "active"
                    : ""
                }

                onClick={() =>
                  onRangeChange(option)
                }
              >
                {option.label}
              </button>
            )
          )}

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

        {loading &&
        temperatureTrend.length === 0 ? (

          <div className="chart-empty">
            Loading temperature data...
          </div>

        ) : chartData.length === 0 ? (

          <div className="chart-empty">
            No historical data available for this period.
          </div>

        ) : (

          <ResponsiveContainer
            width="100%"
            height="100%"
          >

            <LineChart
              data={chartData}

              margin={{
                top: 20,
                right: 20,
                left: 0,
                bottom: 5,
              }}
            >

              <CartesianGrid
                strokeDasharray="3 4"
              />


              <XAxis
                dataKey="label"

                tick={{
                  fontSize: 12,
                }}

                minTickGap={
                  minTickGap
                }
              />


              <YAxis
                tick={{
                  fontSize: 12,
                }}

                domain={[
                  temperatureScale.min,
                  temperatureScale.max,
                ]}

                tickCount={
                  temperatureScale.max -
                  temperatureScale.min +
                  1
                }

                allowDecimals={false}
              />


              <Tooltip
                labelFormatter={(label) =>
                  label
                }

                formatter={(value) => [
                  value !== null &&
                  value !== undefined
                    ? `${value} °C`
                    : "No data",

                  "Avg Temperature",
                ]}
              />


              <Line
                type="monotone"

                dataKey="temperature"

                dot={true}

                activeDot={{
                  r: 5,
                }}

                strokeWidth={2.5}

                connectNulls={true}

                isAnimationActive={false}

              />

            </LineChart>

          </ResponsiveContainer>

        )}

      </div>

    </section>
  )
}


export default TemperatureTrend