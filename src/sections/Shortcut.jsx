import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useInView, useScroll, useTransform } from 'framer-motion'
import { Btn, Eyebrow, SplitHeading, ease } from '../components/ui.jsx'

// Keys that map to something we offer
const MAP = {
  W: { name: 'Web apps', line: 'Portals, dashboards and SaaS platforms built around how you work.', to: '/services#web', tone: 'sky' },
  M: { name: 'Mobile apps', line: 'iOS and Android apps your customers keep using.', to: '/services#mobile', tone: 'lime' },
  A: { name: 'AI agents', line: 'Agents that answer, qualify, book and follow up — 24/7.', to: '/services#ai', tone: 'ink' },
  V: { name: 'Voice agents', line: 'Natural phone calls for lead qualification, reminders and support.', to: '/services#ai', tone: 'wa' },
  C: { name: 'Chat agents', line: 'Instant answers on WhatsApp and your website, any time of day.', to: '/services#ai', tone: 'sky' },
  F: { name: 'Flow automation', line: 'Forms, CRM and calendar connected — no manual work.', to: '/services#ai', tone: 'pink' },
}
const ORDER = Object.keys(MAP)

// Mac-style layout. Each key: [legend, width (u), sub-legend, extra class]. Every row adds up to 15u.
const F = (n) => [`F${n}`, 1, '', 'fnkey']
const ROWS = [
  [['esc', 1.5, '', 'mod'], ...Array.from({ length: 12 }, (_, i) => F(i + 1)), ['', 1.5, '', 'touch']],
  [['~', 1, '`'], ['1', 1, '!'], ['2', 1, '@'], ['3', 1, '#'], ['4', 1, '$'], ['5', 1, '%'], ['6', 1, '^'], ['7', 1, '&'], ['8', 1, '*'], ['9', 1, '('], ['0', 1, ')'], ['–', 1, '_'], ['=', 1, '+'], ['delete', 2, '', 'mod mod--r']],
  [['tab', 1.5, '', 'mod'], ...'QWERTYUIOP'.split('').map((c) => [c, 1]), ['[', 1, '{'], [']', 1, '}'], ['\\', 1.5, '|']],
  [['caps lock', 1.8, '', 'mod'], ...'ASDFGHJKL'.split('').map((c) => [c, 1]), [';', 1, ':'], ["'", 1, '"'], ['return', 2.2, '', 'mod mod--r']],
  [['shift', 2.35, '⇧', 'mod'], ...'ZXCVBNM'.split('').map((c) => [c, 1]), [',', 1, '<'], ['.', 1, '>'], ['/', 1, '?'], ['shift', 2.65, '⇧', 'mod mod--r']],
  [['fn', 1, '◍', 'mod'], ['control', 1, '⌃', 'mod'], ['option', 1, '⌥', 'mod'], ['command', 1.25, '⌘', 'mod'], [' ', 5.5, '', 'space'], ['command', 1.25, '⌘', 'mod'], ['option', 1, '⌥', 'mod'], ['←', 1, '', 'arrow'], ['ARROWS', 1], ['→', 1, '', 'arrow']],
]

const TRAITS = [
  ['Fast', 'Short build cycles — working progress every step.'],
  ['Personal', 'Designed around your business, customers and tone.'],
  ['Reliable', 'Tested on real devices and real conversations.'],
  ['Measured', 'Clear goals and reporting on every app and agent.'],
]

function KeyCap({ k, w = 1, sub, extra = '', live, active, pressed, onPick, onDown, onUp }) {
  const cls = ['key', extra, live && `key--live tone-${live.tone}`, active && 'is-active', pressed && 'is-pressed'].filter(Boolean).join(' ')
  return (
    <button
      type="button"
      tabIndex={live ? 0 : -1}
      className={cls}
      style={{ '--w': w }}
      onClick={onPick}
      onPointerDown={onDown}
      onPointerUp={onUp}
      onPointerLeave={() => pressed && onUp?.()}
      aria-label={live ? live.name : undefined}
    >
      <span className="key__face">
        {sub && <span className="key__sub">{sub}</span>}
        <span className="key__main">{k}</span>
        {live && <span className="key__label">{live.name}</span>}
      </span>
    </button>
  )
}

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
        <SplitHeading text="One team for *everything* you need to build." className="h2" />
        <p className="lead">
          Press <kbd className="kbd-inline">W</kbd> <kbd className="kbd-inline">M</kbd> <kbd className="kbd-inline">A</kbd> <kbd className="kbd-inline">V</kbd> <kbd className="kbd-inline">C</kbd> or <kbd className="kbd-inline">F</kbd> — or tap a glowing key.
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
            <div className="kb__deck">
              {ROWS.map((row, r) => (
                <div className={`kb__row ${r === 0 ? 'kb__row--fn' : ''}`} key={r}>
                  {row.map(([k, w, sub, extra = ''], i) => {
                    if (k === 'ARROWS')
                      return (
                        <div className="key-stack" key={i} style={{ '--w': w }}>
                          <KeyCap k="↑" extra="arrow half" />
                          <KeyCap k="↓" extra="arrow half" />
                        </div>
                      )
                    const live = MAP[k]
                    return (
                      <KeyCap
                        key={i}
                        k={k}
                        w={w}
                        sub={sub}
                        extra={extra}
                        live={live}
                        active={active === k}
                        pressed={pressed === k}
                        onPick={() => pick(k)}
                        onDown={() => setPressed(k)}
                        onUp={() => setPressed(null)}
                      />
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
          <div className="kb-floor" />
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
