import type { DeadlineState } from '../types'

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/
const SOON_WINDOW_DAYS = 7
const MS_PER_DAY = 24 * 60 * 60 * 1000

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

function getLocalDateStart(date: Date) {
  const dateStart = new Date(date)
  dateStart.setHours(0, 0, 0, 0)

  return dateStart
}

export function getDeadlineState(deadline: string): DeadlineState | null {
  if (!deadline) {
    return null
  }

  const deadlineDate = getLocalDateStart(new Date(`${deadline}T00:00:00`))
  const today = getLocalDateStart(new Date())
  const dayDifference = Math.round(
    (deadlineDate.getTime() - today.getTime()) / MS_PER_DAY,
  )

  if (dayDifference < 0) {
    return 'overdue'
  }

  if (dayDifference <= SOON_WINDOW_DAYS) {
    return 'soon'
  }

  return 'future'
}
