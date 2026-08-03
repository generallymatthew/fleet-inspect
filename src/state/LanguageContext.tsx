import { createContext, useContext, useState, type ReactNode } from 'react'
import { translations, type Language } from '../lib/translations'

const STORAGE_KEY = 'fleet-inspect-language'

interface LanguageContextValue {
  language: Language
  setLanguage: (language: Language) => void
  t: (typeof translations)['en']
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

function getInitialLanguage(): Language {
  return localStorage.getItem(STORAGE_KEY) === 'es' ? 'es' : 'en'
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(getInitialLanguage)

  function setLanguage(next: Language) {
    setLanguageState(next)
    localStorage.setItem(STORAGE_KEY, next)
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: translations[language] }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider')
  return ctx
}
