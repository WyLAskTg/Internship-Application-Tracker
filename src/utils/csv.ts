import { TRANSLATIONS } from '../i18n'
import { APPLICATION_STATUSES, type Application, type ApplicationStatus } from '../types'
import { isValidDateInput, isValidOptionalDateInput } from './dates'

const CSV_COLUMNS = ['company', 'role', 'date', 'status', 'deadline', 'notes'] as const

type CsvColumn = (typeof CSV_COLUMNS)[number]

const CSV_HEADERS: Record<CsvColumn, string> = {
  company: 'company',
  role: 'role',
  date: 'date',
  status: 'status',
  deadline: 'deadline',
  notes: 'notes',
}

const CSV_HEADER_ALIASES: Record<CsvColumn, string[]> = {
  company: ['company', 'company name'],
  role: ['role', 'position', 'job title'],
  date: ['date', 'date applied', 'application date'],
  status: ['status', 'application status'],
  deadline: ['deadline', 'next step', 'next step date'],
  notes: ['notes', 'note', 'details'],
}

function isApplicationStatus(value: unknown): value is ApplicationStatus {
  return (
    typeof value === 'string' &&
    APPLICATION_STATUSES.includes(value as ApplicationStatus)
  )
}

function escapeCsvCell(value: string) {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replaceAll('"', '""')}"`
  }

  return value
}

export function buildCsv(applications: Application[]) {
  const rows = [
    CSV_COLUMNS.map((column) => CSV_HEADERS[column]),
    ...applications.map((app) => [
      app.company,
      app.role,
      app.date,
      app.status,
      app.deadline,
      app.notes,
    ]),
  ]

  return rows.map((row) => row.map(escapeCsvCell).join(',')).join('\r\n')
}

function parseCsvRows(input: string) {
  const rows: string[][] = []
  let row: string[] = []
  let field = ''
  let insideQuotes = false

  for (let index = 0; index < input.length; index += 1) {
    const char = input[index]
    const nextChar = input[index + 1]

    if (char === '"' && insideQuotes && nextChar === '"') {
      field += '"'
      index += 1
      continue
    }

    if (char === '"') {
      insideQuotes = !insideQuotes
      continue
    }

    if (char === ',' && !insideQuotes) {
      row.push(field)
      field = ''
      continue
    }

    if ((char === '\n' || char === '\r') && !insideQuotes) {
      if (char === '\r' && nextChar === '\n') {
        index += 1
      }

      row.push(field)
      rows.push(row)
      row = []
      field = ''
      continue
    }

    field += char
  }

  row.push(field)
  rows.push(row)

  return rows.filter((currentRow) => currentRow.some((cell) => cell.trim()))
}

function normalizeCsvHeader(value: string) {
  return value.trim().toLowerCase().replace(/[\s_/-]+/g, '')
}

function getColumnIndex(headers: string[], column: CsvColumn) {
  const normalizedAliases = CSV_HEADER_ALIASES[column].map(normalizeCsvHeader)

  return headers.findIndex((header) =>
    normalizedAliases.includes(normalizeCsvHeader(header)),
  )
}

function getStatusFromCsv(value: string): ApplicationStatus | null {
  const normalizedValue = value.trim().toLowerCase()

  if (isApplicationStatus(value.trim())) {
    return value.trim() as ApplicationStatus
  }

  for (const translation of Object.values(TRANSLATIONS)) {
    for (const status of APPLICATION_STATUSES) {
      if (translation.statuses[status].toLowerCase() === normalizedValue) {
        return status
      }
    }
  }

  return null
}

export function parseApplicationsFromCsv(input: string) {
  const rows = parseCsvRows(input)

  if (!rows.length) {
    return { applications: [], skipped: 0 }
  }

  const firstRow = rows[0]
  const hasHeader =
    getColumnIndex(firstRow, 'company') >= 0 &&
    getColumnIndex(firstRow, 'role') >= 0 &&
    getColumnIndex(firstRow, 'date') >= 0
  const indexes: Record<CsvColumn, number> = hasHeader
    ? {
        company: getColumnIndex(firstRow, 'company'),
        role: getColumnIndex(firstRow, 'role'),
        date: getColumnIndex(firstRow, 'date'),
        status: getColumnIndex(firstRow, 'status'),
        deadline: getColumnIndex(firstRow, 'deadline'),
        notes: getColumnIndex(firstRow, 'notes'),
      }
    : {
        company: 0,
        role: 1,
        date: 2,
        status: 3,
        deadline: 4,
        notes: 5,
      }
  const dataRows = hasHeader ? rows.slice(1) : rows
  const applications: Application[] = []
  let skipped = 0

  dataRows.forEach((row, index) => {
    const company = (row[indexes.company] ?? '').trim()
    const role = (row[indexes.role] ?? '').trim()
    const date = (row[indexes.date] ?? '').trim()
    const status = getStatusFromCsv(row[indexes.status] ?? '')
    const deadline = (row[indexes.deadline] ?? '').trim()
    const notes = (row[indexes.notes] ?? '').trim()

    if (
      !company ||
      !role ||
      !date ||
      !status ||
      !isValidDateInput(date) ||
      !isValidOptionalDateInput(deadline)
    ) {
      skipped += 1
      return
    }

    applications.push({
      id: Date.now() + index,
      company,
      role,
      date,
      status,
      deadline,
      notes,
    })
  })

  return { applications, skipped }
}
