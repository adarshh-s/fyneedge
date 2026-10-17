import { useRef } from 'react'
import { motion, useMotionValueEvent, useScroll, useTransform } from 'framer-motion'
import ArrowField from '../components/ArrowField.jsx'
import { ease } from '../components/ui.jsx'

// Inner-page hero — same arrow-tower field, glow and type as the home hero, a little shorter.
export default function PageHero({ eyebrow, title, text, children }) {
  const ref = useRef(null)
  const progress = useRef(0)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  useMotionValueEvent(scrollYProgress, 'change', (v) => (progress.current = v))
  const textY = useTransform(scrollYProgress, [0, 0.8], [0, -90])
  const textO = useTransform(scrollYProgress, [0, 0.6], [1, 0])

  return (
    <section className="ghero lhero lhero--page" ref={ref}>
      <motion.div className="ghero__field" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.6, ease }}>
        <ArrowField progressRef={progress} theme="dark" variant="lumina" />
      </motion.div>
      <motion.div className="ghero__content" style={{ y: textY, opacity: textO }}>
        <motion.p className="lhero__pill" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <i /> {eyebrow}
        </motion.p>
        <h1 className="hero__title">
          {title.split('\n').map((l, i) => (
            <span className="mask" key={i}>
              <motion.span initial={{ y: '110%' }} animate={{ y: '0%' }} transition={{ duration: 1.1, ease, delay: 0.1 + i * 0.12 }}>
                {l}
              </motion.span>
            </span>
          ))}
        </h1>
        {text && (
          <motion.p className="hero__sub" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.45, ease }}>
            {text}
          </motion.p>
        )}
        {children}
      </motion.div>
    </section>
  )
}
