import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { Screen } from '../../components/Screen'
import { BigButton } from '../../components/BigButton'
import { quickSelectDrivers } from '../../data/drivers'
import { useInspection } from '../../state/InspectionContext'

export function DriverSelect() {
  const navigate = useNavigate()
  const { setDriverName, vehicle } = useInspection()
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
      <h1 className="text-center text-3xl font-bold">Who's Inspecting?</h1>
      <p className="text-center text-ink-dim">{vehicle.label}</p>

      {/* One grid for the quick-select names + the custom-name input + its
          submit button, so auto-rows-fr sizes every row identically and they
          all fill the remaining space together, regardless of viewport
          height. */}
      <div className="grid flex-1 grid-cols-1 auto-rows-fr gap-3 sm:grid-cols-2">
        {quickSelectDrivers.map((name) => (
          <button
            key={name}
            type="button"
            onClick={() => choose(name)}
            className="h-full rounded-xl border border-surface-border bg-surface text-xl font-bold text-ink active:opacity-70"
          >
            {name}
          </button>
        ))}

        <div className="col-span-full flex h-full flex-col gap-2">
          <label htmlFor="custom-name" className="shrink-0 text-lg font-semibold text-ink-dim">
            Or enter your name
          </label>
          <input
            id="custom-name"
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            className="flex-1 rounded-xl border border-surface-border bg-surface px-4 text-xl text-ink"
          />
        </div>
        <BigButton
          variant="accent"
          onClick={() => choose(customName.trim())}
          disabled={!customName.trim()}
          className="col-span-full h-full"
        >
          Continue
        </BigButton>
      </div>
    </Screen>
  )
}
