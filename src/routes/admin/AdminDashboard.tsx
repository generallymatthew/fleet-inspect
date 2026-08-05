import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import { signOut } from 'firebase/auth'
import { Screen } from '../../components/Screen'
import { vehicles } from '../../data/vehicles'
import { useVehicleStatuses, type VehicleStatusDoc } from '../../lib/useVehicleStatuses'
import { auth } from '../../lib/firebase'
import { useHeaderSlots } from '../../state/HeaderSlotContext'
import type { Vehicle } from '../../types'

const headerPillClass =
  'rounded-full border border-surface-border bg-surface px-3 py-1.5 text-xs font-bold text-ink-dim active:opacity-70'

function VehicleTile({
  vehicle,
  status,
  baseColorClass,
}: {
  vehicle: Vehicle
  status: VehicleStatusDoc | undefined
  baseColorClass: string
}) {
  const hasOpenDefects = status?.status !== 'out_of_service' && status?.hasOpenDefects
  return (
    <Link
      to={`/admin/${vehicle.id}`}
      className={`touch-target flex h-full max-h-24 flex-col items-center justify-center gap-0.5 rounded-xl border px-4 text-center text-lg font-bold text-ink ${
        hasOpenDefects ? 'border-monitor bg-monitor/20' : baseColorClass
      }`}
    >
      {vehicle.label}
      {hasOpenDefects && <span className="text-xs font-semibold text-monitor">⚠ Minor issue reported</span>}
    </Link>
  )
}

export function AdminDashboard() {
  const statuses = useVehicleStatuses()
  const { leftSlot, rightSlot } = useHeaderSlots()

  const passed: typeof vehicles = []
  const pending: typeof vehicles = []
  const outOfService: typeof vehicles = []

  for (const vehicle of vehicles) {
    const status = statuses[vehicle.id]
    if (status?.status === 'out_of_service') {
      outOfService.push(vehicle)
    } else if (status?.lastInspectedAtUtc) {
      // Any non-critical inspection on record clears a vehicle out of the
      // pending list, not just one submitted today — otherwise a vehicle
      // that passed yesterday and hasn't been re-inspected yet incorrectly
      // reads as "pending" forever.
      passed.push(vehicle)
    } else {
      pending.push(vehicle)
    }
  }

  return (
    <Screen>
      {leftSlot &&
        createPortal(
          <Link to="/" className={headerPillClass}>
            Inspect
          </Link>,
          leftSlot,
        )}
      {rightSlot &&
        createPortal(
          <button type="button" onClick={() => signOut(auth)} className={headerPillClass}>
            Sign Out
          </button>,
          rightSlot,
        )}

      <section className="flex flex-1 flex-col gap-3">
        <h2 className="text-xl font-bold text-critical">Out of Service ({outOfService.length})</h2>
        <div className="grid flex-1 auto-rows-fr grid-cols-1 gap-3 sm:grid-cols-2">
          {outOfService.map((v) => (
            <Link
              key={v.id}
              to={`/admin/${v.id}`}
              className="touch-target flex h-full max-h-24 items-center justify-center rounded-xl border border-critical bg-critical/20 px-4 text-center text-lg font-bold text-ink"
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
            <VehicleTile
              key={v.id}
              vehicle={v}
              status={statuses[v.id]}
              baseColorClass="border-pending bg-pending/20"
            />
          ))}
          {pending.length === 0 && <p className="text-ink-dim">None</p>}
        </div>
      </section>

      <section className="flex flex-1 flex-col gap-3">
        <h2 className="text-xl font-bold text-pass">Passed ({passed.length})</h2>
        <div className="grid flex-1 auto-rows-fr grid-cols-1 gap-3 sm:grid-cols-2">
          {passed.map((v) => (
            <VehicleTile
              key={v.id}
              vehicle={v}
              status={statuses[v.id]}
              baseColorClass="border-pass bg-pass/20"
            />
          ))}
          {passed.length === 0 && <p className="text-ink-dim">None</p>}
        </div>
      </section>
    </Screen>
  )
}
