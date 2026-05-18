const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/

export function getDateTime(date: string) {
  const time = new Date(date).getTime()

  return Number.isNaN(time) ? 0 : time
}

export function getDeadlineTime(date: string) {
  return date ? getDateTime(date) : Number.MAX_SAFE_INTEGER
}

export function isValidDateInput(value: string) {
  if (!DATE_PATTERN.test(value)) {
    return false
  }

  const [year, month, day] = value.split('-').map(Number)
  const parsedDate = new Date(Date.UTC(year, month - 1, day))

  return (
    parsedDate.getUTCFullYear() === year &&
    parsedDate.getUTCMonth() === month - 1 &&
    parsedDate.getUTCDate() === day
  )
}

export function isValidOptionalDateInput(value: string) {
  return !value.trim() || isValidDateInput(value.trim())
}
