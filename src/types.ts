export const APPLICATION_STATUSES = [
  'Applied',
  'OA',
  'Interview',
  'Rejected',
  'Offer',
] as const

export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number]

export type StatusFilter = ApplicationStatus | 'All'

export const FOCUS_FILTERS = [
  'All',
  'Active',
  'Upcoming',
  'Overdue',
  'MissingNotes',
] as const

export type FocusFilter = (typeof FOCUS_FILTERS)[number]

export const SORT_OPTIONS = ['Newest', 'Oldest', 'Company', 'Deadline'] as const

export type SortOption = (typeof SORT_OPTIONS)[number]

export type Language = 'en' | 'zh' | 'ja' | 'fr'

export type DeadlineState = 'future' | 'soon' | 'overdue'

export type SummaryMetric = {
  label: string
  value: number | string
}

export type Application = {
  id: number
  company: string
  role: string
  date: string
  status: ApplicationStatus
  deadline: string
  notes: string
}
