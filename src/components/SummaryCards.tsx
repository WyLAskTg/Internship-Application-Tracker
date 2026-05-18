import type { Translation } from '../i18n'
import type { ApplicationStatus, SummaryMetric } from '../types'

type StatusCount = {
  label: ApplicationStatus
  count: number
}

type SummaryCardsProps = {
  metrics: SummaryMetric[]
  statusCounts: StatusCount[]
  text: Translation
  totalCount: number
}

function SummaryCards({
  metrics,
  statusCounts,
  text,
  totalCount,
}: SummaryCardsProps) {
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

      {metrics.map((metric) => (
        <div className="summary-card summary-card-metric" key={metric.label}>
          <h3>{metric.label}</h3>
          <p>{metric.value}</p>
        </div>
      ))}
    </div>
  )
}

export default SummaryCards
