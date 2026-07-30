import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { Vehicle, StepOutcome } from '../types'

interface InspectionState {
  vehicle: Vehicle | null
  driverName: string
  odometer: number | null
  outcomes: StepOutcome[]
  signatureDataUrl: string
}

interface InspectionContextValue extends InspectionState {
  setVehicle: (vehicle: Vehicle) => void
  setDriverName: (name: string) => void
  setOdometer: (value: number) => void
  recordOutcome: (outcome: StepOutcome) => void
  setSignature: (dataUrl: string) => void
  reset: () => void
}

const initialState: InspectionState = {
  vehicle: null,
  driverName: '',
  odometer: null,
  outcomes: [],
  signatureDataUrl: '',
}

const InspectionContext = createContext<InspectionContextValue | null>(null)

export function InspectionProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<InspectionState>(initialState)

  const value = useMemo<InspectionContextValue>(
    () => ({
      ...state,
      setVehicle: (vehicle) => setState((s) => ({ ...s, vehicle })),
      setDriverName: (driverName) => setState((s) => ({ ...s, driverName })),
      setOdometer: (odometer) => setState((s) => ({ ...s, odometer })),
      recordOutcome: (outcome) =>
        setState((s) => ({
          ...s,
          outcomes: [...s.outcomes.filter((o) => o.stepId !== outcome.stepId), outcome],
        })),
      setSignature: (signatureDataUrl) => setState((s) => ({ ...s, signatureDataUrl })),
      reset: () => setState(initialState),
    }),
    [state],
  )

  return <InspectionContext.Provider value={value}>{children}</InspectionContext.Provider>
}

export function useInspection() {
  const ctx = useContext(InspectionContext)
  if (!ctx) throw new Error('useInspection must be used within InspectionProvider')
  return ctx
}
