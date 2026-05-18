import type { Application, ApplicationStatus, DeadlineState } from '../types'
import { getDeadlineState } from '../utils/dates'

type ApplicationItemProps = {
  app: Application
  onDelete: (id: number) => void
  onEdit: (app: Application) => void
  labels: {
    date: string
    deadline: string
    notes: string
    edit: string
    delete: string
    statuses: Record<ApplicationStatus, string>
    deadlineStates: Record<DeadlineState, string>
  }
}

function ApplicationItem({
  app,
  onDelete,
  onEdit,
  labels,
}: ApplicationItemProps) {
  const deadlineState = getDeadlineState(app.deadline)

  return (
    <article className="application-item">
      <div className="application-details">
        <div>
          <h3>{app.company}</h3>
          <p>{app.role}</p>
        </div>

        <div className="application-meta">
          <span>
            {labels.date}: {app.date}
          </span>
          {app.deadline && deadlineState && (
            <span className={`deadline-badge deadline-${deadlineState}`}>
              {labels.deadline}: {app.deadline}
              <strong>{labels.deadlineStates[deadlineState]}</strong>
            </span>
          )}
          <span className={`status-badge status-${app.status.toLowerCase().trim()}`}>
            {labels.statuses[app.status]}
          </span>
        </div>

        {app.notes && (
          <p className="application-notes">
            <strong>{labels.notes}:</strong> {app.notes}
          </p>
        )}
      </div>

      <div className="item-actions">
        <button
          className="secondary-button"
          onClick={() => onEdit(app)}
          type="button"
        >
          {labels.edit}
        </button>
        <button
          className="delete-button"
          onClick={() => onDelete(app.id)}
          type="button"
        >
          {labels.delete}
        </button>
      </div>
    </article>
  )
}

export default ApplicationItem
