import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { db } from './firebase'
import { withTimeout } from './withTimeout'
import type { InspectionRecord } from '../types'

const GEOLOCATION_TIMEOUT_MS = 5000
// Firestore's local cache normally resolves writes near-instantly regardless
// of connectivity. This bounds worst-case wait so a driver in the field is
// never stuck on a frozen submit screen if the write layer stalls (e.g. first
// IndexedDB setup, misconfigured project) — the write itself keeps running
// and still lands once it settles.
const WRITE_TIMEOUT_MS = 4000

function getGeolocation(): Promise<{ lat: number; lng: number } | null> {
  return new Promise((resolve) => {
    if (!('geolocation' in navigator)) return resolve(null)
    let settled = false
    const settle = (value: { lat: number; lng: number } | null) => {
      if (settled) return
      settled = true
      resolve(value)
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => settle({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => settle(null),
      { timeout: GEOLOCATION_TIMEOUT_MS },
    )
    setTimeout(() => settle(null), GEOLOCATION_TIMEOUT_MS + 500)
  })
}

export async function submitInspection(
  input: Omit<InspectionRecord, 'id' | 'submittedAtUtc' | 'geolocation' | 'hasCriticalFail'>,
) {
  const hasCriticalFail = input.outcomes.some((o) => o.defect?.severity === 'critical')
  const geolocation = await getGeolocation()

  const record: InspectionRecord = {
    ...input,
    id: `${input.vehicleId}_${Date.now()}`,
    submittedAtUtc: new Date().toISOString(),
    geolocation,
    hasCriticalFail,
  }

  // Firestore's persistent local cache (configured in ./firebase) queues these
  // writes in IndexedDB automatically when offline and syncs on reconnect —
  // this covers FR-4.4 without any custom queueing logic.
  const write = (async () => {
    await setDoc(doc(db, 'inspections', record.id), record)
    await setDoc(
      doc(db, 'vehicles', record.vehicleId),
      {
        label: record.vehicleLabel,
        status: hasCriticalFail ? 'out_of_service' : 'active',
        lastInspectionId: record.id,
        lastInspectedAtUtc: record.submittedAtUtc,
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    )
  })()

  const result = await withTimeout(write, WRITE_TIMEOUT_MS)
  if (result === 'timeout') {
    write.catch(() => {
      // Write continues in the background; Firestore's local cache will
      // retry and sync once the connection/config allows it.
    })
  }

  return record
}
