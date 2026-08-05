import type { ReactNode } from 'react'

export function Screen({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto flex min-h-svh max-w-2xl flex-col gap-4 p-4">{children}</div>
  )
}
