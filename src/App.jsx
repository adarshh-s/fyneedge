import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
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
    const lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 1 })
    lenisRef.current = lenis
    let id
    const raf = (t) => {
      lenis.raf(t)
      id = requestAnimationFrame(raf)
    }
    id = requestAnimationFrame(raf)
    return () => {
      cancelAnimationFrame(id)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [])
}

function ScrollReset() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    const lenis = lenisRef.current
    if (hash) {
      const el = document.querySelector(hash)
      if (el) {
        setTimeout(() => (lenis ? lenis.scrollTo(el, { offset: -90 }) : el.scrollIntoView()), 50)
        return
      }
    }
    lenis ? lenis.scrollTo(0, { immediate: true }) : window.scrollTo(0, 0)
  }, [pathname, hash])
  return null
}

export default function App() {
  useSmoothScroll()
  useSpotlight()
  return (
    <>
      <ScrollReset />
      <ScrollProgress />
      <Cursor />
      <Nav />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <CommandPalette />
    </>
  )
}
