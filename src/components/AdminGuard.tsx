import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuthUser } from '../lib/useAuthUser'
import { Screen } from './Screen'

export function AdminGuard({ children }: { children: ReactNode }) {
  const { user, loading } = useAuthUser()
  const location = useLocation()

  if (loading) {
    return (
      <Screen>
        <p className="text-center text-ink-dim">Loading…</p>
      </Screen>
    )
  }

  if (!user) {
    return <Navigate to="/admin/login" state={{ from: location.pathname }} replace />
  }

  return <>{children}</>
}
