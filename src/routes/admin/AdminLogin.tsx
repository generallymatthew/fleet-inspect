import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../../lib/firebase'
import { useAuthUser } from '../../lib/useAuthUser'
import { Screen } from '../../components/Screen'
import { BigButton } from '../../components/BigButton'

export function AdminLogin() {
  const { user, loading } = useAuthUser()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (!loading && user) {
    const redirectTo = (location.state as { from?: string } | null)?.from ?? '/admin'
    return <Navigate to={redirectTo} replace />
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password)
      navigate('/admin', { replace: true })
    } catch {
      setError('Incorrect email or password.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Screen>
      <h1 className="text-center text-3xl font-bold">Manager Login</h1>

      <form onSubmit={submit} className="flex flex-1 flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="shrink-0 text-lg font-semibold text-ink-dim">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="touch-target rounded-xl border border-surface-border bg-surface px-4 text-xl text-ink"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="password" className="shrink-0 text-lg font-semibold text-ink-dim">
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="touch-target rounded-xl border border-surface-border bg-surface px-4 text-xl text-ink"
          />
        </div>

        {error && <p className="text-center text-fail">{error}</p>}

        <BigButton
          type="submit"
          variant="accent"
          disabled={!email.trim() || !password || submitting}
          className="mt-auto"
        >
          {submitting ? 'Signing in…' : 'Sign In'}
        </BigButton>
      </form>
    </Screen>
  )
}
