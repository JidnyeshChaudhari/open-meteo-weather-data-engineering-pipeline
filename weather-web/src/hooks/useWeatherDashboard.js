import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"

import {
  getCities,
  getCurrentWeather,
  getTemperatureTrend,
  getWeatherSummary,
  getCityComparison,
} from "../services/weatherApi"

import {
  RANGE_OPTIONS,
  getRangeDates,
} from "../utils/dateUtils"


const STORAGE_KEY = "weather_dashboard_state"


function readStoredDashboard() {
  try {
    const stored = localStorage.getItem(
      STORAGE_KEY
    )

    if (!stored) {
      return null
    }

    return JSON.parse(stored)
  } catch {
    return null
  }
}


function writeStoredDashboard(data) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(data)
    )
  } catch {
    // Ignore localStorage errors.
  }
}


function useWeatherDashboard() {

  /*
    ------------------------------------------------------------
    RESTORE LAST SUCCESSFUL STATE
    ------------------------------------------------------------
  */

  const storedDashboard = useMemo(
    () => readStoredDashboard(),
    []
  )


  const [cities, setCities] = useState(
    storedDashboard?.cities || []
  )


  const [city, setCity] = useState(
    storedDashboard?.city || "Pune"
  )


  const [selectedRange, setSelectedRange] =
    useState(() => {

      const storedRange =
        storedDashboard?.selectedRange

      return (
        RANGE_OPTIONS.find(
          (range) =>
            range.label === storedRange
        ) || RANGE_OPTIONS[0]
      )
    })


  const [currentWeather, setCurrentWeather] =
    useState(
      storedDashboard?.currentWeather || null
    )


  /*
    ------------------------------------------------------------
    LAST 7 DAYS TEMPERATURE TREND
    ------------------------------------------------------------
  */

  const [temperatureTrend, setTemperatureTrend] =
    useState(
      storedDashboard?.temperatureTrend || []
    )


  const [summary, setSummary] = useState(
    storedDashboard?.summary || null
  )


  const [comparison, setComparison] =
    useState(
      storedDashboard?.comparison || []
    )


  const hasStoredData =
    Boolean(storedDashboard)


  /*
    ------------------------------------------------------------
    LOADING STATE
    ------------------------------------------------------------
  */

  const [loading, setLoading] = useState(
    !hasStoredData
  )


  const [refreshing, setRefreshing] =
    useState(false)


  const [error, setError] = useState("")


  /*
    ------------------------------------------------------------
    TRACK DASHBOARD CHANGES
    ------------------------------------------------------------
  */

  const dashboardInitialized =
    useRef(false)


  const previousCity =
    useRef(city)


  const previousRange =
    useRef(selectedRange.label)


  /*
    ------------------------------------------------------------
    DATE RANGE
    ------------------------------------------------------------

    For now we are focusing only on
    Last 7 Days.

    The selected range is still passed
    through getRangeDates().
  */

  const rangeDates = useMemo(
    () => getRangeDates(selectedRange),
    [selectedRange]
  )


  /*
    ------------------------------------------------------------
    LAST 7 DAYS TREND RANGE
    ------------------------------------------------------------

    Only Last 7 Days is used for the
    temperature trend visual.
  */

  const trendRange = "7d"


  /*
    ------------------------------------------------------------
    CITY LIST
    ------------------------------------------------------------
  */

  async function loadCities() {

    const result = await getCities()

    setCities(result)

    if (result.length === 0) {
      return
    }


    const puneExists =
      result.some(
        (item) =>
          item.city.toLowerCase() ===
          "pune"
      )


    const currentCityExists =
      result.some(
        (item) =>
          item.city === city
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
    ------------------------------------------------------------
    FULL DASHBOARD LOAD
    ------------------------------------------------------------
  */

  async function loadDashboard(
    showRefresh = false
  ) {

    try {

      setError("")


      if (
        showRefresh ||
        hasStoredData
      ) {

        setRefreshing(true)

      } else {

        setLoading(true)
      }


      const [
        current,
        trend,
        summaryData,
        comparisonData,
      ] = await Promise.all([

        getCurrentWeather(city),

        /*
          Temperature Trend:
          ONLY Last 7 Days
        */

        getTemperatureTrend(
          city,
          trendRange
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


      const nextCurrentWeather =
        current?.current || current


      const nextTemperatureTrend =
        trend || []


      const nextSummary =
        summaryData || null


      const nextComparison =
        comparisonData || []


      setCurrentWeather(
        nextCurrentWeather
      )


      setTemperatureTrend(
        nextTemperatureTrend
      )


      setSummary(
        nextSummary
      )


      setComparison(
        nextComparison
      )


      writeStoredDashboard({

        cities,

        city,

        selectedRange:
          selectedRange.label,

        currentWeather:
          nextCurrentWeather,

        temperatureTrend:
          nextTemperatureTrend,

        summary:
          nextSummary,

        comparison:
          nextComparison,

        savedAt: Date.now(),
      })

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
    ------------------------------------------------------------
    CITY CHANGE
    ------------------------------------------------------------
  */

  async function handleCityChange() {

    try {

      setError("")

      setRefreshing(true)


      const [
        current,
        trend,
        summaryData,
      ] = await Promise.all([

        getCurrentWeather(city),

        /*
          Temperature Trend:
          ONLY Last 7 Days
        */

        getTemperatureTrend(
          city,
          trendRange
        ),

        getWeatherSummary(
          city,
          rangeDates.start,
          rangeDates.end
        ),
      ])


      const nextCurrentWeather =
        current?.current || current


      const nextTemperatureTrend =
        trend || []


      const nextSummary =
        summaryData || null


      setCurrentWeather(
        nextCurrentWeather
      )


      setTemperatureTrend(
        nextTemperatureTrend
      )


      setSummary(
        nextSummary
      )


      writeStoredDashboard({

        cities,

        city,

        selectedRange:
          selectedRange.label,

        currentWeather:
          nextCurrentWeather,

        temperatureTrend:
          nextTemperatureTrend,

        summary:
          nextSummary,

        comparison,

        savedAt: Date.now(),
      })

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
    ------------------------------------------------------------
    RANGE CHANGE
    ------------------------------------------------------------
  */

  async function handleRangeChange() {

    try {

      setError("")

      setRefreshing(true)


      const [
        trend,
        summaryData,
        comparisonData,
      ] = await Promise.all([

        /*
          Temperature Trend:
          STILL ONLY Last 7 Days
        */

        getTemperatureTrend(
          city,
          trendRange
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


      const nextTemperatureTrend =
        trend || []


      const nextSummary =
        summaryData || null


      const nextComparison =
        comparisonData || []


      setTemperatureTrend(
        nextTemperatureTrend
      )


      setSummary(
        nextSummary
      )


      setComparison(
        nextComparison
      )


      writeStoredDashboard({

        cities,

        city,

        selectedRange:
          selectedRange.label,

        currentWeather,

        temperatureTrend:
          nextTemperatureTrend,

        summary:
          nextSummary,

        comparison:
          nextComparison,

        savedAt: Date.now(),
      })

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
    ------------------------------------------------------------
    LOAD CITIES
    ------------------------------------------------------------
  */

  useEffect(() => {

    loadCities().catch((err) => {

      setError(
        err.message ||
          "Unable to load cities."
      )


      if (!hasStoredData) {

        setLoading(false)
      }
    })

  }, [])


  /*
    ------------------------------------------------------------
    DASHBOARD DATA FLOW
    ------------------------------------------------------------
  */

  useEffect(() => {

    if (!city) {
      return
    }


    /*
      FIRST DASHBOARD LOAD
    */

    if (!dashboardInitialized.current) {

      dashboardInitialized.current = true


      previousCity.current =
        city


      previousRange.current =
        selectedRange.label


      loadDashboard(
        hasStoredData
      )

      return
    }


    /*
      DETECT CHANGES
    */

    const cityChanged =
      previousCity.current !== city


    const rangeChanged =
      previousRange.current !==
      selectedRange.label


    previousCity.current =
      city


    previousRange.current =
      selectedRange.label


    /*
      CITY + RANGE changed
    */

    if (
      cityChanged &&
      rangeChanged
    ) {

      loadDashboard(true)

      return
    }


    /*
      ONLY CITY changed
    */

    if (cityChanged) {

      handleCityChange()

      return
    }


    /*
      ONLY RANGE changed
    */

    if (rangeChanged) {

      handleRangeChange()
    }

  }, [
    city,
    selectedRange,
  ])


  /*
    ------------------------------------------------------------
    RETURN
    ------------------------------------------------------------
  */

  return {

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
  }
}


export default useWeatherDashboard