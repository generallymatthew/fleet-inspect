import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { Screen } from '../../components/Screen'
import { BigButton } from '../../components/BigButton'
import { NumericKeypad } from '../../components/NumericKeypad'
import { useInspection } from '../../state/InspectionContext'

export function OdometerEntry() {
  const navigate = useNavigate()
  const { vehicle, driverName, setOdometer } = useInspection()
  const [value, setValue] = useState('')

  if (!vehicle || !driverName) {
    return <Navigate to="/vehicle" replace />
  }

  function submit() {
    setOdometer(Number(value))
    navigate('/inspect/0')
  }

  return (
    <Screen>
      <h1 className="text-center text-3xl font-bold">Odometer / Hours</h1>
      <p className="text-center text-ink-dim">{vehicle.label}</p>

      <div className="touch-target flex items-center justify-center rounded-xl border border-surface-border bg-surface text-4xl font-bold text-ink">
        {value || '0'}
      </div>

      <div className="flex flex-1 flex-col">
        <NumericKeypad value={value} onChange={setValue}>
          <BigButton
            variant="accent"
            onClick={submit}
            disabled={!value}
            className="h-full"
          >
            Start Inspection
          </BigButton>
        </NumericKeypad>
      </div>
    </Screen>
  )
}
