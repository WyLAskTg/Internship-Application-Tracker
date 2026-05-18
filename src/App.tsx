import './App.css'
import { useEffect, useMemo, useState } from 'react'
import ApplicationItem from './ApplicationItem'
import {
  APPLICATION_STATUSES,
  type Application,
  type ApplicationStatus,
  type Language,
  type SortOption,
  type StatusFilter,
} from './types'

const STORAGE_KEY = 'applications'
const LANGUAGE_STORAGE_KEY = 'language'
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/
const LANGUAGE_OPTIONS: Language[] = ['en', 'zh', 'ja', 'fr']
const HTML_LANG: Record<Language, string> = {
  en: 'en',
  zh: 'zh-CN',
  ja: 'ja',
  fr: 'fr',
}

type FormError = 'required' | 'date' | ''

type Translation = {
  language: string
  languages: Record<Language, string>
  title: string
  subtitle: string
  total: string
  addApplication: string
  editApplication: string
  saveChanges: string
  cancel: string
  applicationList: string
  shown: (count: number) => string
  noApplicationsTitle: string
  noApplicationsBody: string
  edit: string
  delete: string
  errors: Record<Exclude<FormError, ''>, string>
  labels: {
    company: string
    role: string
    date: string
    status: string
    search: string
    filterStatus: string
    sort: string
  }
  placeholders: {
    company: string
    role: string
    date: string
    search: string
  }
  help: {
    date: string
  }
  all: string
  statuses: Record<ApplicationStatus, string>
  sortOptions: Record<SortOption, string>
}

