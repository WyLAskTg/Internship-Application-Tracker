import type { ApplicationStatus, Language, SortOption } from './types'

export const LANGUAGE_OPTIONS: Language[] = ['en', 'zh', 'ja', 'fr']

export const HTML_LANG: Record<Language, string> = {
  en: 'en',
  zh: 'zh-CN',
  ja: 'ja',
  fr: 'fr',
}

export type FormError = 'required' | 'date' | 'deadline' | ''

export type Notice = {
  type: 'success' | 'error'
  text: string
}

export type Translation = {
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
  dataTools: string
  exportCsv: string
  importCsv: string
  clearAll: string
  shown: (count: number) => string
  importSuccess: (count: number, skipped: number) => string
  noApplicationsTitle: string
  noApplicationsBody: string
  edit: string
  delete: string
  confirmClear: string
  dataCleared: string
  noExportData: string
  importFailed: string
  importEmpty: string
  errors: Record<Exclude<FormError, ''>, string>
  labels: {
    company: string
    role: string
    date: string
    deadline: string
    notes: string
    status: string
    search: string
    filterStatus: string
    sort: string
  }
  placeholders: {
    company: string
    role: string
    date: string
    deadline: string
    notes: string
    search: string
  }
  help: {
    date: string
    deadline: string
    import: string
  }
  all: string
  statuses: Record<ApplicationStatus, string>
  sortOptions: Record<SortOption, string>
}

