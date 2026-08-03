import { useEffect, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { Screen } from '../../components/Screen'
import { BigButton } from '../../components/BigButton'
import { StepCounter } from '../../components/StepCounter'
import { inspectionSteps } from '../../data/inspectionSteps'
import { useInspection } from '../../state/InspectionContext'
import { useLanguage } from '../../state/LanguageContext'
import { compressImage } from '../../lib/compressImage'
import type { Severity } from '../../types'

export function InspectionStepScreen() {
  const navigate = useNavigate()
  const { stepIndex: stepIndexParam } = useParams()
  const { vehicle, driverName, outcomes, recordOutcome } = useInspection()
  const { t } = useLanguage()

  const steps = inspectionSteps.filter((s) => s.id !== 'hitch-trailer' || vehicle?.hasTrailer)
  const stepIndex = Number(stepIndexParam)

  const [showDefectPanel, setShowDefectPanel] = useState(false)
  const [note, setNote] = useState('')
  const [severity, setSeverity] = useState<Severity | null>(null)
  const [photoDataUrl, setPhotoDataUrl] = useState('')
  const [compressingPhoto, setCompressingPhoto] = useState(false)

  const step = !Number.isNaN(stepIndex) ? steps[stepIndex] : undefined

  // Route param changes don't remount this component, so re-sync the form to
  // whatever was already recorded for the step being viewed — this is what
  // makes revisiting an answered step via Back/Forward show its answer
  // instead of leaking the previous step's in-progress form state.
  useEffect(() => {
    if (!step) return
    const existing = outcomes.find((o) => o.stepId === step.id)
    if (existing?.result === 'fail' && existing.defect) {
      setShowDefectPanel(true)
      setNote(existing.defect.note)
      setSeverity(existing.defect.severity)
      setPhotoDataUrl(existing.defect.photoDataUrl)
    } else {
      setShowDefectPanel(false)
      setNote('')
      setSeverity(null)
      setPhotoDataUrl('')
    }
  }, [step, outcomes])

  if (!vehicle || !driverName) {
    return <Navigate to="/vehicle" replace />
  }
  if (!step) {
    return <Navigate to="/inspect/0" replace />
  }
  const currentStep = step
  const stepText = t.steps[currentStep.id]

  const isLastStep = stepIndex === steps.length - 1
  const answeredStepIds = new Set(outcomes.map((o) => o.stepId))
  const canGoForward = isLastStep
    ? answeredStepIds.has(currentStep.id)
    : answeredStepIds.has(steps[stepIndex + 1].id)

  function goBack() {
    if (stepIndex === 0) {
      navigate('/odometer')
    } else {
      navigate(`/inspect/${stepIndex - 1}`)
    }
  }

  function goForward() {
    if (!canGoForward) return
    if (isLastStep) {
      navigate('/signature')
    } else {
      navigate(`/inspect/${stepIndex + 1}`)
    }
  }

  function goNext() {
    if (isLastStep) {
      navigate('/signature')
    } else {
      navigate(`/inspect/${stepIndex + 1}`)
    }
  }

  function handlePass() {
    recordOutcome({ stepId: currentStep.id, result: 'pass' })
    goNext()
  }

  function handleFailTap() {
    setShowDefectPanel(true)
  }

  async function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setCompressingPhoto(true)
    try {
      setPhotoDataUrl(await compressImage(file))
    } finally {
      setCompressingPhoto(false)
    }
  }

  function submitDefect() {
    if (!photoDataUrl || !note.trim() || !severity) return
    recordOutcome({
      stepId: currentStep.id,
      result: 'fail',
      defect: { stepId: currentStep.id, note: note.trim(), severity, photoDataUrl },
    })
    goNext()
  }

  const defectComplete = Boolean(photoDataUrl && note.trim() && severity && !compressingPhoto)

  return (
    <Screen>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={goBack}
          className="touch-target rounded-xl border border-surface-border bg-surface px-4 text-lg font-bold text-ink active:opacity-70"
        >
          {t.inspectionStep.back}
        </button>
        <div className="flex-1">
          <StepCounter label={t.stepCounter(stepIndex + 1, steps.length)} />
        </div>
        <button
          type="button"
          onClick={goForward}
          disabled={!canGoForward}
          className="touch-target rounded-xl border border-surface-border bg-surface px-4 text-lg font-bold text-ink active:opacity-70 disabled:opacity-30"
        >
          {t.inspectionStep.forward}
        </button>
      </div>
      <div className="flex flex-col gap-1 text-center">
        <h1 className="text-3xl font-bold">{stepText.title}</h1>
        <p className="text-ink-dim">{stepText.description}</p>
      </div>

      {!showDefectPanel && (
        <div className="flex flex-1 flex-col gap-4">
          <BigButton variant="pass" onClick={handlePass}>
            {t.inspectionStep.passButton}
          </BigButton>
          <BigButton variant="fail" onClick={handleFailTap}>
            {t.inspectionStep.failButton}
          </BigButton>
        </div>
      )}

      {showDefectPanel && (
        <div className="flex flex-1 flex-col gap-4 rounded-xl border border-surface-border bg-surface p-4">
          <div className="flex flex-1 flex-col gap-2">
            <label htmlFor="defect-note" className="text-lg font-semibold">
              {t.inspectionStep.defectNoteLabel}
            </label>
            {/* Standard input triggers the device's native voice-to-text keyboard mic. */}
            <textarea
              id="defect-note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="flex-1 resize-none rounded-xl border border-surface-border bg-bg p-3 text-lg text-ink"
              placeholder={t.inspectionStep.defectNotePlaceholder}
            />
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-lg font-semibold">{t.inspectionStep.photoLabel}</span>
            <label className="touch-target flex cursor-pointer items-center justify-center rounded-xl border border-surface-border bg-bg text-lg font-bold">
              {compressingPhoto
                ? t.inspectionStep.photoProcessing
                : photoDataUrl
                  ? t.inspectionStep.photoRetake
                  : t.inspectionStep.photoTake}
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
            <span className="text-lg font-semibold">{t.inspectionStep.severityLabel}</span>
            <div className="flex flex-1 flex-col gap-3">
              <button
                type="button"
                onClick={() => setSeverity('minor')}
                className={`touch-target flex-1 rounded-xl border text-lg font-bold ${
                  severity === 'minor'
                    ? 'border-monitor bg-monitor text-monitor-ink'
                    : 'border-surface-border bg-bg text-ink'
                }`}
              >
                {t.inspectionStep.severityMinor}
              </button>
              <button
                type="button"
                onClick={() => setSeverity('critical')}
                className={`touch-target flex-1 rounded-xl border text-lg font-bold ${
                  severity === 'critical'
                    ? 'border-critical bg-critical text-critical-ink'
                    : 'border-surface-border bg-bg text-ink'
                }`}
              >
                {t.inspectionStep.severityCritical}
              </button>
            </div>
          </div>

          <BigButton variant="accent" onClick={submitDefect} disabled={!defectComplete}>
            {t.inspectionStep.continueButton}
          </BigButton>
        </div>
      )}
    </Screen>
  )
}
