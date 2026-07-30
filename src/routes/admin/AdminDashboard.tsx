import { Link } from 'react-router-dom'
import { Screen } from '../../components/Screen'
import { vehicles } from '../../data/vehicles'
import { useVehicleStatuses } from '../../lib/useVehicleStatuses'

function isToday(isoDate: string) {
  const then = new Date(isoDate)
  const now = new Date()
  return (
    then.getUTCFullYear() === now.getUTCFullYear() &&
    then.getUTCMonth() === now.getUTCMonth() &&
    then.getUTCDate() === now.getUTCDate()
  )
}

export function AdminDashboard() {
  const statuses = useVehicleStatuses()

  const passedToday: typeof vehicles = []
  const pending: typeof vehicles = []
  const outOfService: typeof vehicles = []

  for (const vehicle of vehicles) {
    const status = statuses[vehicle.id]
    if (status?.status === 'out_of_service') {
      outOfService.push(vehicle)
    } else if (status?.lastInspectedAtUtc && isToday(status.lastInspectedAtUtc)) {
      passedToday.push(vehicle)
    } else {
      pending.push(vehicle)
    }
  }

  return (
    <Screen>
      <h1 className="text-center text-3xl font-bold">Fleet Status</h1>

      <section className="flex flex-1 flex-col gap-3">
        <h2 className="text-xl font-bold text-critical">Out of Service ({outOfService.length})</h2>
        <div className="grid flex-1 auto-rows-fr grid-cols-1 gap-3 sm:grid-cols-2">
          {outOfService.map((v) => (
            <Link
              key={v.id}
              to={`/admin/${v.id}`}
              className="touch-target flex h-full items-center rounded-xl border border-critical bg-critical/20 px-4 text-lg font-bold text-ink"
            >
              {v.label}
            </Link>
          ))}
          {outOfService.length === 0 && <p className="text-ink-dim">None</p>}
        </div>
      </section>

      <section className="flex flex-1 flex-col gap-3">
        <h2 className="text-xl font-bold text-pending">Pending Inspection ({pending.length})</h2>
        <div className="grid flex-1 auto-rows-fr grid-cols-1 gap-3 sm:grid-cols-2">
          {pending.map((v) => (
            <div
              key={v.id}
              className="touch-target flex h-full items-center rounded-xl border border-pending bg-pending/20 px-4 text-lg font-bold text-ink"
            >
              {v.label}
            </div>
          ))}
          {pending.length === 0 && <p className="text-ink-dim">None</p>}
        </div>
      </section>

      <section className="flex flex-1 flex-col gap-3">
        <h2 className="text-xl font-bold text-pass">Passed Today ({passedToday.length})</h2>
        <div className="grid flex-1 auto-rows-fr grid-cols-1 gap-3 sm:grid-cols-2">
          {passedToday.map((v) => (
            <div
              key={v.id}
              className="touch-target flex h-full items-center rounded-xl border border-pass bg-pass/20 px-4 text-lg font-bold text-ink"
            >
              {v.label}
            </div>
          ))}
          {passedToday.length === 0 && <p className="text-ink-dim">None</p>}
        </div>
      </section>
    </Screen>
  )
}