export const TRANSLATIONS: Record<Language, Translation> = {
  en: {
    language: 'Language',
    languages: {
      en: 'English',
      zh: 'Chinese',
      ja: 'Japanese',
      fr: 'French',
    },
    title: 'Internship Application Tracker',
    subtitle: 'Track applications, interviews, outcomes, and follow-ups.',
    total: 'Total',
    addApplication: 'Add Application',
    editApplication: 'Edit Application',
    saveChanges: 'Save Changes',
    cancel: 'Cancel',
    applicationList: 'Application List',
    dataTools: 'Data Tools',
    exportCsv: 'Export CSV',
    importCsv: 'Import CSV',
    clearAll: 'Clear All',
    shown: (count) => `${count} shown`,
    importSuccess: (count, skipped) =>
      `Imported ${count} application${count === 1 ? '' : 's'}${
        skipped ? `, skipped ${skipped}` : ''
      }.`,
    noApplicationsTitle: 'No applications found',
    noApplicationsBody: 'Add a new application or adjust your filters.',
    edit: 'Edit',
    delete: 'Delete',
    confirmClear: 'Clear all saved applications? This cannot be undone.',
    dataCleared: 'All applications were cleared.',
    noExportData: 'There is no application data to export.',
    importFailed: 'Could not import this CSV file.',
    importEmpty: 'No valid applications were found in this CSV file.',
    errors: {
      required: 'Please fill in all required fields.',
      date: 'Please use the date format YYYY-MM-DD.',
      deadline: 'Please use YYYY-MM-DD for the deadline, or leave it blank.',
    },
    labels: {
      company: 'Company',
      role: 'Role',
      date: 'Date Applied',
      deadline: 'Deadline / Next Step',
      notes: 'Notes',
      status: 'Status',
      search: 'Search',
      filterStatus: 'Filter by Status',
      sort: 'Sort',
    },
    placeholders: {
      company: 'Enter company name',
      role: 'Enter role',
      date: 'YYYY-MM-DD',
      deadline: 'YYYY-MM-DD',
      notes: 'Add interview details, recruiter notes, links, or next steps',
      search: 'Company, role, or notes',
    },
    help: {
      date: 'Use YYYY-MM-DD.',
      deadline: 'Optional. Use YYYY-MM-DD.',
      import: 'CSV import accepts company, role, date, status, deadline, and notes columns.',
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
      Deadline: 'Deadline',
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
    subtitle: '记录申请、面试、结果和后续事项。',
    total: '总计',
    addApplication: '添加申请',
    editApplication: '编辑申请',
    saveChanges: '保存修改',
    cancel: '取消',
    applicationList: '申请列表',
    dataTools: '数据工具',
    exportCsv: '导出 CSV',
    importCsv: '导入 CSV',
    clearAll: '清空全部',
    shown: (count) => `显示 ${count} 条`,
    importSuccess: (count, skipped) =>
      `已导入 ${count} 条申请${skipped ? `，跳过 ${skipped} 条` : ''}。`,
    noApplicationsTitle: '未找到申请',
    noApplicationsBody: '添加新申请或调整筛选条件。',
    edit: '编辑',
    delete: '删除',
    confirmClear: '确定要清空所有申请吗？此操作无法撤销。',
    dataCleared: '所有申请已清空。',
    noExportData: '没有可导出的申请数据。',
    importFailed: '无法导入这个 CSV 文件。',
    importEmpty: '这个 CSV 文件中没有有效申请。',
    errors: {
      required: '请填写所有必填项。',
      date: '请使用 YYYY-MM-DD 日期格式。',
      deadline: '截止日期请使用 YYYY-MM-DD，或留空。',
    },
    labels: {
      company: '公司',
      role: '岗位',
      date: '申请日期',
      deadline: '截止 / 下一步日期',
      notes: '备注',
      status: '状态',
      search: '搜索',
      filterStatus: '按状态筛选',
      sort: '排序',
    },
    placeholders: {
      company: '输入公司名称',
      role: '输入岗位',
      date: 'YYYY-MM-DD',
      deadline: 'YYYY-MM-DD',
      notes: '记录面试细节、HR 信息、链接或下一步',
      search: '公司、岗位或备注',
    },
    help: {
      date: '请使用 YYYY-MM-DD。',
      deadline: '可选，请使用 YYYY-MM-DD。',
      import: 'CSV 导入支持 company、role、date、status、deadline、notes 列。',
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
      Deadline: '截止日期',
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
    subtitle: '応募、面接、結果、フォローアップを記録します。',
    total: '合計',
    addApplication: '応募を追加',
    editApplication: '応募を編集',
    saveChanges: '変更を保存',
    cancel: 'キャンセル',
    applicationList: '応募リスト',
    dataTools: 'データツール',
    exportCsv: 'CSV を出力',
    importCsv: 'CSV を取り込む',
    clearAll: 'すべて削除',
    shown: (count) => `${count} 件表示`,
    importSuccess: (count, skipped) =>
      `${count} 件の応募を取り込みました${skipped ? `。${skipped} 件をスキップしました` : ''}。`,
    noApplicationsTitle: '応募が見つかりません',
    noApplicationsBody: '新しい応募を追加するか、フィルターを調整してください。',
    edit: '編集',
    delete: '削除',
    confirmClear: '保存済みの応募をすべて削除しますか？この操作は元に戻せません。',
    dataCleared: 'すべての応募を削除しました。',
    noExportData: '出力できる応募データがありません。',
    importFailed: 'この CSV ファイルを取り込めませんでした。',
    importEmpty: 'この CSV ファイルに有効な応募がありません。',
    errors: {
      required: '必須項目をすべて入力してください。',
      date: '日付は YYYY-MM-DD 形式で入力してください。',
      deadline: '期限は YYYY-MM-DD 形式で入力するか、空欄にしてください。',
    },
    labels: {
      company: '会社',
      role: '職種',
      date: '応募日',
      deadline: '期限 / 次の予定日',
      notes: 'メモ',
      status: 'ステータス',
      search: '検索',
      filterStatus: 'ステータスで絞り込み',
      sort: '並び替え',
    },
    placeholders: {
      company: '会社名を入力',
      role: '職種を入力',
      date: 'YYYY-MM-DD',
      deadline: 'YYYY-MM-DD',
      notes: '面接内容、担当者、リンク、次の対応を記録',
      search: '会社、職種、メモ',
    },
    help: {
      date: 'YYYY-MM-DD を使用してください。',
      deadline: '任意。YYYY-MM-DD を使用してください。',
      import: 'CSV 取り込みは company、role、date、status、deadline、notes 列に対応しています。',
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
      Deadline: '期限',
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
    subtitle: 'Suivez vos candidatures, entretiens, résultats et relances.',
    total: 'Total',
    addApplication: 'Ajouter une candidature',
    editApplication: 'Modifier la candidature',
    saveChanges: 'Enregistrer',
    cancel: 'Annuler',
    applicationList: 'Liste des candidatures',
    dataTools: 'Outils de données',
    exportCsv: 'Exporter CSV',
    importCsv: 'Importer CSV',
    clearAll: 'Tout effacer',
    shown: (count) => `${count} affichée${count > 1 ? 's' : ''}`,
    importSuccess: (count, skipped) =>
      `${count} candidature${count > 1 ? 's' : ''} importée${count > 1 ? 's' : ''}${
        skipped ? `, ${skipped} ignorée${skipped > 1 ? 's' : ''}` : ''
      }.`,
    noApplicationsTitle: 'Aucune candidature trouvée',
    noApplicationsBody: 'Ajoutez une candidature ou ajustez vos filtres.',
    edit: 'Modifier',
    delete: 'Supprimer',
    confirmClear: 'Effacer toutes les candidatures enregistrées ? Cette action est définitive.',
    dataCleared: 'Toutes les candidatures ont été effacées.',
    noExportData: 'Aucune candidature à exporter.',
    importFailed: 'Impossible d’importer ce fichier CSV.',
    importEmpty: 'Aucune candidature valide trouvée dans ce CSV.',
    errors: {
      required: 'Veuillez remplir tous les champs requis.',
      date: 'Utilisez le format de date YYYY-MM-DD.',
      deadline: 'Utilisez YYYY-MM-DD pour l’échéance, ou laissez le champ vide.',
    },
    labels: {
      company: 'Entreprise',
      role: 'Poste',
      date: 'Date de candidature',
      deadline: 'Échéance / prochaine étape',
      notes: 'Notes',
      status: 'Statut',
      search: 'Recherche',
      filterStatus: 'Filtrer par statut',
      sort: 'Trier',
    },
    placeholders: {
      company: "Saisir le nom de l’entreprise",
      role: 'Saisir le poste',
      date: 'YYYY-MM-DD',
      deadline: 'YYYY-MM-DD',
      notes: 'Ajouter des détails d’entretien, contacts, liens ou prochaines étapes',
      search: 'Entreprise, poste ou notes',
    },
    help: {
      date: 'Utilisez YYYY-MM-DD.',
      deadline: 'Optionnel. Utilisez YYYY-MM-DD.',
      import: 'L’import CSV accepte les colonnes company, role, date, status, deadline et notes.',
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
      Deadline: 'Échéance',
    },
  },
}
