import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { RING_CARDS } from '../components/mockups.jsx'

// Cards drift up past the pinned headline at different speeds — some in front, some behind.
const FLY = [
  { card: 0, left: '4%', start: 105, end: -60, rot: -8, depth: 'front', size: 1.15 },
  { card: 1, left: '78%', start: 120, end: -90, rot: 6, depth: 'front', size: 1.1 },
  { card: 2, left: '22%', start: 160, end: -40, rot: 4, depth: 'back', size: 0.85 },
  { card: 4, left: '62%', start: 150, end: -70, rot: -5, depth: 'back', size: 0.9 },
  { card: 6, left: '40%', start: 210, end: -120, rot: -3, depth: 'front', size: 1.05 },
  { card: 9, left: '86%', start: 230, end: -30, rot: 9, depth: 'back', size: 0.8 },
  { card: 10, left: '10%', start: 250, end: -50, rot: 7, depth: 'back', size: 0.85 },
  { card: 11, left: '70%', start: 260, end: -110, rot: -7, depth: 'front', size: 1 },
]

function Flyer({ f, progress }) {
  const y = useTransform(progress, [0, 1], [`${f.start}vh`, `${f.end}vh`])
  const rotate = useTransform(progress, [0, 1], [f.rot, -f.rot])
  const Card = RING_CARDS[f.card]
  return (
    <motion.div className={`fly fly--${f.depth}`} style={{ left: f.left, y, rotate, '--s': f.size }}>
      <motion.div
        className="fly__drag"
        data-cursor="Drag"
        drag
        dragSnapToOrigin
        dragElastic={0.5}
        dragTransition={{ bounceStiffness: 260, bounceDamping: 14 }}
        whileHover={{ scale: 1.04 }}
        whileDrag={{ scale: 1.1, rotate: f.rot * -1.5, zIndex: 10 }}
      >
        <Card />
      </motion.div>
    </motion.div>
  )
}

export default function BigType() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const scale = useTransform(scrollYProgress, [0.04, 0.3], [0.8, 1])
  const o = useTransform(scrollYProgress, [0.04, 0.18], [0, 1])
  return (
    <section className="bigtype" ref={ref}>
      <div className="bigtype__sticky">
        {FLY.filter((f) => f.depth === 'back').map((f, i) => (
          <Flyer key={'b' + i} f={f} progress={scrollYProgress} />
        ))}
        <motion.h2 className="bigtype__text" style={{ scale, opacity: o }}>
          Grow your
          <br />
          business
        </motion.h2>
        {FLY.filter((f) => f.depth === 'front').map((f, i) => (
          <Flyer key={'f' + i} f={f} progress={scrollYProgress} />
        ))}
      </div>
    </section>
  )
}
