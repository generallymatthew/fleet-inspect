import { useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { Screen } from '../../components/Screen'
import { BigButton } from '../../components/BigButton'
import { StepCounter } from '../../components/StepCounter'
import { inspectionSteps } from '../../data/inspectionSteps'
import { useInspection } from '../../state/InspectionContext'
import type { Severity } from '../../types'

export function InspectionStepScreen() {
  const navigate = useNavigate()
  const { stepIndex: stepIndexParam } = useParams()
  const { vehicle, driverName, recordOutcome } = useInspection()

  const steps = inspectionSteps.filter((s) => s.id !== 'hitch-trailer' || vehicle?.hasTrailer)
  const stepIndex = Number(stepIndexParam)

  const [showDefectPanel, setShowDefectPanel] = useState(false)
  const [note, setNote] = useState('')
  const [severity, setSeverity] = useState<Severity | null>(null)
  const [photoDataUrl, setPhotoDataUrl] = useState('')

  if (!vehicle || !driverName) {
    return <Navigate to="/" replace />
  }
  if (Number.isNaN(stepIndex) || stepIndex < 0 || stepIndex >= steps.length) {
    return <Navigate to="/inspect/0" replace />
  }

  const step = steps[stepIndex]
  const isLastStep = stepIndex === steps.length - 1

  function goNext() {
    if (isLastStep) {
      navigate('/signature')
    } else {
      navigate(`/inspect/${stepIndex + 1}`)
    }
  }

  function resetDefectForm() {
    setShowDefectPanel(false)
    setNote('')
    setSeverity(null)
    setPhotoDataUrl('')
  }

  function handlePass() {
    recordOutcome({ stepId: step.id, result: 'pass' })
    resetDefectForm()
    goNext()
  }

  function handleFailTap() {
    setShowDefectPanel(true)
  }

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setPhotoDataUrl(reader.result as string)
    reader.readAsDataURL(file)
  }

  function submitDefect() {
    if (!photoDataUrl || !note.trim() || !severity) return
    recordOutcome({
      stepId: step.id,
      result: 'fail',
      defect: { stepId: step.id, note: note.trim(), severity, photoDataUrl },
    })
    resetDefectForm()
    goNext()
  }

  const defectComplete = Boolean(photoDataUrl && note.trim() && severity)

  return (
    <Screen>
      <StepCounter current={stepIndex + 1} total={steps.length} />
      <div className="flex flex-col gap-1 text-center">
        <h1 className="text-3xl font-bold">{step.title}</h1>
        <p className="text-ink-dim">{step.description}</p>
      </div>

      {!showDefectPanel && (
        <div className="flex flex-col gap-4">
          <BigButton variant="pass" onClick={handlePass}>
            PASS
          </BigButton>
          <BigButton variant="fail" onClick={handleFailTap}>
            FAIL
          </BigButton>
        </div>
      )}

      {showDefectPanel && (
        <div className="flex flex-col gap-4 rounded-xl border border-surface-border bg-surface p-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="defect-note" className="text-lg font-semibold">
              Describe the issue
            </label>
            {/* Standard input triggers the device's native voice-to-text keyboard mic. */}
            <textarea
              id="defect-note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              className="rounded-xl border border-surface-border bg-bg p-3 text-lg text-ink"
              placeholder="Tap the mic on your keyboard to dictate, or type here"
            />
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-lg font-semibold">Photo evidence (required)</span>
            <label className="touch-target flex cursor-pointer items-center justify-center rounded-xl border border-surface-border bg-bg text-lg font-bold">
              {photoDataUrl ? 'Photo captured — tap to retake' : 'Take Photo'}
              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handlePhotoChange}
                className="hidden"
              />
            </label>
            {photoDataUrl && (
              <img src={photoDataUrl} alt="Defect evidence" className="max-h-48 rounded-xl object-contain" />
            )}
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-lg font-semibold">Severity</span>
            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={() => setSeverity('minor')}
                className={`touch-target rounded-xl border text-lg font-bold ${
                  severity === 'minor'
                    ? 'border-monitor bg-monitor text-monitor-ink'
                    : 'border-surface-border bg-bg text-ink'
                }`}
              >
                Minor (Monitor)
              </button>
              <button
                type="button"
                onClick={() => setSeverity('critical')}
                className={`touch-target rounded-xl border text-lg font-bold ${
                  severity === 'critical'
                    ? 'border-critical bg-critical text-critical-ink'
                    : 'border-surface-border bg-bg text-ink'
                }`}
              >
                Critical (Out of Service)
              </button>
            </div>
          </div>

          <BigButton variant="accent" onClick={submitDefect} disabled={!defectComplete}>
            Continue
          </BigButton>
        </div>
      )}
    </Screen>
  )
}
