export const RANGE_OPTIONS = [
  { label: "Last 7 Days", days: 7 },
  { label: "Last 15 Days", days: 15 },
  { label: "Last Month", days: 30 },
  { label: "Last 6 Months", days: 180 },
  { label: "Last Year", days: 365 },
]

export function formatDate(date) {
  return date.toISOString().split("T")[0]
}

export function getRangeDates(days) {
  const end = new Date()
  const start = new Date()

  start.setDate(end.getDate() - (days - 1))

  return {
    start: formatDate(start),
    end: formatDate(end),
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