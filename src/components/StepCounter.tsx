export function StepCounter({ current, total }: { current: number; total: number }) {
  return (
    <div className="text-center text-lg font-semibold text-ink-dim">
      Step {current} of {total}
    </div>
  )
}
