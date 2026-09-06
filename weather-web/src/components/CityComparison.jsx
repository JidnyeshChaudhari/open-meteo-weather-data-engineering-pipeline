import { MapPin } from "lucide-react"

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

function CityComparison({
  comparison,
  selectedRange,
}) {
  return (
    <section className="dashboard-section comparison-section">
      <div className="section-title-row">
        <h2>City Comparison (Temperature)</h2>

        <select className="comparison-select">
          <option>Avg Temperature (°C)</option>
        </select>
      </div>

      <div className="comparison-table-wrapper">
        <table className="comparison-table">
          <thead>
            <tr>
              <th>City</th>
              <th>Current Temp (°C)</th>
              <th>{selectedRange.label} Avg (°C)</th>
              <th>Min (°C)</th>
              <th>Max (°C)</th>
              <th>Rainfall (mm)</th>
              <th>Humidity (%)</th>
            </tr>
          </thead>

          <tbody>
            {comparison.length === 0 ? (
              <tr>
                <td colSpan="7" className="table-empty">
                  No comparison data available.
                </td>
              </tr>
            ) : (
              comparison.map((item, index) => (
                <tr key={`${item.city}-${index}`}>
                  <td>
                    <div className="table-city">
                      <MapPin size={16} />
                      {item.city}
                    </div>
                  </td>

                  <td>
                    {formatNumber(
                      item.current_temperature
                    )}
                  </td>

                  <td>
                    {formatNumber(
                      item.avg_temperature
                    )}
                  </td>

                  <td>
                    {formatNumber(item.min_temperature)}
                  </td>

                  <td>
                    {formatNumber(item.max_temperature)}
                  </td>

                  <td>
                    {formatNumber(item.total_rainfall)}
                  </td>

                  <td>
                    {formatNumber(item.avg_humidity, 0)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default CityComparison