import { useLayoutEffect, useRef, useState } from 'react'
import { motion, useScroll, useSpring, useTransform } from 'framer-motion'
import Clouds from '../components/Clouds.jsx'
import { OmniMock, SeoMock, SocialMock } from '../components/mockups.jsx'
import { Btn, Eyebrow } from '../components/ui.jsx'

export const PRODUCTS = [
  {
    id: 'omnireach',
    tag: 'Flagship',
    name: 'OmniReach AI',
    line: 'Reach every lead on the channel they actually answer — WhatsApp, email and AI voice calls, from one platform.',
    cta: 'Book a demo',
    theme: 'sky',
    Mock: OmniMock,
  },
  {
    id: 'seo',
    tag: 'Visibility',
    name: 'SEO · AEO · GEO Agent',
    line: 'Get found on Google, in instant answers and inside AI assistants like ChatGPT, Gemini and Perplexity.',
    cta: 'Free visibility check',
    theme: 'white',
    Mock: SeoMock,
  },
  {
    id: 'social',
    tag: 'Social',
    name: 'Social Media AI',
    line: 'Plan, write, schedule and manage business or personal social accounts — without the daily grind.',
    cta: 'Try Social Media AI',
    theme: 'dark',
    Mock: SocialMock,
  },
]

export default function ProductsScroll() {
  const section = useRef(null)
  const track = useRef(null)
  const [dist, setDist] = useState(0)

  useLayoutEffect(() => {
    const measure = () => track.current && setDist(Math.max(0, track.current.scrollWidth - window.innerWidth))
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(track.current)
    window.addEventListener('resize', measure)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [])

  const { scrollYProgress } = useScroll({ target: section, offset: ['start start', 'end end'] })
  const raw = useTransform(scrollYProgress, [0, 1], [0, -dist])
  const x = useSpring(raw, { stiffness: 120, damping: 30, mass: 0.3 })
  const bar = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  return (
    <section className="hscroll" ref={section} style={{ height: `calc(100vh + ${dist}px)` }}>
      <div className="hscroll__sticky">
        <motion.div className="hscroll__track" ref={track} style={{ x }}>
          <div className="hscroll__intro">
            <Eyebrow light>Our products</Eyebrow>
            <h2 className="h2 h2--light">
              AI products, <span className="accent-lime">ready to plug</span> into your business.
            </h2>
            <p>Built and used by us every day — so we understand the tools we build for you.</p>
            <span className="hscroll__hint">
              Keep scrolling <i>→</i>
            </span>
          </div>
          {PRODUCTS.map(({ id, tag, name, line, cta, theme, Mock }) => (
            <article className={`pcard pcard--${theme}`} key={id}>
              {theme === 'sky' && <Clouds seed={5} className="pcard__clouds" />}
              <div className="pcard__text">
                <span className="pcard__tag">{tag}</span>
                <h3>{name}</h3>
                <p>{line}</p>
                <Btn to={`/products#${id}`} variant={theme === 'dark' ? 'lime' : theme === 'white' ? 'dark' : 'white'} arrow>
                  {cta}
                </Btn>
              </div>
              <div className="pcard__mock">
                <Mock />
              </div>
            </article>
          ))}
        </motion.div>
        <div className="hscroll__bar">
          <motion.i style={{ width: bar }} />
        </div>
      </div>
    </section>
  )
}
