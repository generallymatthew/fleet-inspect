import { useNavigate } from 'react-router-dom'
import { Screen } from '../../components/Screen'
import { BigButton } from '../../components/BigButton'
import { Illustration } from '../../components/Illustration'
import { useLanguage } from '../../state/LanguageContext'

export function Welcome() {
  const navigate = useNavigate()
  const { language, setLanguage, t } = useLanguage()

  return (
    <Screen>
      <div className="flex flex-col items-center gap-4 text-center">
        <h1 className="text-4xl font-bold">{t.welcome.title}</h1>
        <p className="text-ink-dim">{t.welcome.subtitle}</p>

        <div className="flex w-full flex-col gap-2 pt-2">
          <span className="text-center text-lg font-semibold text-ink-dim">
            {t.welcome.languageLabel}
          </span>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setLanguage('en')}
              aria-pressed={language === 'en'}
              className={`touch-target flex-1 rounded-full border px-4 text-xl font-bold active:opacity-80 ${
                language === 'en'
                  ? 'border-cta bg-cta text-cta-ink'
                  : 'border-surface-border bg-surface text-ink'
              }`}
            >
              English
            </button>
            <button
              type="button"
              onClick={() => setLanguage('es')}
              aria-pressed={language === 'es'}
              className={`touch-target flex-1 rounded-full border px-4 text-xl font-bold active:opacity-80 ${
                language === 'es'
                  ? 'border-cta bg-cta text-cta-ink'
                  : 'border-surface-border bg-surface text-ink'
              }`}
            >
              Español
            </button>
          </div>
        </div>
      </div>

      <Illustration id="welcome" />

      <BigButton variant="accent" onClick={() => navigate('/vehicle')} className="mt-auto">
        {t.welcome.startButton}
      </BigButton>
    </Screen>
  )
}
