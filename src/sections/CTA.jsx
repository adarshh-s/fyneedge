import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import ArrowField from '../components/ArrowField.jsx'
import { SITE } from '../config.js'
import { Btn, SplitHeading } from '../components/ui.jsx'

const STILL = { current: 0 }

export default function CTA({
  title = "Have an idea? Let's build it.",
  text = "Tell us what you need — an app, a platform or an AI agent — and we'll show you how we'd build it. Free, no obligation.",
}) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end end'] })
  const scale = useTransform(scrollYProgress, [0, 1], [0.86, 1])
  return (
    <section className="cta" ref={ref}>
      <motion.div className="cta__box lhero" style={{ scale }}>
        <div className="cta__field">
          <ArrowField progressRef={STILL} theme="dark" variant="lumina" />
        </div>
        <div className="cta__inner">
          <SplitHeading text={title} className="cta__title" />
          <p>{text}</p>
          <div className="hero__ctas">
            <Btn to="/contact" variant="snow">
              Book a free consultation
            </Btn>
            <Btn href={SITE.whatsapp} variant="night">
              Chat on WhatsApp
            </Btn>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
