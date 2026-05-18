import type { Application } from './types'

type ApplicationItemProps = {
  app: Application
  onDelete: (id: number) => void
  onEdit: (app: Application) => void
}

function ApplicationItem({ app, onDelete, onEdit }: ApplicationItemProps) {
  return (
    <article className="application-item">
      <div className="application-details">
        <div>
          <h3>{app.company}</h3>
          <p>{app.role}</p>
        </div>

        <div className="application-meta">
          <span>{app.date}</span>
          <span className={`status-badge status-${app.status.toLowerCase().trim()}`}>
            {app.status}
          </span>
        </div>
      </div>

      <div className="item-actions">
        <button
          className="secondary-button"
          onClick={() => onEdit(app)}
          type="button"
        >
          Edit
        </button>
        <button
          className="delete-button"
          onClick={() => onDelete(app.id)}
          type="button"
        >
          Delete
        </button>
      </div>
    </article>
  )
}

export default ApplicationItem
