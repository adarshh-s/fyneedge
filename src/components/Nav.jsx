import { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion'
import { NAV } from '../config.js'
import { Btn, Logo, ease } from './ui.jsx'
import ThemeToggle from './ThemeToggle.jsx'
import { MOD, openPalette } from './CommandPalette.jsx'

export default function Nav() {
  const { scrollY } = useScroll()
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()

  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0
    setScrolled(y > 40)
    setHidden(y > 400 && y > prev + 2)
    if (y < prev - 2) setHidden(false)
  })

  useEffect(() => setOpen(false), [pathname])
  useEffect(() => {
    document.documentElement.style.overflow = open ? 'hidden' : ''
  }, [open])

  return (
    <>
      <motion.header
        className={`nav ${scrolled ? 'nav--scrolled' : ''}`}
        animate={{ y: hidden && !open ? '-160%' : '0%' }}
        transition={{ duration: 0.45, ease }}
      >
        <NavLink to="/" className="nav__logo" aria-label="Home">
          <Logo light={!scrolled} />
        </NavLink>
        <nav className="nav__links">
          {NAV.map((n) => (
            <NavLink key={n.to} to={n.to} end className="nav__link">
              {n.label}
            </NavLink>
          ))}
        </nav>
        <div className="nav__actions">
          <button className="kbd-btn" onClick={openPalette} aria-label="Open command menu">
            <svg viewBox="0 0 24 24" width="15" height="15">
              <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2.2" />
              <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
            </svg>
            <span className="kbd-btn__keys">
              <kbd>{MOD}</kbd>
              <kbd>K</kbd>
            </span>
          </button>
          <ThemeToggle />
          <div className="nav__cta">
            <Btn to="/contact" variant="lime">
              Book a call
            </Btn>
          </div>
          <button className={`burger ${open ? 'is-open' : ''}`} onClick={() => setOpen((o) => !o)} aria-label="Menu" aria-expanded={open}>
            <span />
            <span />
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="menu"
            initial={{ clipPath: 'circle(0% at 100% 0%)' }}
            animate={{ clipPath: 'circle(150% at 100% 0%)' }}
            exit={{ clipPath: 'circle(0% at 100% 0%)' }}
            transition={{ duration: 0.7, ease }}
          >
            <ul>
              {[...NAV, { label: 'Contact', to: '/contact' }].map((n, i) => (
                <motion.li key={n.to} initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 + i * 0.06, ease, duration: 0.6 }}>
                  <NavLink to={n.to} end>
                    {n.label}
                  </NavLink>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
