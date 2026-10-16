import { useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion'
import { PhoneMock, Wave } from '../components/mockups.jsx'
import { Btn, Eyebrow, ease } from '../components/ui.jsx'

const STEPS = [
  {
    key: 'wa',
    label: 'WhatsApp outreach',
    text: 'Personalised WhatsApp messages and follow-ups on the app your leads check most.',
  },
  {
    key: 'em',
    label: 'Email outreach',
    text: 'Personalised email campaigns and follow-up sequences that land and get replies.',
  },
  {
    key: 'vc',
    label: 'AI voice calls',
    text: 'AI voice agents that call leads, have real conversations and qualify their interest.',
  },
]

function Screen({ k }) {
  if (k === 'wa')
    return (
      <div className="scr scr--wa">
        <div className="scr__top">
          <span className="scr__av">YB</span>
          <div>
            <b>Your Business</b>
            <small>online</small>
          </div>
        </div>
        <div className="scr__body">
          {[
            ['out', 'Hi Omar 👋 thanks for your interest in our new villas. Would you like the brochure?'],
            ['in', 'Yes please! What are the prices?'],
            ['out', 'Starting from 1.2M. I can book you a viewing — Saturday 11am or 4pm?'],
            ['in', '4pm works 👍'],
          ].map(([d, t], i) => (
            <motion.div key={i} className={`bubble bubble--${d}`} initial={{ opacity: 0, y: 14, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay: 0.25 + i * 0.35 }}>
              {t}
            </motion.div>
          ))}
        </div>
      </div>
    )
  if (k === 'em')
    return (
      <div className="scr scr--em">
        <p className="scr__h">Inbox</p>
        {[
          ['Sarah K.', 'Re: Quick question about pricing', "Thanks, that's helpful — can we talk Tuesday?", true],
          ['Follow-up #2', 'Still interested in a demo?', 'Sent automatically · 2 days after no reply'],
          ['James R.', 'Re: Your proposal', 'Looks great. Sending it to our team now.'],
          ['Sequence', '48 leads · Day 3', 'Open rate tracking on'],
        ].map(([f, s, p, hot], i) => (
          <motion.div key={i} className={`mailrow ${hot ? 'mailrow--hot' : ''}`} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.15 }}>
            <span className="mailrow__av">{f[0]}</span>
            <div>
              <b>{f}</b>
              <i>{s}</i>
              <small>{p}</small>
            </div>
          </motion.div>
        ))}
      </div>
    )
  return (
    <div className="scr scr--vc">
      <small>OmniReach AI · calling</small>
      <motion.div className="scr__orb" animate={{ scale: [1, 1.08, 1] }} transition={{ repeat: Infinity, duration: 1.8 }} />
      <b>Daniel Hughes</b>
      <span>03:42</span>
      <Wave bars={22} />
      <motion.div className="scr__note" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
        ✓ Interested · demo booked for Thu
      </motion.div>
      <div className="scr__end" />
    </div>
  )
}

export default function OmniPhone() {
  const ref = useRef(null)
  const [active, setActive] = useState(0)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  useMotionValueEvent(scrollYProgress, 'change', (v) => setActive(Math.min(STEPS.length - 1, Math.floor(v * STEPS.length))))

  return (
    <section className="omni-pin" ref={ref}>
      <div className={`omni-pin__sticky step-${active}`}>
        <div className="container omni-pin__grid">
          <div className="omni-pin__text">
            <Eyebrow>Flagship · OmniReach AI</Eyebrow>
            <h2 className="h2">Reach every lead. On every channel. Automatically.</h2>
            <ol className="omni-pin__steps">
              {STEPS.map((s, i) => (
                <li key={s.key} className={i === active ? 'is-active' : ''}>
                  <span className="omni-pin__idx">0{i + 1}</span>
                  <div>
                    <b>{s.label}</b>
                    <motion.p initial={false} animate={{ height: i === active ? 'auto' : 0, opacity: i === active ? 1 : 0 }} transition={{ duration: 0.5, ease }}>
                      {s.text}
                    </motion.p>
                  </div>
                </li>
              ))}
            </ol>
            <Btn to="/products#omnireach" variant="dark" arrow>
              Book an OmniReach AI demo
            </Btn>
          </div>
          <div className="omni-pin__phone">
            <motion.div className="omni-pin__glow" animate={{ rotate: active * 120 }} transition={{ duration: 1, ease }} />
            <PhoneMock className="phone--lg">
              <AnimatePresence mode="wait">
                <motion.div key={STEPS[active].key} className="scr-wrap" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.45, ease }}>
                  <Screen k={STEPS[active].key} />
                </motion.div>
              </AnimatePresence>
            </PhoneMock>
          </div>
        </div>
      </div>
    </section>
  )
}
