import type { Translation } from '../i18n'
import type { ApplicationStatus } from '../types'

type StatusCount = {
  label: ApplicationStatus
  count: number
}

type SummaryCardsProps = {
  statusCounts: StatusCount[]
  text: Translation
  totalCount: number
}

function SummaryCards({ statusCounts, text, totalCount }: SummaryCardsProps) {
  return (
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
  )
}

export default SummaryCards
