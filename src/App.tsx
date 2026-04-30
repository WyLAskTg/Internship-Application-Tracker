import './App.css'
import { useEffect, useState } from 'react'
import ApplicationItem from './ApplicationItem'


function App() {
  const [company, setCompany] = useState('')
  const [role, setRole] = useState('')
  const [date, setDate] = useState('')
  const [status, setStatus] = useState('Applied')
  const [applications, setApplications] = useState<any[]>([])
  const [error, setError] = useState('')
  const [filterStatus, setFilterStatus] = useState('All')

  useEffect(() => {
    const savedApplications = localStorage.getItem('applications')

    if(savedApplications){
      setApplications(JSON.parse(savedApplications))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('applications', JSON.stringify(applications))
  }, [applications])

  function handleAddApplication(){
    if(!company.trim() || !role.trim() || !date.trim()){
      setError('Please fill in all required fields.')
      return
    }

    setError('')

    const newApplication = {
      id: Date.now(),
      company: company,
      role: role,
      date: date,
      status: status
    }

    setApplications([...applications, newApplication])

    setCompany('')
    setRole('')
    setDate('')
    setStatus('Applied')
  }

  function handleDeleteApplication(idToDelete: number){
    const updateApplications = applications.filter(
      (app) => app.id !== idToDelete
    )

    setApplications(updateApplications)
  }

  const totalCount = applications.length
  const appliedCount = applications.filter((app) => app.status === 'Applied').length
  const oaCount = applications.filter((app) => app.status === 'OA').length
  const interviewCount = applications.filter((app) => app.status === 'Interview').length
  const rejectedCount = applications.filter((app) => app.status === 'Rejected').length
  const offerCount = applications.filter((app) => app.status === 'Offer').length

  const filteredApplications = applications.filter((app) => {
    if(filterStatus === 'All'){
      return true
    }

    return app.status === filterStatus
  })

  return (
    <div className="app-container">
      <h1 className="app-title">Internship Application Tracker</h1>
      <p className="app-subtitle">Track your internship applications in one place</p>

      <div className="summary-grid">
        <div className="summary-card">
          <h3>Total</h3>
          <p>{totalCount}</p>
        </div>

        <div className="summary-card">
          <h3>Applied</h3>
          <p>{appliedCount}</p>
        </div>

        <div className="summary-card">
          <h3>OA</h3>
          <p>{oaCount}</p>
        </div>

        <div className="summary-card">
          <h3>Interview</h3>
          <p>{interviewCount}</p>
        </div>

        <div className="summary-card">
          <h3>Rejected</h3>
          <p>{rejectedCount}</p>
        </div>

        <div className="summary-card">
          <h3>Offer</h3>
          <p>{offerCount}</p>
        </div>
      </div>

      <div className="section">
        <h2>Add Application</h2>
        {error && <p className="error-text">{error}</p>}

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
            placeholder="Enter date applied"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option>Applied</option>
            <option>OA</option>
            <option>Interview</option>
            <option>Rejected</option>
            <option>Offer</option>
          </select>
        </div>

        <button className="add-button" onClick={handleAddApplication}>
          Add Application
        </button>
      </div>

      <div className="section">
        <h2>Application List</h2>

        <div className="form-group">
          <label>Filter by Status</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option>All</option>
            <option>Applied</option>
            <option>OA</option>
            <option>Interview</option>
            <option>Rejected</option>
            <option>Offer</option>
          </select>
        </div>

        <div className="application-list">
          {filteredApplications.map((app) => (
            <ApplicationItem
              key={app.id}
              app={app}
              onDelete={handleDeleteApplication}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default App