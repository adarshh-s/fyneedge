import { useRef } from 'react'
import { motion, useMotionValueEvent, useScroll, useTransform } from 'framer-motion'
import HaloRing, { useRingPointer } from '../components/HaloRing.jsx'
import { SITE } from '../config.js'
import { Accent, Btn } from '../components/ui.jsx'

// Outro — mirrors the hero exit in reverse: the woven ring settles in from large around the headline,
// which arrives from big and blurred to sharp. Pinned briefly, no hard edges.
export default function CTA({
  title = "Have an idea? Let's build *it*.",
  text = "Tell us what you need — an app, a platform or an AI agent — and we'll show you how we'd build it. Free, no obligation.",
}) {
  const ref = useRef(null)
  const arrival = useRef(0)
  const [input, ring] = useRingPointer()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end end'] })
  useMotionValueEvent(scrollYProgress, 'change', (v) => (arrival.current = Math.min(1, v / 0.62)))
  const titleS = useTransform(scrollYProgress, [0.3, 0.68], [1.9, 1])
  const titleO = useTransform(scrollYProgress, [0.3, 0.55], [0, 1])
  const titleB = useTransform(scrollYProgress, [0.3, 0.62], ['blur(18px)', 'blur(0px)'])
  const restO = useTransform(scrollYProgress, [0.62, 0.8], [0, 1])
  const restY = useTransform(scrollYProgress, [0.62, 0.82], [30, 0])

  return (
    <section className="outro" ref={ref}>
      <div className="outro__sticky" data-cursor-idle {...ring}>
        <div className="outro__field">
          <HaloRing progress={arrival} input={input} layout="center" />
        </div>
        <div className="outro__inner">
          <motion.h2 className="outro__title" style={{ scale: titleS, opacity: titleO, filter: titleB }}>
            <Accent text={title} />
          </motion.h2>
          <motion.div className="outro__rest" style={{ opacity: restO, y: restY }}>
            <p>{text}</p>
            <div className="hero__ctas">
              <Btn to="/contact" variant="white">
                Book a free consultation
              </Btn>
              <Btn href={SITE.whatsapp} variant="ghostpill">
                Chat on WhatsApp
              </Btn>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