const TRANSLATIONS: Record<Language, Translation> = {
  en: {
    language: 'Language',
    languages: {
      en: 'English',
      zh: 'Chinese',
      ja: 'Japanese',
      fr: 'French',
    },
    title: 'Internship Application Tracker',
    subtitle: 'Track applications, interviews, and outcomes.',
    total: 'Total',
    addApplication: 'Add Application',
    editApplication: 'Edit Application',
    saveChanges: 'Save Changes',
    cancel: 'Cancel',
    applicationList: 'Application List',
    shown: (count) => `${count} shown`,
    noApplicationsTitle: 'No applications found',
    noApplicationsBody: 'Add a new application or adjust your filters.',
    edit: 'Edit',
    delete: 'Delete',
    errors: {
      required: 'Please fill in all required fields.',
      date: 'Please use the date format YYYY-MM-DD.',
    },
    labels: {
      company: 'Company',
      role: 'Role',
      date: 'Date Applied',
      status: 'Status',
      search: 'Search',
      filterStatus: 'Filter by Status',
      sort: 'Sort',
    },
    placeholders: {
      company: 'Enter company name',
      role: 'Enter role',
      date: 'YYYY-MM-DD',
      search: 'Company or role',
    },
    help: {
      date: 'Use YYYY-MM-DD.',
    },
    all: 'All',
    statuses: {
      Applied: 'Applied',
      OA: 'OA',
      Interview: 'Interview',
      Rejected: 'Rejected',
      Offer: 'Offer',
    },
    sortOptions: {
      Newest: 'Newest',
      Oldest: 'Oldest',
      Company: 'Company',
    },
  },
  zh: {
    language: '语言',
    languages: {
      en: '英语',
      zh: '中文',
      ja: '日语',
      fr: '法语',
    },
    title: '实习申请追踪器',
    subtitle: '记录申请、面试和结果。',
    total: '总计',
    addApplication: '添加申请',
    editApplication: '编辑申请',
    saveChanges: '保存修改',
    cancel: '取消',
    applicationList: '申请列表',
    shown: (count) => `显示 ${count} 条`,
    noApplicationsTitle: '未找到申请',
    noApplicationsBody: '添加新申请或调整筛选条件。',
    edit: '编辑',
    delete: '删除',
    errors: {
      required: '请填写所有必填项。',
      date: '请使用 YYYY-MM-DD 日期格式。',
    },
    labels: {
      company: '公司',
      role: '岗位',
      date: '申请日期',
      status: '状态',
      search: '搜索',
      filterStatus: '按状态筛选',
      sort: '排序',
    },
    placeholders: {
      company: '输入公司名称',
      role: '输入岗位',
      date: 'YYYY-MM-DD',
      search: '公司或岗位',
    },
    help: {
      date: '请使用 YYYY-MM-DD。',
    },
    all: '全部',
    statuses: {
      Applied: '已申请',
      OA: '在线测评',
      Interview: '面试',
      Rejected: '已拒绝',
      Offer: '录用',
    },
    sortOptions: {
      Newest: '最新',
      Oldest: '最早',
      Company: '公司',
    },
  },
  ja: {
    language: '言語',
    languages: {
      en: '英語',
      zh: '中国語',
      ja: '日本語',
      fr: 'フランス語',
    },
    title: 'インターン応募トラッカー',
    subtitle: '応募、面接、結果を記録します。',
    total: '合計',
    addApplication: '応募を追加',
    editApplication: '応募を編集',
    saveChanges: '変更を保存',
    cancel: 'キャンセル',
    applicationList: '応募リスト',
    shown: (count) => `${count} 件表示`,
    noApplicationsTitle: '応募が見つかりません',
    noApplicationsBody: '新しい応募を追加するか、フィルターを調整してください。',
    edit: '編集',
    delete: '削除',
    errors: {
      required: '必須項目をすべて入力してください。',
      date: '日付は YYYY-MM-DD 形式で入力してください。',
    },
    labels: {
      company: '会社',
      role: '職種',
      date: '応募日',
      status: 'ステータス',
      search: '検索',
      filterStatus: 'ステータスで絞り込み',
      sort: '並び替え',
    },
    placeholders: {
      company: '会社名を入力',
      role: '職種を入力',
      date: 'YYYY-MM-DD',
      search: '会社または職種',
    },
    help: {
      date: 'YYYY-MM-DD を使用してください。',
    },
    all: 'すべて',
    statuses: {
      Applied: '応募済み',
      OA: 'オンラインテスト',
      Interview: '面接',
      Rejected: '不採用',
      Offer: '内定',
    },
    sortOptions: {
      Newest: '新しい順',
      Oldest: '古い順',
      Company: '会社名',
    },
  },
  fr: {
    language: 'Langue',
    languages: {
      en: 'Anglais',
      zh: 'Chinois',
      ja: 'Japonais',
      fr: 'Français',
    },
    title: 'Suivi des candidatures de stage',
    subtitle: 'Suivez vos candidatures, entretiens et résultats.',
    total: 'Total',
    addApplication: 'Ajouter une candidature',
    editApplication: 'Modifier la candidature',
    saveChanges: 'Enregistrer',
    cancel: 'Annuler',
    applicationList: 'Liste des candidatures',
    shown: (count) => `${count} affichée${count > 1 ? 's' : ''}`,
    noApplicationsTitle: 'Aucune candidature trouvée',
    noApplicationsBody: 'Ajoutez une candidature ou ajustez vos filtres.',
    edit: 'Modifier',
    delete: 'Supprimer',
    errors: {
      required: 'Veuillez remplir tous les champs requis.',
      date: 'Utilisez le format de date YYYY-MM-DD.',
    },
    labels: {
      company: 'Entreprise',
      role: 'Poste',
      date: 'Date de candidature',
      status: 'Statut',
      search: 'Recherche',
      filterStatus: 'Filtrer par statut',
      sort: 'Trier',
    },
    placeholders: {
      company: "Saisir le nom de l'entreprise",
      role: 'Saisir le poste',
      date: 'YYYY-MM-DD',
      search: 'Entreprise ou poste',
    },
    help: {
      date: 'Utilisez YYYY-MM-DD.',
    },
    all: 'Tous',
    statuses: {
      Applied: 'Candidature',
      OA: 'Test en ligne',
      Interview: 'Entretien',
      Rejected: 'Refus',
      Offer: 'Offre',
    },
    sortOptions: {
      Newest: 'Plus récentes',
      Oldest: 'Plus anciennes',
      Company: 'Entreprise',
    },
  },
}

