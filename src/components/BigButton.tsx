import type { ButtonHTMLAttributes } from 'react'

type Variant = 'pass' | 'fail' | 'neutral' | 'accent'

const variantClasses: Record<Variant, string> = {
  pass: 'bg-pass text-pass-ink',
  fail: 'bg-fail text-fail-ink',
  neutral: 'bg-surface text-ink border border-surface-border',
  accent: 'bg-ink text-bg',
}

interface BigButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
}

export function BigButton({ variant = 'neutral', className = '', ...props }: BigButtonProps) {
  return (
    <button
      type="button"
      className={`touch-target w-full flex-1 rounded-xl text-2xl font-bold active:opacity-80 disabled:opacity-40 ${variantClasses[variant]} ${className}`}
      {...props}
    />
  )
}
