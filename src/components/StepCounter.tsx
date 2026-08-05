export function StepCounter({ label }: { label: string }) {
  return (
    <div className="whitespace-nowrap text-center text-sm font-extrabold uppercase tracking-widest text-progress">
      {label}
    </div>
  )
}
