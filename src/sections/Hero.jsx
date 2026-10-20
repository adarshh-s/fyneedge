import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValueEvent, useScroll, useTransform } from 'framer-motion'
import HaloRing, { useRingPointer } from '../components/HaloRing.jsx'
import { Btn, ease } from '../components/ui.jsx'

const WORDS = ['Web apps', 'Mobile apps', 'AI agents', 'Automation']

/* types a word, holds it, erases it, moves to the next */
function useCycle(words) {
  const [text, setText] = useState('')
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      let i = 0
      setText(words[0])
      const id = setInterval(() => setText(words[++i % words.length]), 2600)
      return () => clearInterval(id)
    }
    let w = 0
    let c = 0
    let dir = 1
    let t
    const tick = () => {
      const word = words[w]
      c += dir
      setText(word.slice(0, c))
      if (dir > 0 && c === word.length) {
        dir = -1
        t = setTimeout(tick, 2200)
      } else if (dir < 0 && c === 0) {
        dir = 1
        w = (w + 1) % words.length
        t = setTimeout(tick, 280)
      } else t = setTimeout(tick, dir > 0 ? 85 : 40)
    }
    t = setTimeout(tick, 700)
    return () => clearTimeout(t)
  }, [words])
  return text
}

const rise = (delay) => ({
  initial: { opacity: 0, y: 24, filter: 'blur(10px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
  transition: { duration: 1.1, ease, delay },
})

export default function Hero() {
  const ref = useRef(null)
  const progress = useRef(0)
  // pointer + clicks shared with the ring canvas
  const [input, ring] = useRingPointer()
  const word = useCycle(WORDS)

  // pinned for a run of scroll: the ring flattens, grows and you pass through it
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  useMotionValueEvent(scrollYProgress, 'change', (v) => (progress.current = v))
  const wordS = useTransform(scrollYProgress, [0, 0.3], [1, 0.82])
  const wordO = useTransform(scrollYProgress, [0.05, 0.28], [1, 0])
  const wordY = useTransform(scrollYProgress, [0, 0.3], [0, 80])
  const restO = useTransform(scrollYProgress, [0, 0.12], [1, 0])
  const dim = useTransform(scrollYProgress, [0.55, 0.95], [0, 1])

  return (
    <section className="ghero-pin" ref={ref}>
      <div className="ghero rhero">
        <div className="rhero__stage" data-cursor-idle {...ring}>
          <motion.div className="rhero__ring" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 2, ease }}>
            <HaloRing progress={progress} input={input} />
          </motion.div>

          <div className="rhero__content">
            <h1 className="rhero__h1">
              <span className="sr-only">Software and AI agents that grow your business — </span>
              <motion.span className="rhero__wordwrap" style={{ scale: wordS, opacity: wordO, y: wordY }} aria-hidden="true">
                <motion.span className="rhero__word" {...rise(0.2)}>
                  {word || ' '}
                  <i className="rhero__caret" />
                </motion.span>
              </motion.span>
            </h1>
            <motion.div style={{ opacity: restO }}>
              <motion.p className="rhero__sub" {...rise(0.45)}>
                Software and AI agents that grow your business — designed, built and run by one team.
              </motion.p>
              <motion.div className="rhero__ctas" {...rise(0.6)}>
                <Btn to="/contact" variant="white">
                  Book a free consultation
                </Btn>
                <Btn to="/services" variant="ghostpill">
                  Our services
                </Btn>
              </motion.div>
            </motion.div>
          </div>

          <motion.div className="rhero__hint" style={{ opacity: restO }}>
            <span className="hint-fine">Move across the ring · Click to send a wave</span>
            <span className="hint-touch">Tap the ring to send a wave</span>
          </motion.div>
          <motion.span className="rhero__scroll" style={{ opacity: restO }}>
            <i /> Scroll
          </motion.span>
        </div>
        <motion.div className="ghero__dim" style={{ opacity: dim }} />
      </div>
    </section>
  )
}
