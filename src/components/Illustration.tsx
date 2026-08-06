// Material Symbols Outlined codepoints, from Google's canonical codepoints
// list (google/material-design-icons). Rendered as raw \uXXXX codepoints
// rather than ligature names (e.g. "flare") because the CDN-served font's
// ligature table lags behind newer glyphs — codepoints map directly to the
// glyph regardless of ligature support. These are Private Use Area
// characters, so they render invisibly in plain-text editors/diffs; the hex
// in each comment is the source of truth, not the glyph itself.
const icons: Record<string, string> = {
  welcome: '', // local_shipping (U+E558)
  // "tire_repair" (U+EBC8) is listed in Google's icon set but not yet served
  // by the Google Fonts CDN build — renders as a missing-glyph box. "album"
  // (concentric rings + center hub) is the closest available wheel analog.
  'tires-wheels': '', // album (U+E019)
  'fluids-engine': '', // oil_barrel (U+EC15)
  'lights-signals': '', // flare (U+E3E4)
  // No standalone "steering_wheel" glyph exists in the set; this heated-wheel
  // variant is the closest available steering-wheel silhouette.
  'brakes-steering': '', // steering_wheel_heat (U+F32B)
  'hitch-trailer': '', // rv_hookup (U+E642)
  'safety-equipment': '', // health_and_safety (U+E1D5)
}

export function Illustration({ id }: { id: string }) {
  const icon = icons[id]
  if (!icon) return null

  return (
    <div className="flex flex-1 items-center justify-center text-progress">
      <span className="material-symbols-outlined illustration-icon" aria-hidden="true">
        {icon}
      </span>
    </div>
  )
}
