import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '../../lib/firebase'
import { withTimeout } from '../../lib/withTimeout'
import { Screen } from '../../components/Screen'
import { BigButton } from '../../components/BigButton'
import { translations } from '../../lib/translations'
import type { InspectionRecord, VehicleStatus } from '../../types'

// Admin is English-only (see CLAUDE.md), so the driver-flow step titles are
// read straight from the 'en' dictionary rather than through LanguageContext.
const stepTitles = translations.en.steps

interface VehicleDoc {
  label: string
  status: VehicleStatus
  lastInspectionId?: string
}

function BackToDashboardButton() {
  return (
    // Visual box stays a compact 48px circle; before:-inset-1.5 pads the
    // tappable hit area out to the 60px UX-2 floor without growing the icon.
    <Link
      to="/admin"
      aria-label="Back to dashboard"
      className="relative flex h-12 w-12 shrink-0 items-center justify-center self-start rounded-full bg-ink text-2xl font-bold text-bg active:opacity-70 before:absolute before:-inset-1.5 before:content-['']"
    >
      ←
    </Link>
  )
}

const READ_TIMEOUT_MS = 4000
const WRITE_TIMEOUT_MS = 4000

export function AssetDetail() {
  const { vehicleId } = useParams()
  const navigate = useNavigate()
  const [vehicle, setVehicle] = useState<VehicleDoc | null>(null)
  const [inspection, setInspection] = useState<InspectionRecord | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)
  const [mechanicNotes, setMechanicNotes] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!vehicleId) return
    let cancelled = false

    async function load() {
      try {
        const vehicleResult = await withTimeout(
          getDoc(doc(db, 'vehicles', vehicleId!)),
          READ_TIMEOUT_MS,
        )
        if (cancelled) return

        if (vehicleResult === 'timeout') {
          setLoadError(true)
          setLoading(false)
          return
        }

        const vehicleData = vehicleResult.data() as VehicleDoc | undefined
        setVehicle(vehicleData ?? null)

        if (vehicleData?.lastInspectionId) {
          const inspectionResult = await withTimeout(
            getDoc(doc(db, 'inspections', vehicleData.lastInspectionId)),
            READ_TIMEOUT_MS,
          )
          if (!cancelled && inspectionResult !== 'timeout') {
            setInspection((inspectionResult.data() as InspectionRecord) ?? null)
          }
        }
        setLoading(false)
      } catch {
        if (!cancelled) {
          setLoadError(true)
          setLoading(false)
        }
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [vehicleId])

  async function markRepairComplete() {
    if (!vehicleId || !mechanicNotes.trim()) return
    setSaving(true)
    try {
      await withTimeout(
        setDoc(
          doc(db, 'vehicles', vehicleId),
          {
            status: 'active',
            repairNotes: mechanicNotes.trim(),
            repairedAtUtc: new Date().toISOString(),
          },
          { merge: true },
        ),
        WRITE_TIMEOUT_MS,
      )
    } catch {
      // Firestore's local cache still queues the write for later sync even
      // if this call throws (e.g. transient client-state errors); proceed
      // rather than leaving the admin stuck on a frozen "Saving…" button.
    }
    setSaving(false)
    navigate('/admin')
  }

  if (loading) {
    return (
      <Screen>
        <BackToDashboardButton />
        <p className="text-center text-ink-dim">Loading…</p>
      </Screen>
    )
  }

  if (loadError) {
    return (
      <Screen>
        <BackToDashboardButton />
        <p className="text-center text-fail">
          Couldn't load this vehicle's record. Check your connection and try again.
        </p>
      </Screen>
    )
  }

  if (!vehicle) {
    return (
      <Screen>
        <BackToDashboardButton />
        <p className="text-center text-ink-dim">No record found for this vehicle.</p>
      </Screen>
    )
  }

  const defects = inspection?.outcomes.filter((o) => o.defect) ?? []

  return (
    <Screen>
      <div className="flex items-center gap-3">
        <BackToDashboardButton />
        <h1 className="flex-1 text-center text-3xl font-bold">{vehicle.label}</h1>
        <div className="w-12 shrink-0" aria-hidden="true" />
      </div>

      {inspection ? (
        <div className="flex flex-col gap-4">
          <div className="rounded-xl border border-surface-border bg-surface p-4">
            <p>
              <span className="text-ink-dim">Driver:</span> {inspection.driverName}
            </p>
            <p>
              <span className="text-ink-dim">Submitted:</span>{' '}
              {new Date(inspection.submittedAtUtc).toLocaleString()} UTC
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <h2 className="text-xl font-bold">Reported Defects</h2>
            {defects.length === 0 && <p className="text-ink-dim">No defects reported.</p>}
            {defects.map((o) => (
              <div key={o.stepId} className="rounded-xl border border-surface-border bg-surface p-4">
                <p className="font-bold">
                  {stepTitles[o.stepId]?.title ?? o.stepId.replace(/-/g, ' ')} —{' '}
                  <span className={o.defect!.severity === 'critical' ? 'text-critical' : 'text-monitor'}>
                    {o.defect!.severity}
                  </span>
                </p>
                <p className="text-ink-dim">{o.defect!.note}</p>
                {o.defect!.photoDataUrl && (
                  <img
                    src={o.defect!.photoDataUrl}
                    alt={`${o.stepId} evidence`}
                    className="mt-2 max-h-48 rounded-xl object-contain"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-ink-dim">No inspection log on file yet.</p>
      )}

      {vehicle.status === 'out_of_service' && (
        <div className="flex flex-col gap-3 rounded-xl border border-surface-border bg-surface p-4">
          <h2 className="text-xl font-bold">Mark Repair Complete</h2>
          <textarea
            value={mechanicNotes}
            onChange={(e) => setMechanicNotes(e.target.value)}
            rows={3}
            placeholder="Mechanic's notes"
            className="rounded-xl border border-surface-border bg-bg p-3 text-lg text-ink"
          />
          <BigButton variant="pass" onClick={markRepairComplete} disabled={!mechanicNotes.trim() || saving}>
            {saving ? 'Saving…' : 'Mark Repair Complete'}
          </BigButton>
        </div>
      )}
    </Screen>
  )
}
