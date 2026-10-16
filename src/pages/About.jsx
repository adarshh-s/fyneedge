import PageHero from './PageHero.jsx'
import Statement from '../sections/Statement.jsx'
import WhyUs from '../sections/WhyUs.jsx'
import CTA from '../sections/CTA.jsx'
import { Eyebrow, Reveal, SplitHeading, usePageMeta } from '../components/ui.jsx'
import { SITE } from '../config.js'

const VALUES = [
  ['Build what matters', 'We focus on outcomes, not features for their own sake.'],
  ['Keep it simple', 'Clear products, clear communication, no jargon.'],
  ['Honest by default', 'Realistic timelines, transparent pricing and straight advice.'],
  ['Always improving', 'We learn fast, ship often and keep making things better.'],
]

export default function About() {
  usePageMeta(`About Us | ${SITE.name}`, 'Meet the team building web apps, mobile apps and AI products for growing businesses.')
  return (
    <>
      <PageHero eyebrow="About us" title={'We turn ideas into software —\nand software into growth.'} />

      <section className="about container">
        <Reveal as="p" className="about__lead">
          {SITE.name} is a technology company that builds web applications, mobile apps and AI agents for growing businesses. We combine solid engineering with practical AI to create products that save time, win customers and scale with you.
        </Reveal>
        <Reveal as="p" className="about__body" delay={0.1}>
          Alongside our client work, we build our own AI products — OmniReach AI for multi-channel lead outreach, an SEO · AEO · GEO agent for search visibility, and Social Media AI for managing social accounts. Using them every day keeps us sharp, and means we understand the tools we build for you.
        </Reveal>
      </section>

      <section className="mv container">
        <Reveal tilt className="mv__card mv__card--lime">
          <Eyebrow>Our mission</Eyebrow>
          <p>Make powerful technology simple and useful for every business.</p>
        </Reveal>
        <Reveal tilt className="mv__card mv__card--dark" delay={0.1}>
          <Eyebrow light>Our vision</Eyebrow>
          <p>A world where every business has an AI team working beside its people.</p>
        </Reveal>
      </section>

      <Statement />

      <section className="values container">
        <div className="section-head">
          <Eyebrow>Our values</Eyebrow>
          <SplitHeading text="How we work, every day." className="h2" />
        </div>
        <div className="values__grid">
          {VALUES.map(([t, d], i) => (
            <Reveal tilt className="values__item" key={t} delay={i * 0.08}>
              <span>0{i + 1}</span>
              <h3>{t}</h3>
              <p>{d}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <WhyUs />
      <CTA />
    </>
  )
}
