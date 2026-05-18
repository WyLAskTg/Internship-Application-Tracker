import { HTML_LANG, LANGUAGE_OPTIONS, type Translation } from '../i18n'
import type { Language } from '../types'

type AppHeaderProps = {
  language: Language
  text: Translation
  onLanguageChange: (language: Language) => void
}

function AppHeader({ language, text, onLanguageChange }: AppHeaderProps) {
  return (
    <header className="app-header" lang={HTML_LANG[language]}>
      <div>
        <h1 className="app-title">{text.title}</h1>
        <p className="app-subtitle">{text.subtitle}</p>
      </div>

      <div className="language-control">
        <label htmlFor="language">{text.language}</label>
        <select
          id="language"
          value={language}
          onChange={(event) => onLanguageChange(event.target.value as Language)}
        >
          {LANGUAGE_OPTIONS.map((languageOption) => (
            <option key={languageOption} value={languageOption}>
              {text.languages[languageOption]}
            </option>
          ))}
        </select>
      </div>
    </header>
  )
}

export default AppHeader
