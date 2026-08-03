import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Screen } from '../../components/Screen'
import { BigButton } from '../../components/BigButton'
import { useInspection } from '../../state/InspectionContext'
import { useLanguage } from '../../state/LanguageContext'

export function SubmissionComplete() {
  const navigate = useNavigate()
  const { reset } = useInspection()
  const { t } = useLanguage()

  // Runs after SignatureStep has fully unmounted, so clearing the shared
  // context here can't trip its "no vehicle" guard mid-navigation.
  useEffect(() => {
    reset()
  }, [reset])

  return (
    <Screen>
      <div className="flex flex-col items-center gap-4 text-center">
        <h1 className="text-3xl font-bold text-pass">{t.complete.title}</h1>
        <p className="text-ink-dim">{t.complete.body}</p>
      </div>
      <div className="mt-auto flex flex-col items-center gap-4">
        <BigButton variant="accent" onClick={() => navigate('/vehicle')}>
          {t.complete.nextButton}
        </BigButton>
        <Link to="/admin" className="text-ink-dim underline underline-offset-2">
          {t.complete.dashboardLink}
        </Link>
      </div>
    </Screen>
  )
}
