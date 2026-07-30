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
    return <Navigate to="/" replace />
  }

  return (
    <Screen>
      <h1 className="text-center text-3xl font-bold">Who's Inspecting?</h1>
      <p className="text-center text-ink-dim">{vehicle.label}</p>

      <div className="flex flex-1 flex-col gap-3">
        {quickSelectDrivers.map((name) => (
          <button
            key={name}
            type="button"
            onClick={() => choose(name)}
            className="touch-target flex-1 rounded-xl border border-surface-border bg-surface text-xl font-bold text-ink active:opacity-70"
          >
            {name}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        <label htmlFor="custom-name" className="text-lg font-semibold text-ink-dim">
          Or enter your name
        </label>
        <input
          id="custom-name"
          value={customName}
          onChange={(e) => setCustomName(e.target.value)}
          className="touch-target rounded-xl border border-surface-border bg-surface px-4 text-xl text-ink"
        />
        <BigButton
          variant="accent"
          onClick={() => choose(customName.trim())}
          disabled={!customName.trim()}
        >
          Continue
        </BigButton>
      </div>
    </Screen>
  )
}
