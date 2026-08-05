import type { ButtonHTMLAttributes } from 'react'

type Variant = 'pass' | 'fail' | 'neutral' | 'accent'

const variantClasses: Record<Variant, string> = {
  pass: 'bg-pass text-pass-ink uppercase tracking-wide',
  fail: 'bg-fail text-fail-ink uppercase tracking-wide',
  neutral: 'bg-surface text-ink border border-surface-border',
  accent: 'bg-cta text-cta-ink',
}

interface BigButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
}

export function BigButton({ variant = 'neutral', className = '', ...props }: BigButtonProps) {
  return (
    <button
      type="button"
      className={`touch-target w-full flex-1 max-h-24 rounded-xl px-6 text-2xl font-bold active:opacity-80 disabled:opacity-40 ${variantClasses[variant]} ${className}`}
      {...props}
    />
  )
}
