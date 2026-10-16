import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Eyebrow } from '../components/ui.jsx'

// "{name}" tokens render inline icon pills
const TEXT = 'One team turning ideas into {bolt} software that works — and software into {spark} growth. Apps your customers love, and AI agents that answer, qualify and follow up {clock} around the clock.'

const ICONS = {
  bolt: (
    <span className="ico ico--sky">
      <svg viewBox="0 0 24 24">
        <path d="M13 2 4 14h7l-1 8 9-12h-7z" fill="currentColor" />
      </svg>
    </span>
  ),
  spark: (
    <span className="ico ico--lime">
      <svg viewBox="0 0 24 24">
        <path d="M12 2c.6 4.8 2.2 6.9 8 8-5.8 1.1-7.4 3.2-8 10-.6-6.8-2.2-8.9-8-10 5.8-1.1 7.4-3.2 8-8Z" fill="currentColor" />
      </svg>
    </span>
  ),
  clock: (
    <span className="ico ico--dark">
      <svg viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth="2.2" />
        <path d="M12 7v5l3 2" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
    </span>
  ),
}

function Word({ children, range, progress }) {
  const opacity = useTransform(progress, range, [0.14, 1])
  const y = useTransform(progress, range, [6, 0])
  return (
    <motion.span className="sw" style={{ opacity, y }}>
      {children}
    </motion.span>
  )
}

export default function Statement() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.45'] })
  const tokens = TEXT.split(' ')
  return (
    <section className="statement container" ref={ref}>
      <Eyebrow>About us</Eyebrow>
      <p className="statement__text">
        {tokens.map((t, i) => {
          const range = [i / tokens.length, (i + 1) / tokens.length]
          const m = t.match(/^\{(\w+)\}$/)
          return (
            <Word key={i} range={range} progress={scrollYProgress}>
              {m ? ICONS[m[1]] : t}{' '}
            </Word>
          )
        })}
      </p>
    </section>
  )
}
