import { Link } from 'react-router-dom'
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { SITE } from '../config.js'
import { Accent, Btn, Logo, ease } from './ui.jsx'
import { useProximity } from './interactions.jsx'

// late in a month we're already booking the next one
const bookingMonth = (d = new Date()) => {
  const m = d.getDate() > 20 ? new Date(d.getFullYear(), d.getMonth() + 1, 1) : d
  return m.toLocaleString('en-US', { month: 'long' })
}

/* studio clock — ticks every second in the studio's own timezone */
function LocalTime() {
  const fmt = (d) => {
    try {
      return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: SITE.timezone, timeZoneName: 'short' })
    } catch {
      return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit', timeZoneName: 'short' })
    }
  }
  const [now, setNow] = useState(() => fmt(new Date()))
  useEffect(() => {
    const id = setInterval(() => setNow(fmt(new Date())), 1000)
    return () => clearInterval(id)
  }, [])
  return <span className="footer__time">{now}</span>
}

/* the email, big — click to copy, with a confirmation that swaps in */
function CopyEmail() {
  const [copied, setCopied] = useState(false)
  const timer = useRef(0)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(SITE.email)
    } catch {
      window.location.href = `mailto:${SITE.email}`
      return
    }
    setCopied(true)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setCopied(false), 1800)
  }
  useEffect(() => () => clearTimeout(timer.current), [])
  return (
    <button type="button" className="footer__email" onClick={copy} data-cursor={copied ? 'Copied' : 'Copy'} aria-label={`Copy email address ${SITE.email}`}>
      <span className="footer__email-addr">{SITE.email}</span>
      <span className="footer__email-tag" aria-live="polite">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span key={copied ? 'y' : 'n'} initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -12, opacity: 0 }} transition={{ duration: 0.25, ease }}>
            {copied ? 'Copied ✓' : 'Click to copy'}
          </motion.span>
        </AnimatePresence>
      </span>
    </button>
  )
}

export default function Footer() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end end'] })
  const y = useTransform(scrollYProgress, [0, 1], ['60%', '0%'])
  const word = useRef(null)
  useProximity(word, '.fchar', 320)

  return (
    <footer className="footer" ref={ref}>
      <div className="container footer__cta">
        <p className="footer__status">
          <i className={SITE.available ? '' : 'is-off'} />
          {SITE.available ? `Taking new projects for ${bookingMonth()}` : 'Booked up — join the waitlist'}
        </p>
        <p className="footer__kicker">
          <Accent text="Say *hello*" />
        </p>
        <div className="footer__actions">
          <CopyEmail />
          <Btn to="/contact" variant="white" arrow>
            Book a call
          </Btn>
        </div>
        <p className="footer__clock">
          Local time <LocalTime />
        </p>
      </div>

      <div className="container footer__grid">
        <div className="footer__brand">
          <Logo light />
          <p>{SITE.tagline}</p>
        </div>
        <div>
          <h4>Services</h4>
          <Link to="/services#web">Web Applications</Link>
          <Link to="/services#mobile">Mobile Apps</Link>
          <Link to="/services#ai">AI Agents</Link>
        </div>
        <div>
          <h4>Company</h4>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
          <a href={SITE.whatsapp} target="_blank" rel="noreferrer">
            WhatsApp
          </a>
        </div>
      </div>
      <div className="container footer__bottom">
        <span>
          © {SITE.year} {SITE.name}. All rights reserved.
        </span>
        <span className="footer__legal">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms</a>
        </span>
      </div>
      <div className="footer__word" aria-hidden="true" ref={word}>
        <motion.span style={{ y }}>
          {SITE.name.split('').map((ch, i) => (
            <span className="fchar" key={i}>
              {ch}
            </span>
          ))}
        </motion.span>
      </div>
    </footer>
  )
}
