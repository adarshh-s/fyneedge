import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { SERVICES } from '../data.js'
import { AgentMock, AppScreen, BrowserMock, PhoneMock } from '../components/mockups.jsx'
import { Btn, Eyebrow, SplitHeading } from '../components/ui.jsx'

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

function Card({ s, i, n, progress }) {
  const scale = useTransform(progress, [i / n, 1], [1, 1 - (n - 1 - i) * 0.05])
  const V = VISUALS[s.id]
  return (
    <div className="stack__slot" style={{ top: `calc(90px + ${i * 22}px)` }}>
      <motion.article className={`spot stack__card stack__card--${s.theme}`} style={{ scale }}>
        <div className="stack__text">
          <span className="stack__num">
            {s.num} / {s.tag}
          </span>
          <h3>{s.title}</h3>
          <p>{s.short}</p>
          <ul className="chips">
            {s.build.slice(0, 4).map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
          <Btn to={`/services#${s.id}`} variant={s.theme === 'lime' ? 'dark' : s.theme === 'dark' ? 'lime' : 'white'} arrow>
            {s.cta}
          </Btn>
        </div>
        <div className="stack__visual">
          <V />
        </div>
      </motion.article>
    </div>
  )
}

export default function ServicesStack() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  return (
    <section className="stack container" id="services">
      <div className="section-head">
        <Eyebrow>What we do</Eyebrow>
        <SplitHeading text="Everything you need to build, launch and grow — under one roof." className="h2" />
      </div>
      <div className="stack__list" ref={ref}>
        {SERVICES.map((s, i) => (
          <Card key={s.id} s={s} i={i} n={SERVICES.length} progress={scrollYProgress} />
        ))}
      </div>
      <div className="center">
        <Btn to="/services" variant="ghost" arrow>
          View all services
        </Btn>
      </div>
    </section>
  )
}
