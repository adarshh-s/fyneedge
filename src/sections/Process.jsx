import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValueEvent, useScroll, useSpring, useTransform } from 'framer-motion'
import { STEPS } from '../data.js'
import { Eyebrow, SplitHeading } from '../components/ui.jsx'

// a rising growth curve that draws itself on scroll, with an arrowhead riding the line
const PATH = 'M 20 390 C 160 392, 220 330, 300 318 S 470 300, 560 236 S 760 190, 860 150 S 1060 70, 1180 24'
const AT = [0.08, 0.37, 0.64, 0.93] // where each step sits along the curve

export default function Process() {
  const ref = useRef(null)
  const pathRef = useRef(null)
  const head = useRef(null)
  const [pts, setPts] = useState([])
  const [active, setActive] = useState(-1)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.8', 'center 0.85'] })
  const prog = useSpring(scrollYProgress, { stiffness: 90, damping: 24 })
  const clipW = useTransform(prog, [0, 1], [0, 1200])

  useEffect(() => {
    const p = pathRef.current
    const L = p.getTotalLength()
    setPts(AT.map((a) => p.getPointAtLength(a * L)).map((q) => [q.x, q.y]))
  }, [])

  useMotionValueEvent(prog, 'change', (v) => {
    const p = pathRef.current
    if (!p || !head.current) return
    const L = p.getTotalLength()
    const l = Math.max(0.001, Math.min(1, v)) * L
    const q = p.getPointAtLength(l)
    const q2 = p.getPointAtLength(Math.max(0, l - 3))
    const ang = (Math.atan2(q.y - q2.y, q.x - q2.x) * 180) / Math.PI
    head.current.setAttribute('transform', `translate(${q.x} ${q.y}) rotate(${ang})`)
    head.current.style.opacity = v > 0.01 ? 1 : 0
    let a = -1
    AT.forEach((t, i) => v >= t - 0.01 && (a = i))
    setActive(a)
  })

  return (
    <section className="process container" ref={ref}>
      <div className="section-head">
        <Eyebrow>How we work</Eyebrow>
        <SplitHeading text="From idea to impact in four clear steps." className="h2" />
      </div>
      <div className="growth">
        <svg viewBox="0 0 1200 420" className="growth__svg" aria-hidden="true">
          <defs>
            <linearGradient id="growthGrad" x1="0" x2="1">
              <stop offset="0" stopColor="#2f8ff2" />
              <stop offset="1" stopColor="#d7ff3e" />
            </linearGradient>
            <linearGradient id="growthFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#2f8ff2" stopOpacity="0.22" />
              <stop offset="1" stopColor="#2f8ff2" stopOpacity="0" />
            </linearGradient>
            <filter id="growthGlow" x="-20%" y="-50%" width="140%" height="200%">
              <feGaussianBlur stdDeviation="7" />
            </filter>
            <clipPath id="growthClip">
              <motion.rect x="0" y="-40" height="500" width={clipW} />
            </clipPath>
          </defs>
          {[80, 170, 260, 350].map((y) => (
            <line key={y} x1="0" x2="1200" y1={y} y2={y} className="growth__grid" />
          ))}
          <path d={PATH} className="growth__track" ref={pathRef} />
          <path d={`${PATH} L 1180 420 L 20 420 Z`} fill="url(#growthFill)" clipPath="url(#growthClip)" />
          <motion.path d={PATH} className="growth__glow" style={{ pathLength: prog }} />
          <motion.path d={PATH} className="growth__line" style={{ pathLength: prog }} />
          {pts.map(([x, y], i) => (
            <g key={i} className={`growth__node ${active >= i ? 'on' : ''}`} transform={`translate(${x} ${y})`}>
              <circle r="22" className="halo" />
              <circle r="8" className="dot" />
              <text y="-30">0{i + 1}</text>
            </g>
          ))}
          <g ref={head} className="growth__head" style={{ opacity: 0 }}>
            <circle r="17" className="growth__headbg" />
            <path d="M -5 -7 L 5 0 L -5 7" />
          </g>
        </svg>
        <div className="growth__steps">
          {STEPS.map(([t, d], i) => (
            <div className={`growth__step ${active >= i ? 'on' : ''}`} key={t}>
              <span>Step 0{i + 1}</span>
              <h3>{t}</h3>
              <p>{d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
