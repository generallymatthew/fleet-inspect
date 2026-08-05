import { createContext, useContext, useState, type ReactNode } from 'react'

interface HeaderSlots {
  leftSlot: HTMLDivElement | null
  rightSlot: HTMLDivElement | null
  setLeftSlot: (el: HTMLDivElement | null) => void
  setRightSlot: (el: HTMLDivElement | null) => void
}

const HeaderSlotContext = createContext<HeaderSlots | null>(null)

export function HeaderSlotProvider({ children }: { children: ReactNode }) {
  const [leftSlot, setLeftSlot] = useState<HTMLDivElement | null>(null)
  const [rightSlot, setRightSlot] = useState<HTMLDivElement | null>(null)

  return (
    <HeaderSlotContext.Provider value={{ leftSlot, rightSlot, setLeftSlot, setRightSlot }}>
      {children}
    </HeaderSlotContext.Provider>
  )
}

// Lets screens (e.g. the inspection wizard's back/forward) portal small
// controls into the sticky AppHeader without AppHeader needing to know
// about any particular screen's navigation logic.
export function useHeaderSlots() {
  const ctx = useContext(HeaderSlotContext)
  if (!ctx) throw new Error('useHeaderSlots must be used within HeaderSlotProvider')
  return ctx
}
