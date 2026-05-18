import './App.css'
import { useEffect, useMemo, useState, type ChangeEvent } from 'react'
import ApplicationForm from './components/ApplicationForm'
import ApplicationList from './components/ApplicationList'
import AppHeader from './components/AppHeader'
import DataTools from './components/DataTools'
import SummaryCards from './components/SummaryCards'
import {
  HTML_LANG,
  TRANSLATIONS,
  type FormError,
  type Notice,
} from './i18n'
import {
  APPLICATION_STATUSES,
  type Application,
  type ApplicationStatus,
  type FocusFilter,
  type Language,
  type SummaryMetric,
  type SortOption,
  type StatusFilter,
} from './types'
import { buildCsv, parseApplicationsFromCsv } from './utils/csv'
import {
  getDateTime,
  getDeadlineTime,
  getDeadlineState,
  isValidDateInput,
  isValidOptionalDateInput,
} from './utils/dates'
import {
  LANGUAGE_STORAGE_KEY,
  STORAGE_KEY,
  loadStoredApplications,
  loadStoredLanguage,
} from './utils/storage'

const ACTIVE_STATUSES: ApplicationStatus[] = ['Applied', 'OA', 'Interview']

function isActiveStatus(status: ApplicationStatus) {
  return ACTIVE_STATUSES.includes(status)
}

function formatRate(count: number, total: number) {
  return total ? `${Math.round((count / total) * 100)}%` : '0%'
}

function matchesFocusFilter(app: Application, focusFilter: FocusFilter) {
  const deadlineState = getDeadlineState(app.deadline)

  if (focusFilter === 'Active') {
    return isActiveStatus(app.status)
  }

  if (focusFilter === 'Upcoming') {
    return deadlineState === 'soon'
  }

  if (focusFilter === 'Overdue') {
    return deadlineState === 'overdue'
  }

  if (focusFilter === 'MissingNotes') {
    return !app.notes.trim()
  }

  return true
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
  const [focusFilter, setFocusFilter] = useState<FocusFilter>('All')
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

    const applicationData = {
      company: company.trim(),
      role: role.trim(),
      date: date.trim(),
      deadline: deadline.trim(),
      notes: notes.trim(),
      status,
    }

    if (editingId) {
      setApplications((currentApplications) =>
        currentApplications.map((app) =>
          app.id === editingId ? { ...app, ...applicationData } : app,
        ),
      )
      resetForm()
      return
    }

    setApplications((currentApplications) => [
      { id: Date.now(), ...applicationData },
      ...currentApplications,
    ])
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
  const activeCount = applications.filter((app) => isActiveStatus(app.status)).length
  const interviewCount = applications.filter((app) => app.status === 'Interview').length
  const offerCount = applications.filter((app) => app.status === 'Offer').length
  const rejectionCount = applications.filter((app) => app.status === 'Rejected').length
  const metrics: SummaryMetric[] = [
    {
      label: text.activeApplications,
      value: activeCount,
    },
    {
      label: text.interviewRate,
      value: formatRate(interviewCount, totalCount),
    },
    {
      label: text.offerRate,
      value: formatRate(offerCount, totalCount),
    },
    {
      label: text.rejectionRate,
      value: formatRate(rejectionCount, totalCount),
    },
  ]

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
        const matchesFocus = matchesFocusFilter(app, focusFilter)

        return matchesStatus && matchesSearch && matchesFocus
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
  }, [applications, filterStatus, focusFilter, searchTerm, sortOption])

  return (
    <div className="app-container" lang={HTML_LANG[language]}>
      <AppHeader
        language={language}
        text={text}
        onLanguageChange={setLanguage}
      />

      <SummaryCards
        metrics={metrics}
        statusCounts={statusCounts}
        text={text}
        totalCount={totalCount}
      />

      <DataTools
        notice={notice}
        text={text}
        onClearAll={handleClearAll}
        onExportCsv={handleExportCsv}
        onImportCsv={handleImportCsv}
      />

      <ApplicationForm
        company={company}
        date={date}
        deadline={deadline}
        editingId={editingId}
        errorKey={errorKey}
        notes={notes}
        role={role}
        status={status}
        text={text}
        onCancel={resetForm}
        onCompanyChange={setCompany}
        onDateChange={setDate}
        onDeadlineChange={setDeadline}
        onNotesChange={setNotes}
        onRoleChange={setRole}
        onStatusChange={setStatus}
        onSubmit={handleSubmitApplication}
      />

      <ApplicationList
        applications={filteredApplications}
        focusFilter={focusFilter}
        filterStatus={filterStatus}
        searchTerm={searchTerm}
        sortOption={sortOption}
        text={text}
        onDelete={handleDeleteApplication}
        onEdit={handleEditApplication}
        onFocusFilterChange={setFocusFilter}
        onFilterStatusChange={setFilterStatus}
        onSearchTermChange={setSearchTerm}
        onSortOptionChange={setSortOption}
      />
    </div>
  )
}

export default App
