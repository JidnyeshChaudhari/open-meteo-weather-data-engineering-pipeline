import Header from "../components/Header"
import CitySelector from "../components/CitySelector"
import CurrentWeather from "../components/CurrentWeather"
import TemperatureTrend from "../components/TemperatureTrend"
import WeatherSummary from "../components/WeatherSummary"
import CityComparison from "../components/CityComparison"

import useWeatherDashboard from "../hooks/useWeatherDashboard"

import { formatCurrentTime } from "../utils/dateUtils"


function Dashboard() {

  const {
    cities,
    city,
    setCity,
    selectedRange,
    setSelectedRange,
    currentWeather,
    temperatureTrend,
    summary,
    comparison,
    loading,
    refreshing,
    error,
    loadDashboard,
  } = useWeatherDashboard()


  return (
    <div className="dashboard">

      <Header
        currentWeather={currentWeather}
        refreshing={refreshing}
        onRefresh={() => loadDashboard(true)}
        formatCurrentTime={formatCurrentTime}
      />


      <main className="dashboard-content">

        <CitySelector
          cities={cities}
          city={city}
          onCityChange={setCity}
        />


        {error && (
          <div className="dashboard-error">
            {error}
          </div>
        )}


        <CurrentWeather
          currentWeather={currentWeather}
        />


        <TemperatureTrend
          temperatureTrend={temperatureTrend}
          loading={loading}
          selectedRange={selectedRange}
          onRangeChange={setSelectedRange}
        />


        <WeatherSummary
          summary={summary}
          selectedRange={selectedRange}
        />


        <CityComparison
          comparison={comparison}
          selectedRange={selectedRange}
        />

      </main>

    </div>
  )
}


export default Dashboard