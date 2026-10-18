import { useRef } from 'react'
import { motion, useMotionValueEvent, useScroll, useTransform } from 'framer-motion'
import ArrowField from '../components/ArrowField.jsx'
import { SITE } from '../config.js'
import { Btn } from '../components/ui.jsx'

// Outro — mirrors the hero exit: the field flies in and settles, the glow rises,
// and the headline arrives from large and blurred to sharp. Pinned briefly, no hard edges.
export default function CTA({
  title = "Have an idea? Let's build it.",
  text = "Tell us what you need — an app, a platform or an AI agent — and we'll show you how we'd build it. Free, no obligation.",
}) {
  const ref = useRef(null)
  const field = useRef(0.55)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end end'] })
  // field: starts zoomed in and faded, settles to rest as you arrive
  useMotionValueEvent(scrollYProgress, 'change', (v) => (field.current = Math.max(0, 0.55 * (1 - v / 0.62))))
  const glowY = useTransform(scrollYProgress, [0.15, 0.7], ['45%', '0%'])
  const glowO = useTransform(scrollYProgress, [0.15, 0.6], [0, 1])
  const titleS = useTransform(scrollYProgress, [0.3, 0.68], [1.9, 1])
  const titleO = useTransform(scrollYProgress, [0.3, 0.55], [0, 1])
  const titleB = useTransform(scrollYProgress, [0.3, 0.62], ['blur(18px)', 'blur(0px)'])
  const restO = useTransform(scrollYProgress, [0.62, 0.8], [0, 1])
  const restY = useTransform(scrollYProgress, [0.62, 0.82], [30, 0])

  return (
    <section className="outro" ref={ref}>
      <div className="outro__sticky lhero">
        <div className="outro__field">
          <ArrowField progressRef={field} theme="dark" variant="lumina" />
        </div>
        <motion.div className="outro__glow" style={{ y: glowY, opacity: glowO }} />
        <div className="outro__inner">
          <motion.h2 className="outro__title" style={{ scale: titleS, opacity: titleO, filter: titleB }}>
            {title}
          </motion.h2>
          <motion.div className="outro__rest" style={{ opacity: restO, y: restY }}>
            <p>{text}</p>
            <div className="hero__ctas">
              <Btn to="/contact" variant="snow">
                Book a free consultation
              </Btn>
              <Btn href={SITE.whatsapp} variant="night">
                Chat on WhatsApp
              </Btn>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
