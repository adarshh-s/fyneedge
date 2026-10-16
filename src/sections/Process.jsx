import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { STEPS } from '../data.js'
import { Eyebrow, Reveal, SplitHeading } from '../components/ui.jsx'

export default function Process() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.8', 'end 0.6'] })
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1])
  return (
    <section className="process container" ref={ref}>
      <div className="section-head">
        <Eyebrow>How we work</Eyebrow>
        <SplitHeading text="From idea to impact in four clear steps." className="h2" />
      </div>
      <div className="process__line">
        <motion.i style={{ scaleX }} />
      </div>
      <div className="process__grid">
        {STEPS.map(([t, d], i) => (
          <Reveal className="process__step" key={t} delay={i * 0.12}>
            <span className="process__dot">0{i + 1}</span>
            <h3>{t}</h3>
            <p>{d}</p>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
