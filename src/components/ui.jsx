import { Fragment, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView, useScroll, useTransform, animate } from 'framer-motion'
import { SITE } from '../config.js'
import { Scramble, useMagnetic, useTilt } from './interactions.jsx'

export const ease = [0.22, 1, 0.36, 1]

export function usePageMeta(title, description) {
  useEffect(() => {
    document.title = title
    const m = document.querySelector('meta[name="description"]')
    if (m && description) m.setAttribute('content', description)
  }, [title, description])
}

export function Logo({ light }) {
  return (
    <span className={`logo ${light ? 'logo--light' : ''}`}>
      <svg viewBox="0 0 40 28" aria-hidden="true">
        <path d="M2 26 15 2h7L9 26z" fill="currentColor" />
        <path d="M18 26 28 9l9 17z" fill="var(--lime)" />
      </svg>
      {SITE.name}
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

/** Headline whose words slide up from a mask, one after another */
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
      aria-label={text}
    >
      {words.map((w, i) => (
        <Fragment key={i}>
          <span className="mask" aria-hidden="true">
            <motion.span
              className={accent && accent.includes(w.replace(/[.,]/g, '')) ? 'accent' : undefined}
              variants={{ hidden: { y: '110%' }, show: { y: '0%' } }}
              transition={{ duration: 0.9, ease }}
            >
              {w}
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

export function Marquee({ children, speed = 40, reverse, className = '' }) {
  return (
    <div className={`marquee ${className}`}>
      <div className="marquee__track" style={{ animationDuration: `${speed}s`, animationDirection: reverse ? 'reverse' : 'normal' }}>
        <div className="marquee__group">{children}</div>
        <div className="marquee__group" aria-hidden="true">
          {children}
        </div>
      </div>
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
