import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useInView, useScroll, useTransform } from 'framer-motion'
import { Btn, Eyebrow, SplitHeading, ease } from '../components/ui.jsx'

// Keys that map to something we offer
const MAP = {
  W: { name: 'Web apps', line: 'Portals, dashboards and SaaS platforms built around how your business works.', to: '/services#web', tone: 'sky' },
  M: { name: 'Mobile apps', line: 'iOS and Android apps your customers keep — from first sketch to App Store.', to: '/services#mobile', tone: 'lime' },
  A: { name: 'AI agents', line: 'Voice, chat and workflow agents that answer, qualify, book and follow up 24/7.', to: '/services#ai', tone: 'ink' },
  O: { name: 'OmniReach AI', line: 'Reach every lead on WhatsApp, email and AI voice calls — from one platform.', to: '/products#omnireach', tone: 'wa' },
  S: { name: 'SEO · AEO · GEO', line: 'Get found on Google, in instant answers and inside AI assistants.', to: '/products#seo', tone: 'sky' },
  P: { name: 'Social Media AI', line: 'Plan, write, schedule and manage your posts — without the daily grind.', to: '/products#social', tone: 'pink' },
}
const ORDER = Object.keys(MAP)

// 'label:width' — every row adds up to 12.8 units
const ROWS = [
  ['esc:1.3', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '⌫:1.5'],
  ['tab:1.3', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '\\:1.5'],
  ['caps:1.6', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', '↵:2.2'],
  ['⇧:2.1', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '⇧:1.7'],
  ['fn', '⌃', '⌥', '⌘:1.3', 'space:4.2', '⌘:1.3', '⌥', '←', '→'],
].map((row) => row.map((k) => (k.length > 1 && k.includes(':') ? k.split(':') : [k, 1])))

const TRAITS = [
  ['Fast', 'Short build cycles — working progress every step.'],
  ['Personal', 'Designed around your business, customers and tone.'],
  ['Reliable', 'Tested on real devices and real conversations.'],
  ['Measured', 'Clear goals and reporting on every app and agent.'],
]

export default function Shortcut() {
  const ref = useRef(null)
  const inView = useInView(ref, { margin: '-30% 0px' })
  const [active, setActive] = useState('W')
  const [pressed, setPressed] = useState(null)
  const [auto, setAuto] = useState(true)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'center center'] })
  const tilt = useTransform(scrollYProgress, [0, 1], [48, 14])
  const lift = useTransform(scrollYProgress, [0, 1], [80, 0])

  // auto-cycle until the visitor interacts
  useEffect(() => {
    if (!auto || !inView) return
    const id = setInterval(() => {
      setActive((a) => {
        const next = ORDER[(ORDER.indexOf(a) + 1) % ORDER.length]
        setPressed(next)
        setTimeout(() => setPressed(null), 180)
        return next
      })
    }, 2400)
    return () => clearInterval(id)
  }, [auto, inView])

  // physical keyboard support while the section is on screen
  useEffect(() => {
    if (!inView) return
    const down = (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey || /input|textarea/i.test(e.target.tagName)) return
      const k = e.key.length === 1 ? e.key.toUpperCase() : null
      if (!k) return
      setPressed(k)
      if (MAP[k]) {
        setAuto(false)
        setActive(k)
      }
    }
    const up = () => setPressed(null)
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    return () => {
      window.removeEventListener('keydown', down)
      window.removeEventListener('keyup', up)
    }
  }, [inView])

  const pick = (k) => {
    if (!MAP[k]) return
    setAuto(false)
    setActive(k)
  }
  const item = MAP[active]

  return (
    <section className="shortcut" ref={ref}>
      <div className="container section-head section-head--center">
        <Eyebrow>Your shortcut</Eyebrow>
        <SplitHeading text="One shortcut to everything your business needs." className="h2" />
        <p className="lead">
          Press <kbd className="kbd-inline">W</kbd> <kbd className="kbd-inline">M</kbd> <kbd className="kbd-inline">A</kbd> <kbd className="kbd-inline">O</kbd> <kbd className="kbd-inline">S</kbd> or <kbd className="kbd-inline">P</kbd> on your keyboard — or tap a glowing key.
        </p>
      </div>

      <div className="shortcut__stage">
        <ul className="shortcut__traits">
          {TRAITS.map(([t, d], i) => (
            <motion.li key={t} className={`trait trait--${i}`} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 + i * 0.1, duration: 0.8, ease }}>
              <b>{t}</b>
              <span>{d}</span>
            </motion.li>
          ))}
        </ul>

        <motion.div className="kb-wrap" style={{ rotateX: tilt, y: lift }}>
          <div className="kb">
            {ROWS.map((row, r) => (
              <div className="kb__row" key={r}>
                {row.map(([k, w], i) => {
                  const live = MAP[k]
                  return (
                    <button
                      key={i}
                      type="button"
                      tabIndex={live ? 0 : -1}
                      className={`key ${live ? `key--live tone-${live.tone}` : ''} ${active === k ? 'is-active' : ''} ${pressed === k ? 'is-pressed' : ''}`}
                      style={{ '--w': w }}
                      onClick={() => pick(k)}
                      onPointerDown={() => setPressed(k)}
                      onPointerUp={() => setPressed(null)}
                      onPointerLeave={() => pressed === k && setPressed(null)}
                      aria-label={live ? live.name : undefined}
                    >
                      <span className="key__cap">{k === 'space' ? '' : k}</span>
                      {live && <span className="key__label">{live.name}</span>}
                    </button>
                  )
                })}
              </div>
            ))}
          </div>
        </motion.div>

        <div className="shortcut__panel">
          <AnimatePresence mode="wait">
            <motion.div key={active} className="shortcut__card" initial={{ opacity: 0, y: 16, filter: 'blur(6px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} exit={{ opacity: 0, y: -12, filter: 'blur(6px)' }} transition={{ duration: 0.4, ease }}>
              <span className={`shortcut__key tone-${item.tone}`}>{active}</span>
              <div>
                <b>{item.name}</b>
                <p>{item.line}</p>
              </div>
              <Btn to={item.to} variant="dark" arrow>
                Open
              </Btn>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
