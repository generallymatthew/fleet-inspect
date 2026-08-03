import { useNavigate } from 'react-router-dom'
import { Screen } from '../../components/Screen'
import { BigButton } from '../../components/BigButton'
import { useLanguage } from '../../state/LanguageContext'

export function Welcome() {
  const navigate = useNavigate()
  const { language, setLanguage, t } = useLanguage()

  return (
    <Screen>
      <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
        <h1 className="text-4xl font-bold">{t.welcome.title}</h1>
        <p className="text-ink-dim">{t.welcome.subtitle}</p>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-center text-lg font-semibold text-ink-dim">
          {t.welcome.languageLabel}
        </span>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setLanguage('en')}
            aria-pressed={language === 'en'}
            className={`touch-target flex-1 rounded-xl border text-xl font-bold active:opacity-80 ${
              language === 'en'
                ? 'border-ink bg-ink text-bg'
                : 'border-surface-border bg-surface text-ink'
            }`}
          >
            English
          </button>
          <button
            type="button"
            onClick={() => setLanguage('es')}
            aria-pressed={language === 'es'}
            className={`touch-target flex-1 rounded-xl border text-xl font-bold active:opacity-80 ${
              language === 'es'
                ? 'border-ink bg-ink text-bg'
                : 'border-surface-border bg-surface text-ink'
            }`}
          >
            Español
          </button>
        </div>
      </div>

      <BigButton variant="accent" onClick={() => navigate('/vehicle')}>
        {t.welcome.startButton}
      </BigButton>
    </Screen>
  )
}
