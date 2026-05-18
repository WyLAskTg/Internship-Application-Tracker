import type { ChangeEvent } from 'react'
import type { Notice, Translation } from '../i18n'

type DataToolsProps = {
  notice: Notice | null
  text: Translation
  onClearAll: () => void
  onExportCsv: () => void
  onImportCsv: (event: ChangeEvent<HTMLInputElement>) => void
}

function DataTools({
  notice,
  text,
  onClearAll,
  onExportCsv,
  onImportCsv,
}: DataToolsProps) {
  return (
    <div className="section">
      <div className="section-header">
        <h2>{text.dataTools}</h2>
      </div>

      <div className="button-row">
        <button className="secondary-button" onClick={onExportCsv} type="button">
          {text.exportCsv}
        </button>
        <label className="secondary-button file-button" htmlFor="csv-import">
          {text.importCsv}
        </label>
        <input
          accept=".csv,text/csv"
          className="file-input"
          id="csv-import"
          onChange={onImportCsv}
          type="file"
        />
        <button className="danger-outline-button" onClick={onClearAll} type="button">
          {text.clearAll}
        </button>
      </div>

      <p className="field-help">{text.help.import}</p>
      {notice && <p className={`notice-text notice-${notice.type}`}>{notice.text}</p>}
    </div>
  )
}

export default DataTools
