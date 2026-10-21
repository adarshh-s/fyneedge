import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion, useInView } from 'framer-motion'
import { SERVICES } from '../data.js'
import { AgentMock, AppScreen, BrowserMock, PhoneMock } from '../components/mockups.jsx'
import { useTilt } from '../components/interactions.jsx'
import { Arrow, Btn, Eyebrow, ScrollText, SplitHeading, ease } from '../components/ui.jsx'

const VISUALS = {
  web: () => <BrowserMock />,
  mobile: () => (
    <div className="phones">
      <PhoneMock className="phone--back">
        <AppScreen />
      </PhoneMock>
      <PhoneMock>
        <AppScreen />
      </PhoneMock>
    </div>
  ),
  ai: () => <AgentMock />,
}

// what each service covers — hovering a chip points back at its service
const CAPS = [
  ['Customer portals', 'web'],
  ['SaaS platforms', 'web'],
  ['Admin dashboards', 'web'],
  ['Booking & payments', 'web'],
  ['iOS & Android', 'mobile'],
  ['Cross-platform apps', 'mobile'],
  ['Push & offline', 'mobile'],
  ['AI voice agents', 'ai'],
  ['WhatsApp agents', 'ai'],
  ['Email agents', 'ai'],
  ['Workflow automation', 'ai'],
  ['CRM integrations', 'ai'],
]

const CYCLE = 6.5 // seconds each service stays on stage while auto-playing

/* a quiet dot grid behind the panel — dots near the cursor brighten and lean away */
function DotField({ host }) {
  const canvas = useRef(null)
  useEffect(() => {
    const cv = canvas.current
    const root = host.current
    if (!cv || !root) return
    const ctx = cv.getContext('2d')
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const GAP = 22
    const R = 150
    let w = 0
    let h = 0
    let dpr = 1
    let raf = 0
    let tx = -1e4
    let ty = -1e4
    let cx = -1e4
    let cy = -1e4
    let color = '127,180,255'

    const readColor = () => {
      const v = getComputedStyle(root).getPropertyValue('--dot').trim()
      if (v) color = v
    }
    const paint = () => {
      ctx.clearRect(0, 0, w, h)
      for (let y = GAP / 2; y < h; y += GAP) {
        for (let x = GAP / 2; x < w; x += GAP) {
          const dx = x - cx
          const dy = y - cy
          const d = Math.hypot(dx, dy)
          const f = d < R ? 1 - d / R : 0
          const k = f * f
          const push = k * 6
          const nx = d ? x + (dx / d) * push : x
          const ny = d ? y + (dy / d) * push : y
          ctx.fillStyle = `rgba(${color},${0.14 + k * 0.75})`
          ctx.beginPath()
          ctx.arc(nx, ny, 1 + k * 1.2, 0, Math.PI * 2)
          ctx.fill()
        }
      }
    }
    const tick = () => {
      cx += (tx - cx) * 0.18
      cy += (ty - cy) * 0.18
      paint()
      raf = Math.abs(tx - cx) + Math.abs(ty - cy) > 0.5 ? requestAnimationFrame(tick) : 0
    }
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(tick)
    }
    const size = () => {
      const r = root.getBoundingClientRect()
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = r.width
      h = r.height
      cv.width = w * dpr
      cv.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      readColor()
      paint()
    }
    const move = (e) => {
      const r = root.getBoundingClientRect()
      tx = e.clientX - r.left
      ty = e.clientY - r.top
      // jump in rather than sliding from far away
      if (cx < -1e3) {
        cx = tx
        cy = ty
      }
      kick()
    }
    const leave = () => {
      tx = ty = -1e4
      cx = cy = -1e4
      paint()
    }
    const ro = new ResizeObserver(size)
    ro.observe(root)
    // repaint in the right colour when the theme flips
    const mo = new MutationObserver(() => {
      readColor()
      paint()
    })
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    if (fine && !reduce) {
      root.addEventListener('pointermove', move)
      root.addEventListener('pointerleave', leave)
    }
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      mo.disconnect()
      root.removeEventListener('pointermove', move)
      root.removeEventListener('pointerleave', leave)
    }
  }, [host])
  return <canvas ref={canvas} className="svx__dots" aria-hidden="true" />
}

