export const APPLICATION_STATUSES = [
  'Applied',
  'OA',
  'Interview',
  'Rejected',
  'Offer',
] as const

export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number]

export type StatusFilter = ApplicationStatus | 'All'

export type SortOption = 'Newest' | 'Oldest' | 'Company'

export type Application = {
  id: number
  company: string
  role: string
  date: string
  status: ApplicationStatus
}
