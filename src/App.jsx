import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, cancelFrame, frame, motion } from 'framer-motion'
import Lenis from 'lenis'
import { lenisRef } from './lenis.js'
import CommandPalette from './components/CommandPalette.jsx'
import { Cursor, ScrollProgress, useSpotlight } from './components/interactions.jsx'
import Nav from './components/Nav.jsx'
import Footer from './components/Footer.jsx'
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
      if (el) lenis ? lenis.scrollTo(el, { offset: -90, duration: 1.4 }) : el.scrollIntoView({ behavior: 'smooth' })
    }, 180)
    return () => clearTimeout(id)
  }, [hash])
  return null
}

const ease = [0.22, 1, 0.36, 1]
/* page change: the old page fades and lifts away, the scroll resets while nothing is visible, the new one rises in */
const page = {
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
  exit: { opacity: 0, y: -18, transition: { duration: 0.32, ease: [0.4, 0, 1, 1] } },
}

export default function App() {
  useSmoothScroll()
  useSpotlight()
  const location = useLocation()
  return (
    <>
      <ScrollProgress />
      <Cursor />
      <Nav />
      <main>
        <AnimatePresence mode="wait" onExitComplete={toTop}>
          <motion.div key={location.pathname} variants={page} initial="initial" animate="animate" exit="exit">
            <HashScroll />
            <Routes location={location}>
              <Route path="/" element={<Home />} />
              <Route path="/services" element={<Services />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
      <CommandPalette />
    </>
  )
}
