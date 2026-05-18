import './App.css'
import { useEffect, useMemo, useState, type ChangeEvent } from 'react'
import ApplicationItem from './ApplicationItem'
import {
  HTML_LANG,
  LANGUAGE_OPTIONS,
  TRANSLATIONS,
  type FormError,
  type Notice,
} from './i18n'
import {
  APPLICATION_STATUSES,
  SORT_OPTIONS,
  type Application,
  type ApplicationStatus,
  type Language,
  type SortOption,
  type StatusFilter,
} from './types'

const STORAGE_KEY = 'applications'
const LANGUAGE_STORAGE_KEY = 'language'
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/
const CSV_COLUMNS = ['company', 'role', 'date', 'status', 'deadline', 'notes'] as const

type CsvColumn = (typeof CSV_COLUMNS)[number]

const CSV_HEADERS: Record<CsvColumn, string> = {
  company: 'company',
  role: 'role',
  date: 'date',
  status: 'status',
  deadline: 'deadline',
  notes: 'notes',
}

const CSV_HEADER_ALIASES: Record<CsvColumn, string[]> = {
  company: ['company', 'company name'],
  role: ['role', 'position', 'job title'],
  date: ['date', 'date applied', 'application date'],
  status: ['status', 'application status'],
  deadline: ['deadline', 'next step', 'next step date'],
  notes: ['notes', 'note', 'details'],
}

function getDateTime(date: string) {
  const time = new Date(date).getTime()

  return Number.isNaN(time) ? 0 : time
}

function getDeadlineTime(date: string) {
  return date ? getDateTime(date) : Number.MAX_SAFE_INTEGER
}

function isValidDateInput(value: string) {
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

function isValidOptionalDateInput(value: string) {
  return !value.trim() || isValidDateInput(value.trim())
}

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

function loadStoredApplications() {
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

function loadStoredLanguage() {
  const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY)

  return isLanguage(savedLanguage) ? savedLanguage : 'en'
}

function escapeCsvCell(value: string) {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replaceAll('"', '""')}"`
  }

  return value
}

function buildCsv(applications: Application[]) {
  const rows = [
    CSV_COLUMNS.map((column) => CSV_HEADERS[column]),
    ...applications.map((app) => [
      app.company,
      app.role,
      app.date,
      app.status,
      app.deadline,
      app.notes,
    ]),
  ]

  return rows.map((row) => row.map(escapeCsvCell).join(',')).join('\r\n')
}

function parseCsvRows(input: string) {
  const rows: string[][] = []
  let row: string[] = []
  let field = ''
  let insideQuotes = false

  for (let index = 0; index < input.length; index += 1) {
    const char = input[index]
    const nextChar = input[index + 1]

    if (char === '"' && insideQuotes && nextChar === '"') {
      field += '"'
      index += 1
      continue
    }

    if (char === '"') {
      insideQuotes = !insideQuotes
      continue
    }

    if (char === ',' && !insideQuotes) {
      row.push(field)
      field = ''
      continue
    }

    if ((char === '\n' || char === '\r') && !insideQuotes) {
      if (char === '\r' && nextChar === '\n') {
        index += 1
      }

      row.push(field)
      rows.push(row)
      row = []
      field = ''
      continue
    }

    field += char
  }

  row.push(field)
  rows.push(row)

  return rows.filter((currentRow) => currentRow.some((cell) => cell.trim()))
}

function normalizeCsvHeader(value: string) {
  return value.trim().toLowerCase().replace(/[\s_/-]+/g, '')
}

function getColumnIndex(headers: string[], column: CsvColumn) {
  const normalizedAliases = CSV_HEADER_ALIASES[column].map(normalizeCsvHeader)

  return headers.findIndex((header) =>
    normalizedAliases.includes(normalizeCsvHeader(header)),
  )
}

function getStatusFromCsv(value: string): ApplicationStatus | null {
  const normalizedValue = value.trim().toLowerCase()

  if (isApplicationStatus(value.trim())) {
    return value.trim() as ApplicationStatus
  }

  for (const translation of Object.values(TRANSLATIONS)) {
    for (const status of APPLICATION_STATUSES) {
      if (translation.statuses[status].toLowerCase() === normalizedValue) {
        return status
      }
    }
  }

  return null
}

