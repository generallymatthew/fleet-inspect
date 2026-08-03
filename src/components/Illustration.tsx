import type { ReactElement } from 'react'

const shared = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 4,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

const illustrations: Record<string, ReactElement> = {
  welcome: (
    <svg viewBox="0 0 160 160" {...shared}>
      <rect x="18" y="55" width="68" height="38" rx="4" />
      <path d="M86 93 L86 60 L108 60 L108 72 L130 72 L130 93 Z" />
      <circle cx="45" cy="100" r="11" />
      <circle cx="45" cy="100" r="2" fill="currentColor" stroke="none" />
      <circle cx="112" cy="100" r="11" />
      <circle cx="112" cy="100" r="2" fill="currentColor" stroke="none" />
    </svg>
  ),
  'tires-wheels': (
    <svg viewBox="0 0 160 160" {...shared}>
      <circle cx="80" cy="80" r="60" />
      <circle cx="80" cy="80" r="28" />
      <circle cx="80" cy="52" r="4" fill="currentColor" stroke="none" />
      <circle cx="106.6" cy="71.3" r="4" fill="currentColor" stroke="none" />
      <circle cx="96.5" cy="102.6" r="4" fill="currentColor" stroke="none" />
      <circle cx="63.5" cy="102.6" r="4" fill="currentColor" stroke="none" />
      <circle cx="53.4" cy="71.3" r="4" fill="currentColor" stroke="none" />
    </svg>
  ),
  'fluids-engine': (
    <svg viewBox="0 0 160 160" {...shared}>
      <path d="M80 28 C80 28 45 80 45 106 C45 126 61 140 80 140 C99 140 115 126 115 106 C115 80 80 28 80 28 Z" />
      <path d="M62 106 C62 116 70 122 80 122" />
    </svg>
  ),
  'lights-signals': (
    <svg viewBox="0 0 160 160" {...shared}>
      <circle cx="58" cy="80" r="26" />
      <circle cx="58" cy="80" r="4" fill="currentColor" stroke="none" />
      <line x1="88" y1="62" x2="132" y2="46" />
      <line x1="92" y1="80" x2="136" y2="80" />
      <line x1="88" y1="98" x2="132" y2="114" />
    </svg>
  ),
  'brakes-steering': (
    <svg viewBox="0 0 160 160" {...shared}>
      <circle cx="80" cy="80" r="55" />
      <circle cx="80" cy="80" r="16" />
      <line x1="80" y1="64" x2="80" y2="28" />
      <line x1="68" y1="90" x2="40" y2="120" />
      <line x1="92" y1="90" x2="120" y2="120" />
    </svg>
  ),
  'hitch-trailer': (
    <svg viewBox="0 0 160 160" {...shared}>
      <rect x="55" y="62" width="80" height="45" rx="6" />
      <circle cx="75" cy="114" r="10" />
      <circle cx="115" cy="114" r="10" />
      <path d="M55 82 L25 82 L25 98" />
      <circle cx="25" cy="102" r="6" fill="currentColor" stroke="none" />
    </svg>
  ),
  'safety-equipment': (
    <svg viewBox="0 0 160 160" {...shared}>
      <path d="M80 25 L125 40 L125 85 C125 115 105 135 80 145 C55 135 35 115 35 85 L35 40 Z" />
      <path d="M60 85 L75 100 L105 65" />
    </svg>
  ),
}

export function Illustration({ id }: { id: string }) {
  const icon = illustrations[id]
  if (!icon) return null

  return (
    <div className="flex flex-1 items-center justify-center text-ink opacity-80">
      <div className="h-72 w-72 sm:h-96 sm:w-96">{icon}</div>
    </div>
  )
}
