import { useRef } from 'react'
import { motion, useAnimationFrame, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion'
import Clouds from '../components/Clouds.jsx'
import { RING_CARDS } from '../components/mockups.jsx'
import { Btn, ease } from '../components/ui.jsx'

const line = (delay) => ({
  initial: { y: '110%' },
  animate: { y: '0%' },
  transition: { duration: 1.1, ease, delay },
})

function Ring({ progress }) {
  const rot = useMotionValue(0)
  const boost = useSpring(useTransform(progress, [0, 1], [0, 160]), { stiffness: 60, damping: 20 })
  useAnimationFrame((t) => rot.set(-(t / 1000) * 7 - boost.get()))
  const cards = [...RING_CARDS, ...RING_CARDS]
  const n = cards.length
  return (
    <div className="ring-stage">
      <div className="ring-wrap">
        <motion.div className="ring" style={{ rotateY: rot }}>
          {cards.map((Card, i) => (
            <div className="ring__item" key={i} style={{ '--a': `${(360 / n) * i}deg`, '--dy': `${(i % 3) * 10 - 10}px` }}>
              <Card />
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}

export default function Hero() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const scale = useTransform(scrollYProgress, [0, 0.7], [1, 0.9])
  const radius = useTransform(scrollYProgress, [0, 0.7], [28, 56])
  const textY = useTransform(scrollYProgress, [0, 0.6], [0, -140])
  const textO = useTransform(scrollYProgress, [0, 0.45], [1, 0])
  const ringY = useTransform(scrollYProgress, [0, 0.8], [0, -120])
  const cloudY = useTransform(scrollYProgress, [0, 1], [0, -160])
  const cloudBackY = useTransform(scrollYProgress, [0, 1], [0, -60])

  return (
    <section className="hero" ref={ref}>
      <div className="hero__sticky">
        <motion.div className="hero__sky" style={{ scale, borderRadius: radius }}>
          <div className="hero__sun" />
          <div className="stars" />
          <motion.div className="hero__clouds hero__clouds--back" style={{ y: cloudBackY }}>
            <Clouds seed={8} density={0.55} />
          </motion.div>

          <motion.div className="hero__content" style={{ y: textY, opacity: textO }}>
            <motion.p className="pill pill--glass" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}>
              <span className="dot" /> Web · Mobile · AI agents
            </motion.p>
            <h1 className="hero__title">
              <span className="mask">
                <motion.span {...line(0.15)}>We build software & AI agents</motion.span>
              </span>
              <span className="mask">
                <motion.span {...line(0.27)} className="hero__soft">
                  that grow your business.
                </motion.span>
              </span>
            </h1>
            <motion.p className="hero__sub" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.6, ease }}>
              Web applications, mobile apps and AI agents — designed, built and run by one team. From the first idea to customers answered on WhatsApp, email and the phone.
            </motion.p>
            <motion.div className="hero__ctas" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.75, ease }}>
              <Btn to="/products#omnireach" variant="glass">
                Explore OmniReach AI
              </Btn>
              <Btn to="/contact" variant="lime" arrow>
                Book a free consultation
              </Btn>
            </motion.div>
          </motion.div>

          <motion.div className="hero__ring" style={{ y: ringY }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.6, delay: 0.5 }}>
            <Ring progress={scrollYProgress} />
          </motion.div>

          <motion.div className="hero__clouds" style={{ y: cloudY }}>
            <Clouds seed={3} />
          </motion.div>

          <div className="hero__foot">
            <span>Strategy · Design · Engineering · AI</span>
            <span className="hero__scroll">
              Scroll <i />
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
