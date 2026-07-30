export function StepCounter({ current, total }: { current: number; total: number }) {
  return (
    <div className="sticky top-0 bg-bg py-3 text-center text-lg font-semibold text-ink-dim">
      Step {current} of {total}
    </div>
  )
}
