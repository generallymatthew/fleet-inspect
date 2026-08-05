import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { Screen } from '../../components/Screen'
import { BigButton } from '../../components/BigButton'
import { quickSelectDrivers } from '../../data/drivers'
import { useInspection } from '../../state/InspectionContext'
import { useLanguage } from '../../state/LanguageContext'

export function DriverSelect() {
  const navigate = useNavigate()
  const { setDriverName, vehicle } = useInspection()
  const { t } = useLanguage()
  const [customName, setCustomName] = useState('')

  function choose(name: string) {
    setDriverName(name)
    navigate('/odometer')
  }

  if (!vehicle) {
    return <Navigate to="/vehicle" replace />
  }

  return (
    <Screen>
      <h1 className="text-center text-3xl">{t.driverSelect.title}</h1>
      <p className="text-center font-semibold text-ink-dim">{vehicle.label}</p>

      {/* Plain stacked flex column, not a fr-grid: each row keeps its own
          natural height instead of all rows being forced to match the
          tallest one (the label+input row), which is what caused overflow
          on shorter phones. */}
      <div className="flex flex-1 flex-col gap-3 overflow-y-auto">
        {quickSelectDrivers.map((name) => (
          <button
            key={name}
            type="button"
            onClick={() => choose(name)}
            className="touch-target shrink-0 rounded-xl border-2 border-surface-border bg-surface px-4 text-center text-xl font-bold text-ink active:opacity-70"
          >
            {name}
          </button>
        ))}

        <div className="flex shrink-0 flex-col gap-2">
          <label htmlFor="custom-name" className="shrink-0 font-semibold text-ink-dim">
            {t.driverSelect.customNameLabel}
          </label>
          <input
            id="custom-name"
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            className="touch-target rounded-xl border-2 border-surface-border bg-surface px-5 text-xl text-ink placeholder:text-placeholder"
          />
        </div>
        <BigButton
          variant="accent"
          onClick={() => choose(customName.trim())}
          disabled={!customName.trim()}
          className="shrink-0"
        >
          {t.driverSelect.continueButton}
        </BigButton>
      </div>
    </Screen>
  )
}
