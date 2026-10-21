import { useEffect, useRef, useState } from 'react'
import { animate, motion, useMotionValue, useTransform } from 'framer-motion'
import { CarriedRing, findPageRing, holdPageRings } from './HaloRing.jsx'
import { Logo } from './ui.jsx'
import { lenisRef, setIntroReady } from '../lenis.js'

/*
  First-visit opener: the woven ring draws itself loop by loop while a counter runs 0 → 100,
  then glides into the exact place, size and tilt of the page's own ring while the black lifts —
  the page's ring is already drawn underneath, identical, so the hand-off is one continuous motion.
  Click, tap or any key skips the weave.
*/

const glide = [0.65, 0, 0.25, 1]

export default function IntroLoader({ onDone }) {
  const reveal = useRef(0)
  const morph = useRef(null)
  const api = useRef(null)
  const [count, setCount] = useState(0)
  const [leaving, setLeaving] = useState(false)
  const [bloom, setBloom] = useState(false)
  const run = useRef(null)
  // m: 0 → 1 drives the whole exit — ring glide, chrome fade, black lift, then the ring hand-off
  const m = useMotionValue(0)
  const chromeO = useTransform(m, [0, 0.25], [1, 0])
  const chromeY = useTransform(m, [0, 0.25], [0, 16])
  const bgO = useTransform(m, [0.35, 0.9], [1, 0])
  const bloomS = useTransform(m, [0, 1], [1, 2.6])
  const bloomO = useTransform(m, [0.6, 1], [1, 0])

  useEffect(() => {
    document.documentElement.classList.add('is-intro')
    setIntroReady(false)
    // the page's ring waits hidden, in its resting pose, for the intro ring to land on it
    holdPageRings(true)
    // Lenis is created by App after this mounts, so pause it on the next tick
    const t = setTimeout(() => lenisRef.current?.stop(), 0)
    run.current = animate(0, 1, {
      duration: 2.6,
      ease: [0.6, 0, 0.3, 1],
      onUpdate: (v) => {
        reveal.current = v
        setCount(Math.round(v * 100))
      },
      onComplete: () => setTimeout(() => setLeaving(true), 220),
    })
    return () => {
      clearTimeout(t)
      run.current?.stop()
    }
  }, [])

  const done = useRef(false)
  const finish = () => {
    if (done.current) return
    done.current = true
    document.documentElement.classList.remove('is-intro')
    // landed: the page ring takes over in the same frame
    if (morph.current) api.current?.land()
    else holdPageRings(false)
    setIntroReady(true)
    lenisRef.current?.start()
    onDone()
  }

  // the exit
  useEffect(() => {
    if (!leaving) return
    const target = findPageRing()
    morph.current = target ? { ...target, m: 0 } : null
    // with no page ring to settle into, the ring blooms outward instead
    setBloom(!target)
    let released = false
    const ctl = animate(m, 1, {
      duration: target ? 1.5 : 1.2,
      ease: glide,
      onUpdate: (v) => {
        if (morph.current) morph.current.m = v
        // page entrances start as the black begins to lift
        if (!released && v > 0.42) {
          released = true
          setIntroReady(true)
        }
      },
      onComplete: finish,
    })
    return () => ctl.stop()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leaving])

  // skip: finish the weave instantly and go straight to the exit
  const skip = (e) => {
    // the key that skips shouldn't also scroll the page underneath
    if (e?.type === 'keydown') e.preventDefault()
    if (leaving) return
    run.current?.stop()
    reveal.current = 1
    setCount(100)
    setLeaving(true)
  }
  useEffect(() => {
    if (leaving) return
    window.addEventListener('keydown', skip)
    return () => window.removeEventListener('keydown', skip)
  })

  return (
    <div className={`intro ${leaving ? 'is-leaving' : ''}`} role="status" aria-label="Loading" onClick={skip}>
      <motion.div className="intro__bg" style={{ opacity: bgO }} />
      <motion.div className="intro__ring" style={bloom ? { scale: bloomS, opacity: bloomO } : undefined}>
        <CarriedRing morph={morph} reveal={reveal} api={api} />
      </motion.div>

      <motion.div className="intro__top" style={{ opacity: chromeO }}>
        <Logo light />
        <span>Software & AI agents</span>
      </motion.div>

      <motion.div className="intro__bottom" style={{ opacity: chromeO, y: chromeY }}>
        <span className="intro__count">{String(count).padStart(3, '0')}</span>
        <span className="intro__skip">Click or press any key to skip</span>
      </motion.div>
    </div>
  )
}
