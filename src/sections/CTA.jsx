import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Clouds from '../components/Clouds.jsx'
import { SITE } from '../config.js'
import { Btn, SplitHeading } from '../components/ui.jsx'

export default function CTA({
  title = "Have an idea? Let's build it.",
  text = "Tell us what you need — an app, a platform or an AI agent — and we'll show you how we'd build it. Free, no obligation.",
}) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end end'] })
  const scale = useTransform(scrollYProgress, [0, 1], [0.86, 1])
  const cloudY = useTransform(scrollYProgress, [0, 1], [120, 0])
  return (
    <section className="cta" ref={ref}>
      <motion.div className="cta__box" style={{ scale }}>
        <div className="stars" />
        <div className="cta__inner">
          <SplitHeading text={title} className="cta__title" />
          <p>{text}</p>
          <div className="hero__ctas">
            <Btn to="/contact" variant="lime" arrow>
              Book a free consultation
            </Btn>
            <Btn href={SITE.whatsapp} variant="glass">
              Chat on WhatsApp
            </Btn>
          </div>
        </div>
        <motion.div className="cta__clouds" style={{ y: cloudY }}>
          <Clouds seed={21} />
        </motion.div>
      </motion.div>
    </section>
  )
}
