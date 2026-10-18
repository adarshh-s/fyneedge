import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

// [text, highlighted?] — highlighted phrases light up pale blue as they're revealed
const PARTS = [
  ['One team turning ideas into', false],
  ['software that works', true],
  ['— and software into', false],
  ['growth.', true],
  ['Apps your customers love, and AI agents that answer, qualify and follow up', false],
  ['around the clock.', true],
]

function Word({ children, range, progress, hi }) {
  const opacity = useTransform(progress, range, [0.16, 1])
  return (
    <motion.span className={hi ? 'sw sw--hi' : 'sw'} style={{ opacity }}>
      {children}{' '}
    </motion.span>
  )
}

export default function Statement() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.8', 'end 0.5'] })
  const line = useTransform(scrollYProgress, [0, 0.6], [0, 1])
  const words = PARTS.flatMap(([t, hi]) => t.split(' ').map((w) => [w, hi]))
  return (
    <section className="statement container" ref={ref}>
      <div className="statement__rule">
        <motion.i style={{ scaleX: line }} />
        <span>↗</span>
      </div>
      <div className="statement__grid">
        <p className="statement__label">
          <span>01</span> About us
        </p>
        <p className="statement__text">
          {words.map(([w, hi], i) => (
            <Word key={i} hi={hi} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>
              {w}
            </Word>
          ))}
        </p>
      </div>
    </section>
  )
}
