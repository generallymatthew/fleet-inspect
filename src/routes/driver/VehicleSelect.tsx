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
      <h1 className="text-center text-3xl">{t.vehicleSelect.title}</h1>

      {/* Plain stacked flex column, not a fr-grid: each row keeps its own
          natural height instead of all rows being forced to match the
          tallest one (the label+input row), which is what caused overflow
          on shorter phones. */}
      <div className="flex flex-1 flex-col gap-3 overflow-y-auto">
        {vehicles.map((vehicle) => (
          <button
            key={vehicle.id}
            type="button"
            onClick={() => choose(vehicle)}
            className="touch-target shrink-0 rounded-xl border-2 border-surface-border bg-surface p-4 text-center text-xl font-bold text-ink active:opacity-70"
          >
            {vehicle.label}
          </button>
        ))}

        <div className="flex shrink-0 flex-col gap-2">
          <label htmlFor="scan-code" className="shrink-0 font-semibold text-ink-dim">
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
            className="touch-target rounded-xl border-2 border-surface-border bg-surface px-5 text-xl text-ink placeholder:text-placeholder"
          />
        </div>
        <BigButton
          variant="accent"
          onClick={submitScan}
          disabled={!scanCode.trim()}
          className="shrink-0"
        >
          {t.vehicleSelect.useCodeButton}
        </BigButton>
      </div>

      {scanError && <p className="text-center text-fail">{scanError}</p>}
    </Screen>
  )
}