function parseApplicationsFromCsv(input: string) {
  const rows = parseCsvRows(input)

  if (!rows.length) {
    return { applications: [], skipped: 0 }
  }

  const firstRow = rows[0]
  const hasHeader =
    getColumnIndex(firstRow, 'company') >= 0 &&
    getColumnIndex(firstRow, 'role') >= 0 &&
    getColumnIndex(firstRow, 'date') >= 0
  const indexes: Record<CsvColumn, number> = hasHeader
    ? {
        company: getColumnIndex(firstRow, 'company'),
        role: getColumnIndex(firstRow, 'role'),
        date: getColumnIndex(firstRow, 'date'),
        status: getColumnIndex(firstRow, 'status'),
        deadline: getColumnIndex(firstRow, 'deadline'),
        notes: getColumnIndex(firstRow, 'notes'),
      }
    : {
        company: 0,
        role: 1,
        date: 2,
        status: 3,
        deadline: 4,
        notes: 5,
      }
  const dataRows = hasHeader ? rows.slice(1) : rows
  const applications: Application[] = []
  let skipped = 0

  dataRows.forEach((row, index) => {
    const company = (row[indexes.company] ?? '').trim()
    const role = (row[indexes.role] ?? '').trim()
    const date = (row[indexes.date] ?? '').trim()
    const status = getStatusFromCsv(row[indexes.status] ?? '')
    const deadline = (row[indexes.deadline] ?? '').trim()
    const notes = (row[indexes.notes] ?? '').trim()

    if (
      !company ||
      !role ||
      !date ||
      !status ||
      !isValidDateInput(date) ||
      !isValidOptionalDateInput(deadline)
    ) {
      skipped += 1
      return
    }

    applications.push({
      id: Date.now() + index,
      company,
      role,
      date,
      status,
      deadline,
      notes,
    })
  })

  return { applications, skipped }
}

