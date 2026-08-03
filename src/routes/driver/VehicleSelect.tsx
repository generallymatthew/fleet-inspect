import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Screen } from '../../components/Screen'
import { BigButton } from '../../components/BigButton'
import { vehicles } from '../../data/vehicles'
import { useInspection } from '../../state/InspectionContext'
import { useLanguage } from '../../state/LanguageContext'
import type { Vehicle } from '../../types'

export function VehicleSelect() {
  const navigate = useNavigate()
  const { setVehicle } = useInspection()
  const { t } = useLanguage()
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
      setScanError(t.vehicleSelect.noMatchError)
      return
    }
    choose(match)
  }

  return (
    <Screen>
      <h1 className="text-center text-3xl font-bold">{t.vehicleSelect.title}</h1>

      {/* One grid for vehicle buttons + the scan input + its submit button,
          so auto-rows-fr sizes every row identically and they all fill the
          remaining space together, regardless of viewport height. */}
      <div className="grid flex-1 grid-cols-1 auto-rows-fr gap-4 sm:grid-cols-2">
        {vehicles.map((vehicle) => (
          <button
            key={vehicle.id}
            type="button"
            onClick={() => choose(vehicle)}
            className="h-full rounded-xl border border-surface-border bg-surface p-4 text-xl font-bold text-ink active:opacity-70"
          >
            {vehicle.label}
          </button>
        ))}

        <div className="col-span-full flex h-full flex-col gap-2">
          <label htmlFor="scan-code" className="shrink-0 text-lg font-semibold text-ink-dim">
            {t.vehicleSelect.scanLabel}
          </label>
          <input
            id="scan-code"
            value={scanCode}
            onChange={(e) => {
              setScanCode(e.target.value)
              setScanError('')
            }}
            placeholder={t.vehicleSelect.scanPlaceholder}
            className="flex-1 rounded-xl border border-surface-border bg-surface px-4 text-xl text-ink"
          />
        </div>
        <BigButton
          variant="accent"
          onClick={submitScan}
          disabled={!scanCode.trim()}
          className="col-span-full h-full"
        >
          {t.vehicleSelect.useCodeButton}
        </BigButton>
      </div>

      {scanError && <p className="text-center text-fail">{scanError}</p>}
    </Screen>
  )
}
