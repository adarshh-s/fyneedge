import { useEffect, useRef, useState } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { animate, cancelFrame, frame, motion, useMotionValue } from 'framer-motion'
import Lenis from 'lenis'
import { lenisRef, navState, setIntroReady } from './lenis.js'
import HaloRing, { findPageRing } from './components/HaloRing.jsx'
import CommandPalette from './components/CommandPalette.jsx'
import { Cursor, ScrollProgress, useSpotlight } from './components/interactions.jsx'
import Nav from './components/Nav.jsx'
import Footer from './components/Footer.jsx'
import IntroLoader from './components/IntroLoader.jsx'
import Home from './pages/Home.jsx'
import Services from './pages/Services.jsx'
import About from './pages/About.jsx'
import Contact from './pages/Contact.jsx'
import NotFound from './pages/NotFound.jsx'

function useSmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 0.9, touchMultiplier: 1.4, autoRaf: false })
    lenisRef.current = lenis
    // drive Lenis from Framer Motion's own frame loop, so every scroll-linked animation
    // reads the scroll position from the same tick that moved it — no one-frame drift, no jitter
    const tick = ({ timestamp }) => lenis.raf(timestamp)
    frame.update(tick, true)
    return () => {
      cancelFrame(tick)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [])
}

const toTop = () => (lenisRef.current ? lenisRef.current.scrollTo(0, { immediate: true, force: true }) : window.scrollTo(0, 0))

/* jump to #section links — rendered inside each page, so it runs once the page that holds the section is in */
function HashScroll() {
  const { hash } = useLocation()
  useEffect(() => {
    if (!hash) return
    const id = setTimeout(() => {
      const el = document.querySelector(hash)
      const lenis = lenisRef.current
      if (el) lenis ? lenis.scrollTo(el, { offset: -90, duration: 1.4, force: true }) : el.scrollIntoView({ behavior: 'smooth' })
    }, 180)
    return () => clearTimeout(id)
  }, [hash])
  return null
}

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

/*
  Page change through the woven ring — the same ring travels from page to page:
    cover  → the black fades in while the ring lifts out of the current page's ring to the centre
             (or weaves itself in at the centre if that ring is scrolled away)
    swap   → the new page mounts underneath with its ring already drawn, the scroll resets, unseen
    reveal → the ring glides into the new page's ring as the black lifts; the copy rises in as it clears
  Returns the location to render (it only changes while the screen is covered).
*/
const glide = [0.65, 0, 0.25, 1]
const smoothstep = (a, b, x) => {
  const t = Math.min(Math.max((x - a) / (b - a), 0), 1)
  return t * t * (3 - 2 * t)
}

function usePageTransition(location) {
  const [shown, setShown] = useState(location)
  const [active, setActive] = useState(false)
  const bg = useMotionValue(0)
  const ringO = useMotionValue(1)
  const morph = useRef(null)
  const reveal = useRef(1)
  const run = useRef(null)
  const wait = useRef(0)

  useEffect(() => {
    // same page (e.g. a #section link) → no transition
    if (location.pathname === shown.pathname) {
      setShown(location)
      return
    }
    if (reducedMotion()) {
      setShown(location)
      toTop()
      return
    }
    run.current?.stop()
    clearTimeout(wait.current)
    lenisRef.current?.stop()
    navState.arrived = true
    // the old page's copy eases out with the black
    setIntroReady(false)
    ringO.set(1)

    // cover: from the current page's ring if it's resting in view, otherwise weave in at the centre
    const from = window.scrollY < 40 ? findPageRing() : null
    morph.current = from ? { ...from, m: 1 } : null
    reveal.current = from ? 1 : 0
    setActive(true)
    run.current = animate(0, 1, {
      duration: from ? 0.8 : 0.9,
      ease: glide,
      onUpdate: (k) => {
        if (morph.current) morph.current.m = 1 - k
        else reveal.current = k
        bg.set(smoothstep(0, 0.6, k))
      },
      onComplete: () => {
        setShown(location)
        toTop()
        // reveal once the new page — and the first frame of its ring — has painted
        requestAnimationFrame(() =>
          requestAnimationFrame(() => {
            wait.current = setTimeout(() => {
              const to = findPageRing()
              morph.current = to ? { ...to, m: 0 } : null
              reveal.current = 1
              let released = false
              run.current = animate(0, 1, {
                duration: 1.4,
                ease: glide,
                onUpdate: (v) => {
                  if (morph.current) morph.current.m = v
                  bg.set(1 - smoothstep(0.35, 0.9, v))
                  ringO.set(1 - smoothstep(0.86, 1, v))
                  if (!released && v > 0.42) {
                    released = true
                    setIntroReady(true)
                  }
                },
                onComplete: () => {
                  setActive(false)
                  setIntroReady(true)
                  lenisRef.current?.start()
                },
              })
            }, 60)
          }),
        )
      },
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location])

  useEffect(() => () => clearTimeout(wait.current), [])
  return [shown, { active, bg, ringO, morph, reveal }]
}

const settledRef = { current: 1 }
const idleInput = { current: { over: false, x: 0, y: 0, mx: -9999, my: -9999, clicks: [] } }

function TransitionRing({ active, bg, ringO, morph, reveal }) {
  if (!active) return null
  return (
    <div className="ptrans" aria-hidden="true">
      <motion.div className="ptrans__bg" style={{ opacity: bg }} />
      <motion.div className="ptrans__ring" style={{ opacity: ringO }}>
        <HaloRing layout="center" progress={settledRef} input={idleInput} reveal={reveal} morph={morph} />
      </motion.div>
    </div>
  )
}

const firstVisit = () => {
  if (reducedMotion()) return false
  try {
    if (sessionStorage.getItem('fe-intro')) return false
    sessionStorage.setItem('fe-intro', '1')
  } catch {
    // storage blocked — still show it once for this page load
  }
  return true
}
// decided once per page load (React may run state initialisers twice in development)
const SHOW_INTRO = firstVisit()
if (SHOW_INTRO) navState.arrived = true

export default function App() {
  useSmoothScroll()
  useSpotlight()
  const location = useLocation()
  const [shown, trans] = usePageTransition(location)
  const [intro, setIntro] = useState(SHOW_INTRO)
  return (
    <>
      {intro && <IntroLoader onDone={() => setIntro(false)} />}
      <TransitionRing {...trans} />
      <ScrollProgress />
      <Cursor />
      <Nav />
      <main>
        <div key={shown.pathname}>
          <HashScroll />
          <Routes location={shown}>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </main>
      <Footer />
      <CommandPalette />
    </>
  )
}
