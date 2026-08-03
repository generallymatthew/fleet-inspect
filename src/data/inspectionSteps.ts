import type { InspectionStepDef } from '../types'

// Titles/descriptions live in src/lib/translations.ts (keyed by id) so the
// driver-facing wizard can render in English or Spanish.
export const inspectionSteps: InspectionStepDef[] = [
  { id: 'tires-wheels' },
  { id: 'fluids-engine' },
  { id: 'lights-signals' },
  { id: 'brakes-steering' },
  // Only shown when the selected vehicle has a trailer — filtered at runtime.
  { id: 'hitch-trailer' },
  { id: 'safety-equipment' },
]
