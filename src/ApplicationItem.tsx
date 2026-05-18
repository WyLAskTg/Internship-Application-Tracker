import type { Application } from "./src"

type ApplicationItemProps = {
  app: Application
  onDelete: (id: number) => void
}

function ApplicationItem({ app, onDelete }: ApplicationItemProps) {
  return (
    <div className="application-item">
      <div className="application-details">
        <p><strong>Company:</strong> {app.company}</p>
        <p><strong>Role:</strong> {app.role}</p>
        <p><strong>Date Applied:</strong> {app.date}</p>
        <p>
          <strong>Status:</strong>{' '}
          <span className={`status-badge status-${app.status.toLowerCase().trim()}`}>
            {app.status}
          </span>
        </p>
      </div>

      <button
        className="delete-button"
        onClick={() => onDelete(app.id)}
      >
        Delete
      </button>
    </div>
  )
}

export default ApplicationItem