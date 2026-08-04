import { useEffect, useState } from 'react'
import { collection, onSnapshot } from 'firebase/firestore'
import { db } from './firebase'
import type { VehicleStatus } from '../types'

export interface VehicleStatusDoc {
  status: VehicleStatus
  hasOpenDefects?: boolean
  lastInspectionId?: string
  lastInspectedAtUtc?: string
}

export function useVehicleStatuses() {
  const [statuses, setStatuses] = useState<Record<string, VehicleStatusDoc>>({})

  useEffect(() => {
    // onSnapshot gives near-instant UI updates the moment a critical fail
    // flips a vehicle's status (FR-4.3), including from Firestore's local
    // cache while offline.
    return onSnapshot(collection(db, 'vehicles'), (snapshot) => {
      const next: Record<string, VehicleStatusDoc> = {}
      snapshot.forEach((docSnap) => {
        next[docSnap.id] = docSnap.data() as VehicleStatusDoc
      })
      setStatuses(next)
    })
  }, [])

  return statuses
}
