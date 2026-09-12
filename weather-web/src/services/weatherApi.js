const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000"


async function apiRequest(endpoint) {
  let response

  try {
    response = await fetch(`${API_BASE_URL}${endpoint}`)
  } catch {
    throw new Error(
      "Unable to connect to the weather API."
    )
  }

  let data

  try {
    data = await response.json()
  } catch {
    throw new Error(
      "The weather API returned an invalid response."
    )
  }

  if (!response.ok) {
    throw new Error(
      data?.message ||
        "The weather API request failed."
    )
  }

  return data
}


// ---------------------------------------------------------
// AVAILABLE CITIES
// ---------------------------------------------------------

export async function getCities() {
  const data = await apiRequest(
    "/weather/cities"
  )

  return data.cities || []
}


// ---------------------------------------------------------
// CURRENT WEATHER
// ---------------------------------------------------------

export async function getCurrentWeather(city) {
  if (!city) {
    throw new Error(
      "Please select a city."
    )
  }

  return await apiRequest(
    `/weather/current?city=${encodeURIComponent(city)}`
  )
}


// ---------------------------------------------------------
// HISTORICAL WEATHER
// ---------------------------------------------------------

export async function getHistoricalWeather(
  city,
  start,
  end
) {
  if (!city) {
    throw new Error(
      "Please select a city."
    )
  }

  if (!start || !end) {
    throw new Error(
      "Please select both start and end dates."
    )
  }

  const data = await apiRequest(
    `/weather/history?city=${encodeURIComponent(
      city
    )}&start=${encodeURIComponent(
      start
    )}&end=${encodeURIComponent(end)}`
  )

  return data.data || []
}


// ---------------------------------------------------------
// TEMPERATURE HISTORY
// ---------------------------------------------------------

export async function getTemperatureHistory(
  city,
  start,
  end
) {
  const data = await getHistoricalWeather(
    city,
    start,
    end
  )

  return data.map((item) => ({
    time: new Date(
      item.weather_timestamp
    ).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),

    temperature: Number(
      item.temperature
    ),
  }))
}


// ---------------------------------------------------------
// TEMPERATURE TREND
// ---------------------------------------------------------

export async function getTemperatureTrend(
  city,
  range
) {
  if (!city) {
    throw new Error(
      "Please select a city."
    )
  }

  if (!range) {
    throw new Error(
      "Please select a temperature trend range."
    )
  }

  const data = await apiRequest(
    `/weather/trend?city=${encodeURIComponent(
      city
    )}&range=${encodeURIComponent(range)}`
  )

  return data.data || []
}


// ---------------------------------------------------------
// WEATHER SUMMARY
// ---------------------------------------------------------

export async function getWeatherSummary(
  city,
  start,
  end
) {
  if (!city) {
    throw new Error(
      "Please select a city."
    )
  }

  const data = await apiRequest(
    `/weather/summary?city=${encodeURIComponent(
      city
    )}&start=${encodeURIComponent(
      start
    )}&end=${encodeURIComponent(end)}`
  )

  if (!data.has_data) {
    return null
  }

  return data.summary
}


// ---------------------------------------------------------
// CITY COMPARISON
// ---------------------------------------------------------

export async function getCityComparison(
  start,
  end
) {
  if (!start || !end) {
    throw new Error(
      "Please select both start and end dates."
    )
  }

  const data = await apiRequest(
    `/weather/compare?start=${encodeURIComponent(
      start
    )}&end=${encodeURIComponent(end)}`
  )

  return data.cities || []
}