function getDateTime(date: string) {
  const time = new Date(date).getTime()

  return Number.isNaN(time) ? 0 : time
}

function isValidDateInput(value: string) {
  if (!DATE_PATTERN.test(value)) {
    return false
  }

  const [year, month, day] = value.split('-').map(Number)
  const parsedDate = new Date(Date.UTC(year, month - 1, day))

  return (
    parsedDate.getUTCFullYear() === year &&
    parsedDate.getUTCMonth() === month - 1 &&
    parsedDate.getUTCDate() === day
  )
}

function isApplicationStatus(value: unknown): value is ApplicationStatus {
  return (
    typeof value === 'string' &&
    APPLICATION_STATUSES.includes(value as ApplicationStatus)
  )
}

function isLanguage(value: unknown): value is Language {
  return (
    typeof value === 'string' && LANGUAGE_OPTIONS.includes(value as Language)
  )
}

function isApplication(value: unknown): value is Application {
  if (!value || typeof value !== 'object') {
    return false
  }

  const application = value as Record<string, unknown>

  return (
    typeof application.id === 'number' &&
    typeof application.company === 'string' &&
    typeof application.role === 'string' &&
    typeof application.date === 'string' &&
    isApplicationStatus(application.status)
  )
}

function loadStoredApplications() {
  const savedApplications = localStorage.getItem(STORAGE_KEY)

  if (!savedApplications) {
    return []
  }

  try {
    const parsedApplications: unknown = JSON.parse(savedApplications)

    return Array.isArray(parsedApplications)
      ? parsedApplications.filter(isApplication)
      : []
  } catch {
    return []
  }
}

function loadStoredLanguage() {
  const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY)

  return isLanguage(savedLanguage) ? savedLanguage : 'en'
}

