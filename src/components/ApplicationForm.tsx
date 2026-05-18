import type { FormError, Translation } from '../i18n'
import { APPLICATION_STATUSES, type ApplicationStatus } from '../types'

type ApplicationFormProps = {
  company: string
  date: string
  deadline: string
  editingId: number | null
  errorKey: FormError
  notes: string
  role: string
  status: ApplicationStatus
  text: Translation
  onCancel: () => void
  onCompanyChange: (value: string) => void
  onDateChange: (value: string) => void
  onDeadlineChange: (value: string) => void
  onNotesChange: (value: string) => void
  onRoleChange: (value: string) => void
  onStatusChange: (status: ApplicationStatus) => void
  onSubmit: () => void
}

function ApplicationForm({
  company,
  date,
  deadline,
  editingId,
  errorKey,
  notes,
  role,
  status,
  text,
  onCancel,
  onCompanyChange,
  onDateChange,
  onDeadlineChange,
  onNotesChange,
  onRoleChange,
  onStatusChange,
  onSubmit,
}: ApplicationFormProps) {
  return (
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
            onChange={(event) => onCompanyChange(event.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="role">{text.labels.role}</label>
          <input
            id="role"
            placeholder={text.placeholders.role}
            value={role}
            onChange={(event) => onRoleChange(event.target.value)}
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
            onChange={(event) => onDateChange(event.target.value)}
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
            onChange={(event) => onDeadlineChange(event.target.value)}
          />
          <span className="field-help">{text.help.deadline}</span>
        </div>

        <div className="form-group">
          <label htmlFor="status">{text.labels.status}</label>
          <select
            id="status"
            value={status}
            onChange={(event) => onStatusChange(event.target.value as ApplicationStatus)}
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
            onChange={(event) => onNotesChange(event.target.value)}
          />
        </div>
      </div>

      <div className="button-row">
        <button className="primary-button" onClick={onSubmit} type="button">
          {editingId ? text.saveChanges : text.addApplication}
        </button>
        {editingId && (
          <button className="secondary-button" onClick={onCancel} type="button">
            {text.cancel}
          </button>
        )}
      </div>
    </div>
  )
}

export default ApplicationForm
