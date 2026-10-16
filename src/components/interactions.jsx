import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useScroll, useSpring } from 'framer-motion'

const canHover = () => typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches

/* ---------- scramble: letters shuffle then resolve when the parent is hovered ---------- */
const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/<>*#'
export function Scramble({ text }) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    const host = el?.closest('a, button') || el?.parentElement
    if (!host || !canHover()) return
    let id
    const run = () => {
      clearInterval(id)
      let frame = 0
      const total = 12
      id = setInterval(() => {
        const reveal = Math.floor((frame / total) * text.length)
        el.textContent = text
          .split('')
          .map((ch, i) => (ch === ' ' || i < reveal ? ch : GLYPHS[(Math.random() * GLYPHS.length) | 0]))
          .join('')
        if (++frame > total) {
          clearInterval(id)
          el.textContent = text
        }
      }, 32)
    }
    host.addEventListener('mouseenter', run)
    return () => {
      clearInterval(id)
      host.removeEventListener('mouseenter', run)
    }
  }, [text])
  return (
    <span ref={ref} aria-label={text}>
      {text}
    </span>
  )
}

/* ---------- magnetic: element is pulled toward the cursor ---------- */
export function useMagnetic(strength = 0.28) {
  const x = useSpring(0, { stiffness: 220, damping: 15, mass: 0.4 })
  const y = useSpring(0, { stiffness: 220, damping: 15, mass: 0.4 })
  const onMouseMove = (e) => {
    if (!canHover()) return
    const r = e.currentTarget.getBoundingClientRect()
    x.set((e.clientX - (r.left + r.width / 2)) * strength)
    y.set((e.clientY - (r.top + r.height / 2)) * strength)
  }
  const onMouseLeave = () => {
    x.set(0)
    y.set(0)
  }
  return { style: { x, y }, onMouseMove, onMouseLeave }
}

/* ---------- tilt: 3D tilt toward the cursor with a moving glare ---------- */
export function useTilt(max = 7) {
  const rx = useSpring(0, { stiffness: 180, damping: 18 })
  const ry = useSpring(0, { stiffness: 180, damping: 18 })
  const gx = useMotionValue('50%')
  const gy = useMotionValue('50%')
  const go = useSpring(0, { stiffness: 200, damping: 25 })
  const onMouseMove = (e) => {
    if (!canHover()) return
    const r = e.currentTarget.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width
    const py = (e.clientY - r.top) / r.height
    ry.set((px - 0.5) * max * 2)
    rx.set(-(py - 0.5) * max * 2)
    gx.set(`${px * 100}%`)
    gy.set(`${py * 100}%`)
    go.set(1)
  }
  const onMouseLeave = () => {
    rx.set(0)
    ry.set(0)
    go.set(0)
  }
  return {
    style: { rotateX: rx, rotateY: ry, transformPerspective: 1000, '--gx': gx, '--gy': gy, '--go': go },
    onMouseMove,
    onMouseLeave,
  }
}

/* ---------- custom cursor ring with contextual labels ---------- */
export function Cursor() {
  const [enabled] = useState(canHover)
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const sx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.5 })
  const sy = useSpring(y, { stiffness: 500, damping: 40, mass: 0.5 })
  const [mode, setMode] = useState('idle')
  const [label, setLabel] = useState('')
  const [down, setDown] = useState(false)

  useEffect(() => {
    if (!enabled) return
    document.documentElement.classList.add('has-cursor')
    const move = (e) => {
      x.set(e.clientX)
      y.set(e.clientY)
      const t = e.target instanceof Element ? e.target : null
      const interactive = t?.closest('a, button, input, textarea, select, [role="tab"]')
      const labelled = t?.closest('[data-cursor]')
      // plain ring over areas that ask for it (e.g. the interactive headline)
      if (t?.closest('[data-cursor-idle]')) {
        setMode('idle')
        return
      }
      // a link/button inside a labelled area keeps the link style unless it carries its own label
      if (interactive && (!labelled || labelled.contains(interactive))) {
        if (interactive.hasAttribute('data-cursor')) {
          setMode('label')
          setLabel(interactive.dataset.cursor)
        } else setMode('link')
      } else if (labelled) {
        setMode('label')
        setLabel(labelled.dataset.cursor)
      } else setMode('idle')
    }
    const leave = () => setMode('hidden')
    const dn = () => setDown(true)
    const up = () => setDown(false)
    window.addEventListener('mousemove', move)
    document.addEventListener('mouseleave', leave)
    window.addEventListener('mousedown', dn)
    window.addEventListener('mouseup', up)
    return () => {
      document.documentElement.classList.remove('has-cursor')
      window.removeEventListener('mousemove', move)
      document.removeEventListener('mouseleave', leave)
      window.removeEventListener('mousedown', dn)
      window.removeEventListener('mouseup', up)
    }
  }, [enabled, x, y])

  if (!enabled) return null
  return (
    <>
      <motion.div className={`cursor cursor--${mode} ${down ? 'is-down' : ''}`} style={{ x: sx, y: sy }} aria-hidden="true">
        <span className="cursor__label">{mode === 'label' ? label : ''}</span>
      </motion.div>
      <motion.div className="cursor-dot" style={{ x, y }} aria-hidden="true" />
    </>
  )
}

/* ---------- thin progress bar showing how far down the page you are ---------- */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 40 })
  return <motion.div className="scroll-progress" style={{ scaleX }} aria-hidden="true" />
}
