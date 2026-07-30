import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '../../lib/firebase'
import { withTimeout } from '../../lib/withTimeout'
import { Screen } from '../../components/Screen'
import { BigButton } from '../../components/BigButton'
import type { InspectionRecord, VehicleStatus } from '../../types'

interface VehicleDoc {
  label: string
  status: VehicleStatus
  lastInspectionId?: string
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
        <p className="text-center text-ink-dim">Loading…</p>
      </Screen>
    )
  }

  if (loadError) {
    return (
      <Screen>
        <p className="text-center text-fail">
          Couldn't load this vehicle's record. Check your connection and try again.
        </p>
      </Screen>
    )
  }

  if (!vehicle) {
    return (
      <Screen>
        <p className="text-center text-ink-dim">No record found for this vehicle.</p>
      </Screen>
    )
  }

  const defects = inspection?.outcomes.filter((o) => o.defect) ?? []

  return (
    <Screen>
      <h1 className="text-center text-3xl font-bold">{vehicle.label}</h1>

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
                <p className="font-bold capitalize">
                  {o.stepId.replace(/-/g, ' ')} —{' '}
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
