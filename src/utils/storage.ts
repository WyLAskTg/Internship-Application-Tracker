import { LANGUAGE_OPTIONS } from '../i18n'
import { APPLICATION_STATUSES, type Application, type ApplicationStatus, type Language } from '../types'

export const STORAGE_KEY = 'applications'
export const LANGUAGE_STORAGE_KEY = 'language'

function isApplicationStatus(value: unknown): value is ApplicationStatus {
  return (
    typeof value === 'string' &&
    APPLICATION_STATUSES.includes(value as ApplicationStatus)
  )
}

function isLanguage(value: unknown): value is Language {
  return (
    typeof value === 'string' && LANGUAGE_OPTIONS.includes(value as Language)
  )
}

function normalizeApplication(value: unknown): Application | null {
  if (!value || typeof value !== 'object') {
    return null
  }

  const application = value as Record<string, unknown>

  if (
    typeof application.id !== 'number' ||
    typeof application.company !== 'string' ||
    typeof application.role !== 'string' ||
    typeof application.date !== 'string' ||
    !isApplicationStatus(application.status)
  ) {
    return null
  }

  return {
    id: application.id,
    company: application.company,
    role: application.role,
    date: application.date,
    status: application.status,
    deadline: typeof application.deadline === 'string' ? application.deadline : '',
    notes: typeof application.notes === 'string' ? application.notes : '',
  }
}

export function loadStoredApplications() {
  const savedApplications = localStorage.getItem(STORAGE_KEY)

  if (!savedApplications) {
    return []
  }

  try {
    const parsedApplications: unknown = JSON.parse(savedApplications)

    return Array.isArray(parsedApplications)
      ? parsedApplications.flatMap((item) => {
          const application = normalizeApplication(item)

          return application ? [application] : []
        })
      : []
  } catch {
    return []
  }
}

export function loadStoredLanguage() {
  const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY)

  return isLanguage(savedLanguage) ? savedLanguage : 'en'
}