export default function ServicesStack() {
  const panel = useRef(null)
  const inView = useInView(panel, { margin: '-20% 0px' })
  const [active, setActive] = useState(0)
  const [auto, setAuto] = useState(true)
  const [hovering, setHovering] = useState(false)
  const [hint, setHint] = useState(null) // service id pointed at by a hovered chip
  const tilt = useTilt(4)
  const s = SERVICES[active]
  const V = VISUALS[s.id]
  const playing = auto && inView && !hovering

  const pick = (i) => {
    setAuto(false)
    setActive(i)
  }
  const onKey = (e) => {
    const step = e.key === 'ArrowDown' || e.key === 'ArrowRight' ? 1 : e.key === 'ArrowUp' || e.key === 'ArrowLeft' ? -1 : 0
    if (!step) return
    e.preventDefault()
    const n = (active + step + SERVICES.length) % SERVICES.length
    pick(n)
    panel.current?.querySelectorAll('.svx__tab')[n]?.focus()
  }

  return (
    <section className="svx" id="services">
      <div className="container">
        <div className="section-head svx__head">
          <div>
            <Eyebrow>What we do</Eyebrow>
            <SplitHeading text="Everything you need to build, launch and grow — under one *roof*." className="h2" />
          </div>
          <ScrollText className="lead" text="Three disciplines, one team. Pick a service to see what we build." />
        </div>

        <motion.div
          ref={panel}
          className="svx__panel"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10% 0px' }}
          transition={{ duration: 0.9, ease }}
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
        >
          <DotField host={panel} />

          <div className="svx__list" role="tablist" aria-label="Services" aria-orientation="vertical" onKeyDown={onKey}>
            {SERVICES.map((x, i) => {
              const on = i === active
              return (
                <div key={x.id} className={`svx__item ${on ? 'is-on' : ''} ${hint === x.id ? 'is-hint' : ''}`}>
                  <button
                    type="button"
                    role="tab"
                    id={`svx-tab-${x.id}`}
                    aria-selected={on}
                    aria-controls="svx-stage"
                    tabIndex={on ? 0 : -1}
                    className="svx__tab"
                    onClick={() => pick(i)}
                    onMouseEnter={() => !on && pick(i)}
                  >
                    <span className="svx__num">{x.num}</span>
                    <span className="svx__name">{x.tag.replace(' Development', '')}</span>
                    <span className="svx__plus" aria-hidden="true" />
                  </button>
                  <span className="svx__bar" aria-hidden="true">
                    {on && <i key={`${active}-${auto}`} style={{ animationDuration: `${CYCLE}s`, animationPlayState: playing ? 'running' : 'paused', opacity: auto ? 1 : 0 }} onAnimationEnd={() => auto && setActive((a) => (a + 1) % SERVICES.length)} />}
                  </span>
                  <AnimatePresence initial={false}>
                    {on && (
                      <motion.div className="svx__body" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.55, ease }}>
                        <div className="svx__inner">
                          <h3>{x.title}</h3>
                          <p>{x.short}</p>
                          <ul>
                            {x.build.slice(0, 4).map((b) => (
                              <li key={b}>{b}</li>
                            ))}
                          </ul>
                          <Link to={`/services#${x.id}`} className="svx__more">
                            {x.cta} <Arrow />
                          </Link>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}
          </div>

          <Link to={`/services#${s.id}`} id="svx-stage" role="tabpanel" aria-labelledby={`svx-tab-${s.id}`} className={`svx__stage svx__stage--${s.id}`} data-cursor="Open" style={tilt.style} onMouseMove={tilt.onMouseMove} onMouseLeave={tilt.onMouseLeave}>
            <span className="svx__glow" aria-hidden="true" />
            <span className="svx__label" aria-hidden="true">
              <i /> {s.num} / 0{SERVICES.length}
            </span>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={s.id} className="svx__visual" initial={{ opacity: 0, y: 24, scale: 0.96, filter: 'blur(8px)' }} animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }} exit={{ opacity: 0, y: -16, scale: 0.98, filter: 'blur(8px)' }} transition={{ duration: 0.5, ease }}>
                <V />
              </motion.div>
            </AnimatePresence>
          </Link>
        </motion.div>

        <motion.div className="svx__caps" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-10% 0px' }} transition={{ duration: 0.9, ease, delay: 0.15 }} onMouseLeave={() => setHint(null)}>
          <ul>
            {CAPS.map(([t, id]) => (
              <li key={t} className={`${s.id === id ? 'is-on' : ''} ${hint === id ? 'is-hint' : ''}`}>
                <button type="button" onMouseEnter={() => setHint(id)} onFocus={() => setHint(id)} onBlur={() => setHint(null)} onClick={() => pick(SERVICES.findIndex((x) => x.id === id))}>
                  {t}
                </button>
              </li>
            ))}
          </ul>
          <Btn to="/services" variant="white" arrow>
            View all services
          </Btn>
        </motion.div>
      </div>
    </section>
  )
}
