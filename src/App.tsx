import './App.css'
import { useEffect, useMemo, useState } from 'react'
import ApplicationItem from './ApplicationItem'
import {
  APPLICATION_STATUSES,
  type Application,
  type ApplicationStatus,
  type SortOption,
  type StatusFilter,
} from './types'

const STORAGE_KEY = 'applications'

function getDateTime(date: string) {
  const time = new Date(date).getTime()

  return Number.isNaN(time) ? 0 : time
}

function isApplicationStatus(value: unknown): value is ApplicationStatus {
  return (
    typeof value === 'string' &&
    APPLICATION_STATUSES.includes(value as ApplicationStatus)
  )
}

function isApplication(value: unknown): value is Application {
  if (!value || typeof value !== 'object') {
    return false
  }

  const application = value as Record<string, unknown>

  return (
    typeof application.id === 'number' &&
    typeof application.company === 'string' &&
    typeof application.role === 'string' &&
    typeof application.date === 'string' &&
    isApplicationStatus(application.status)
  )
}

function loadStoredApplications() {
  const savedApplications = localStorage.getItem(STORAGE_KEY)

  if (!savedApplications) {
    return []
  }

  try {
    const parsedApplications: unknown = JSON.parse(savedApplications)

    return Array.isArray(parsedApplications)
      ? parsedApplications.filter(isApplication)
      : []
  } catch {
    return []
  }
}

function App() {
  const [company, setCompany] = useState('')
  const [role, setRole] = useState('')
  const [date, setDate] = useState('')
  const [status, setStatus] = useState<ApplicationStatus>('Applied')
  const [applications, setApplications] =
    useState<Application[]>(loadStoredApplications)
  const [error, setError] = useState('')
  const [filterStatus, setFilterStatus] = useState<StatusFilter>('All')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortOption, setSortOption] = useState<SortOption>('Newest')
  const [editingId, setEditingId] = useState<number | null>(null)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(applications))
  }, [applications])

  function resetForm() {
    setCompany('')
    setRole('')
    setDate('')
    setStatus('Applied')
    setEditingId(null)
  }

  function handleSubmitApplication() {
    if (!company.trim() || !role.trim() || !date.trim()) {
      setError('Please fill in all required fields.')
      return
    }

    setError('')

    if (editingId) {
      setApplications((currentApplications) =>
        currentApplications.map((app) =>
          app.id === editingId
            ? {
                ...app,
                company: company.trim(),
                role: role.trim(),
                date,
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
      date,
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
    setStatus(app.status)
    setError('')
  }

  function handleDeleteApplication(idToDelete: number) {
    setApplications((currentApplications) =>
      currentApplications.filter((app) => app.id !== idToDelete),
    )

    if (editingId === idToDelete) {
      resetForm()
    }
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
          app.role.toLowerCase().includes(normalizedSearchTerm)

        return matchesStatus && matchesSearch
      })
      .sort((a, b) => {
        if (sortOption === 'Company') {
          return a.company.localeCompare(b.company)
        }

        const dateDifference = getDateTime(a.date) - getDateTime(b.date)

        return sortOption === 'Oldest' ? dateDifference : -dateDifference
      })
  }, [applications, filterStatus, searchTerm, sortOption])

  return (
    <div className="app-container">
      <header className="app-header">
        <div>
          <h1 className="app-title">Internship Application Tracker</h1>
          <p className="app-subtitle">Track applications, interviews, and outcomes.</p>
        </div>
      </header>

      <div className="summary-grid">
        <div className="summary-card">
          <h3>Total</h3>
          <p>{totalCount}</p>
        </div>

        {statusCounts.map((item) => (
          <div className="summary-card" key={item.label}>
            <h3>{item.label}</h3>
            <p>{item.count}</p>
          </div>
        ))}
      </div>

      <div className="section">
        <h2>{editingId ? 'Edit Application' : 'Add Application'}</h2>
        {error && <p className="error-text">{error}</p>}

        <div className="form-grid">
          <div className="form-group">
            <label>Company</label>
            <input
              placeholder="Enter company name"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Role</label>
            <input
              placeholder="Enter role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Date Applied</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as ApplicationStatus)}
            >
              {APPLICATION_STATUSES.map((applicationStatus) => (
                <option key={applicationStatus}>{applicationStatus}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="button-row">
          <button className="primary-button" onClick={handleSubmitApplication} type="button">
            {editingId ? 'Save Changes' : 'Add Application'}
          </button>
          {editingId && (
            <button className="secondary-button" onClick={resetForm} type="button">
              Cancel
            </button>
          )}
        </div>
      </div>

      <div className="section">
        <div className="section-header">
          <h2>Application List</h2>
          <span>{filteredApplications.length} shown</span>
        </div>

        <div className="toolbar-grid">
          <div className="form-group">
            <label>Search</label>
            <input
              placeholder="Company or role"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Filter by Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as StatusFilter)}
            >
              <option>All</option>
              {APPLICATION_STATUSES.map((applicationStatus) => (
                <option key={applicationStatus}>{applicationStatus}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Sort</label>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as SortOption)}
            >
              <option>Newest</option>
              <option>Oldest</option>
              <option>Company</option>
            </select>
          </div>
        </div>

        <div className="application-list">
          {filteredApplications.length > 0 ? (
            filteredApplications.map((app) => (
              <ApplicationItem
                key={app.id}
                app={app}
                onDelete={handleDeleteApplication}
                onEdit={handleEditApplication}
              />
            ))
          ) : (
            <div className="empty-state">
              <h3>No applications found</h3>
              <p>Add a new application or adjust your filters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
