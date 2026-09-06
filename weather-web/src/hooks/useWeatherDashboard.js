import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"

import {
  getCities,
  getCurrentWeather,
  getHistoricalWeather,
  getWeatherSummary,
  getCityComparison,
} from "../services/weatherApi"

import {
  RANGE_OPTIONS,
  getRangeDates,
} from "../utils/dateUtils"

function useWeatherDashboard() {
  const [cities, setCities] = useState([])
  const [city, setCity] = useState("Pune")

  const [selectedRange, setSelectedRange] = useState(
    RANGE_OPTIONS[0]
  )

  const [currentWeather, setCurrentWeather] = useState(null)
  const [historicalWeather, setHistoricalWeather] = useState([])
  const [summary, setSummary] = useState(null)
  const [comparison, setComparison] = useState([])

  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState("")

  /*
    Used to distinguish the first dashboard load
    from later city/range changes.
  */
  const dashboardInitialized = useRef(false)
  const previousCity = useRef(city)
  const previousRange = useRef(selectedRange.label)

  const rangeDates = useMemo(
    () => getRangeDates(selectedRange.days),
    [selectedRange]
  )

  /*
    --------------------------------------------------
    CITY LIST
    --------------------------------------------------
  */

  async function loadCities() {
    const result = await getCities()

    setCities(result)

    if (result.length === 0) {
      return
    }

    const puneExists = result.some(
      (item) => item.city.toLowerCase() === "pune"
    )

    const currentCityExists = result.some(
      (item) => item.city === city
    )

    if (!currentCityExists) {
      setCity(
        puneExists
          ? "Pune"
          : result[0].city
      )
    }
  }

  /*
    --------------------------------------------------
    CURRENT WEATHER
    --------------------------------------------------
  */

  async function loadCurrentWeather() {
    const current = await getCurrentWeather(city)

    setCurrentWeather(
      current?.current || current
    )
  }

  /*
    --------------------------------------------------
    HISTORICAL WEATHER + SUMMARY
    --------------------------------------------------

    Both depend on:
      - city
      - selected date range
  */

  async function loadHistoricalAndSummary() {
    const [history, summaryData] = await Promise.all([
      getHistoricalWeather(
        city,
        rangeDates.start,
        rangeDates.end
      ),

      getWeatherSummary(
        city,
        rangeDates.start,
        rangeDates.end
      ),
    ])

    setHistoricalWeather(
      history || []
    )

    setSummary(
      summaryData || null
    )
  }

  /*
    --------------------------------------------------
    CITY COMPARISON
    --------------------------------------------------

    Depends only on selected date range.
  */

  async function loadComparison() {
    const comparisonData = await getCityComparison(
      rangeDates.start,
      rangeDates.end
    )

    setComparison(
      comparisonData || []
    )
  }

  /*
    --------------------------------------------------
    INITIAL LOAD / FULL REFRESH
    --------------------------------------------------
  */

  async function loadDashboard(showRefresh = false) {
    try {
      setError("")

      if (showRefresh) {
        setRefreshing(true)
      } else {
        setLoading(true)
      }

      const [
        current,
        history,
        summaryData,
        comparisonData,
      ] = await Promise.all([
        getCurrentWeather(city),

        getHistoricalWeather(
          city,
          rangeDates.start,
          rangeDates.end
        ),

        getWeatherSummary(
          city,
          rangeDates.start,
          rangeDates.end
        ),

        getCityComparison(
          rangeDates.start,
          rangeDates.end
        ),
      ])

      setCurrentWeather(
        current?.current || current
      )

      setHistoricalWeather(
        history || []
      )

      setSummary(
        summaryData || null
      )

      setComparison(
        comparisonData || []
      )
    } catch (err) {
      setError(
        err.message ||
          "Unable to load weather data."
      )
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  /*
    --------------------------------------------------
    CITY CHANGE
    --------------------------------------------------

    City affects:
      ✓ Current Weather
      ✓ Historical Weather
      ✓ Weather Summary

    City does NOT affect:
      ✗ City Comparison
  */

  async function handleCityChange() {
    try {
      setError("")
      setLoading(true)

      await Promise.all([
        loadCurrentWeather(),
        loadHistoricalAndSummary(),
      ])
    } catch (err) {
      setError(
        err.message ||
          "Unable to load weather data."
      )
    } finally {
      setLoading(false)
    }
  }

  /*
    --------------------------------------------------
    RANGE CHANGE
    --------------------------------------------------

    Range affects:
      ✓ Historical Weather
      ✓ Weather Summary
      ✓ City Comparison

    Range does NOT affect:
      ✗ Current Weather
  */

  async function handleRangeChange() {
    try {
      setError("")
      setLoading(true)

      await Promise.all([
        loadHistoricalAndSummary(),
        loadComparison(),
      ])
    } catch (err) {
      setError(
        err.message ||
          "Unable to load weather data."
      )
    } finally {
      setLoading(false)
    }
  }

  /*
    --------------------------------------------------
    LOAD CITIES
    --------------------------------------------------
  */

  useEffect(() => {
    loadCities().catch((err) => {
      setError(
        err.message ||
          "Unable to load cities."
      )

      setLoading(false)
    })
  }, [])

  /*
    --------------------------------------------------
    DASHBOARD DATA FLOW
    --------------------------------------------------

    First load:
      → Everything

    City change:
      → Current + Historical + Summary

    Range change:
      → Historical + Summary + Comparison

    City + Range change simultaneously:
      → Everything
  */

  useEffect(() => {
    if (!city) {
      return
    }

    /*
      First dashboard load.
    */

    if (!dashboardInitialized.current) {
      dashboardInitialized.current = true

      previousCity.current = city
      previousRange.current = selectedRange.label

      loadDashboard()

      return
    }

    const cityChanged =
      previousCity.current !== city

    const rangeChanged =
      previousRange.current !== selectedRange.label

    previousCity.current = city
    previousRange.current = selectedRange.label

    /*
      Both dimensions changed.
      Safest option is to load everything.
    */

    if (cityChanged && rangeChanged) {
      loadDashboard()
      return
    }

    /*
      Only city changed.
    */

    if (cityChanged) {
      handleCityChange()
      return
    }

    /*
      Only range changed.
    */

    if (rangeChanged) {
      handleRangeChange()
    }
  }, [city, selectedRange])

  return {
    cities,
    city,
    setCity,

    selectedRange,
    setSelectedRange,

    currentWeather,
    historicalWeather,
    summary,
    comparison,

    loading,
    refreshing,
    error,

    loadDashboard,
  }
}

export default useWeatherDashboard