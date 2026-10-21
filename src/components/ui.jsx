import { Fragment, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useAnimationFrame, useInView, useMotionValue, useScroll, useSpring, useTransform, useVelocity, animate } from 'framer-motion'
import { SITE } from '../config.js'
import { navState } from '../lenis.js'
import { Scramble, useMagnetic, useTilt } from './interactions.jsx'

export const ease = [0.22, 1, 0.36, 1]

/** false while the first-visit intro still covers the page — entrances wait for it */
export function useIntroReady() {
  const [ready, setReady] = useState(navState.introReady)
  useEffect(() => {
    navState.listeners.add(setReady)
    setReady(navState.introReady)
    return () => navState.listeners.delete(setReady)
  }, [])
  return ready
}

export function usePageMeta(title, description) {
  useEffect(() => {
    document.title = title
    const m = document.querySelector('meta[name="description"]')
    if (m && description) m.setAttribute('content', description)
  }, [title, description])
}

/* the FyneEdge mark — two interlocking rounded panels with a spark.
   Redrawn from the logo artwork; swap these paths for the exact export when it arrives. */
export function BrandMark({ className }) {
  return (
    <svg className={className} viewBox="0 0 100 100" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="7.5" strokeLinejoin="round">
        <path d="M31.0 16.0Q31.0 7.0 39.4 10.3L66.6 21.3Q75.0 24.6 75.0 33.6L75.0 63.6Q75.0 72.6 66.6 69.3L39.4 58.3Q31.0 55.0 31.0 46.0Z" />
        <path d="M7.0 36.0Q7.0 27.0 15.4 30.3L42.6 41.3Q51.0 44.6 51.0 53.6L51.0 83.6Q51.0 92.6 42.6 89.3L15.4 78.3Q7.0 75.0 7.0 66.0Z" />
      </g>
      <path fill="currentColor" d="M86 2 Q86 11 95 11 Q86 11 86 20 Q86 11 77 11 Q86 11 86 2 Z" />
      <path fill="currentColor" d="M29 74 Q29 64 20 61 Q29 58 29 48 Q31 58 40 61 Q31 64 29 74 Z" />
    </svg>
  )
}

export function Logo({ light }) {
  return (
    <span className={`logo ${light ? 'logo--light' : ''}`} aria-label={SITE.name}>
      <BrandMark className="logo__mark" />
      <span className="logo__word" aria-hidden="true">
        FYNE EDGE
      </span>
    </span>
  )
}

