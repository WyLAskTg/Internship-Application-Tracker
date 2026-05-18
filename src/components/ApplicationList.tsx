import type { Translation } from '../i18n'
import {
  APPLICATION_STATUSES,
  FOCUS_FILTERS,
  SORT_OPTIONS,
  type Application,
  type FocusFilter,
  type SortOption,
  type StatusFilter,
} from '../types'
import ApplicationItem from './ApplicationItem'

type ApplicationListProps = {
  applications: Application[]
  focusFilter: FocusFilter
  filterStatus: StatusFilter
  searchTerm: string
  sortOption: SortOption
  text: Translation
  onDelete: (id: number) => void
  onEdit: (app: Application) => void
  onFocusFilterChange: (filter: FocusFilter) => void
  onFilterStatusChange: (status: StatusFilter) => void
  onSearchTermChange: (value: string) => void
  onSortOptionChange: (option: SortOption) => void
}

function ApplicationList({
  applications,
  focusFilter,
  filterStatus,
  searchTerm,
  sortOption,
  text,
  onDelete,
  onEdit,
  onFocusFilterChange,
  onFilterStatusChange,
  onSearchTermChange,
  onSortOptionChange,
}: ApplicationListProps) {
  return (
    <div className="section">
      <div className="section-header">
        <h2>{text.applicationList}</h2>
        <span>{text.shown(applications.length)}</span>
      </div>

      <div className="toolbar-grid">
        <div className="form-group">
          <label htmlFor="search">{text.labels.search}</label>
          <input
            id="search"
            placeholder={text.placeholders.search}
            value={searchTerm}
            onChange={(event) => onSearchTermChange(event.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="filter-status">{text.labels.filterStatus}</label>
          <select
            id="filter-status"
            value={filterStatus}
            onChange={(event) => onFilterStatusChange(event.target.value as StatusFilter)}
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
          <label htmlFor="focus-filter">{text.labels.focus}</label>
          <select
            id="focus-filter"
            value={focusFilter}
            onChange={(event) => onFocusFilterChange(event.target.value as FocusFilter)}
          >
            {FOCUS_FILTERS.map((filter) => (
              <option key={filter} value={filter}>
                {text.focusOptions[filter]}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="sort">{text.labels.sort}</label>
          <select
            id="sort"
            value={sortOption}
            onChange={(event) => onSortOptionChange(event.target.value as SortOption)}
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
        {applications.length > 0 ? (
          applications.map((app) => (
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
                deadlineStates: text.deadlineStates,
              }}
              onDelete={onDelete}
              onEdit={onEdit}
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
  )
}

export default ApplicationList
