import type { InspectionStepDef } from '../types'

export const inspectionSteps: InspectionStepDef[] = [
  {
    id: 'tires-wheels',
    title: 'Tires & Wheels',
    description: 'Pressure, tread depth, lug nuts',
  },
  {
    id: 'fluids-engine',
    title: 'Fluids & Engine',
    description: 'Oil level, coolant, visible leaks under vehicle',
  },
  {
    id: 'lights-signals',
    title: 'Lights & Signals',
    description: 'Headlights, brake lights, turn signals, flashers',
  },
  {
    id: 'brakes-steering',
    title: 'Brakes & Steering',
    description: 'Brake pedal response, steering play',
  },
  {
    id: 'hitch-trailer',
    title: 'Hitch & Trailer Coupling',
    description: 'Safety chains, breakaway cable, trailer plug',
    // Only shown when the selected vehicle has a trailer — filtered at runtime.
  },
  {
    id: 'safety-equipment',
    title: 'Safety Equipment',
    description: 'Fire extinguisher, first-aid kit, high-vis cones',
  },
]