function App() {
  const [language, setLanguage] = useState<Language>(loadStoredLanguage)
  const [company, setCompany] = useState('')
  const [role, setRole] = useState('')
  const [date, setDate] = useState('')
  const [deadline, setDeadline] = useState('')
  const [notes, setNotes] = useState('')
  const [status, setStatus] = useState<ApplicationStatus>('Applied')
  const [applications, setApplications] =
    useState<Application[]>(loadStoredApplications)
  const [errorKey, setErrorKey] = useState<FormError>('')
  const [notice, setNotice] = useState<Notice | null>(null)
  const [filterStatus, setFilterStatus] = useState<StatusFilter>('All')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortOption, setSortOption] = useState<SortOption>('Newest')
  const [editingId, setEditingId] = useState<number | null>(null)
  const text = TRANSLATIONS[language]

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(applications))
  }, [applications])

  useEffect(() => {
    document.documentElement.lang = HTML_LANG[language]
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language)
  }, [language])

  function resetForm() {
    setCompany('')
    setRole('')
    setDate('')
    setDeadline('')
    setNotes('')
    setStatus('Applied')
    setEditingId(null)
  }

  function handleSubmitApplication() {
    if (!company.trim() || !role.trim() || !date.trim()) {
      setErrorKey('required')
      return
    }

    if (!isValidDateInput(date.trim())) {
      setErrorKey('date')
      return
    }

    if (!isValidOptionalDateInput(deadline)) {
      setErrorKey('deadline')
      return
    }

    setErrorKey('')
    setNotice(null)

    if (editingId) {
      setApplications((currentApplications) =>
        currentApplications.map((app) =>
          app.id === editingId
            ? {
                ...app,
                company: company.trim(),
                role: role.trim(),
                date: date.trim(),
                deadline: deadline.trim(),
                notes: notes.trim(),
                status,
              }
            : app,
        ),
      )
      resetForm()
      return
    }

    const newApplication: Application = {
      id: Date.now(),
      company: company.trim(),
      role: role.trim(),
      date: date.trim(),
      deadline: deadline.trim(),
      notes: notes.trim(),
      status,
    }

    setApplications((currentApplications) => [newApplication, ...currentApplications])
    resetForm()
  }

  function handleEditApplication(app: Application) {
    setEditingId(app.id)
    setCompany(app.company)
    setRole(app.role)
    setDate(app.date)
    setDeadline(app.deadline)
    setNotes(app.notes)
    setStatus(app.status)
    setErrorKey('')
    setNotice(null)
  }

  function handleDeleteApplication(idToDelete: number) {
    setApplications((currentApplications) =>
      currentApplications.filter((app) => app.id !== idToDelete),
    )

    if (editingId === idToDelete) {
      resetForm()
    }
  }

  function handleExportCsv() {
    if (!applications.length) {
      setNotice({ type: 'error', text: text.noExportData })
      return
    }

    const csv = buildCsv(applications)
    const blob = new Blob(['\uFEFF', csv], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')

    link.href = url
    link.download = `internship-applications-${new Date().toISOString().slice(0, 10)}.csv`
    document.body.append(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(url)
    setNotice(null)
  }

  async function handleImportCsv(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.currentTarget.value = ''

    if (!file) {
      return
    }

    try {
      const contents = await file.text()
      const result = parseApplicationsFromCsv(contents)

      if (!result.applications.length) {
        setNotice({ type: 'error', text: text.importEmpty })
        return
      }

      setApplications((currentApplications) => [
        ...result.applications,
        ...currentApplications,
      ])
      setNotice({
        type: 'success',
        text: text.importSuccess(result.applications.length, result.skipped),
      })
    } catch {
      setNotice({ type: 'error', text: text.importFailed })
    }
  }

  function handleClearAll() {
    if (!applications.length || !window.confirm(text.confirmClear)) {
      return
    }

    setApplications([])
    resetForm()
    setNotice({ type: 'success', text: text.dataCleared })
  }

  const totalCount = applications.length
  const statusCounts = APPLICATION_STATUSES.map((applicationStatus) => ({
    label: applicationStatus,
    count: applications.filter((app) => app.status === applicationStatus).length,
  }))

  const filteredApplications = useMemo(() => {
    const normalizedSearchTerm = searchTerm.trim().toLowerCase()

    return applications
      .filter((app) => {
        const matchesStatus = filterStatus === 'All' || app.status === filterStatus
        const matchesSearch =
          !normalizedSearchTerm ||
          app.company.toLowerCase().includes(normalizedSearchTerm) ||
          app.role.toLowerCase().includes(normalizedSearchTerm) ||
          app.notes.toLowerCase().includes(normalizedSearchTerm)

        return matchesStatus && matchesSearch
      })
      .sort((a, b) => {
        if (sortOption === 'Company') {
          return a.company.localeCompare(b.company)
        }

        if (sortOption === 'Deadline') {
          return getDeadlineTime(a.deadline) - getDeadlineTime(b.deadline)
        }

        const dateDifference = getDateTime(a.date) - getDateTime(b.date)

        return sortOption === 'Oldest' ? dateDifference : -dateDifference
      })
  }, [applications, filterStatus, searchTerm, sortOption])

  return (
    <div className="app-container" lang={HTML_LANG[language]}>
      <header className="app-header">
        <div>
          <h1 className="app-title">{text.title}</h1>
          <p className="app-subtitle">{text.subtitle}</p>
        </div>

        <div className="language-control">
          <label htmlFor="language">{text.language}</label>
          <select
            id="language"
            value={language}
            onChange={(event) => setLanguage(event.target.value as Language)}
          >
            {LANGUAGE_OPTIONS.map((languageOption) => (
              <option key={languageOption} value={languageOption}>
                {text.languages[languageOption]}
              </option>
            ))}
          </select>
        </div>
      </header>

      <div className="summary-grid">
        <div className="summary-card">
          <h3>{text.total}</h3>
          <p>{totalCount}</p>
        </div>

        {statusCounts.map((item) => (
          <div className="summary-card" key={item.label}>
            <h3>{text.statuses[item.label]}</h3>
            <p>{item.count}</p>
          </div>
        ))}
      </div>

      <div className="section">
        <div className="section-header">
          <h2>{text.dataTools}</h2>
        </div>

        <div className="button-row">
          <button className="secondary-button" onClick={handleExportCsv} type="button">
            {text.exportCsv}
          </button>
          <label className="secondary-button file-button" htmlFor="csv-import">
            {text.importCsv}
          </label>
          <input
            accept=".csv,text/csv"
            className="file-input"
            id="csv-import"
            onChange={handleImportCsv}
            type="file"
          />
          <button className="danger-outline-button" onClick={handleClearAll} type="button">
            {text.clearAll}
          </button>
        </div>

        <p className="field-help">{text.help.import}</p>
        {notice && <p className={`notice-text notice-${notice.type}`}>{notice.text}</p>}
      </div>

      <div className="section">
        <h2>{editingId ? text.editApplication : text.addApplication}</h2>
        {errorKey && <p className="error-text">{text.errors[errorKey]}</p>}

        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="company">{text.labels.company}</label>
            <input
              id="company"
              placeholder={text.placeholders.company}
              value={company}
              onChange={(event) => setCompany(event.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="role">{text.labels.role}</label>
            <input
              id="role"
              placeholder={text.placeholders.role}
              value={role}
              onChange={(event) => setRole(event.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="date-applied">{text.labels.date}</label>
            <input
              id="date-applied"
              inputMode="numeric"
              pattern="\d{4}-\d{2}-\d{2}"
              placeholder={text.placeholders.date}
              value={date}
              onChange={(event) => setDate(event.target.value)}
            />
            <span className="field-help">{text.help.date}</span>
          </div>

          <div className="form-group">
            <label htmlFor="deadline">{text.labels.deadline}</label>
            <input
              id="deadline"
              inputMode="numeric"
              pattern="\d{4}-\d{2}-\d{2}"
              placeholder={text.placeholders.deadline}
              value={deadline}
              onChange={(event) => setDeadline(event.target.value)}
            />
            <span className="field-help">{text.help.deadline}</span>
          </div>

          <div className="form-group">
            <label htmlFor="status">{text.labels.status}</label>
            <select
              id="status"
              value={status}
              onChange={(event) => setStatus(event.target.value as ApplicationStatus)}
            >
              {APPLICATION_STATUSES.map((applicationStatus) => (
                <option key={applicationStatus} value={applicationStatus}>
                  {text.statuses[applicationStatus]}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group form-group-wide">
            <label htmlFor="notes">{text.labels.notes}</label>
            <textarea
              id="notes"
              placeholder={text.placeholders.notes}
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
            />
          </div>
        </div>

        <div className="button-row">
          <button className="primary-button" onClick={handleSubmitApplication} type="button">
            {editingId ? text.saveChanges : text.addApplication}
          </button>
          {editingId && (
            <button className="secondary-button" onClick={resetForm} type="button">
              {text.cancel}
            </button>
          )}
        </div>
      </div>

      <div className="section">
        <div className="section-header">
          <h2>{text.applicationList}</h2>
          <span>{text.shown(filteredApplications.length)}</span>
        </div>

        <div className="toolbar-grid">
          <div className="form-group">
            <label htmlFor="search">{text.labels.search}</label>
            <input
              id="search"
              placeholder={text.placeholders.search}
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="filter-status">{text.labels.filterStatus}</label>
            <select
              id="filter-status"
              value={filterStatus}
              onChange={(event) => setFilterStatus(event.target.value as StatusFilter)}
            >
              <option value="All">{text.all}</option>
              {APPLICATION_STATUSES.map((applicationStatus) => (
                <option key={applicationStatus} value={applicationStatus}>
                  {text.statuses[applicationStatus]}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="sort">{text.labels.sort}</label>
            <select
              id="sort"
              value={sortOption}
              onChange={(event) => setSortOption(event.target.value as SortOption)}
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {text.sortOptions[option]}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="application-list">
          {filteredApplications.length > 0 ? (
            filteredApplications.map((app) => (
              <ApplicationItem
                key={app.id}
                app={app}
                labels={{
                  date: text.labels.date,
                  deadline: text.labels.deadline,
                  notes: text.labels.notes,
                  edit: text.edit,
                  delete: text.delete,
                  statuses: text.statuses,
                }}
                onDelete={handleDeleteApplication}
                onEdit={handleEditApplication}
              />
            ))
          ) : (
            <div className="empty-state">
              <h3>{text.noApplicationsTitle}</h3>
              <p>{text.noApplicationsBody}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
