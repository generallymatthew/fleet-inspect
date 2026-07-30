const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'clear', '0', 'back']

export function NumericKeypad({
  value,
  onChange,
}: {
  value: string
  onChange: (next: string) => void
}) {
  function press(key: string) {
    if (key === 'clear') return onChange('')
    if (key === 'back') return onChange(value.slice(0, -1))
    if (value.length >= 7) return
    onChange(value + key)
  }

  return (
    <div className="grid grid-cols-3 gap-3">
      {KEYS.map((key) => (
        <button
          key={key}
          type="button"
          onClick={() => press(key)}
          className="touch-target rounded-xl bg-surface text-3xl font-bold text-ink border border-surface-border active:opacity-70"
        >
          {key === 'clear' ? 'C' : key === 'back' ? '⌫' : key}
        </button>
      ))}
    </div>
  )
}
