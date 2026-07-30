export type Severity = 'minor' | 'critical'

export type CheckResult = 'pass' | 'fail'

export interface Vehicle {
  id: string
  label: string
  hasTrailer: boolean
}

export interface InspectionStepDef {
  id: string
  title: string
  description: string
}

export interface DefectEntry {
  stepId: string
  note: string
  severity: Severity
  photoDataUrl: string
}

export interface StepOutcome {
  stepId: string
  result: CheckResult
  defect?: DefectEntry
}

export type VehicleStatus = 'active' | 'out_of_service'

export interface InspectionRecord {
  id: string
  vehicleId: string
  vehicleLabel: string
  driverName: string
  odometer: number
  outcomes: StepOutcome[]
  signatureDataUrl: string
  submittedAtUtc: string
  geolocation: { lat: number; lng: number } | null
  hasCriticalFail: boolean
}
