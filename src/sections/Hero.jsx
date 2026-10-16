import { Fragment, useEffect, useRef } from 'react'
import { motion, useMotionValueEvent, useScroll, useTransform } from 'framer-motion'
import ArrowField from '../components/ArrowField.jsx'
import { Btn, ease } from '../components/ui.jsx'
import { useTheme } from '../theme.js'

const line = (delay) => ({
  initial: { y: '110%' },
  animate: { y: '0%' },
  transition: { duration: 1.1, ease, delay },
})

/* ---------- headline whose letters swell, lift and glow near the cursor ---------- */
function LiveTitle({ lines }) {
  const ref = useRef(null)
  useEffect(() => {
    const root = ref.current
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    const chars = [...root.querySelectorAll('.hchar')]
    let raf = 0
    let px = -9999
    let py = -9999
    const paint = () => {
      raf = 0
      for (const el of chars) {
        const r = el.getBoundingClientRect()
        const d = Math.hypot(px - (r.left + r.width / 2), py - (r.top + r.height / 2))
        const f = Math.max(0, 1 - d / 170)
        el.style.setProperty('--f', (f * f).toFixed(3))
      }
    }
    const move = (e) => {
      px = e.clientX
      py = e.clientY
      if (!raf) raf = requestAnimationFrame(paint)
    }
    const leave = () => {
      px = py = -9999
      if (!raf) raf = requestAnimationFrame(paint)
    }
    const host = root.closest('.ghero')
    host.addEventListener('pointermove', move)
    host.addEventListener('pointerleave', leave)
    return () => {
      cancelAnimationFrame(raf)
      host.removeEventListener('pointermove', move)
      host.removeEventListener('pointerleave', leave)
    }
  }, [])
  return (
    <h1 className="hero__title" ref={ref} data-cursor-idle aria-label={lines.map((l) => l.text).join(' ')}>
      {lines.map((l, li) => (
        <span className="mask" key={li} aria-hidden="true">
          <motion.span {...line(0.15 + li * 0.12)} className={l.soft ? 'hero__soft' : undefined}>
            {l.text.split(' ').map((word, wi, arr) => (
              <Fragment key={wi}>
                <span className="hword">
                  {word.split('').map((ch, ci) => (
                    <span className="hchar" key={ci}>
                      {ch}
                    </span>
                  ))}
                </span>
                {wi < arr.length - 1 && ' '}
              </Fragment>
            ))}
          </motion.span>
        </span>
      ))}
    </h1>
  )
}

export default function Hero() {
  const ref = useRef(null)
  const theme = useTheme()
  const progress = useRef(0)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  useMotionValueEvent(scrollYProgress, 'change', (v) => (progress.current = v))
  const textY = useTransform(scrollYProgress, [0, 0.7], [0, -120])
  const textO = useTransform(scrollYProgress, [0, 0.55], [1, 0])

  return (
    <section className="ghero" ref={ref}>
      <motion.div className="ghero__field" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.6, ease }}>
        <ArrowField progressRef={progress} theme={theme} />
      </motion.div>
      <div className="ghero__halo" />

      <motion.div className="ghero__content" style={{ y: textY, opacity: textO }}>
        <motion.p className="pill pill--glass" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}>
          <span className="dot" /> Web · Mobile · AI agents
        </motion.p>
        <LiveTitle
          lines={[
            { text: 'We build software & AI agents' },
            { text: 'that grow your business.', soft: true },
          ]}
        />
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

      <div className="hero__foot">
        <span className="hero__scroll">
          <i /> Scroll
        </span>
        <span className="hero__hint">
          <i className="hint-fine">Move through the field · click anywhere</i>
          <i className="hint-touch">Tap to send a wave</i>
        </span>
      </div>
    </section>
  )
}