export function Arrow() {
  return (
    <svg className="arrow" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M4 12 12 4M5.5 4H12v6.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

const MotionLink = motion.create(Link)

/** Pill button. variant: lime | dark | glass | ghost | white — magnetic, with scrambling label */
export function Btn({ to, href, variant = 'lime', children, arrow, ...rest }) {
  const cls = `btn btn--${variant}`
  const mag = useMagnetic()
  const inner = (
    <>
      <span className="btn__label">{typeof children === 'string' ? <Scramble text={children} /> : children}</span>
      {arrow && (
        <span className="btn__icon">
          <Arrow />
        </span>
      )}
    </>
  )
  if (href)
    return (
      <motion.a className={cls} href={href} target="_blank" rel="noreferrer" {...mag} {...rest}>
        {inner}
      </motion.a>
    )
  if (to)
    return (
      <MotionLink className={cls} to={to} {...mag} {...rest}>
        {inner}
      </MotionLink>
    )
  return (
    <motion.button className={cls} {...mag} {...rest}>
      {inner}
    </motion.button>
  )
}

export function Eyebrow({ children, light }) {
  return <p className={`eyebrow ${light ? 'eyebrow--light' : ''}`}>{children}</p>
}

/** Fade + rise when scrolled into view. `tilt` adds a 3D hover tilt with glare. */
export function Reveal({ children, delay = 0, y = 40, className, as = 'div', tilt, ...rest }) {
  const M = motion[as]
  const t = useTilt()
  const tiltProps = tilt ? { style: t.style, onMouseMove: t.onMouseMove, onMouseLeave: t.onMouseLeave } : {}
  return (
    <M
      className={tilt ? `${className || ''} is-tilt` : className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10% 0px' }}
      transition={{ duration: 0.9, ease, delay }}
      {...tiltProps}
      {...rest}
    >
      {children}
      {tilt && <span className="glare" aria-hidden="true" />}
    </M>
  )
}

/** Text where a *word* becomes the serif italic accent */
export function Accent({ text }) {
  return text.split(/(\*[^*]+\*)/).map((part, i) =>
    part.length > 2 && part.startsWith('*') && part.endsWith('*') ? (
      <em className="serif" key={i}>
        {part.slice(1, -1)}
      </em>
    ) : (
      part
    ),
  )
}
const plain = (t) => t.replaceAll('*', '')

/** Headline whose words slide up from a mask, one after another. Wrap a word in *asterisks* for the serif accent. */
export function SplitHeading({ text, as = 'h2', className, delay = 0, accent }) {
  const Tag = motion[as]
  const words = text.split(' ')
  return (
    <Tag
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-10% 0px' }}
      transition={{ staggerChildren: 0.06, delayChildren: delay }}
      aria-label={plain(text)}
    >
      {words.map((w, i) => (
        <Fragment key={i}>
          <span className="mask" aria-hidden="true">
            <motion.span
              className={accent && accent.includes(w.replace(/[.,]/g, '')) ? 'accent' : undefined}
              variants={{ hidden: { y: '110%' }, show: { y: '0%' } }}
              transition={{ duration: 0.9, ease }}
            >
              {w.includes('*') ? <Accent text={w} /> : w}
            </motion.span>
          </span>
          {i < words.length - 1 && ' '}
        </Fragment>
      ))}
    </Tag>
  )
}

/** Count up to a number when it enters the viewport */
export function Counter({ to, suffix = '', prefix = '', duration = 1.6 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  useEffect(() => {
    if (!inView) return
    const c = animate(0, to, {
      duration,
      ease: 'easeOut',
      onUpdate: (v) => ref.current && (ref.current.textContent = prefix + Math.round(v) + suffix),
    })
    return () => c.stop()
  }, [inView, to, suffix, prefix, duration])
  return <span ref={ref}>{prefix}0{suffix}</span>
}

/** Endless strip that speeds up, leans and reverses with scroll velocity */
export function Marquee({ children, speed = 40, reverse, className = '' }) {
  const track = useRef(null)
  const x = useMotionValue(0)
  const { scrollY } = useScroll()
  const vel = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 })
  const skewX = useTransform(vel, [-2500, 0, 2500], [7, 0, -7], { clamp: true })
  const dir = useRef(1)
  const hover = useRef(false)
  useAnimationFrame((_, delta) => {
    const el = track.current
    if (!el) return
    const half = el.scrollWidth / 2
    if (!half) return
    const v = vel.get()
    if (v < -5) dir.current = -1
    else if (v > 5) dir.current = 1
    const factor = (1 + Math.min(Math.abs(v) / 350, 6)) * (hover.current ? 0.25 : 1)
    let nx = x.get() - (reverse ? -1 : 1) * dir.current * (half / speed) * factor * (Math.min(delta, 50) / 1000)
    if (nx <= -half) nx += half
    if (nx > 0) nx -= half
    x.set(nx)
  })
  return (
    <div className={`marquee ${className}`} onMouseEnter={() => (hover.current = true)} onMouseLeave={() => (hover.current = false)}>
      <motion.div className="marquee__track" ref={track} style={{ x, skewX }}>
        <div className="marquee__group">{children}</div>
        <div className="marquee__group" aria-hidden="true">
          {children}
        </div>
      </motion.div>
    </div>
  )
}

/** Parallax wrapper — moves children on the Y axis as the element passes through the viewport */
export function Parallax({ children, speed = 80, className }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [speed, -speed])
  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  )
}

/** Statement that lights up word by word as it scrolls through the viewport (dim → bright, in reading order) */
export function ScrollText({ text, as = 'p', className }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.45'] })
  const Tag = as
  const words = text.split(' ')
  return (
    <Tag ref={ref} className={`scroll-text ${className || ''}`} aria-label={text}>
      {words.map((w, i) => (
        <Fragment key={i}>
          <LitWord progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>
            {w}
          </LitWord>{' '}
        </Fragment>
      ))}
    </Tag>
  )
}
function LitWord({ progress, range, children }) {
  const opacity = useTransform(progress, range, [0.18, 1])
  return (
    <motion.span aria-hidden="true" style={{ opacity }}>
      {children}
    </motion.span>
  )
}
