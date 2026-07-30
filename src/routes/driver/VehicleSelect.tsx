import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Screen } from '../../components/Screen'
import { BigButton } from '../../components/BigButton'
import { vehicles } from '../../data/vehicles'
import { useInspection } from '../../state/InspectionContext'
import type { Vehicle } from '../../types'

export function VehicleSelect() {
  const navigate = useNavigate()
  const { setVehicle } = useInspection()
  const [scanCode, setScanCode] = useState('')
  const [scanError, setScanError] = useState('')

  function choose(vehicle: Vehicle) {
    setVehicle(vehicle)
    navigate('/driver')
  }

  function submitScan() {
    const match = vehicles.find(
      (v) => v.id.toLowerCase() === scanCode.trim().toLowerCase(),
    )
    if (!match) {
      setScanError('No vehicle matches that code.')
      return
    }
    choose(match)
  }

  return (
    <Screen>
      <h1 className="text-center text-3xl font-bold">Select Vehicle</h1>
      <div className="grid flex-1 auto-rows-fr grid-cols-1 gap-4 sm:grid-cols-2">
        {vehicles.map((vehicle) => (
          <button
            key={vehicle.id}
            type="button"
            onClick={() => choose(vehicle)}
            className="touch-target h-full rounded-xl border border-surface-border bg-surface p-4 text-xl font-bold text-ink active:opacity-70"
          >
            {vehicle.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        <label htmlFor="scan-code" className="text-lg font-semibold text-ink-dim">
          Or scan / enter asset code
        </label>
        <input
          id="scan-code"
          value={scanCode}
          onChange={(e) => {
            setScanCode(e.target.value)
            setScanError('')
          }}
          placeholder="e.g. truck-102"
          className="touch-target rounded-xl border border-surface-border bg-surface px-4 text-xl text-ink"
        />
        {scanError && <p className="text-fail">{scanError}</p>}
        <BigButton variant="accent" onClick={submitScan} disabled={!scanCode.trim()}>
          Use Code
        </BigButton>
      </div>
    </Screen>
  )
}
