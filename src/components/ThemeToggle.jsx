import { motion } from 'framer-motion'
import { toggleTheme, useTheme } from '../theme.js'

export default function ThemeToggle({ className = '' }) {
  const theme = useTheme()
  const dark = theme === 'dark'
  const onClick = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    toggleTheme({ x: r.left + r.width / 2, y: r.top + r.height / 2 })
  }
  return (
    <button className={className || 'theme-toggle'} onClick={onClick} aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'} title="Toggle theme">
      <motion.svg viewBox="0 0 24 24" width="20" height="20" animate={{ rotate: dark ? 40 : 90 }} transition={{ type: 'spring', stiffness: 200, damping: 18 }}>
        <mask id="moon-mask">
          <rect x="0" y="0" width="24" height="24" fill="white" />
          <motion.circle r="9" fill="black" animate={{ cx: dark ? 17 : 30, cy: dark ? 6 : 0 }} transition={{ duration: 0.5 }} />
        </mask>
        <motion.circle cx="12" cy="12" fill="currentColor" mask="url(#moon-mask)" animate={{ r: dark ? 9 : 5 }} transition={{ type: 'spring', stiffness: 200, damping: 18 }} />
        <motion.g stroke="currentColor" strokeWidth="2" strokeLinecap="round" animate={{ opacity: dark ? 0 : 1, scale: dark ? 0.5 : 1 }} style={{ originX: '12px', originY: '12px' }}>
          {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
            <line key={a} x1="12" y1="1.5" x2="12" y2="3.5" transform={`rotate(${a} 12 12)`} />
          ))}
        </motion.g>
      </motion.svg>
    </button>
  )
}
