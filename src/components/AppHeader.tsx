import { useLocation } from 'react-router-dom'
import { useHeaderSlots } from '../state/HeaderSlotContext'

export function AppHeader() {
  const { setLeftSlot, setRightSlot } = useHeaderSlots()
  const { pathname } = useLocation()
  const title = pathname === '/admin' ? 'Fleet Status' : 'Fleet Inspect'

  return (
    <header className="sticky top-0 z-20 flex h-11 shrink-0 items-center gap-2 border-b border-surface-border bg-header-bg px-2">
      <div ref={setLeftSlot} className="flex min-w-9 flex-1 shrink-0 items-center justify-start" />
      <span className="shrink-0 text-center text-sm font-medium text-ink-dim">{title}</span>
      <div ref={setRightSlot} className="flex min-w-9 flex-1 shrink-0 items-center justify-end" />
    </header>
  )
}
