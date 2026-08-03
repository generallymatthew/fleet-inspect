import { useLayoutEffect, useRef, useState } from 'react'
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
  const padContainerRef = useRef<HTMLDivElement>(null)
  const [padSize, setPadSize] = useState<{ width: number; height: number } | null>(null)
  const [hasSignature, setHasSignature] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  // The signature canvas can't be sized with CSS percentages/h-full: its
  // parent's height comes from flexbox growth rather than an explicit
  // `height`, so percentage-height on the canvas (a replaced element) falls
  // back to its intrinsic aspect ratio instead of filling the box. Measuring
  // the plain (canvas-free) container here and passing pixel dimensions
  // straight to canvasProps sidesteps that entirely.
  useLayoutEffect(() => {
    function measure() {
      const el = padContainerRef.current
      if (!el) return
      setPadSize({ width: el.clientWidth, height: el.clientHeight })
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

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
        <div
          ref={padContainerRef}
          className="touch-target flex-[2] overflow-hidden rounded-xl border border-surface-border bg-white"
        >
          {padSize && (
            <SignatureCanvas
              ref={sigRef}
              onEnd={() => setHasSignature(true)}
              canvasProps={{ width: padSize.width, height: padSize.height, className: 'block' }}
            />
          )}
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
