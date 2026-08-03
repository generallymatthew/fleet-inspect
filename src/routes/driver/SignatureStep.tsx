import { useRef, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import SignatureCanvas from 'react-signature-canvas'
import { Screen } from '../../components/Screen'
import { BigButton } from '../../components/BigButton'
import { useInspection } from '../../state/InspectionContext'
import { useLanguage } from '../../state/LanguageContext'
import { submitInspection } from '../../lib/submitInspection'

export function SignatureStep() {
  const navigate = useNavigate()
  const { vehicle, driverName, odometer, outcomes } = useInspection()
  const { t } = useLanguage()
  const sigRef = useRef<SignatureCanvas>(null)
  const [hasSignature, setHasSignature] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  if (!vehicle || !driverName || odometer === null) {
    return <Navigate to="/vehicle" replace />
  }

  function clear() {
    sigRef.current?.clear()
    setHasSignature(false)
  }

  async function submit() {
    if (!sigRef.current || sigRef.current.isEmpty()) return
    setSubmitting(true)
    setError('')
    try {
      const signatureDataUrl = sigRef.current.toDataURL('image/png')
      await submitInspection({
        vehicleId: vehicle!.id,
        vehicleLabel: vehicle!.label,
        driverName,
        odometer: odometer!,
        outcomes,
        signatureDataUrl,
      })
      // Context reset happens in SubmissionComplete's mount effect, not here:
      // clearing it in this same tick would re-render this still-mounted
      // route with an empty vehicle, tripping the guard above and bouncing
      // back to "/vehicle" before the /complete navigation takes effect.
      navigate('/complete')
    } catch {
      setError(t.signature.submitError)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Screen>
      <h1 className="text-center text-3xl font-bold">{t.signature.title}</h1>
      <p className="text-center text-ink-dim">{t.signature.attestation(driverName)}</p>

      <div className="flex flex-1 flex-col gap-6">
        <div className="touch-target flex-[2] rounded-xl border border-surface-border bg-white">
          <SignatureCanvas
            ref={sigRef}
            onEnd={() => setHasSignature(true)}
            canvasProps={{ className: 'w-full h-full rounded-xl' }}
          />
        </div>

        <BigButton variant="neutral" onClick={clear}>
          {t.signature.clearButton}
        </BigButton>

        {error && <p className="text-center text-fail">{error}</p>}

        <BigButton
          variant="accent"
          onClick={submit}
          disabled={!hasSignature || submitting}
        >
          {submitting ? t.signature.submitting : t.signature.submitButton}
        </BigButton>
      </div>
    </Screen>
  )
}
