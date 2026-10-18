import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { SERVICES } from '../data.js'
import { AgentMock, AppScreen, BrowserMock, PhoneMock } from '../components/mockups.jsx'
import { Arrow, Btn, Eyebrow, SplitHeading, ease } from '../components/ui.jsx'

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

const TAGS = ['Customer portals', 'SaaS platforms', 'iOS & Android', 'AI voice agents', 'WhatsApp agents', 'Workflow automation', 'CRM integrations', 'Booking & payments']

export default function ServicesStack() {
  return (
    <section className="sbento container" id="services">
      <div className="section-head">
        <Eyebrow>What we do</Eyebrow>
        <SplitHeading text="Everything you need to build, launch and grow — under one roof." className="h2" />
      </div>

      <div className="sbento__grid">
        {SERVICES.map((s, i) => {
          const V = VISUALS[s.id]
          return (
            <motion.div
              key={s.id}
              className={`sbento__cell sbento__cell--${s.id}`}
              initial={{ opacity: 0, y: 50, scale: 0.97 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: '-10% 0px' }}
              transition={{ duration: 0.9, ease, delay: i * 0.12 }}
            >
              <Link to={`/services#${s.id}`} className="spot sbento__card" data-cursor="Open">
                <div className="sbento__text">
                  <span className="sbento__num">
                    {s.num} <i /> {s.tag}
                  </span>
                  <h3>{s.title}</h3>
                  <p>{s.short}</p>
                </div>
                <div className="sbento__visual">
                  <V />
                </div>
                <span className="sbento__go">
                  <Arrow />
                </span>
              </Link>
            </motion.div>
          )
        })}

        <motion.div
          className="sbento__cell sbento__cell--tags"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10% 0px' }}
          transition={{ duration: 0.9, ease, delay: 0.36 }}
        >
          <div className="spot sbento__card sbento__card--tags">
            <ul>
              {TAGS.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
            <Btn to="/services" variant="snow" arrow>
              View all services
            </Btn>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
