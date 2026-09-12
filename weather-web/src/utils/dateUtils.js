export const RANGE_OPTIONS = [
  { label: "Last 7 Days", type: "days", value: 7 },
  { label: "Last 15 Days", type: "days", value: 15 },
  { label: "Last Month", type: "months", value: 1 },
  { label: "Last 6 Months", type: "months", value: 6 },
  { label: "Last Year", type: "months", value: 12 },
]


export function formatDate(date) {
  return date.toISOString().split("T")[0]
}


export function getRangeDates(range) {
  const today = new Date()

  /*
    ------------------------------------------------------------
    DAILY RANGES
    ------------------------------------------------------------

    Use completed calendar days.

    Example:
    Today = 2026-09-06

    Last 7 Days:
    2026-08-30 → 2026-09-05
  */

  if (range.type === "days") {
    const end = new Date(today)
    end.setDate(end.getDate() - 1)

    const start = new Date(end)
    start.setDate(start.getDate() - (range.value - 1))

    return {
      start: formatDate(start),
      end: formatDate(end),
    }
  }


  /*
    ------------------------------------------------------------
    MONTHLY RANGES
    ------------------------------------------------------------

    Use completed calendar months.

    Example:
    Today = September 2026

    Last Month:
    2026-08-01 → 2026-08-31

    Last 6 Months:
    2026-03-01 → 2026-08-31

    Last Year:
    2025-09-01 → 2026-08-31
  */

  if (range.type === "months") {
    // First day of the current month
    const currentMonthStart = new Date(
      today.getFullYear(),
      today.getMonth(),
      1
    )

    // Last day of the previous completed month
    const end = new Date(currentMonthStart)
    end.setDate(0)

    // First day of the starting month
    const start = new Date(
      currentMonthStart.getFullYear(),
      currentMonthStart.getMonth() - range.value,
      1
    )

    return {
      start: formatDate(start),
      end: formatDate(end),
    }
  }


  /*
    ------------------------------------------------------------
    FALLBACK
    ------------------------------------------------------------
  */

  return {
    start: formatDate(today),
    end: formatDate(today),
  }
}


export function formatCurrentTime(timestamp) {
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