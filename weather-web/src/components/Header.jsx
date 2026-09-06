import {
  CloudSun,
  RefreshCw,
} from "lucide-react"

function Header({
  currentWeather,
  refreshing,
  onRefresh,
  formatCurrentTime,
}) {
  return (
    <header className="dashboard-header">
      <div className="brand">
        <div className="brand-icon">
          <CloudSun size={25} />
        </div>

        <div>
          <h1>Weather Analytics</h1>
        </div>
      </div>

      <div className="header-right">
        <div className="updated-info">
          <RefreshCw size={15} />
          <span>
            Last Updated:{" "}
            {formatCurrentTime(currentWeather?.ingested_at)}
          </span>
        </div>

        <button
          className="header-refresh"
          onClick={onRefresh}
          disabled={refreshing}
          aria-label="Refresh dashboard"
        >
          <RefreshCw
            size={17}
            className={refreshing ? "spin" : ""}
          />
        </button>
      </div>
    </header>
  )
}

export default Header