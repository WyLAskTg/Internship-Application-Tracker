import type { Application, ApplicationStatus } from '../types'

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
  }
}

function ApplicationItem({
  app,
  onDelete,
  onEdit,
  labels,
}: ApplicationItemProps) {
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
          {app.deadline && (
            <span>
              {labels.deadline}: {app.deadline}
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
