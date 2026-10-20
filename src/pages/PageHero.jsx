import { useRef } from 'react'
import { motion, useMotionValueEvent, useScroll, useTransform } from 'framer-motion'
import HaloRing, { useRingPointer } from '../components/HaloRing.jsx'
import { ease } from '../components/ui.jsx'

// Inner-page hero — the home hero's black stage and woven ring, laid along the bottom like a horizon.
export default function PageHero({ eyebrow, title, text, children }) {
  const ref = useRef(null)
  const progress = useRef(0)
  const [input, ring] = useRingPointer()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  useMotionValueEvent(scrollYProgress, 'change', (v) => (progress.current = v))
  const textY = useTransform(scrollYProgress, [0, 0.8], [0, -90])
  const textO = useTransform(scrollYProgress, [0, 0.6], [1, 0])

  return (
    <section className="phero" ref={ref}>
      <div className="phero__stage" data-cursor-idle {...ring}>
        <motion.div className="phero__ring" initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.8, ease }}>
          <HaloRing progress={progress} input={input} layout="horizon" />
        </motion.div>
        <motion.div className="phero__content" style={{ y: textY, opacity: textO }}>
          <motion.p className="glass-pill" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <i /> {eyebrow}
          </motion.p>
          <h1 className="phero__title">
            {title.split('\n').map((l, i) => (
              <span className="mask" key={i}>
                <motion.span initial={{ y: '110%' }} animate={{ y: '0%' }} transition={{ duration: 1.1, ease, delay: 0.1 + i * 0.12 }}>
                  {l}
                </motion.span>
              </span>
            ))}
          </h1>
          {text && (
            <motion.p className="phero__sub" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.45, ease }}>
              {text}
            </motion.p>
          )}
          {children}
        </motion.div>
      </div>
    </section>
  )
}
