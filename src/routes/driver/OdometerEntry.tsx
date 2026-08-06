import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { Screen } from '../../components/Screen'
import { BigButton } from '../../components/BigButton'
import { NumericKeypad } from '../../components/NumericKeypad'
import { useInspection } from '../../state/InspectionContext'
import { useLanguage } from '../../state/LanguageContext'

export function OdometerEntry() {
  const navigate = useNavigate()
  const { vehicle, driverName, odometer, setOdometer } = useInspection()
  const { t } = useLanguage()
  const [value, setValue] = useState(odometer ? String(odometer) : '')

  if (!vehicle || !driverName) {
    return <Navigate to="/vehicle" replace />
  }

  function submit() {
    setOdometer(Number(value))
    navigate('/inspect/0')
  }

  return (
    <Screen>
      <h1 className="text-center text-3xl">{t.odometer.title}</h1>
      <p className="text-center font-semibold text-ink-dim">{vehicle.label}</p>

      <div className="flex min-h-[72px] items-center justify-center rounded-xl border-2 border-surface-border bg-surface text-4xl font-display text-ink">
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
            {t.odometer.startButton}
          </BigButton>
        </NumericKeypad>
      </div>
    </Screen>
  )
}