function App() {
  const [language, setLanguage] = useState<Language>(loadStoredLanguage)
  const [company, setCompany] = useState('')
  const [role, setRole] = useState('')
  const [date, setDate] = useState('')
  const [status, setStatus] = useState<ApplicationStatus>('Applied')
  const [applications, setApplications] =
    useState<Application[]>(loadStoredApplications)
  const [errorKey, setErrorKey] = useState<FormError>('')
  const [filterStatus, setFilterStatus] = useState<StatusFilter>('All')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortOption, setSortOption] = useState<SortOption>('Newest')
  const [editingId, setEditingId] = useState<number | null>(null)
  const text = TRANSLATIONS[language]

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(applications))
  }, [applications])

  useEffect(() => {
    document.documentElement.lang = HTML_LANG[language]
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language)
  }, [language])

  function resetForm() {
    setCompany('')
    setRole('')
    setDate('')
    setStatus('Applied')
    setEditingId(null)
  }

  function handleSubmitApplication() {
    if (!company.trim() || !role.trim() || !date.trim()) {
      setErrorKey('required')
      return
    }

    if (!isValidDateInput(date.trim())) {
      setErrorKey('date')
      return
    }

    setErrorKey('')

    if (editingId) {
      setApplications((currentApplications) =>
        currentApplications.map((app) =>
          app.id === editingId
            ? {
                ...app,
                company: company.trim(),
                role: role.trim(),
                date: date.trim(),
                status,
              }
            : app,
        ),
      )
      resetForm()
      return
    }

    const newApplication: Application = {
      id: Date.now(),
      company: company.trim(),
      role: role.trim(),
      date: date.trim(),
      status,
    }

    setApplications((currentApplications) => [newApplication, ...currentApplications])
    resetForm()
  }

  function handleEditApplication(app: Application) {
    setEditingId(app.id)
    setCompany(app.company)
    setRole(app.role)
    setDate(app.date)
    setStatus(app.status)
    setErrorKey('')
  }

  function handleDeleteApplication(idToDelete: number) {
    setApplications((currentApplications) =>
      currentApplications.filter((app) => app.id !== idToDelete),
    )

    if (editingId === idToDelete) {
      resetForm()
    }
  }

  const totalCount = applications.length
  const statusCounts = APPLICATION_STATUSES.map((applicationStatus) => ({
    label: applicationStatus,
    count: applications.filter((app) => app.status === applicationStatus).length,
  }))

  const filteredApplications = useMemo(() => {
    const normalizedSearchTerm = searchTerm.trim().toLowerCase()

    return applications
      .filter((app) => {
        const matchesStatus = filterStatus === 'All' || app.status === filterStatus
        const matchesSearch =
          !normalizedSearchTerm ||
          app.company.toLowerCase().includes(normalizedSearchTerm) ||
          app.role.toLowerCase().includes(normalizedSearchTerm)

        return matchesStatus && matchesSearch
      })
      .sort((a, b) => {
        if (sortOption === 'Company') {
          return a.company.localeCompare(b.company)
        }

        const dateDifference = getDateTime(a.date) - getDateTime(b.date)

        return sortOption === 'Oldest' ? dateDifference : -dateDifference
      })
  }, [applications, filterStatus, searchTerm, sortOption])

  return (
    <div className="app-container" lang={HTML_LANG[language]}>
      <header className="app-header">
        <div>
          <h1 className="app-title">{text.title}</h1>
          <p className="app-subtitle">{text.subtitle}</p>
        </div>

        <div className="language-control">
          <label htmlFor="language">{text.language}</label>
          <select
            id="language"
            value={language}
            onChange={(event) => setLanguage(event.target.value as Language)}
          >
            {LANGUAGE_OPTIONS.map((languageOption) => (
              <option key={languageOption} value={languageOption}>
                {text.languages[languageOption]}
              </option>
            ))}
          </select>
        </div>
      </header>

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
              onChange={(event) => setCompany(event.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="role">{text.labels.role}</label>
            <input
              id="role"
              placeholder={text.placeholders.role}
              value={role}
              onChange={(event) => setRole(event.target.value)}
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
              onChange={(event) => setDate(event.target.value)}
            />
            <span className="field-help">{text.help.date}</span>
          </div>

          <div className="form-group">
            <label htmlFor="status">{text.labels.status}</label>
            <select
              id="status"
              value={status}
              onChange={(event) => setStatus(event.target.value as ApplicationStatus)}
            >
              {APPLICATION_STATUSES.map((applicationStatus) => (
                <option key={applicationStatus} value={applicationStatus}>
                  {text.statuses[applicationStatus]}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="button-row">
          <button className="primary-button" onClick={handleSubmitApplication} type="button">
            {editingId ? text.saveChanges : text.addApplication}
          </button>
          {editingId && (
            <button className="secondary-button" onClick={resetForm} type="button">
              {text.cancel}
            </button>
          )}
        </div>
      </div>

      <div className="section">
        <div className="section-header">
          <h2>{text.applicationList}</h2>
          <span>{text.shown(filteredApplications.length)}</span>
        </div>

        <div className="toolbar-grid">
          <div className="form-group">
            <label htmlFor="search">{text.labels.search}</label>
            <input
              id="search"
              placeholder={text.placeholders.search}
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="filter-status">{text.labels.filterStatus}</label>
            <select
              id="filter-status"
              value={filterStatus}
              onChange={(event) => setFilterStatus(event.target.value as StatusFilter)}
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
            <label htmlFor="sort">{text.labels.sort}</label>
            <select
              id="sort"
              value={sortOption}
              onChange={(event) => setSortOption(event.target.value as SortOption)}
            >
              {(['Newest', 'Oldest', 'Company'] as SortOption[]).map((option) => (
                <option key={option} value={option}>
                  {text.sortOptions[option]}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="application-list">
          {filteredApplications.length > 0 ? (
            filteredApplications.map((app) => (
              <ApplicationItem
                key={app.id}
                app={app}
                labels={{
                  edit: text.edit,
                  delete: text.delete,
                  statuses: text.statuses,
                }}
                onDelete={handleDeleteApplication}
                onEdit={handleEditApplication}
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
    </div>
  )
}

export default App
