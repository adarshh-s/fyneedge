import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion'
import { NAV } from '../config.js'
import { Logo, ease } from './ui.jsx'
import { MOD, openPalette } from './CommandPalette.jsx'

/* ---------- liquid glass: one shared distortion filter + a glint that follows the cursor ---------- */
function LiquidGlass() {
  useEffect(() => {
    // only Chromium can run an SVG filter inside backdrop-filter; other browsers keep plain frosted glass
    const chromium = navigator.userAgentData?.brands?.some((b) => /Chromium/.test(b.brand))
    if (chromium) document.documentElement.classList.add('lg-svg')
    const move = (e) => {
      const el = e.target instanceof Element ? e.target.closest('.lg') : null
      if (!el) return
      const r = el.getBoundingClientRect()
      el.style.setProperty('--mx', `${e.clientX - r.left}px`)
      el.style.setProperty('--my', `${e.clientY - r.top}px`)
    }
    window.addEventListener('pointermove', move, { passive: true })
    return () => window.removeEventListener('pointermove', move)
  }, [])
  return (
    <svg className="lg-defs" aria-hidden="true" focusable="false">
      <filter id="lg-distort" x="0%" y="0%" width="100%" height="100%" colorInterpolationFilters="sRGB">
        <feTurbulence type="fractalNoise" baseFrequency="0.012 0.018" numOctaves="2" seed="7" result="noise" />
        <feGaussianBlur in="noise" stdDeviation="3" result="soft" />
        <feDisplacementMap in="SourceGraphic" in2="soft" scale="30" xChannelSelector="R" yChannelSelector="G" />
      </filter>
    </svg>
  )
}

export default function Nav() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  const ref = useRef(null)

  useEffect(() => setOpen(false), [pathname])
  useEffect(() => {
    const onDoc = (e) => !ref.current?.contains(e.target) && setOpen(false)
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('pointerdown', onDoc)
    window.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onDoc)
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <>
    {/* part of the page: sits over the hero and scrolls away with it (the dock is the always-there navigation) */}
    <header ref={ref} className={`jnav ${open ? 'jnav--open' : ''}`}>
      <div className="jnav__bar">
        <Link to="/" className="jnav__logo" aria-label="Home">
          <Logo light />
        </Link>

        <div className="jnav__actions">
          <button className="jbtn jbtn--glass jbtn--icon jnav__search lg" onClick={openPalette} aria-label="Search">
            <svg viewBox="0 0 24 24" width="15" height="15">
              <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2.2" />
              <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
            </svg>
            <span className="jnav__kbd">{MOD} K</span>
          </button>
          <Link to="/contact" className="jbtn jbtn--solid jnav__cta">
            Book a call
          </Link>
        </div>
      </div>

    </header>
    <Dock pathname={pathname} />
    <LiquidGlass />
    </>
  )
}

/* ---------- bottom-centre floating dock (Jeton-style) ---------- */
const DOCK_SERVICES = [
  { to: '/services#web', title: 'Web applications', sub: 'Portals, dashboards & SaaS' },
  { to: '/services#mobile', title: 'Mobile apps', sub: 'iOS & Android, end to end' },
  { to: '/services#ai', title: 'AI agents', sub: 'Voice, chat & workflow agents' },
]

const HomeIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
    <path d="M4 10.5 12 4l8 6.5V19a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 19z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
  </svg>
)
const Chev = ({ up }) => (
  <motion.svg viewBox="0 0 12 12" width="12" height="12" animate={{ rotate: up ? 180 : 0 }} transition={{ duration: 0.3, ease }} aria-hidden="true">
    <path d="M2.5 4.5 6 8l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </motion.svg>
)

function Dock({ pathname }) {
  const [menu, setMenu] = useState(false)
  const [hover, setHover] = useState(null)
  const ref = useRef(null)
  const { scrollY } = useScroll()
  const [compact, setCompact] = useState(false)
  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0
    if (y > prev + 4 && y > 200) setCompact(true)
    else if (y < prev - 4) setCompact(false)
  })
  useEffect(() => setMenu(false), [pathname])
  useEffect(() => {
    if (!menu) return
    const off = (e) => !ref.current?.contains(e.target) && setMenu(false)
    const esc = (e) => e.key === 'Escape' && setMenu(false)
    document.addEventListener('pointerdown', off)
    window.addEventListener('keydown', esc)
    return () => {
      document.removeEventListener('pointerdown', off)
      window.removeEventListener('keydown', esc)
    }
  }, [menu])

  const current = pathname === '/' ? 'home' : pathname.startsWith('/services') ? 'services' : pathname.startsWith('/about') ? 'about' : pathname.startsWith('/contact') ? 'contact' : null
  const items = [
    { id: 'services', label: 'Services', menu: true },
    { id: 'about', label: 'About', to: '/about' },
    { id: 'contact', label: 'Contact', to: '/contact' },
  ]
  const hl = hover ?? current

  return (
    <motion.div
      ref={ref}
      className="dock-wrap"
      initial={{ y: 90, opacity: 0 }}
      animate={{ y: 0, opacity: 1, scale: compact && !menu ? 0.92 : 1 }}
      transition={{ duration: 0.6, ease, delay: 0.4 }}
    >
      <AnimatePresence>
        {menu && (
          <motion.div
            className="dock-menu lg"
            initial={{ opacity: 0, y: 14, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.97 }}
            transition={{ duration: 0.3, ease }}
          >
            {DOCK_SERVICES.map((s, i) => (
              <motion.div key={s.to} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.04 + i * 0.05 }}>
                <Link to={s.to} className="dock-menu__item" onClick={() => setMenu(false)}>
                  <span>
                    <b>{s.title}</b>
                    <small>{s.sub}</small>
                  </span>
                  <i>↗</i>
                </Link>
              </motion.div>
            ))}
            <Link to="/services" className="dock-menu__all" onClick={() => setMenu(false)}>
              All services →
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      <nav className="dock lg" aria-label="Main" onMouseLeave={() => setHover(null)}>
        <Link to="/" className="dock__home" aria-label="Home" onMouseEnter={() => setHover('home')}>
          {hl === 'home' && <motion.span layoutId="dock-hl" className="dock__hl" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
          <HomeIcon />
        </Link>
        {items.map((it) => {
          const inner = (
            <>
              {hl === it.id && <motion.span layoutId="dock-hl" className="dock__hl" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
              <span className="dock__label">
                {it.label}
                {it.menu && <Chev up={menu} />}
              </span>
            </>
          )
          return it.menu ? (
            <button key={it.id} className="dock__item" onMouseEnter={() => setHover(it.id)} onClick={() => setMenu((m) => !m)} aria-expanded={menu}>
              {inner}
            </button>
          ) : (
            <Link key={it.id} to={it.to} className="dock__item" onMouseEnter={() => setHover(it.id)} aria-current={current === it.id ? 'page' : undefined}>
              {inner}
            </Link>
          )
        })}
      </nav>
    </motion.div>
  )
}
