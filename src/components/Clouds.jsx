import { useId } from 'react'

// Soft volumetric clouds drawn with SVG noise — no images needed.
const PUFFS = [
  // cx, cy, rx, ry
  [120, 420, 260, 90], [360, 470, 240, 110], [620, 440, 280, 100], [900, 480, 300, 120],
  [1180, 430, 260, 100], [1420, 470, 260, 110], [40, 520, 300, 120], [760, 540, 380, 110],
  [1300, 540, 360, 120], [240, 300, 150, 50], [1250, 290, 170, 55], [980, 250, 120, 40],
]

export default function Clouds({ className = '', seed = 3, density = 1 }) {
  const id = useId().replace(/:/g, '')
  return (
    <svg className={`clouds ${className}`} viewBox="0 0 1440 600" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
      <defs>
        <filter id={`c${id}`} filterUnits="userSpaceOnUse" x="-300" y="-200" width="2040" height="1100">
          <feTurbulence type="fractalNoise" baseFrequency="0.011" numOctaves="5" seed={seed} result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="140" xChannelSelector="R" yChannelSelector="G" result="d" />
          <feGaussianBlur in="d" stdDeviation="9" />
        </filter>
        <linearGradient id={`g${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" />
          <stop offset="1" stopColor="#eaf4ff" />
        </linearGradient>
      </defs>
      <g filter={`url(#c${id})`} fill={`url(#g${id})`} opacity={density}>
        {PUFFS.map(([cx, cy, rx, ry], i) => (
          <ellipse key={i} cx={cx} cy={cy} rx={rx} ry={ry} opacity={i > 8 ? 0.75 : 1} />
        ))}
        <rect x="-100" y="560" width="1640" height="200" />
      </g>
    </svg>
  )
}
