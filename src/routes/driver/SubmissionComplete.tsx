import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Screen } from '../../components/Screen'
import { BigButton } from '../../components/BigButton'
import { useInspection } from '../../state/InspectionContext'

export function SubmissionComplete() {
  const navigate = useNavigate()
  const { reset } = useInspection()

  // Runs after SignatureStep has fully unmounted, so clearing the shared
  // context here can't trip its "no vehicle" guard mid-navigation.
  useEffect(() => {
    reset()
  }, [reset])

  return (
    <Screen>
      <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
        <h1 className="text-3xl font-bold text-pass">Inspection Submitted</h1>
        <p className="text-ink-dim">
          Your inspection has been saved. If you're offline, it will sync automatically once
          you're back online.
        </p>
      </div>
      <BigButton variant="accent" onClick={() => navigate('/')}>
        Start Next Inspection
      </BigButton>
    </Screen>
  )
}
